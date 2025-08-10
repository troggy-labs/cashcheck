import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filename = searchParams.get('filename')
    
    if (!filename) {
      return NextResponse.json(
        { error: 'Filename parameter required' },
        { status: 400 }
      )
    }
    
    // Find the import file
    const importFile = await prisma.importFile.findFirst({
      where: { 
        filename: {
          contains: filename,
          mode: 'insensitive'
        }
      },
      include: {
        transactions: {
          select: { id: true }
        }
      }
    })
    
    if (!importFile) {
      return NextResponse.json(
        { error: `No import file found matching: ${filename}` },
        { status: 404 }
      )
    }
    
    // Delete all associated transactions first
    const deleteTransactions = await prisma.transaction.deleteMany({
      where: { importFileId: importFile.id }
    })
    
    // Delete the import file
    const deletedImportFile = await prisma.importFile.delete({
      where: { id: importFile.id }
    })
    
    return NextResponse.json({
      success: true,
      deleted: {
        importFile: deletedImportFile.filename,
        transactions: deleteTransactions.count
      }
    })
    
  } catch (error) {
    console.error('Delete import error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}