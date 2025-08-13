import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getSessionFromRequest } from '@/lib/auth'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Get session
    const sessionData = getSessionFromRequest(request)
    if (!sessionData) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Find the most recent month with transactions
    const mostRecentTransaction = await prisma.transaction.findFirst({
      where: {
        sessionId: sessionData.sessionId
      },
      orderBy: {
        postedDate: 'desc'
      },
      select: {
        postedDate: true
      }
    })

    if (!mostRecentTransaction) {
      return NextResponse.json({
        hasTransactions: false,
        recentMonth: null
      })
    }

    const recentDate = mostRecentTransaction.postedDate
    const recentMonth = `${recentDate.getFullYear()}-${String(recentDate.getMonth() + 1).padStart(2, '0')}`

    return NextResponse.json({
      hasTransactions: true,
      recentMonth
    })
    
  } catch (error) {
    console.error('Recent month API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}