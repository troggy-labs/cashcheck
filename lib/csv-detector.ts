import { Provider } from '@prisma/client'
import { normalizeHeader } from './csv-utils'
import { parseString } from 'fast-csv'

export interface CSVDetectionResult {
  provider: Provider
  confidence: number
  detectedHeaders: string[]
}

/**
 * Detects CSV format from CSV string by trying multiple header positions
 * Returns the provider and confidence level
 */
export function detectCSVFormat(csvString: string): Promise<CSVDetectionResult> {
  return new Promise((resolve, reject) => {
    // Try parsing with different skip values for multi-header files like Venmo
    const attempts = [
      { skipRows: 0, description: 'standard format' },
      { skipRows: 2, description: 'Venmo format (skip first 2 rows)' }
    ]
    
    tryNextAttempt(0)
    
    function tryNextAttempt(attemptIndex: number): void {
      if (attemptIndex >= attempts.length) {
        // All attempts failed, return default
        resolve({
          provider: Provider.CHASE,
          confidence: 0.3,
          detectedHeaders: []
        })
        return
      }
      
      const attempt = attempts[attemptIndex]
      let csvData = csvString
      
      // Skip rows if needed
      if (attempt.skipRows > 0) {
        const lines = csvString.split('\n')
        csvData = lines.slice(attempt.skipRows).join('\n')
      }
      
      parseString(csvData, { 
        headers: true, 
        maxRows: 1,
        skipLinesWithError: true,
        strictColumnHandling: false 
      })
        .on('data', (firstRow: Record<string, string>) => {
          console.log(`Detection attempt ${attemptIndex + 1} got data:`, Object.keys(firstRow))
          const result = detectCSVFormatFromRow(firstRow)
          console.log(`Detection result: ${result.provider} (${result.confidence})`)
          if (result.confidence > 0.6) {
            resolve(result)
          } else {
            tryNextAttempt(attemptIndex + 1)
          }
        })
        .on('error', () => {
          tryNextAttempt(attemptIndex + 1)
        })
        .on('end', () => {
          // No data received, try next
          tryNextAttempt(attemptIndex + 1)
        })
    }
  })
}

/**
 * Detects CSV format based on a parsed first row
 * Returns the provider and confidence level
 */
export function detectCSVFormatFromRow(firstRow: Record<string, string>): CSVDetectionResult {
  const headers = Object.keys(firstRow).map(h => h.trim())
  const normalizedHeaders = headers.map(normalizeHeader)
  
  // Chase patterns - look for key Chase headers
  const chaseScore = calculateChaseScore(normalizedHeaders)
  
  // Venmo patterns - look for key Venmo headers  
  const venmoScore = calculateVenmoScore(normalizedHeaders)
  
  if (chaseScore > venmoScore && chaseScore > 0.6) {
    return {
      provider: Provider.CHASE,
      confidence: chaseScore,
      detectedHeaders: headers
    }
  } else if (venmoScore > chaseScore && venmoScore > 0.6) {
    return {
      provider: Provider.VENMO,
      confidence: venmoScore,
      detectedHeaders: headers
    }
  }
  
  // Default to Chase if we can't determine (legacy behavior)
  return {
    provider: Provider.CHASE,
    confidence: Math.max(chaseScore, 0.3),
    detectedHeaders: headers
  }
}

function calculateChaseScore(normalizedHeaders: string[]): number {
  let score = 0
  
  // Required Chase headers (high weight)
  const chaseRequiredHeaders = [
    ['postdate', 'postingdate', 'transactiondate'], // Date field variants
    ['description'],                                 // Description
    ['amount']                                      // Amount
  ]
  
  // Optional Chase headers (lower weight)
  const chaseOptionalHeaders = [
    ['category', 'type', 'memo'],
    ['balance']
  ]
  
  // Check required headers
  for (const headerGroup of chaseRequiredHeaders) {
    if (headerGroup.some(h => normalizedHeaders.includes(h))) {
      score += 0.3
    }
  }
  
  // Check optional headers
  for (const headerGroup of chaseOptionalHeaders) {
    if (headerGroup.some(h => normalizedHeaders.includes(h))) {
      score += 0.05
    }
  }
  
  // Penalty for Venmo-specific headers
  const venmoSpecificHeaders = ['datetime', 'id', 'amounttotal', 'amountfee', 'from', 'to']
  const venmoHeaderCount = venmoSpecificHeaders.filter(h => normalizedHeaders.includes(h)).length
  if (venmoHeaderCount > 0) {
    score -= venmoHeaderCount * 0.2
  }
  
  return Math.max(0, Math.min(1, score))
}

