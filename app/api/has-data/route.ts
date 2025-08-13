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

    // Check if user has any transactions in their session
    const transactionCount = await prisma.transaction.count({
      where: {
        sessionId: sessionData.sessionId
      }
    })

    return NextResponse.json({
      hasTransactions: transactionCount > 0,
      totalTransactions: transactionCount
    })
    
  } catch (error) {
    console.error('Has-data API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}