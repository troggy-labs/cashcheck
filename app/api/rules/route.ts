import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient, Direction, RuleMatchType } from '@prisma/client'
import { getSession } from '@/lib/auth'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const sessionData = await getSession()
    if (!sessionData) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const rules = await prisma.categoryRule.findMany({
      where: { sessionId: sessionData.sessionId },
      include: {
        category: true,
        account: true
      },
      orderBy: [
        { priority: 'asc' },
        { createdAt: 'asc' }
      ]
    })
    
    const result = rules.map(rule => ({
      id: rule.id,
      pattern: rule.pattern,
      matchType: rule.matchType,
      direction: rule.direction,
      categoryId: rule.categoryId,
      categoryName: rule.category.name,
      accountId: rule.accountId,
      accountName: rule.account?.displayName || null,
      priority: rule.priority,
      enabled: rule.enabled,
      createdAt: rule.createdAt.toISOString()
    }))
    
    return NextResponse.json(result)
    
  } catch (error) {
    console.error('Rules GET API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const sessionData = await getSession()
    if (!sessionData) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    const body = await request.json()
    
    const {
      pattern,
      direction = Direction.NONE,
      categoryId,
      priority = 100,
      enabled = true,
      accountId,
      matchType = RuleMatchType.CONTAINS
    } = body
    
    if (!pattern || !categoryId) {
      return NextResponse.json(
        { error: 'Pattern and categoryId are required' },
        { status: 400 }
      )
    }
    
    // Validate direction enum
    if (direction && !Object.values(Direction).includes(direction)) {
      return NextResponse.json(
        { error: 'Invalid direction value' },
        { status: 400 }
      )
    }
    
    // Validate matchType enum
    if (matchType && !Object.values(RuleMatchType).includes(matchType)) {
      return NextResponse.json(
        { error: 'Invalid matchType value' },
        { status: 400 }
      )
    }
    
    const rule = await prisma.categoryRule.create({
      data: {
        sessionId: sessionData.sessionId,
        pattern,
        matchType,
        direction,
        categoryId,
        priority,
        enabled,
        accountId: accountId || null
      },
      include: {
        category: true,
        account: true
      }
    })
    
    const result = {
      id: rule.id,
      pattern: rule.pattern,
      matchType: rule.matchType,
      direction: rule.direction,
      categoryId: rule.categoryId,
      categoryName: rule.category.name,
      accountId: rule.accountId,
      accountName: rule.account?.displayName || null,
      priority: rule.priority,
      enabled: rule.enabled,
      createdAt: rule.createdAt.toISOString()
    }
    
    return NextResponse.json(result, { status: 201 })
    
  } catch (error) {
    console.error('Rules POST API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}