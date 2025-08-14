import { PrismaClient, Provider, AccountType, CategoryKind, Direction, RuleMatchType } from '@prisma/client'
import { randomBytes } from 'crypto'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Create app settings only - no session-specific data
  await prisma.appSetting.upsert({
    where: { key: 'timezone' },
    update: {},
    create: {
      key: 'timezone',
      value: 'America/Los_Angeles',
    },
  })

  console.log('✅ Created app settings')
  console.log('🎉 Seed completed successfully!')
  console.log('ℹ️  Categories and accounts will be created automatically when sessions are initialized')
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