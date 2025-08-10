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
  // Venmo CSV headers: ID, Datetime, Type, Status, Note, From, To, Amount (total), Amount (tip), Amount (tax), Amount (fee), ...
  const externalId = row["ID"] || null
  const dateTimeStr = row["Datetime"]
  const type = row["Type"] || ""
  const status = row["Status"] || ""
  const note = row["Note"] || ""
  const from = row["From"] || ""
  const to = row["To"] || ""
  const totalAmountStr = row["Amount (total)"] || "0"
  const feeAmountStr = row["Amount (fee)"] || "0"
  
  // Skip rows that don't have core transaction data (header rows, summary rows, etc.)
  if (!externalId || !dateTimeStr || !totalAmountStr || !type) {
    return []
  }
  
  // Skip transactions with zero amounts (summary rows)
  if (totalAmountStr.trim() === "" || totalAmountStr === "0" || totalAmountStr === "$0.00") {
    return []
  }
  
  // Accept both "Complete" and "Issued" transactions (transfers can be "Issued")
  if (status && !["Complete", "Issued"].includes(status)) {
    return []
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