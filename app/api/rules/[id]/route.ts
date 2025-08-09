import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient, Direction, RuleMatchType } from '@prisma/client'

const prisma = new PrismaClient()

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    
    const updateData: any = {}
    
    if ('pattern' in body) updateData.pattern = body.pattern
    if ('matchType' in body) updateData.matchType = body.matchType
    if ('direction' in body) updateData.direction = body.direction
    if ('categoryId' in body) updateData.categoryId = body.categoryId
    if ('priority' in body) updateData.priority = body.priority
    if ('enabled' in body) updateData.enabled = body.enabled
    if ('accountId' in body) updateData.accountId = body.accountId || null
    
    const rule = await prisma.categoryRule.update({
      where: { id },
      data: updateData,
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
    
    return NextResponse.json(result)
    
  } catch (error) {
    console.error('Rules PATCH API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    await prisma.categoryRule.delete({
      where: { id }
    })
    
    return NextResponse.json({ ok: true })
    
  } catch (error) {
    console.error('Rules DELETE API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}