import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient, Provider, FileStatus, AccountType } from '@prisma/client'
import crypto from 'crypto'
import { parseString } from 'fast-csv'
import { parseChaseRow } from '@/lib/parsers/chase'
import { parseVenmoRow } from '@/lib/parsers/venmo'
import { categorizeBatch } from '@/lib/categorization'
import { processTransferDetection } from '@/lib/transfer-detection'
import { detectCSVFormat, validateDetectedFormat } from '@/lib/csv-detector'
import { getSessionFromRequest } from '@/lib/auth'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Get session
    const sessionData = getSessionFromRequest(request)
    if (!sessionData) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }
    
    // Read file buffer and compute SHA256
    const buffer = await file.arrayBuffer()
    const fileBuffer = Buffer.from(buffer)
    const sha256 = crypto.createHash('sha256').update(fileBuffer).digest('hex')
    
    // Parse CSV to detect format
    const csvString = fileBuffer.toString('utf-8')
    let detectedProvider: Provider
    let confidence: number
    
    try {
      // Detect CSV format using the new async function
      const detection = await detectCSVFormat(csvString)
      detectedProvider = detection.provider
      confidence = detection.confidence
      
      // Validate that we can parse this format
      const isValid = await validateDetectedFormat(detectedProvider, csvString)
      if (!isValid) {
        return NextResponse.json(
          { error: `Unable to detect valid CSV format. Expected ${detectedProvider} headers but validation failed.` },
          { status: 400 }
        )
      }
      
    } catch {
      return NextResponse.json(
        { error: 'Failed to parse CSV file. Please ensure it is a valid CSV format.' },
        { status: 400 }
      )
    }
    
    // Check if file already processed
    const existingFile = await prisma.importFile.findUnique({
      where: { 
        sessionId_sha256: {
          sessionId: sessionData.sessionId,
          sha256
        }
      }
    })
    
    if (existingFile && existingFile.status === FileStatus.PROCESSED) {
      return NextResponse.json({
        imported: 0,
        duplicates: existingFile.imported,
        transferCandidates: 0,
        message: 'File already processed',
        detectedFormat: detectedProvider,
        confidence
      })
    }
    
    // Create or reuse ImportFile record
    let importFile
    if (existingFile && existingFile.status === FileStatus.ERROR) {
      // Reuse existing errored file and reset for retry
      importFile = await prisma.importFile.update({
        where: { id: existingFile.id },
        data: {
          status: FileStatus.PENDING,
          error: null,
          imported: 0,
          duplicates: 0,
          processedAt: null
        }
      })
    } else {
      // Create new ImportFile record
      importFile = await prisma.importFile.create({
        data: {
          sessionId: sessionData.sessionId,
          source: detectedProvider,
          filename: file.name,
          sha256,
          status: FileStatus.PENDING
        }
      })
    }
    
    try {
      // Get or create account for the detected provider
      let account = await prisma.account.findFirst({
        where: {
          sessionId: sessionData.sessionId,
          provider: detectedProvider
        }
      })
      
      if (!account) {
        // Create account automatically for this session
        const displayName = detectedProvider === Provider.CHASE ? 'Chase' : 'Venmo'
        const accountType = detectedProvider === Provider.CHASE ? AccountType.CHECKING : AccountType.WALLET
        
        account = await prisma.account.create({
          data: {
            sessionId: sessionData.sessionId,
            provider: detectedProvider,
            type: accountType,
            displayName: displayName,
            currency: 'USD'
          }
        })
      }
      
      // Get timezone setting
      const timezoneSetting = await prisma.appSetting.findUnique({
        where: { key: 'timezone' }
      })
      const timezone = timezoneSetting?.value || 'America/Los_Angeles'
      
      // Parse CSV using fast-csv for proper parsing - reuse the csvString we already have
      const rows: Record<string, string>[] = await new Promise((resolve, reject) => {
        const parsedRows: Record<string, string>[] = []
        
        if (detectedProvider === Provider.VENMO) {
          // For Venmo, skip the first 2 header rows and start parsing from row 3
          const lines = csvString.split('\n')
          const venmoDataLines = lines.slice(2) // Skip first 2 rows
          const venmoCSV = venmoDataLines.join('\n')
          
          parseString(venmoCSV, { headers: true, ignoreEmpty: true, discardUnmappedColumns: true })
            .on('data', row => {
              // Skip summary/footer rows
              if (row[''] && (row[''].includes('Cryptocurrency summary') || row[''].includes('In case of errors'))) {
                return
              }
              // Skip rows with no ID or no amount data (empty summary rows)
              if (!row['ID'] || !row['Amount (total)'] || row['Amount (total)'].trim() === '') {
                return
              }
              parsedRows.push(row)
            })
            .on('end', () => {
              resolve(parsedRows)
            })
            .on('error', (error) => {
              reject(error)
            })
        } else {
          // For Chase and other formats, parse normally
          parseString(csvString, { headers: true, ignoreEmpty: true, discardUnmappedColumns: true })
            .on('data', row => {
              parsedRows.push(row)
            })
            .on('end', () => {
              resolve(parsedRows)
            })
            .on('error', (error) => {
              reject(error)
            })
        }
      })
      
      if (rows.length === 0) {
        throw new Error('CSV file contains no valid transaction data')
      }
      
      // Parse transactions based on source
      let parsedTransactions: (ReturnType<typeof parseChaseRow> | ReturnType<typeof parseVenmoRow>[number])[] = []
      
      try {
        if (detectedProvider === Provider.CHASE) {
          parsedTransactions = rows.map(row => parseChaseRow(row, account.id, timezone))
        } else if (detectedProvider === Provider.VENMO) {
          for (const row of rows) {
            const venmoTxs = parseVenmoRow(row, account.id, timezone)
            parsedTransactions.push(...venmoTxs)
          }
        }
        
        if (parsedTransactions.length === 0) {
          throw new Error(`No valid transactions found in ${detectedProvider} CSV. Please check the file format and ensure it contains transaction data.`)
        }
      } catch (parseError) {
        console.error('Transaction parsing error:', parseError)
        throw new Error(`Failed to parse ${detectedProvider} transactions: ${parseError instanceof Error ? parseError.message : 'Unknown parsing error'}`)
      }
      
      // Categorize transactions
      const categorizedTransactions = await categorizeBatch(parsedTransactions, sessionData.sessionId)
      
      // Insert transactions with conflict ignore
      let imported = 0
      let duplicates = 0
      
      for (const tx of categorizedTransactions) {
        try {
          await prisma.transaction.create({
            data: {
              sessionId: sessionData.sessionId,
              source: tx.source,
              externalId: tx.externalId,
              accountId: tx.accountId,
              postedAt: tx.postedAt,
              postedDate: tx.postedDate,
              descriptionRaw: tx.descriptionRaw,
              descriptionNorm: tx.descriptionNorm,
              amountCents: tx.amountCents,
              currency: tx.currency,
              categoryId: tx.categoryId,
              importFileId: importFile.id,
              hashUnique: tx.hashUnique
            }
          })
          imported++
        } catch (error: unknown) {
          if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002' && 'meta' in error && error.meta && typeof error.meta === 'object' && 'target' in error.meta && Array.isArray(error.meta.target) && error.meta.target.includes('hashUnique')) {
            duplicates++
          } else {
            throw error
          }
        }
      }
      
      // Update ImportFile with results
      await prisma.importFile.update({
        where: { id: importFile.id },
        data: {
          rowCount: rows.length,
          imported,
          duplicates,
          status: FileStatus.PROCESSED,
          processedAt: new Date()
        }
      })
      
      // Run transfer detection for affected months
      const months = new Set(
        parsedTransactions.map(tx => 
          `${tx.postedDate.getFullYear()}-${String(tx.postedDate.getMonth() + 1).padStart(2, '0')}`
        )
      )
      
      let totalTransferCandidates = 0
      for (const month of months) {
        // TODO: Update processTransferDetection to accept sessionId for proper session scoping
        const result = await processTransferDetection(month)
        totalTransferCandidates += result.candidates
      }
      
      return NextResponse.json({
        imported,
        duplicates,
        transferCandidates: totalTransferCandidates,
        detectedFormat: detectedProvider,
        confidence
      })
      
    } catch (error) {
      console.error('Import processing error:', error)
      
      // Mark ImportFile as error
      await prisma.importFile.update({
        where: { id: importFile.id },
        data: {
          status: FileStatus.ERROR,
          error: error instanceof Error ? error.message : 'Unknown error',
          processedAt: new Date()
        }
      })
      
      throw error
    }
    
  } catch (error) {
    console.error('Import API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}