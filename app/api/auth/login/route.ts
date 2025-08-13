import { NextResponse } from 'next/server'
import { getOrCreateSession, createSessionJWT } from '@/lib/auth'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function POST() {
  try {
    console.log('POST /api/auth/login - Starting session creation...')
    
    // Create or get existing ephemeral session
    const { sessionId, token, isNew } = await getOrCreateSession()
    console.log('Session created/retrieved:', { sessionId, isNew })
    
    // Create JWT token for the session
    const jwtToken = createSessionJWT(sessionId, token)
    const cookieStore = await cookies()
    
    cookieStore.set('session', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 48 * 60 * 60, // 48 hours
      path: '/'
    })
    
    console.log('Session cookie set successfully')
    
    return NextResponse.json({ 
      ok: true, 
      sessionId,
      isNewSession: isNew 
    })
  } catch (error) {
    console.error('Session creation error:', error)
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace')
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Also handle GET requests to create sessions automatically
export async function GET() {
  try {
    const { sessionId, token, isNew } = await getOrCreateSession()
    
    const jwtToken = createSessionJWT(sessionId, token)
    const cookieStore = await cookies()
    
    cookieStore.set('session', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 48 * 60 * 60, // 48 hours
      path: '/'
    })
    
    return NextResponse.json({ 
      ok: true, 
      sessionId,
      isNewSession: isNew 
    })
  } catch (error) {
    console.error('Session creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}