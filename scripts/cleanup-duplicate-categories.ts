import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface DuplicateGroup {
  name: string
  kind: string
  categories: Array<{
    id: string
    sessionId: string | null
    transactionCount: number
    ruleCount: number
    createdAt: Date
  }>
}

async function analyzeCategories() {
  console.log('🔍 Analyzing categories for duplicates...')

  // Get all categories with their usage counts
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: {
          txs: true,
          rules: true
        }
      }
    },
    orderBy: [
      { name: 'asc' },
      { createdAt: 'asc' }
    ]
  })

  console.log(`📊 Found ${categories.length} total categories`)

  // Group by name and kind to find duplicates
  const categoryGroups = new Map<string, DuplicateGroup>()

  for (const category of categories) {
    const key = `${category.name}:${category.kind}`
    
    if (!categoryGroups.has(key)) {
      categoryGroups.set(key, {
        name: category.name,
        kind: category.kind,
        categories: []
      })
    }

    categoryGroups.get(key)!.categories.push({
      id: category.id,
      sessionId: category.sessionId,
      transactionCount: category._count.txs,
      ruleCount: category._count.rules,
      createdAt: category.createdAt
    })
  }

  // Find groups with duplicates
  const duplicateGroups = Array.from(categoryGroups.values())
    .filter(group => group.categories.length > 1)

  console.log(`🚨 Found ${duplicateGroups.length} category groups with duplicates:`)

  for (const group of duplicateGroups) {
    console.log(`\n📂 "${group.name}" (${group.kind}):`)
    for (const cat of group.categories) {
      console.log(`  - ID: ${cat.id.substring(0, 8)}... | Session: ${cat.sessionId?.substring(0, 8) || 'NULL'} | Txns: ${cat.transactionCount} | Rules: ${cat.ruleCount} | Created: ${cat.createdAt.toISOString()}`)
    }
  }

  return duplicateGroups
}

async function cleanupDuplicates(dryRun: boolean = true) {
  const duplicateGroups = await analyzeCategories()

  if (duplicateGroups.length === 0) {
    console.log('✅ No duplicates found!')
    return
  }

  console.log(`\n${dryRun ? '🧪 DRY RUN MODE' : '🔥 LIVE MODE'} - Processing ${duplicateGroups.length} duplicate groups...`)

  let totalTransactionsUpdated = 0
  let totalRulesUpdated = 0
  let totalCategoriesDeleted = 0

  for (const group of duplicateGroups) {
    console.log(`\n🔧 Processing "${group.name}" (${group.kind})...`)

    // Sort categories by priority:
    // 1. Categories with sessionId (keep these)
    // 2. Most used (highest transaction + rule count)
    // 3. Oldest (earliest createdAt)
    const sortedCategories = group.categories.sort((a, b) => {
      // Prioritize categories with sessionId
      if (a.sessionId && !b.sessionId) return -1
      if (!a.sessionId && b.sessionId) return 1
      
      // Then by usage (transactions + rules)
      const aUsage = a.transactionCount + a.ruleCount
      const bUsage = b.transactionCount + b.ruleCount
      if (aUsage !== bUsage) return bUsage - aUsage
      
      // Finally by age (older first)
      return a.createdAt.getTime() - b.createdAt.getTime()
    })

    const keepCategory = sortedCategories[0]
    const duplicatesToRemove = sortedCategories.slice(1)

    console.log(`  📌 Keeping: ${keepCategory.id.substring(0, 8)}... (Session: ${keepCategory.sessionId?.substring(0, 8) || 'NULL'}, Usage: ${keepCategory.transactionCount + keepCategory.ruleCount})`)

    for (const duplicate of duplicatesToRemove) {
      console.log(`  🗑️  Removing: ${duplicate.id.substring(0, 8)}... (Session: ${duplicate.sessionId?.substring(0, 8) || 'NULL'}, Usage: ${duplicate.transactionCount + duplicate.ruleCount})`)

      if (!dryRun) {
        // Update transactions to point to the kept category
        if (duplicate.transactionCount > 0) {
          const txUpdateResult = await prisma.transaction.updateMany({
            where: { categoryId: duplicate.id },
            data: { categoryId: keepCategory.id }
          })
          totalTransactionsUpdated += txUpdateResult.count
          console.log(`    📝 Updated ${txUpdateResult.count} transactions`)
        }

        // Update rules to point to the kept category
        if (duplicate.ruleCount > 0) {
          const ruleUpdateResult = await prisma.categoryRule.updateMany({
            where: { categoryId: duplicate.id },
            data: { categoryId: keepCategory.id }
          })
          totalRulesUpdated += ruleUpdateResult.count
          console.log(`    📋 Updated ${ruleUpdateResult.count} rules`)
        }

        // Delete the duplicate category
        await prisma.category.delete({
          where: { id: duplicate.id }
        })
        totalCategoriesDeleted++
        console.log(`    ✅ Deleted duplicate category`)
      }
    }
  }

  console.log(`\n📊 Summary:`)
  console.log(`   ${totalCategoriesDeleted} categories deleted`)
  console.log(`   ${totalTransactionsUpdated} transactions updated`)
  console.log(`   ${totalRulesUpdated} rules updated`)
  
  if (dryRun) {
    console.log(`\n⚠️  This was a DRY RUN. To actually perform the cleanup, run:`)
    console.log(`   npm run cleanup-categories -- --live`)
  } else {
    console.log(`\n✅ Cleanup completed!`)
  }
}

async function main() {
  const isLive = process.argv.includes('--live')
  
  try {
    await cleanupDuplicates(!isLive)
  } catch (error) {
    console.error('❌ Cleanup failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  main()
}

export { analyzeCategories, cleanupDuplicates }