import { PrismaClient, CategoryRule, Direction, RuleMatchType, CategoryKind } from '@prisma/client'
import { ParsedTransaction } from './parsers/chase'

const prisma = new PrismaClient()

export interface TransactionWithCategory extends ParsedTransaction {
  categoryId?: string | null
}

export async function categorizeTransaction(
  transaction: ParsedTransaction & { isFeeTx?: boolean }
): Promise<string | null> {
  // If this is a Venmo fee transaction, always categorize as "Fees"
  if (transaction.isFeeTx) {
    const feesCategory = await prisma.category.findFirst({
      where: { 
        name: 'Fees',
        kind: CategoryKind.EXPENSE
      }
    })
    return feesCategory?.id || null
  }
  
  // Get all enabled rules sorted by priority
  const rules = await prisma.categoryRule.findMany({
    where: { enabled: true },
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
  return await getDefaultCategory(transaction.amountCents)
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

async function getDefaultCategory(amountCents: number): Promise<string | null> {
  const categoryName = amountCents > 0 ? 'Income: Misc' : 'Expense: Misc'
  const category = await prisma.category.findFirst({
    where: { name: categoryName }
  })
  return category?.id || null
}

export async function categorizeBatch(
  transactions: (ParsedTransaction & { isFeeTx?: boolean })[]
): Promise<(TransactionWithCategory)[]> {
  const results: TransactionWithCategory[] = []
  
  for (const transaction of transactions) {
    const categoryId = await categorizeTransaction(transaction)
    results.push({
      ...transaction,
      categoryId
    })
  }
  
  return results
}