function calculateVenmoScore(normalizedHeaders: string[]): number {
  let score = 0
  
  // Required Venmo headers (high weight)
  const venmoRequiredHeaders = [
    ['datetime'],           // Datetime
    ['id'],                 // ID
    ['amounttotal'],        // Amount (total)
    ['type']                // Type
  ]
  
  // Optional but common Venmo headers
  const venmoOptionalHeaders = [
    ['amountfee'],          // Amount (fee)
    ['from', 'to'],         // From/To
    ['note'],               // Note
    ['status']              // Status
  ]
  
  // Check required headers
  for (const headerGroup of venmoRequiredHeaders) {
    if (headerGroup.some(h => normalizedHeaders.includes(h))) {
      score += 0.25
    }
  }
  
  // Check optional headers
  for (const headerGroup of venmoOptionalHeaders) {
    if (headerGroup.some(h => normalizedHeaders.includes(h))) {
      score += 0.05
    }
  }
  
  // Penalty for Chase-specific patterns
  const chaseSpecificHeaders = ['postdate', 'postingdate', 'transactiondate', 'balance']
  const chaseHeaderCount = chaseSpecificHeaders.filter(h => normalizedHeaders.includes(h)).length
  if (chaseHeaderCount > 0) {
    score -= chaseHeaderCount * 0.2
  }
  
  return Math.max(0, Math.min(1, score))
}

/**
 * Validates that detected format has required headers for parsing
 */
export function validateDetectedFormat(provider: Provider, csvString: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (provider === Provider.CHASE) {
      // For Chase, parse normally
      console.log('Validating CHASE format, CSV length:', csvString.length)
      parseString(csvString, { 
        headers: true, 
        maxRows: 1,
        skipLinesWithError: true,
        strictColumnHandling: false 
      })
        .on('data', (firstRow: Record<string, string>) => {
          console.log('Chase validation got data:', Object.keys(firstRow))
          const result = validateChaseHeaders(firstRow)
          console.log('Chase validation result:', result)
          resolve(result)
        })
        .on('error', (error) => {
          console.log('Chase validation error:', error.message)
          resolve(false)
        })
        .on('end', () => {
          console.log('Chase validation ended with no data')
          resolve(false)
        })
    } else if (provider === Provider.VENMO) {
      // For Venmo, skip first 2 rows
      const lines = csvString.split('\n')
      const venmoData = lines.slice(2).join('\n')
      parseString(venmoData, { 
        headers: true, 
        maxRows: 1,
        skipLinesWithError: true,
        strictColumnHandling: false 
      })
        .on('data', (firstRow: Record<string, string>) => {
          resolve(validateVenmoHeaders(firstRow))
        })
        .on('error', () => resolve(false))
        .on('end', () => resolve(false))
    } else {
      resolve(false)
    }
  })
}

function validateChaseHeaders(row: Record<string, string>): boolean {
  const headers = Object.keys(row)
  const normalizedHeaders = headers.map(normalizeHeader)
  
  // Must have date, description, and amount
  const hasDate = ['postdate', 'postingdate', 'transactiondate'].some(h => normalizedHeaders.includes(h))
  const hasDescription = normalizedHeaders.includes('description')
  const hasAmount = normalizedHeaders.includes('amount')
  
  return hasDate && hasDescription && hasAmount
}

function validateVenmoHeaders(row: Record<string, string>): boolean {
  const headers = Object.keys(row)
  const normalizedHeaders = headers.map(normalizeHeader)
  
  // Must have datetime, type, amount total, and ID
  const hasDatetime = normalizedHeaders.includes('datetime')
  const hasType = normalizedHeaders.includes('type')
  const hasAmountTotal = normalizedHeaders.includes('amounttotal')
  const hasId = normalizedHeaders.includes('id')
  
  return hasDatetime && hasType && hasAmountTotal && hasId
}