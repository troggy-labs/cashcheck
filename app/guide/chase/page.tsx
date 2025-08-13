/* eslint-disable react/no-unescaped-entities */
import Link from 'next/link'
import { ArrowRight, Download, FileText, CheckCircle } from 'lucide-react'

export const metadata = {
  title: 'How to Download Your Chase Bank Statement | CashCheck',
  description: 'Step-by-step guide to downloading your Chase bank statement in CSV format for import into CashCheck.',
}

export default function ChaseGuidePage() {
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
                href="/guide/venmo" 
                className="text-gray-700 hover:text-green-600 transition-colors"
              >
                Venmo Guide
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
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">
            How to Download Your Chase Statement
          </h1>
          <p className="text-xl text-blue-100 mb-8">
            Follow these simple steps to export your Chase transactions for CashCheck
          </p>
          <div className="inline-flex items-center bg-white/10 rounded-lg px-6 py-3">
            <FileText className="w-5 h-5 mr-2" />
            <span>Takes about 2-3 minutes</span>
          </div>
        </div>
      </div>

      {/* Step-by-Step Guide */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-12">
          
          {/* Step 1 */}
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
              1
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Log into Chase Online Banking
              </h3>
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <p className="text-gray-700 mb-4">
                  Go to Chase's secure website and sign into your account:
                </p>
                <a 
                  href="https://secure.chase.com/web/auth/dashboard#/dashboard/documents/myDocs/index;mode=documents"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Go to Chase Banking
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>
                <p className="text-sm text-gray-500 mt-3">
                  This link takes you directly to the documents section
                </p>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
              2
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Navigate to Account Activity
              </h3>
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="space-y-4">
                  <p className="text-gray-700">
                    Once logged in, find your checking account:
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      Click on your checking account from the account list
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      Look for "Account Activity" or "Activity" tab
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      Click on the activity/transactions section
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
              3
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Select Date Range
              </h3>
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="space-y-4">
                  <p className="text-gray-700">
                    Choose the time period for your transactions:
                  </p>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-semibold text-yellow-800">Recommended</h4>
                        <p className="text-sm text-yellow-700">
                          Start with 1-3 months of recent data. You can always download more later.
                        </p>
                      </div>
                    </div>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      Look for date range picker or "Filter" options
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      Select your desired start and end dates
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      Click "Apply" or "Update" to filter transactions
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
              4
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Download as CSV
              </h3>
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="space-y-4">
                  <p className="text-gray-700">
                    Export your transaction data:
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      Look for "Download" or "Export" button
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      Select <strong>"CSV"</strong> format (not PDF or other formats)
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      Click "Download" to save the file to your computer
                    </li>
                  </ul>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                    <div className="flex items-center">
                      <Download className="w-5 h-5 text-green-600 mr-2" />
                      <span className="text-green-800 font-medium">
                        The file will be saved to your Downloads folder
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 5 */}
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0 w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
              5
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Upload to CashCheck
              </h3>
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="space-y-4">
                  <p className="text-gray-700">
                    Now you're ready to import your data:
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link 
                      href="/login"
                      className="inline-flex items-center justify-center bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Start Using CashCheck
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                    <Link 
                      href="/guide/venmo"
                      className="inline-flex items-center justify-center border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      View Venmo Guide
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
              <h4 className="font-semibold text-gray-900 mb-2">Can't find the download option?</h4>
              <p className="text-gray-700">
                Look for terms like "Export", "Download transactions", or a download icon. It's usually near the transaction list.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Only see PDF option?</h4>
              <p className="text-gray-700">
                Make sure you're in the "Activity" or "Transactions" section, not "Statements". CSV downloads are typically available in the activity view.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Download not working?</h4>
              <p className="text-gray-700">
                Try using a different browser or temporarily disabling popup blockers. Some banks require popups for downloads.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}