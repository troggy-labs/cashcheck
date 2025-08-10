import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

export async function DELETE(request: NextRequest) {
  try {
    const { ids } = await request.json()
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'Transaction IDs array required' },
        { status: 400 }
      )
    }
    
    // Delete the specified transactions
    const result = await prisma.transaction.deleteMany({
      where: {
        id: {
          in: ids
        }
      }
    })
    
    return NextResponse.json({ 
      deleted: result.count,
      message: `Deleted ${result.count} transactions` 
    })
    
  } catch (error: any) {
    console.error('Bulk delete transaction error:', error)
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}