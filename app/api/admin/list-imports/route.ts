import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const importFiles = await prisma.importFile.findMany({
      include: {
        transactions: {
          select: { id: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json({
      imports: importFiles.map(file => ({
        id: file.id,
        filename: file.filename,
        source: file.source,
        status: file.status,
        imported: file.imported,
        duplicates: file.duplicates,
        transactionCount: file.transactions.length,
        createdAt: file.createdAt,
        processedAt: file.processedAt
      }))
    })
    
  } catch (error) {
    console.error('List imports error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}