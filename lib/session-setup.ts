import { PrismaClient, CategoryKind, Direction, RuleMatchType } from '@prisma/client'

const prisma = new PrismaClient()

export async function initializeSessionDefaults(sessionId: string) {
  // Check if session already has categories
  const existingCategories = await prisma.category.count({
    where: { sessionId }
  })
  
  if (existingCategories > 0) {
    // Session already initialized
    return
  }
  
  console.log(`🔧 Initializing default categories and rules for session ${sessionId}...`)
  
  // Create income categories
  const incomeCategories = [
    { name: 'Salary', kind: CategoryKind.INCOME },
    { name: 'Refunds', kind: CategoryKind.INCOME },
    { name: 'Income: Misc', kind: CategoryKind.INCOME },
  ]

  // Create expense categories
  const expenseCategories = [
    { name: 'Rent', kind: CategoryKind.EXPENSE },
    { name: 'Utilities', kind: CategoryKind.EXPENSE },
    { name: 'Groceries', kind: CategoryKind.EXPENSE },
    { name: 'Dining', kind: CategoryKind.EXPENSE },
    { name: 'Transport', kind: CategoryKind.EXPENSE },
    { name: 'Travel', kind: CategoryKind.EXPENSE },
    { name: 'Entertainment', kind: CategoryKind.EXPENSE },
    { name: 'Health', kind: CategoryKind.EXPENSE },
    { name: 'Shopping', kind: CategoryKind.EXPENSE },
    { name: 'Fees', kind: CategoryKind.EXPENSE },
    { name: 'Taxes', kind: CategoryKind.EXPENSE },
    { name: 'Expense: Misc', kind: CategoryKind.EXPENSE },
  ]

  // Create transfer category
  const transferCategories = [
    { name: 'Transfer', kind: CategoryKind.TRANSFER },
  ]

  const allCategories = [...incomeCategories, ...expenseCategories, ...transferCategories]
  
  const createdCategories = await Promise.all(
    allCategories.map(cat => 
      prisma.category.create({ 
        data: {
          ...cat,
          sessionId
        }
      })
    )
  )

  console.log(`✅ Created ${createdCategories.length} categories for session`)

  // Find specific categories for rules
  const salaryCategory = createdCategories.find(c => c.name === 'Salary')!
  const groceriesCategory = createdCategories.find(c => c.name === 'Groceries')!
  const transportCategory = createdCategories.find(c => c.name === 'Transport')!

  // Create default rules
  const rules = [
    {
      pattern: 'PAYROLL',
      direction: Direction.INFLOW,
      categoryId: salaryCategory.id,
      matchType: RuleMatchType.CONTAINS,
      priority: 10,
      enabled: true,
    },
    {
      pattern: 'SAFEWAY',
      direction: Direction.OUTFLOW,
      categoryId: groceriesCategory.id,
      matchType: RuleMatchType.CONTAINS,
      priority: 20,
      enabled: true,
    },
    {
      pattern: 'UBER',
      direction: Direction.OUTFLOW,
      categoryId: transportCategory.id,
      matchType: RuleMatchType.CONTAINS,
      priority: 30,
      enabled: true,
    },
  ]

  await Promise.all(
    rules.map(rule => 
      prisma.categoryRule.create({ 
        data: {
          ...rule,
          sessionId
        }
      })
    )
  )

  console.log(`✅ Created ${rules.length} default rules for session`)
}