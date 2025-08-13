import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CashCheck - Track Your Spending with Chase & Venmo Imports | Free Budget Tracker',
  description: 'Finally understand where your money goes. Import Chase bank statements and Venmo transactions to automatically categorize spending and discover money-saving insights. Free to start.',
  keywords: [
    'budget tracker',
    'Chase bank import',
    'Venmo transaction tracker',
    'spending analysis',
    'where does my money go',
    'automatic categorization',
    'budget app',
    'expense tracker',
    'financial insights',
    'money management',
    'paycheck tracker',
    'spending patterns',
    'budget for beginners'
  ],
  authors: [{ name: 'CashCheck' }],
  creator: 'CashCheck',
  publisher: 'CashCheck',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://cashcheck.com'),
  alternates: {
    canonical: '/landing',
  },
  openGraph: {
    title: 'CashCheck - Finally Understand Where Your Money Goes',
    description: 'Import your Chase and Venmo statements to automatically track spending, categorize transactions, and discover where you can save money. Free budget tracker for beginners.',
    url: '/landing',
    siteName: 'CashCheck',
    images: [
      {
        url: '/og-landing.jpg',
        width: 1200,
        height: 630,
        alt: 'CashCheck - Track Your Spending with Chase & Venmo Imports',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CashCheck - Finally Understand Where Your Money Goes',
    description: 'Import Chase & Venmo statements to automatically track spending and find money-saving insights. Free budget tracker.',
    images: ['/twitter-card.jpg'],
    creator: '@cashcheck',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "CashCheck",
            "description": "Import Chase bank statements and Venmo transactions to automatically categorize spending and discover money-saving insights.",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "Web Browser",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD",
              "description": "Free budget tracker with Chase and Venmo import"
            },
            "featureList": [
              "Chase bank statement import",
              "Venmo transaction import", 
              "Automatic spending categorization",
              "Spending pattern analysis",
              "Budget insights for beginners"
            ],
            "provider": {
              "@type": "Organization",
              "name": "CashCheck"
            }
          }),
        }}
      />
      
      {/* FAQ Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "How do I import Chase bank statements?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Log into your Chase online banking account, download your transaction history as a CSV file, then upload it to CashCheck. We'll automatically detect the format and categorize your transactions."
                }
              },
              {
                "@type": "Question", 
                "name": "Can I import Venmo transactions?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes! Download your Venmo transaction history and upload it to CashCheck. We'll categorize your peer-to-peer payments and help you track social spending."
                }
              },
              {
                "@type": "Question",
                "name": "Is CashCheck free to use?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, CashCheck is free to start. Upload your statements and get spending insights without any credit card required."
                }
              },
              {
                "@type": "Question",
                "name": "How secure is my financial data?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "We use bank-level security with encrypted data storage. We never connect directly to your bank accounts - you upload statement files that you download yourself."
                }
              }
            ]
          }),
        }}
      />
      
      {children}
    </>
  )
}