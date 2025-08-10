import { Provider } from '@prisma/client'
import { normalizeHeader } from './csv-utils'

export interface CSVDetectionResult {
  provider: Provider
  confidence: number
  detectedHeaders: string[]
}

/**
 * Detects CSV format based on headers
 * Returns the provider and confidence level
 */
export function detectCSVFormat(firstRow: Record<string, string>): CSVDetectionResult {
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
export function validateDetectedFormat(provider: Provider, firstRow: Record<string, string>): boolean {
  if (provider === Provider.CHASE) {
    return validateChaseHeaders(firstRow)
  } else if (provider === Provider.VENMO) {
    return validateVenmoHeaders(firstRow)
  }
  return false
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