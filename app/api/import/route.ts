import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient, Provider, FileStatus } from '@prisma/client'
import crypto from 'crypto'
import { parseChaseRow } from '@/lib/parsers/chase'
import { parseVenmoRow } from '@/lib/parsers/venmo'
import { categorizeBatch } from '@/lib/categorization'
import { processTransferDetection } from '@/lib/transfer-detection'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const source = url.searchParams.get('source')
    
    if (!source || !['CHASE', 'VENMO'].includes(source)) {
      return NextResponse.json(
        { error: 'Invalid source parameter. Must be CHASE or VENMO' },
        { status: 400 }
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
    
    // Check if file already processed
    const existingFile = await prisma.importFile.findUnique({
      where: { sha256 }
    })
    
    if (existingFile && existingFile.status === FileStatus.PROCESSED) {
      return NextResponse.json({
        imported: 0,
        duplicates: existingFile.imported,
        transferCandidates: 0,
        message: 'File already processed'
      })
    }
    
    // Create ImportFile record
    const importFile = await prisma.importFile.create({
      data: {
        source: source as Provider,
        filename: file.name,
        sha256,
        status: FileStatus.PENDING
      }
    })
    
    try {
      // Get account for the source
      const account = await prisma.account.findFirst({
        where: {
          provider: source as Provider
        }
      })
      
      if (!account) {
        throw new Error(`No account found for provider ${source}`)
      }
      
      // Get timezone setting
      const timezoneSetting = await prisma.appSetting.findUnique({
        where: { key: 'timezone' }
      })
      const timezone = timezoneSetting?.value || 'America/Los_Angeles'
      
      // Parse CSV using simple string parsing (more reliable)
      const csvString = fileBuffer.toString('utf-8')
      const lines = csvString.split('\n').filter(line => line.trim())
      
      if (lines.length < 2) {
        throw new Error('CSV file must have at least a header row and one data row')
      }
      
      const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim())
      const rows: any[] = []
      
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.replace(/"/g, '').trim())
        if (values.length === headers.length) {
          const row: any = {}
          headers.forEach((header, index) => {
            row[header] = values[index]
          })
          rows.push(row)
        }
      }
      
      // Parse transactions based on source
      let parsedTransactions: any[] = []
      
      if (source === 'CHASE') {
        parsedTransactions = rows.map(row => parseChaseRow(row, account.id, timezone))
      } else if (source === 'VENMO') {
        for (const row of rows) {
          const venmoTxs = parseVenmoRow(row, account.id, timezone)
          parsedTransactions.push(...venmoTxs)
        }
      }
      
      // Categorize transactions
      const categorizedTransactions = await categorizeBatch(parsedTransactions)
      
      // Insert transactions with conflict ignore
      let imported = 0
      let duplicates = 0
      
      for (const tx of categorizedTransactions) {
        try {
          await prisma.transaction.create({
            data: {
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
        } catch (error: any) {
          if (error.code === 'P2002' && error.meta?.target?.includes('hashUnique')) {
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
        const result = await processTransferDetection(month)
        totalTransferCandidates += result.candidates
      }
      
      return NextResponse.json({
        imported,
        duplicates,
        transferCandidates: totalTransferCandidates
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