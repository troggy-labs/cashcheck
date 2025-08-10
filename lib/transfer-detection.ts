import { PrismaClient, Provider } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'

const prisma = new PrismaClient()

export async function markTransferCandidates(month: string): Promise<number> {
  const startDate = new Date(`${month}-01T00:00:00Z`)
  const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0, 23, 59, 59, 999)
  
  // Mark Venmo candidates: Type or descriptionNorm contains TRANSFER
  await prisma.transaction.updateMany({
    where: {
      source: Provider.VENMO,
      postedDate: { gte: startDate, lte: endDate },
      isTransfer: false,
      OR: [
        { descriptionRaw: { contains: 'Transfer', mode: 'insensitive' } },
        { descriptionNorm: { contains: 'TRANSFER' } }
      ]
    },
    data: { transferCandidate: true }
  })
  
  // Mark Chase candidates: descriptionNorm contains VENMO, P2P, or ONLINE TRANSFER
  await prisma.transaction.updateMany({
    where: {
      source: Provider.CHASE,
      postedDate: { gte: startDate, lte: endDate },
      isTransfer: false,
      OR: [
        { descriptionNorm: { contains: 'VENMO' } },
        { descriptionNorm: { contains: 'P2P' } },
        { descriptionNorm: { contains: 'ONLINE TRANSFER' } }
      ]
    },
    data: { transferCandidate: true }
  })
  
  const candidateCount = await prisma.transaction.count({
    where: {
      transferCandidate: true,
      isTransfer: false,
      postedDate: { gte: startDate, lte: endDate }
    }
  })
  
  return candidateCount
}

export async function detectTransfers(month: string): Promise<number> {
  const startDate = new Date(`${month}-01T00:00:00Z`)
  const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0, 23, 59, 59, 999)
  
  // Get all Venmo candidates for the month
  const venmoCandidates = await prisma.transaction.findMany({
    where: {
      source: Provider.VENMO,
      transferCandidate: true,
      isTransfer: false,
      postedDate: { gte: startDate, lte: endDate },
      // Exclude fee transactions from transfer matching
      NOT: {
        descriptionRaw: { contains: 'Fee', mode: 'insensitive' }
      }
    }
  })
  
  let matchedPairs = 0
  
  for (const venmoTx of venmoCandidates) {
    const targetAmount = Math.abs(venmoTx.amountCents)
    const venmoDate = venmoTx.postedDate
    
    // Look for Chase transactions within ±3 days with opposite sign and matching amount
    const searchStart = new Date(venmoDate.getTime() - 3 * 24 * 60 * 60 * 1000)
    const searchEnd = new Date(venmoDate.getTime() + 3 * 24 * 60 * 60 * 1000)
    
    // Find opposite sign: if Venmo is positive (money in), Chase should be negative (money out)
    const expectedChaseSign = venmoTx.amountCents > 0 ? -1 : 1
    
    const chaseMatches = await prisma.transaction.findMany({
      where: {
        source: Provider.CHASE,
        transferCandidate: true,
        isTransfer: false,
        postedDate: { gte: searchStart, lte: searchEnd },
        amountCents: expectedChaseSign > 0 ? { gt: 0 } : { lt: 0 }
      }
    })
    
    // Filter Chase matches by exact amount
    const exactMatches = chaseMatches.filter(
      tx => Math.abs(tx.amountCents) === targetAmount
    )
    
    // If exactly one match, create transfer pair
    if (exactMatches.length === 1) {
      const chaseTx = exactMatches[0]
      const transferGroupId = uuidv4()
      
      // Mark both transactions as transfers with same group ID
      await prisma.transaction.updateMany({
        where: { id: { in: [venmoTx.id, chaseTx.id] } },
        data: {
          isTransfer: true,
          transferGroupId,
          transferCandidate: false
        }
      })
      
      matchedPairs++
    }
    // If multiple or no matches, leave as transferCandidate for manual review
  }
  
  return matchedPairs
}

export async function processTransferDetection(month: string): Promise<{
  candidates: number
  matched: number
}> {
  // First mark candidates
  const candidates = await markTransferCandidates(month)
  
  // Then detect and pair transfers
  const matched = await detectTransfers(month)
  
  return { candidates, matched }
}