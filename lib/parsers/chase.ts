import { Provider } from '@prisma/client'
import { 
  pickHeader, 
  toCents, 
  parseUsDate, 
  toDateOnly, 
  normalizeDesc, 
  createHashUnique 
} from '../csv-utils'

export interface ParsedTransaction {
  source: Provider
  externalId?: string | null
  accountId: string
  postedAt: Date
  postedDate: Date
  descriptionRaw: string
  descriptionNorm: string
  amountCents: number
  currency: string
  hashUnique: string
  csvCategory?: string | null // Add CSV category field
}

export function parseChaseRow(
  row: Record<string, string>, 
  accountId: string, 
  timezone: string = 'America/Los_Angeles'
): ParsedTransaction {
  // Extract fields using header normalization - prefer Post Date, fallback to Transaction Date
  const dateStr = pickHeader(row, ["Post Date", "Posting Date", "Transaction Date"])
  const description = pickHeader(row, ["Description"])
  const amountStr = pickHeader(row, ["Amount"])
  
  if (!dateStr || !description || !amountStr) {
    throw new Error(`Missing required fields in Chase CSV row: ${JSON.stringify(row)}`)
  }
  
  // Extract additional fields but don't modify description
  const csvCategory = pickHeader(row, ["Category"])
  const type = pickHeader(row, ["Type"]) 
  const memo = pickHeader(row, ["Memo"])
  
  // Build enhanced description with type and memo only (not category)
  let enhancedDescription = description
  if (type && type !== 'Sale') { // Only add type if it's not the default 'Sale'
    enhancedDescription += ` (${type})`
  }
  if (memo && memo.trim()) {
    enhancedDescription += ` - ${memo}`
  }
  
  // Parse date and amount
  const postedAt = parseUsDate(dateStr, timezone)
  const postedDate = toDateOnly(postedAt, timezone)
  const amountCents = toCents(amountStr) // Sign preserved from CSV
  const descriptionNorm = normalizeDesc(enhancedDescription)
  
  // Create unique hash using enhanced description
  const hashUnique = createHashUnique(
    Provider.CHASE,
    accountId,
    postedDate,
    amountCents,
    enhancedDescription,
    null // Chase doesn't have external IDs
  )
  
  return {
    source: Provider.CHASE,
    externalId: null,
    accountId,
    postedAt,
    postedDate,
    descriptionRaw: enhancedDescription,
    descriptionNorm,
    amountCents,
    currency: 'USD',
    hashUnique,
    csvCategory: csvCategory || null
  }
}