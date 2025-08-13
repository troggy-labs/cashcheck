import React from 'react'

interface CashCheckLogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
}

export default function CashCheckLogo({ 
  className = '', 
  size = 'md',
  showText = true 
}: CashCheckLogoProps) {
  const sizeClasses = {
    sm: 'h-6 w-8',
    md: 'h-8 w-10', 
    lg: 'h-10 w-12'
  }
  
  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className={`${sizeClasses[size]} relative`}>
        <svg
          viewBox="0 0 40 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Check background */}
          <rect
            x="2"
            y="4"
            width="36"
            height="24"
            rx="2"
            fill="#f8fafc"
            stroke="#cbd5e1"
            strokeWidth="1"
          />
          
          {/* Bank name line */}
          <rect x="6" y="8" width="12" height="1.5" rx="0.75" fill="#94a3b8" />
          
          {/* Account/routing lines */}
          <rect x="6" y="11" width="8" height="1" rx="0.5" fill="#cbd5e1" />
          <rect x="16" y="11" width="10" height="1" rx="0.5" fill="#cbd5e1" />
          
          {/* Amount line */}
          <rect x="6" y="20" width="16" height="2" rx="1" fill="#10b981" />
          
          {/* Signature line */}
          <rect x="24" y="20" width="10" height="1" rx="0.5" fill="#cbd5e1" />
          
          {/* Dollar sign */}
          <text
            x="32"
            y="18"
            fontSize="8"
            fontWeight="bold"
            fill="#059669"
            fontFamily="monospace"
          >
            $
          </text>
          
          {/* Memo line */}
          <rect x="6" y="15" width="14" height="1" rx="0.5" fill="#e2e8f0" />
          <text
            x="7"
            y="16.2"
            fontSize="3"
            fill="#94a3b8"
          >
            MEMO
          </text>
        </svg>
      </div>
      
      {showText && (
        <span className={`font-bold tracking-tight text-brand-900 ${textSizeClasses[size]}`}>
          CashCheck
        </span>
      )}
    </div>
  )
}