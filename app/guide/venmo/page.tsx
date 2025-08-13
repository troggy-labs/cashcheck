/* eslint-disable react/no-unescaped-entities */
import Link from 'next/link'
import { ArrowRight, FileText, CheckCircle, Clock } from 'lucide-react'

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
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="inline-flex items-center bg-white/10 rounded-lg px-6 py-3">
              <FileText className="w-5 h-5 mr-2" />
              <span>Takes about 2-3 minutes</span>
            </div>
            <div className="inline-flex items-center bg-white/10 rounded-lg px-6 py-3">
              <Clock className="w-5 h-5 mr-2" />
              <span>Download may take 24-48 hours</span>
            </div>
          </div>
        </div>
      </div>

      {/* Important Notice */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-amber-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-amber-800 mb-2">Important Note</h3>
              <p className="text-amber-700">
                Venmo processes download requests in the background. After requesting your data, you'll receive an email when it's ready (usually within 24-48 hours). This guide shows you how to request the download.
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
                Choose Your Date Range
              </h3>
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="space-y-4">
                  <p className="text-gray-700">
                    Select the time period you want to download:
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
                          Start with 3-6 months of recent data. You can always request more later if needed.
                        </p>
                      </div>
                    </div>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      Use the date picker to select your start date
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      Choose your end date (can be today's date)
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      Review the date range to make sure it looks correct
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
                Select CSV Format
              </h3>
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="space-y-4">
                  <p className="text-gray-700">
                    Choose the file format for your download:
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      Look for format options (usually CSV and PDF)
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      Select <strong>"CSV"</strong> format
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      CSV format is required for CashCheck import
                    </li>
                  </ul>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="w-5 h-5 text-red-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-semibold text-red-800">Important</h4>
                        <p className="text-sm text-red-700">
                          Don't select PDF format - CashCheck can only read CSV files.
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
            <div className="flex-shrink-0 w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
              4
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Request Your Statement
              </h3>
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="space-y-4">
                  <p className="text-gray-700">
                    Submit your download request:
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      Review your date range and format selection
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      Click "Request Statement" or "Generate" button
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      You'll see a confirmation that your request was submitted
                    </li>
                  </ul>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 text-yellow-600 mr-2" />
                      <span className="text-yellow-800 font-medium">
                        Venmo will process your request in the background
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 5 */}
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0 w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
              5
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Wait for Email Notification
              </h3>
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="space-y-4">
                  <p className="text-gray-700">
                    Venmo will send you an email when your statement is ready:
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      Check your email (including spam folder) in 24-48 hours
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      Look for an email from Venmo about your statement
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      The email will contain a download link
                    </li>
                  </ul>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-semibold text-blue-800">Email Subject Line</h4>
                        <p className="text-sm text-blue-700">
                          Look for: "Your Venmo statement is ready" or similar subject line from Venmo.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 6 */}
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0 w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
              6
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Download and Upload to CashCheck
              </h3>
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="space-y-4">
                  <p className="text-gray-700">
                    Once you receive the email:
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      Click the download link in the email
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      Save the CSV file to your computer
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      Import the file into CashCheck
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
              <h4 className="font-semibold text-gray-900 mb-2">Haven't received the email after 48 hours?</h4>
              <p className="text-gray-700">
                Check your spam folder first. If still not found, try requesting the statement again from the Venmo website.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Download link expired?</h4>
              <p className="text-gray-700">
                Download links typically expire after a certain period. Request a new statement if your link no longer works.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Getting a PDF instead of CSV?</h4>
              <p className="text-gray-700">
                Make sure you selected "CSV" format when requesting the statement. You may need to request a new one with the correct format.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Empty or incomplete data?</h4>
              <p className="text-gray-700">
                Venmo may limit the date range for downloads. Try requesting smaller time periods (e.g., 3 months at a time) if your download seems incomplete.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}