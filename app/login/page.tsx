'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function WelcomePage() {
  const router = useRouter()
  const [isCreatingSession, setIsCreatingSession] = useState(false)

  useEffect(() => {
    const createSessionAndRedirect = async () => {
      setIsCreatingSession(true)
      
      try {
        // Create session via the auth endpoint
        const response = await fetch('/api/auth/login', { method: 'POST' })
        
        if (response.ok) {
          // Wait a moment for cookie to be set, then redirect
          setTimeout(() => {
            router.push('/')
          }, 100)
        } else {
          console.error('Failed to create session')
          setIsCreatingSession(false)
        }
      } catch (error) {
        console.error('Session creation error:', error)
        setIsCreatingSession(false)
      }
    }

    createSessionAndRedirect()
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome to CashCheck
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isCreatingSession 
              ? 'Creating your session...' 
              : 'Redirecting you to your personal finance dashboard...'
            }
          </p>
        </div>
      </div>
    </div>
  )
}