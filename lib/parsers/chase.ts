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
}

export function parseChaseRow(
  row: Record<string, string>, 
  accountId: string, 
  timezone: string = 'America/Los_Angeles'
): ParsedTransaction {
  // Extract fields using header normalization
  const postDateStr = pickHeader(row, ["Post Date", "Posting Date"])
  const description = pickHeader(row, ["Description"])
  const amountStr = pickHeader(row, ["Amount"])
  
  if (!postDateStr || !description || !amountStr) {
    throw new Error(`Missing required fields in Chase CSV row: ${JSON.stringify(row)}`)
  }
  
  // Parse date and amount
  const postedAt = parseUsDate(postDateStr, timezone)
  const postedDate = toDateOnly(postedAt, timezone)
  const amountCents = toCents(amountStr) // Sign preserved from CSV
  const descriptionNorm = normalizeDesc(description)
  
  // Create unique hash
  const hashUnique = createHashUnique(
    Provider.CHASE,
    accountId,
    postedDate,
    amountCents,
    description,
    null // Chase doesn't have external IDs
  )
  
  return {
    source: Provider.CHASE,
    externalId: null,
    accountId,
    postedAt,
    postedDate,
    descriptionRaw: description,
    descriptionNorm,
    amountCents,
    currency: 'USD',
    hashUnique
  }
}