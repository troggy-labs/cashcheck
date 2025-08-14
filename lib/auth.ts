import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'
import { randomBytes } from 'crypto'
import { PrismaClient } from '@prisma/client'
import { initializeSessionDefaults } from './session-setup'

const SESSION_SECRET = process.env.SESSION_SECRET || 'fallback-secret'
const SESSION_DURATION_HOURS = 48 // 48 hours session duration

// Create a global Prisma instance (will be reused across requests)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export interface SessionData {
  sessionId: string
  sessionToken: string
  isAuthenticated: boolean
  iat: number
  exp: number
}

export async function createEphemeralSession(): Promise<{ sessionId: string; token: string }> {
  // Generate a cryptographically secure session token
  const sessionToken = randomBytes(32).toString('hex')
  
  const expiresAt = new Date(Date.now() + SESSION_DURATION_HOURS * 60 * 60 * 1000)
  
  // Create session in database
  const session = await prisma.session.create({
    data: {
      token: sessionToken,
      expiresAt,
      lastActive: new Date()
    }
  })
  
  // Initialize default categories and rules for the new session
  await initializeSessionDefaults(session.id)
  
  return {
    sessionId: session.id,
    token: sessionToken
  }
}

export async function getOrCreateSession(): Promise<{ sessionId: string; token: string; isNew: boolean }> {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('session')
  
  if (sessionCookie) {
    // Try to validate existing session
    const sessionData = verifySessionToken(sessionCookie.value)
    if (sessionData && sessionData.sessionToken) {
      const session = await prisma.session.findUnique({
        where: { 
          token: sessionData.sessionToken,
          expiresAt: { gt: new Date() }
        }
      })
      
      if (session) {
        // Update last active time
        await prisma.session.update({
          where: { id: session.id },
          data: { lastActive: new Date() }
        })
        
        return {
          sessionId: session.id,
          token: session.token,
          isNew: false
        }
      }
    }
  }
  
  // Create new session
  const newSession = await createEphemeralSession()
  return {
    ...newSession,
    isNew: true
  }
}

export function createSessionJWT(sessionId: string, sessionToken: string): string {
  const payload: Omit<SessionData, 'iat' | 'exp'> = {
    sessionId,
    sessionToken,
    isAuthenticated: true
  }
  
  return jwt.sign(payload, SESSION_SECRET, {
    expiresIn: `${SESSION_DURATION_HOURS}h`
  })
}

export function verifySessionToken(token: string): SessionData | null {
  try {
    return jwt.verify(token, SESSION_SECRET) as SessionData
  } catch {
    return null
  }
}

export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('session')
  
  if (!sessionCookie) {
    return null
  }
  
  const sessionData = verifySessionToken(sessionCookie.value)
  if (!sessionData) {
    return null
  }
  
  // Verify session still exists and is valid
  const session = await prisma.session.findUnique({
    where: { 
      id: sessionData.sessionId,
      token: sessionData.sessionToken,
      expiresAt: { gt: new Date() }
    }
  })
  
  return session ? sessionData : null
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession()
  return session?.isAuthenticated === true
}

export function getSessionFromRequest(request: NextRequest): SessionData | null {
  const sessionCookie = request.cookies.get('session')
  
  if (!sessionCookie) {
    return null
  }
  
  return verifySessionToken(sessionCookie.value)
}

export async function cleanupExpiredSessions(): Promise<number> {
  const result = await prisma.session.deleteMany({
    where: {
      expiresAt: { lt: new Date() }
    }
  })
  
  return result.count
}

export { prisma }