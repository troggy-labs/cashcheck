import { PrismaClient, Provider, AccountType } from '@prisma/client'

const prisma = new PrismaClient()

async function seedDemo() {
  console.log('🎬 Seeding demo data...')

  const DEMO_SESSION_ID = 'demo-session-id'

  // Create demo session
  const demoSession = await prisma.session.upsert({
    where: { id: DEMO_SESSION_ID },
    update: {},
    create: {
      id: DEMO_SESSION_ID,
      token: 'demo-token',
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      lastActive: new Date()
    }
  })

  // Create demo accounts
  const chaseAccount = await prisma.account.upsert({
    where: { 
      sessionId_provider_type_displayName: {
        sessionId: DEMO_SESSION_ID,
        provider: Provider.CHASE,
        type: AccountType.CHECKING,
        displayName: 'Chase Checking'
      }
    },
    update: {},
    create: {
      sessionId: DEMO_SESSION_ID,
      provider: Provider.CHASE,
      type: AccountType.CHECKING,
      displayName: 'Chase Checking',
      currency: 'USD'
    }
  })

  const venmoAccount = await prisma.account.upsert({
    where: { 
      sessionId_provider_type_displayName: {
        sessionId: DEMO_SESSION_ID,
        provider: Provider.VENMO,
        type: AccountType.WALLET,
        displayName: 'Venmo'
      }
    },
    update: {},
    create: {
      sessionId: DEMO_SESSION_ID,
      provider: Provider.VENMO,
      type: AccountType.WALLET,
      displayName: 'Venmo',
      currency: 'USD'
    }
  })

  // Get categories (should already exist from main seed)
  const categories = await prisma.category.findMany()
  const incomeCategory = categories.find(c => c.name === 'Income')
  const groceriesCategory = categories.find(c => c.name === 'Groceries')
  const diningCategory = categories.find(c => c.name === 'Food & Dining')
  const transportCategory = categories.find(c => c.name === 'Transportation')
  const shoppingCategory = categories.find(c => c.name === 'Shopping')
  const entertainmentCategory = categories.find(c => c.name === 'Entertainment')
  const billsCategory = categories.find(c => c.name === 'Bills & Utilities')

  // Clear existing demo transactions
  await prisma.transaction.deleteMany({
    where: { sessionId: DEMO_SESSION_ID }
  })

  // Create demo transactions
  const demoTransactions = [
    {
      sessionId: DEMO_SESSION_ID,
      source: Provider.CHASE,
      externalId: 'demo-1',
      accountId: chaseAccount.id,
      postedAt: new Date('2024-12-15T10:00:00Z'),
      postedDate: new Date('2024-12-15'),
      descriptionRaw: 'SALARY DEPOSIT - ACME CORP',
      descriptionNorm: 'Salary Deposit - Acme Corp',
      amountCents: 450000,
      currency: 'USD',
      categoryId: incomeCategory?.id,
      hashUnique: 'demo-hash-1'
    },
    {
      sessionId: DEMO_SESSION_ID,
      source: Provider.CHASE,
      externalId: 'demo-2',
      accountId: chaseAccount.id,
      postedAt: new Date('2024-12-14T14:30:00Z'),
      postedDate: new Date('2024-12-14'),
      descriptionRaw: 'WHOLE FOODS #10327',
      descriptionNorm: 'Whole Foods #10327',
      amountCents: -8950,
      currency: 'USD',
      categoryId: groceriesCategory?.id,
      hashUnique: 'demo-hash-2'
    },
    {
      sessionId: DEMO_SESSION_ID,
      source: Provider.VENMO,
      externalId: 'demo-3',
      accountId: venmoAccount.id,
      postedAt: new Date('2024-12-14T09:15:00Z'),
      postedDate: new Date('2024-12-14'),
      descriptionRaw: 'Coffee with Sarah',
      descriptionNorm: 'Coffee with Sarah',
      amountCents: -650,
      currency: 'USD',
      categoryId: diningCategory?.id,
      hashUnique: 'demo-hash-3'
    },
    {
      sessionId: DEMO_SESSION_ID,
      source: Provider.CHASE,
      externalId: 'demo-4',
      accountId: chaseAccount.id,
      postedAt: new Date('2024-12-13T18:45:00Z'),
      postedDate: new Date('2024-12-13'),
      descriptionRaw: 'UBER TRIP',
      descriptionNorm: 'Uber Trip',
      amountCents: -1840,
      currency: 'USD',
      categoryId: transportCategory?.id,
      hashUnique: 'demo-hash-4'
    },
    {
      sessionId: DEMO_SESSION_ID,
      source: Provider.CHASE,
      externalId: 'demo-5',
      accountId: chaseAccount.id,
      postedAt: new Date('2024-12-13T16:20:00Z'),
      postedDate: new Date('2024-12-13'),
      descriptionRaw: 'AMAZON.COM',
      descriptionNorm: 'Amazon.com',
      amountCents: -4299,
      currency: 'USD',
      categoryId: shoppingCategory?.id,
      hashUnique: 'demo-hash-5'
    },
    {
      sessionId: DEMO_SESSION_ID,
      source: Provider.VENMO,
      externalId: 'demo-6',
      accountId: venmoAccount.id,
      postedAt: new Date('2024-12-12T20:30:00Z'),
      postedDate: new Date('2024-12-12'),
      descriptionRaw: 'Split dinner bill - Mike',
      descriptionNorm: 'Split dinner bill - Mike',
      amountCents: -2800,
      currency: 'USD',
      categoryId: diningCategory?.id,
      hashUnique: 'demo-hash-6'
    },
    {
      sessionId: DEMO_SESSION_ID,
      source: Provider.CHASE,
      externalId: 'demo-7',
      accountId: chaseAccount.id,
      postedAt: new Date('2024-12-12T10:00:00Z'),
      postedDate: new Date('2024-12-12'),
      descriptionRaw: 'NETFLIX.COM',
      descriptionNorm: 'Netflix.com',
      amountCents: -1599,
      currency: 'USD',
      categoryId: entertainmentCategory?.id,
      hashUnique: 'demo-hash-7'
    },
    {
      sessionId: DEMO_SESSION_ID,
      source: Provider.CHASE,
      externalId: 'demo-8',
      accountId: chaseAccount.id,
      postedAt: new Date('2024-12-11T15:00:00Z'),
      postedDate: new Date('2024-12-11'),
      descriptionRaw: 'PG&E ELECTRIC BILL',
      descriptionNorm: 'PG&E Electric Bill',
      amountCents: -12400,
      currency: 'USD',
      categoryId: billsCategory?.id,
      hashUnique: 'demo-hash-8'
    },
    {
      sessionId: DEMO_SESSION_ID,
      source: Provider.CHASE,
      externalId: 'demo-9',
      accountId: chaseAccount.id,
      postedAt: new Date('2024-12-10T08:30:00Z'),
      postedDate: new Date('2024-12-10'),
      descriptionRaw: 'STARBUCKS #2847',
      descriptionNorm: 'Starbucks #2847',
      amountCents: -575,
      currency: 'USD',
      categoryId: diningCategory?.id,
      hashUnique: 'demo-hash-9'
    },
    {
      sessionId: DEMO_SESSION_ID,
      source: Provider.CHASE,
      externalId: 'demo-10',
      accountId: chaseAccount.id,
      postedAt: new Date('2024-12-10T17:00:00Z'),
      postedDate: new Date('2024-12-10'),
      descriptionRaw: 'TRADER JOES #049',
      descriptionNorm: 'Trader Joes #049',
      amountCents: -6750,
      currency: 'USD',
      categoryId: groceriesCategory?.id,
      hashUnique: 'demo-hash-10'
    }
  ]

  // Insert demo transactions  
  await prisma.transaction.createMany({
    data: demoTransactions,
    skipDuplicates: true
  })

  console.log('✅ Demo data seeded successfully!')
  console.log(`📊 Created ${demoTransactions.length} demo transactions`)
  console.log(`🏦 Demo session ID: ${DEMO_SESSION_ID}`)
}

seedDemo()
  .catch((e) => {
    console.error('❌ Demo seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })