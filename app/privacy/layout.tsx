import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - CashCheck | How We Protect Your Financial Data',
  description: 'Learn how CashCheck protects your financial data with bank-level security. We never sell your data or connect directly to your accounts. Complete privacy policy.',
  keywords: [
    'privacy policy',
    'data protection',
    'financial data security',
    'bank-level security',
    'GDPR compliance',
    'CCPA compliance',
    'data deletion rights',
    'transaction data privacy'
  ],
  robots: {
    index: true,
    follow: true,
  },
}

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}