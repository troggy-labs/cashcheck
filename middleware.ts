import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Simple base64 decode for JWT payload (Edge Runtime compatible)
function decodeJWT(token: string): any {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    
    const payload = parts[1]
    // Add padding if needed
    const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4)
    const decoded = atob(paddedPayload)
    return JSON.parse(decoded)
  } catch (error) {
    console.log('JWT decode error:', error)
    return null
  }
}

function getSessionFromRequest(request: NextRequest): any {
  const sessionCookie = request.cookies.get('session')
  
  if (!sessionCookie) {
    return null
  }
  
  const payload = decodeJWT(sessionCookie.value)
  if (!payload) return null
  
  // Check if token is expired
  const now = Math.floor(Date.now() / 1000)
  if (payload.exp && payload.exp < now) {
    return null
  }
  
  return payload
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Allow access to login page and auth endpoints
  if (pathname === '/login' || pathname.startsWith('/api/auth/')) {
    return NextResponse.next()
  }
  
  // Allow access to demo page and demo API calls
  if (pathname === '/demo' || 
      pathname.startsWith('/landing') || 
      pathname.startsWith('/privacy') ||
      pathname.startsWith('/guide/')) {
    return NextResponse.next()
  }
  
  // Allow demo API calls (check for demo=true parameter)
  if (pathname.startsWith('/api/') && request.nextUrl.searchParams.get('demo') === 'true') {
    return NextResponse.next()
  }
  
  // Allow access to static files
  if (pathname.startsWith('/_next/') || pathname.startsWith('/favicon.ico')) {
    return NextResponse.next()
  }
  
  // Check authentication for protected routes
  if (pathname === '/' || pathname.startsWith('/api/')) {
    const session = getSessionFromRequest(request)
    
    if (!session || !session.isAuthenticated) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}