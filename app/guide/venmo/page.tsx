/* eslint-disable react/no-unescaped-entities */
import Link from 'next/link'
import { ArrowRight, FileText, CheckCircle } from 'lucide-react'

export const metadata = {
  title: 'How to Download Your Venmo Transaction History | CashCheck',
  description: 'Step-by-step guide to downloading your Venmo transaction history in CSV format for import into CashCheck.',
}

export default function VenmoGuidePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-green-600">
                CashCheck
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/landing" 
                className="text-gray-700 hover:text-green-600 transition-colors"
              >
                Home
              </Link>
              <Link 
                href="/guide/chase" 
                className="text-gray-700 hover:text-green-600 transition-colors"
              >
                Chase Guide
              </Link>
              <Link 
                href="/login" 
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">
            How to Download Your Venmo History
          </h1>
          <p className="text-xl text-purple-100 mb-8">
            Export your Venmo transactions to see your spending patterns in CashCheck
          </p>
          <div className="inline-flex items-center bg-white/10 rounded-lg px-6 py-3">
            <FileText className="w-5 h-5 mr-2" />
            <span>Takes about 2-3 minutes</span>
          </div>
        </div>
      </div>

      {/* Important Notice */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-green-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Quick & Easy</h3>
              <p className="text-green-700">
                Venmo downloads your transaction history immediately as a CSV file - no waiting required! Just select your date range and download.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Step-by-Step Guide */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="space-y-12">
          
          {/* Step 1 */}
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0 w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
              1
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Go to Venmo Statement Page
              </h3>
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <p className="text-gray-700 mb-4">
                  Visit Venmo's statement download page:
                </p>
                <a 
                  href="https://account.venmo.com/statement"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Go to Venmo Statements
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>
                <p className="text-sm text-gray-500 mt-3">
                  You'll need to log in if you haven't already
                </p>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0 w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
              2
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Select Statement Month
              </h3>
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="space-y-4">
                  <p className="text-gray-700">
                    Choose which month's statement you want to download:
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-semibold text-blue-800">Tip</h4>
                        <p className="text-sm text-blue-700">
                          Start with recent months and download multiple months separately if you need more history.
                        </p>
                      </div>
                    </div>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      Use the dropdown menu to select a statement month
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      Choose from available months (usually current and past months)
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      Each statement covers one full month of transactions
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0 w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
              3
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Download CSV File
              </h3>
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="space-y-4">
                  <p className="text-gray-700">
                    Venmo automatically provides CSV format - perfect for CashCheck:
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      Click the "Download" or "Export" button
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      The CSV file downloads immediately to your computer
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      The file will be saved to your Downloads folder
                    </li>
                  </ul>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="w-5 h-5 text-green-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-semibold text-green-800">Perfect for CashCheck</h4>
                        <p className="text-sm text-green-700">
                          Venmo's CSV format is exactly what CashCheck needs - no conversion required!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0 w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
              4
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Upload to CashCheck
              </h3>
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="space-y-4">
                  <p className="text-gray-700">
                    Now you're ready to analyze your Venmo spending:
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      Open CashCheck and click the upload button
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      Select your downloaded Venmo CSV file
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      Watch CashCheck automatically categorize your transactions
                    </li>
                  </ul>
                  <div className="flex flex-col sm:flex-row gap-4 mt-6">
                    <Link 
                      href="/login"
                      className="inline-flex items-center justify-center bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Start Using CashCheck
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                    <Link 
                      href="/guide/chase"
                      className="inline-flex items-center justify-center border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      View Chase Guide
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Troubleshooting Section */}
        <div className="mt-16 bg-gray-100 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Troubleshooting</h2>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Can't find the download button?</h4>
              <p className="text-gray-700">
                Look for "Export" or "Download" text/button near your transaction history. It may be at the top or bottom of the transaction list.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Download not starting?</h4>
              <p className="text-gray-700">
                Try disabling popup blockers temporarily, or use a different browser. Some browsers may block automatic downloads.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">File won't open in CashCheck?</h4>
              <p className="text-gray-700">
                Make sure the file extension is .csv and that it downloaded completely. If the file is corrupted, try downloading again.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Can't see the month you need?</h4>
              <p className="text-gray-700">
                Venmo typically shows several months of available statements. If you need older data, you may need to contact Venmo support.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}