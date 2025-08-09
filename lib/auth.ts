import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

const SESSION_SECRET = process.env.SESSION_SECRET || 'fallback-secret'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin'

export interface SessionData {
  isAuthenticated: boolean
  iat: number
  exp: number
}

export async function verifyPassword(password: string): Promise<boolean> {
  return password === ADMIN_PASSWORD
}

export function createSessionToken(): string {
  const payload = {
    isAuthenticated: true
  }
  
  return jwt.sign(payload, SESSION_SECRET, {
    expiresIn: '7d'
  })
}

export function verifySessionToken(token: string): SessionData | null {
  try {
    return jwt.verify(token, SESSION_SECRET) as SessionData
  } catch (error) {
    return null
  }
}

export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('session')
  
  if (!sessionCookie) {
    return null
  }
  
  return verifySessionToken(sessionCookie.value)
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