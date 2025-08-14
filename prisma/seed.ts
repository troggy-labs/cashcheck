import { PrismaClient, Provider, AccountType, CategoryKind, Direction, RuleMatchType } from '@prisma/client'
import { randomBytes } from 'crypto'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Create a session first
  const sessionToken = randomBytes(32).toString('hex')
  const session = await prisma.session.create({
    data: {
      token: sessionToken,
      expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours from now
      lastActive: new Date()
    }
  })

  console.log('✅ Created session')

  // Create accounts
  const chaseAccount = await prisma.account.create({
    data: {
      sessionId: session.id,
      provider: Provider.CHASE,
      type: AccountType.CHECKING,
      displayName: 'Chase',
      currency: 'USD',
    },
  })

  const venmoAccount = await prisma.account.create({
    data: {
      sessionId: session.id,
      provider: Provider.VENMO,
      type: AccountType.WALLET,
      displayName: 'Venmo',
      currency: 'USD',
    },
  })

  console.log('✅ Created accounts')

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
          sessionId: session.id
        }
      })
    )
  )

  console.log('✅ Created categories')

  // Find specific categories for rules
  const salaryCategory = createdCategories.find(c => c.name === 'Salary')!
  const groceriesCategory = createdCategories.find(c => c.name === 'Groceries')!
  const transportCategory = createdCategories.find(c => c.name === 'Transport')!
  const feesCategory = createdCategories.find(c => c.name === 'Fees')!

  // Create example rules
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
          sessionId: session.id
        }
      })
    )
  )

  console.log('✅ Created rules')

  // Create app settings
  await prisma.appSetting.create({
    data: {
      key: 'timezone',
      value: 'America/Los_Angeles',
    },
  })

  console.log('✅ Created app settings')
  console.log('🎉 Seed completed successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })