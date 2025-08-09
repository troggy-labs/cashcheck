import { Provider } from '@prisma/client'
import { 
  toCents, 
  parseDateTime, 
  toDateOnly, 
  normalizeDesc, 
  createHashUnique 
} from '../csv-utils'
import { ParsedTransaction } from './chase'

export interface VenmoTransaction extends ParsedTransaction {
  isFeeTx?: boolean // Mark fee transactions
}

export function parseVenmoRow(
  row: Record<string, string>, 
  accountId: string, 
  timezone: string = 'America/Los_Angeles'
): VenmoTransaction[] {
  // Venmo CSV headers: Datetime, Type, From, To, Amount (total), Amount (fee), Note, ID
  const dateTimeStr = row["Datetime"]
  const type = row["Type"] || ""
  const from = row["From"] || ""
  const to = row["To"] || ""
  const totalAmountStr = row["Amount (total)"] || "0"
  const feeAmountStr = row["Amount (fee)"] || "0"
  const note = row["Note"] || ""
  const externalId = row["ID"] || null
  
  if (!dateTimeStr || !totalAmountStr) {
    throw new Error(`Missing required fields in Venmo CSV row: ${JSON.stringify(row)}`)
  }
  
  // Parse datetime
  const postedAt = parseDateTime(dateTimeStr, timezone)
  const postedDate = toDateOnly(postedAt, timezone)
  
  // Parse amounts
  const totalCents = toCents(totalAmountStr)
  const feeCents = -Math.abs(toCents(feeAmountStr)) // Fees are always outflows (negative)
  const mainCents = totalCents - feeCents // Main amount after subtracting fee
  
  // Create description
  const fromPart = from ? `From ${from}` : ''
  const toPart = to ? `To ${to}` : ''
  const descriptionRaw = `${type}: ${note || ''} ${fromPart} ${toPart}`.trim()
  const descriptionNorm = normalizeDesc(descriptionRaw)
  
  const transactions: VenmoTransaction[] = []
  
  // Create main transaction
  const mainHashUnique = createHashUnique(
    Provider.VENMO,
    accountId,
    postedDate,
    mainCents,
    descriptionRaw,
    externalId
  )
  
  transactions.push({
    source: Provider.VENMO,
    externalId,
    accountId,
    postedAt,
    postedDate,
    descriptionRaw,
    descriptionNorm,
    amountCents: mainCents,
    currency: 'USD',
    hashUnique: mainHashUnique,
    isFeeTx: false
  })
  
  // Create fee transaction if there's a fee
  if (feeCents !== 0) {
    const feeDescription = `${type} Fee: ${note || ''} ${fromPart} ${toPart}`.trim()
    const feeHashUnique = createHashUnique(
      Provider.VENMO,
      accountId,
      postedDate,
      feeCents,
      feeDescription,
      externalId ? `${externalId}-fee` : null
    )
    
    transactions.push({
      source: Provider.VENMO,
      externalId: externalId ? `${externalId}-fee` : null,
      accountId,
      postedAt,
      postedDate,
      descriptionRaw: feeDescription,
      descriptionNorm: normalizeDesc(feeDescription),
      amountCents: feeCents,
      currency: 'USD',
      hashUnique: feeHashUnique,
      isFeeTx: true
    })
  }
  
  return transactions
}