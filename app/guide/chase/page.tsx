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
                  href="https://secure.chase.com/web/auth/dashboard#/dashboard/accountDetails/downloadAccountTransactions/index"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Go to Chase Banking
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>
                <p className="text-sm text-gray-500 mt-3">
                  This link takes you directly to the download transactions section
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
                Select Your Account
              </h3>
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="space-y-4">
                  <p className="text-gray-700">
                    Choose which account you want to download:
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      Select your checking account from the dropdown
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      You can download multiple accounts separately if needed
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
                Choose Date Range from Activity Menu
              </h3>
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="space-y-4">
                  <p className="text-gray-700">
                    Select your date range from the "Activity" dropdown menu:
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
                      Click the "Activity" dropdown menu
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      Select your desired date range (e.g., "Last 3 months", "Custom range")
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
                Confirm File Type and Download
              </h3>
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="space-y-4">
                  <p className="text-gray-700">
                    Verify the file format and download your data:
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      Confirm file type shows <strong>"Spreadsheet (Excel, CSV)"</strong>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      Click the <strong>"Download"</strong> button
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      The CSV file will download immediately to your computer
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
              <h4 className="font-semibold text-gray-900 mb-2">Link takes me to a different page?</h4>
              <p className="text-gray-700">
                If the direct link doesn't work, manually navigate to Account Details → Download Transactions. Look for the download section in your Chase dashboard.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Don't see "Spreadsheet (Excel, CSV)" option?</h4>
              <p className="text-gray-700">
                Make sure you've selected an account and date range first. The file type options typically appear after these selections.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Activity dropdown menu is empty?</h4>
              <p className="text-gray-700">
                Try selecting your account first, then the Activity menu should populate with date range options.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Download not working?</h4>
              <p className="text-gray-700">
                Try using a different browser or temporarily disabling popup blockers. Some browsers may block automatic downloads.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}