import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()

    const updateData: Prisma.TransactionUncheckedUpdateInput = {}
    
    if ('categoryId' in body) {
      updateData.categoryId = body.categoryId === '' ? null : body.categoryId
    }
    
    if ('isTransfer' in body) {
      updateData.isTransfer = Boolean(body.isTransfer)
      // If marking as transfer, clear transfer candidate flag
      if (body.isTransfer) {
        updateData.transferCandidate = false
      }
    }
    
    if ('notes' in body) {
      updateData.notes = body.notes || null
    }
    
    const transaction = await prisma.transaction.update({
      where: { id },
      data: updateData,
      include: {
        account: true,
        category: true
      }
    })
    
    // Format response
    const result = {
      id: transaction.id,
      date: transaction.postedDate.toISOString().split('T')[0],
      account: transaction.account.displayName,
      description: transaction.descriptionRaw,
      amountCents: transaction.amountCents,
      categoryId: transaction.categoryId,
      categoryName: transaction.category?.name || null,
      isTransfer: transaction.isTransfer,
      transferCandidate: transaction.transferCandidate,
      notes: transaction.notes || ''
    }
    
    return NextResponse.json(result)
    
  } catch (error) {
    console.error('Transaction update API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}