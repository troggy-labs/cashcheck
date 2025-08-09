import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const month = url.searchParams.get('month')
    
    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      return NextResponse.json(
        { error: 'Invalid month parameter. Use YYYY-MM format' },
        { status: 400 }
      )
    }
    
    const startDate = new Date(`${month}-01T00:00:00Z`)
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0, 23, 59, 59, 999)
    
    // Get tiles data (exclude transfers)
    const tilesResult = await prisma.$queryRaw<Array<{
      incomeCents: bigint | null
      expenseCents: bigint | null  
      netCents: bigint | null
    }>>`
      SELECT
        SUM(CASE WHEN "amountCents" > 0 AND NOT "isTransfer" THEN "amountCents" ELSE 0 END) AS "incomeCents",
        SUM(CASE WHEN "amountCents" < 0 AND NOT "isTransfer" THEN -"amountCents" ELSE 0 END) AS "expenseCents",
        SUM(CASE WHEN NOT "isTransfer" THEN "amountCents" ELSE 0 END) AS "netCents"
      FROM "Transaction"
      WHERE date_trunc('month', "postedDate") = date_trunc('month', ${startDate}::date)
    `
    
    const tiles = {
      incomeCents: Number(tilesResult[0]?.incomeCents || 0),
      expenseCents: Number(tilesResult[0]?.expenseCents || 0),
      netCents: Number(tilesResult[0]?.netCents || 0)
    }
    
    // Get by category data (expenses only)
    const byCategoryResult = await prisma.$queryRaw<Array<{
      category: string
      expensesCents: bigint
    }>>`
      SELECT c.name AS category,
             SUM(ABS(t."amountCents")) AS "expensesCents"
      FROM "Transaction" t
      JOIN "Category" c ON c.id = t."categoryId"
      WHERE c.kind = 'EXPENSE'
        AND NOT t."isTransfer"
        AND date_trunc('month', t."postedDate") = date_trunc('month', ${startDate}::date)
        AND t."amountCents" < 0
      GROUP BY c.name
      ORDER BY "expensesCents" DESC
    `
    
    const byCategory = byCategoryResult.map(row => ({
      category: row.category,
      expensesCents: Number(row.expensesCents)
    }))
    
    // Get by account data
    const byAccountResult = await prisma.$queryRaw<Array<{
      account: string
      incomeCents: bigint | null
      expensesCents: bigint | null
    }>>`
      SELECT a."displayName" AS account,
             SUM(CASE WHEN t."amountCents" > 0 AND NOT t."isTransfer" THEN t."amountCents" ELSE 0 END) AS "incomeCents",
             SUM(CASE WHEN t."amountCents" < 0 AND NOT t."isTransfer" THEN -t."amountCents" ELSE 0 END) AS "expensesCents"
      FROM "Transaction" t
      JOIN "Account" a ON a.id = t."accountId"
      WHERE date_trunc('month', t."postedDate") = date_trunc('month', ${startDate}::date)
      GROUP BY a."displayName"
      ORDER BY a."displayName"
    `
    
    const byAccount = byAccountResult.map(row => ({
      account: row.account,
      incomeCents: Number(row.incomeCents || 0),
      expensesCents: Number(row.expensesCents || 0)
    }))
    
    // Get counters
    const uncategorizedCount = await prisma.transaction.count({
      where: {
        categoryId: null,
        isTransfer: false,
        postedDate: { gte: startDate, lte: endDate }
      }
    })
    
    const reviewTransfersCount = await prisma.transaction.count({
      where: {
        transferCandidate: true,
        isTransfer: false,
        postedDate: { gte: startDate, lte: endDate }
      }
    })
    
    // Get categories for dropdowns
    const categories = await prisma.category.findMany({
      orderBy: [
        { kind: 'asc' },
        { name: 'asc' }
      ]
    })
    
    // Get accounts for dropdowns
    const accounts = await prisma.account.findMany({
      orderBy: { displayName: 'asc' }
    })
    
    return NextResponse.json({
      tiles,
      byCategory,
      byAccount,
      counters: {
        uncategorized: uncategorizedCount,
        reviewTransfers: reviewTransfersCount
      },
      categories: categories.map(c => ({
        id: c.id,
        name: c.name,
        kind: c.kind
      })),
      accounts: accounts.map(a => ({
        id: a.id,
        displayName: a.displayName
      }))
    })
    
  } catch (error) {
    console.error('Page data API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}