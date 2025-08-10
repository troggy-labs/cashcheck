import crypto from 'crypto'
import Currency from 'currency.js'

export const normalizeHeader = (s: string): string => 
  s.toLowerCase().replace(/[^a-z0-9]/g, "")

export function pickHeader(row: Record<string, string>, candidates: string[]): string | undefined {
  const map = new Map<string, string>()
  for (const k of Object.keys(row)) {
    map.set(normalizeHeader(k), k)
  }
  for (const c of candidates) {
    const k = map.get(normalizeHeader(c))
    if (k && row[k]) return row[k]
  }
  return undefined
}

export function toCents(s: string | undefined): number {
  if (!s) return 0
  try {
    // Use currency.js to parse various currency formats
    // Handles: "$300.00", "- $300.00", "+ $300.00", "-47.57", "3000.00", etc.
    return Currency(s).intValue
  } catch (error) {
    console.warn(`Failed to parse currency: "${s}"`, error)
    return 0
  }
}

export function normalizeDesc(s: string): string {
  return s
    .toUpperCase()
    .replace(/[#\d]+/g, " ")
    .replace(/\b(POS|DEBIT|CREDIT|CO)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

export function parseUsDate(dateStr: string, timezone: string = 'America/Los_Angeles'): Date {
  // Parse MM/DD/YYYY format
  const [month, day, year] = dateStr.split('/').map(Number)
  if (!month || !day || !year) {
    throw new Error(`Invalid date format: ${dateStr}`)
  }
  
  // Create date in the specified timezone
  return new Date(year, month - 1, day)
}

export function parseDateTime(dateTimeStr: string, timezone: string = 'America/Los_Angeles'): Date {
  // Parse formats like "07/05/2025 10:22:00"
  const date = new Date(dateTimeStr)
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid datetime format: ${dateTimeStr}`)
  }
  return date
}

export function toDateOnly(date: Date, timezone: string = 'America/Los_Angeles'): Date {
  // Return a date with time set to start of day
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function createHashUnique(
  source: string,
  accountId: string,
  postedDate: Date,
  amountCents: number,
  descriptionRaw: string,
  externalId?: string | null
): string {
  const dateStr = postedDate.toISOString().split('T')[0] // YYYY-MM-DD
  const normalizedDesc = normalizeDesc(descriptionRaw)
  const hashInput = `${source}|${accountId}|${dateStr}|${amountCents}|${normalizedDesc}|${externalId ?? ""}`
  
  return crypto.createHash('sha256').update(hashInput).digest('hex')
}