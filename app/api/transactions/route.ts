import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient, Prisma } from '@prisma/client'
import { getSessionFromRequest } from '@/lib/auth'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const id = url.searchParams.get('id')
    const all = url.searchParams.get('all') === 'true'
    
    if (!id && !all) {
      return NextResponse.json(
        { error: 'Transaction ID or all=true parameter required' },
        { status: 400 }
      )
    }
    
    if (all) {
      // Delete all transactions
      const result = await prisma.transaction.deleteMany({})
      return NextResponse.json({ 
        deleted: result.count,
        message: `Deleted ${result.count} transactions` 
      })
    } else {
      // Delete single transaction
      await prisma.transaction.delete({
        where: { id: id! }
      })
      return NextResponse.json({ message: 'Transaction deleted successfully' })
    }
    
  } catch (error: unknown) {
    console.error('Delete transaction error:', error)

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const isDemo = url.searchParams.get('demo') === 'true'
    
    // Get session ID - use demo session for demo mode
    let sessionId: string
    
    if (isDemo) {
      sessionId = 'demo-session-id'
    } else {
      const sessionData = getSessionFromRequest(request)
      if (!sessionData) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        )
      }
      sessionId = sessionData.sessionId
    }
    
    const month = url.searchParams.get('month')
    const accountId = url.searchParams.get('accountId')
    const categoryId = url.searchParams.get('categoryId')
    const q = url.searchParams.get('q') // search query
    const page = parseInt(url.searchParams.get('page') || '1')
    const pageSize = parseInt(url.searchParams.get('pageSize') || '200')
    const includeTransfers = url.searchParams.get('includeTransfers') === 'true'
    const onlyCandidates = url.searchParams.get('onlyCandidates') === 'true'
    
    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      return NextResponse.json(
        { error: 'Invalid month parameter. Use YYYY-MM format' },
        { status: 400 }
      )
    }
    
    // Parse month (YYYY-MM) and create date range  
    const [year, monthNum] = month.split('-').map(Number)
    
    // Build where clause - proper date range for the specified month
    const where: Prisma.TransactionWhereInput = {
      sessionId: sessionId,
      postedDate: {
        gte: new Date(year, monthNum - 1, 1), // Start of month (monthNum-1 because JS months are 0-indexed)
        lt: new Date(year, monthNum, 1) // Start of next month
      }
    }
    
    if (!includeTransfers) {
      where.isTransfer = false
    }
    
    if (onlyCandidates) {
      where.transferCandidate = true
      where.isTransfer = false
    }
    
    if (accountId) {
      where.accountId = accountId
    }
    
    if (categoryId) {
      where.categoryId = categoryId
    }
    
    if (q) {
      where.OR = [
        { descriptionRaw: { contains: q, mode: 'insensitive' } },
        { descriptionNorm: { contains: q.toUpperCase() } }
      ]
    }
    
    // Get total count
    const total = await prisma.transaction.count({ where })
    
    // Get transactions with pagination
    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        account: true,
        category: true
      },
      orderBy: [
        { postedDate: 'desc' },
        { createdAt: 'desc' }
      ],
      skip: (page - 1) * pageSize,
      take: pageSize
    })
    
    // Format response
    const rows = transactions.map(tx => ({
      id: tx.id,
      date: tx.postedDate.toISOString().split('T')[0],
      account: tx.account.displayName,
      description: tx.descriptionRaw,
      amountCents: tx.amountCents,
      categoryId: tx.categoryId,
      categoryName: tx.category?.name || null,
      isTransfer: tx.isTransfer,
      transferCandidate: tx.transferCandidate,
      notes: tx.notes || ''
    }))
    
    return NextResponse.json({
      rows,
      page,
      pageSize,
      total
    })
    
  } catch (error) {
    console.error('Transactions API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}