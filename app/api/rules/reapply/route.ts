import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { categorizeTransaction } from '@/lib/categorization'
import { getSessionFromRequest } from '@/lib/auth'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    // Get session
    const sessionData = getSessionFromRequest(request)
    if (!sessionData) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { month } = body
    
    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      return NextResponse.json(
        { error: 'Invalid month parameter. Use YYYY-MM format' },
        { status: 400 }
      )
    }
    
    const startDate = new Date(`${month}-01T00:00:00Z`)
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0, 23, 59, 59, 999)
    
    // Get all transactions for the month (excluding transfers)
    const transactions = await prisma.transaction.findMany({
      where: {
        sessionId: sessionData.sessionId,
        postedDate: { gte: startDate, lte: endDate },
        isTransfer: false
      }
    })
    
    let updated = 0
    
    // Recategorize each transaction
    for (const transaction of transactions) {
      const newCategoryId = await categorizeTransaction({
        source: transaction.source,
        externalId: transaction.externalId,
        accountId: transaction.accountId,
        postedAt: transaction.postedAt,
        postedDate: transaction.postedDate,
        descriptionRaw: transaction.descriptionRaw,
        descriptionNorm: transaction.descriptionNorm,
        amountCents: transaction.amountCents,
        currency: transaction.currency,
        hashUnique: transaction.hashUnique
      }, sessionData.sessionId)
      
      // Only update if category changed
      if (newCategoryId !== transaction.categoryId) {
        await prisma.transaction.update({
          where: { id: transaction.id },
          data: { categoryId: newCategoryId }
        })
        updated++
      }
    }
    
    return NextResponse.json({
      updated,
      total: transactions.length
    })
    
  } catch (error) {
    console.error('Rules reapply API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}