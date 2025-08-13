import { Upload, Sparkles, BarChart3, Clock } from 'lucide-react'

interface WelcomeOnboardingProps {
  onUploadClick: () => void
}

export default function WelcomeOnboarding({ onUploadClick }: WelcomeOnboardingProps) {
  return (
    <div className="min-h-[600px] flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center px-6">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-6 shadow-lg">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Welcome to CashCheck!
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Ready to understand where your money goes? Let&apos;s get started by importing your first statement.
          </p>
        </div>

        {/* Upload CTA */}
        <div className="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-12 mb-8 hover:border-green-400 hover:bg-green-50/30 transition-all duration-200 group">
          <Upload className="w-16 h-16 text-gray-400 group-hover:text-green-500 mx-auto mb-6 transition-colors duration-200" />
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Upload your first statement
          </h2>
          <p className="text-gray-600 mb-6">
            Import your Chase bank statement or Venmo transaction history to see your spending patterns automatically categorized.
          </p>
          <button
            onClick={onUploadClick}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Choose CSV File
          </button>
        </div>

        {/* How it Works */}
        <div className="grid sm:grid-cols-3 gap-6">
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Upload className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">1. Upload</h3>
            <p className="text-sm text-gray-600">
              Drop your CSV file from Chase or Venmo
            </p>
          </div>
          
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">2. Categorize</h3>
            <p className="text-sm text-gray-600">
              We automatically sort your transactions
            </p>
          </div>
          
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <BarChart3 className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">3. Insights</h3>
            <p className="text-sm text-gray-600">
              Discover where your money really goes
            </p>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="mt-12 bg-blue-50 rounded-xl p-6 text-left">
          <div className="flex items-start space-x-3">
            <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">Quick tip:</h4>
              <div className="text-sm text-blue-800 space-y-1">
                <p><strong>Chase:</strong> Log in to <a href="https://secure.chase.com/web/auth/dashboard#/dashboard/accountDetails/downloadAccountTransactions/index" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">chase.com</a> → Account Activity → Download → CSV format</p>
                <p><strong>Venmo:</strong> Go to <a href="https://account.venmo.com/statement" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">venmo.com</a> → Settings → Privacy → Export Transaction History</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}