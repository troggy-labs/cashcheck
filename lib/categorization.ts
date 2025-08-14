import { PrismaClient, CategoryRule, Direction, RuleMatchType, CategoryKind } from '@prisma/client'
import { ParsedTransaction } from './parsers/chase'

const prisma = new PrismaClient()

export interface TransactionWithCategory extends ParsedTransaction {
  categoryId?: string | null
}

export async function categorizeTransaction(
  transaction: ParsedTransaction & { isFeeTx?: boolean },
  sessionId: string
): Promise<string | null> {
  // If this is a Venmo fee transaction, always categorize as "Fees"
  if (transaction.isFeeTx) {
    const feesCategory = await prisma.category.findFirst({
      where: { 
        sessionId: sessionId,
        name: 'Fees',
        kind: CategoryKind.EXPENSE
      }
    })
    return feesCategory?.id || null
  }
  
  // First priority: Use CSV category if available and mappable
  if (transaction.csvCategory) {
    const mappedCategory = await mapCsvCategory(transaction.csvCategory, sessionId)
    if (mappedCategory) {
      return mappedCategory
    }
  }
  
  // Second priority: Get all enabled rules sorted by priority for this session
  const rules = await prisma.categoryRule.findMany({
    where: { 
      sessionId: sessionId,
      enabled: true 
    },
    orderBy: { priority: 'asc' },
    include: { category: true }
  })
  
  // Apply rules in order
  for (const rule of rules) {
    if (matchesRule(transaction, rule)) {
      return rule.categoryId
    }
  }
  
  // Apply defaults if no rule matched
  return await getDefaultCategory(transaction.amountCents, sessionId)
}

function matchesRule(transaction: ParsedTransaction, rule: CategoryRule): boolean {
  // Check direction filter
  if (rule.direction !== Direction.NONE) {
    if (rule.direction === Direction.INFLOW && transaction.amountCents <= 0) return false
    if (rule.direction === Direction.OUTFLOW && transaction.amountCents >= 0) return false
  }
  
  // Check account filter
  if (rule.accountId && rule.accountId !== transaction.accountId) return false
  
  // Check pattern match
  const target = transaction.descriptionNorm
  
  if (rule.matchType === RuleMatchType.CONTAINS) {
    return target.toUpperCase().includes(rule.pattern.toUpperCase())
  } else if (rule.matchType === RuleMatchType.REGEX) {
    try {
      const regex = new RegExp(rule.pattern, 'i')
      return regex.test(target)
    } catch (error) {
      console.error(`Invalid regex pattern: ${rule.pattern}`, error)
      return false
    }
  }
  
  return false
}

// Map Chase CSV categories to our internal categories
async function mapCsvCategory(csvCategory: string, sessionId: string): Promise<string | null> {
  // Create a mapping of Chase categories to our categories
  const categoryMappings: Record<string, string[]> = {
    // Food & Dining
    'Food & Drink': ['Dining', 'Food & Dining'],
    'Restaurants': ['Dining', 'Food & Dining'],
    'Fast Food': ['Dining', 'Food & Dining'], 
    'Coffee Shop': ['Dining', 'Food & Dining'],
    'Bar': ['Dining', 'Food & Dining'],
    
    // Shopping
    'Shopping': ['Shopping'],
    'Clothing': ['Shopping'],
    'Electronics': ['Shopping'],
    'Home': ['Shopping'],
    'Personal': ['Shopping'],
    
    // Transportation
    'Gas': ['Transport', 'Transportation'],
    'Transportation': ['Transport', 'Transportation'],
    'Public Transport': ['Transport', 'Transportation'],
    'Uber': ['Transport', 'Transportation'],
    'Lyft': ['Transport', 'Transportation'],
    'Travel': ['Travel'],
    
    // Bills & Utilities
    'Bills & Utilities': ['Utilities'],
    'Phone': ['Utilities'],
    'Internet': ['Utilities'],
    'Cable': ['Utilities'],
    'Electric': ['Utilities'],
    'Gas & Electric': ['Utilities'],
    'Water': ['Utilities'],
    'Rent': ['Rent'],
    
    // Entertainment
    'Entertainment': ['Entertainment'],
    'Movies': ['Entertainment'],
    'Music': ['Entertainment'],
    'Games': ['Entertainment'],
    
    // Health
    'Health': ['Health'],
    'Medical': ['Health'],
    'Pharmacy': ['Health'],
    
    // Groceries
    'Groceries': ['Groceries'],
    'Grocery': ['Groceries'],
    
    // Income
    'Paycheck': ['Salary', 'Income: Misc'],
    'Deposit': ['Salary', 'Refunds', 'Income: Misc'],
    
    // Fees
    'Fees': ['Fees'],
    'ATM': ['Fees'],
    'Service Charge': ['Fees'],
  }
  
  // Find potential category names to try
  const potentialCategoryNames = categoryMappings[csvCategory] || [csvCategory]
  
  // Try to find matching category in our database
  for (const categoryName of potentialCategoryNames) {
    const category = await prisma.category.findFirst({
      where: {
        sessionId: sessionId,
        name: categoryName
      }
    })
    
    if (category) {
      return category.id
    }
  }
  
  return null // No mapping found
}

async function getDefaultCategory(amountCents: number, sessionId: string): Promise<string | null> {
  const categoryName = amountCents > 0 ? 'Income: Misc' : null // Let uncategorized transactions remain null
  if (!categoryName) return null
  
  const category = await prisma.category.findFirst({
    where: { 
      sessionId: sessionId,
      name: categoryName 
    }
  })
  return category?.id || null
}

export async function categorizeBatch(
  transactions: (ParsedTransaction & { isFeeTx?: boolean })[],
  sessionId: string
): Promise<(TransactionWithCategory)[]> {
  const results: TransactionWithCategory[] = []
  
  for (const transaction of transactions) {
    const categoryId = await categorizeTransaction(transaction, sessionId)
    results.push({
      ...transaction,
      categoryId
    })
  }
  
  return results
}