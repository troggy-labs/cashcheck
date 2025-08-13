'use client'

import Link from 'next/link'
import { CheckCircle, Upload, BarChart3, TrendingUp, Clock, Shield } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-green-600">CashCheck</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/login" 
                className="text-gray-700 hover:text-green-600 transition-colors"
              >
                Sign In
              </Link>
              <Link 
                href="/login" 
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Finally understand
              <span className="text-green-600 block">where your money goes</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Stop wondering where your paycheck disappeared. Import your Chase and Venmo statements 
              to automatically categorize every transaction and see your spending patterns clearly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/login"
                className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Start Tracking Your Money
              </Link>
              <button className="border-2 border-green-600 text-green-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-50 transition-colors">
                See How It Works
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Free to start • No credit card required • 2-minute setup
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Built for Chase and Venmo users
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We specialize in the two most popular payment methods. Just upload your statements 
              and we&apos;ll handle the rest.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Chase Bank Import
              </h3>
              <p className="text-gray-600">
                Upload your Chase checking account CSV statements. We&apos;ll automatically categorize 
                every transaction and identify your spending patterns.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Venmo Transactions
              </h3>
              <p className="text-gray-600">
                Import your Venmo transaction history to see where your peer-to-peer payments 
                are going and track social spending.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Smart Categorization
              </h3>
              <p className="text-gray-600">
                Our AI automatically sorts your transactions into categories like groceries, 
                dining, transportation, and more.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Stop living paycheck to paycheck
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Most people have no idea where their money goes each month. Sound familiar? 
                You&apos;re not alone. CashCheck shows you exactly where every dollar is spent, 
                so you can take control of your finances.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-600 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">See your spending patterns</h4>
                    <p className="text-gray-600">Discover which categories are eating up your paycheck</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-600 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Identify money leaks</h4>
                    <p className="text-gray-600">Find subscriptions and recurring charges you forgot about</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-600 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Make informed decisions</h4>
                    <p className="text-gray-600">Know exactly how much you can afford to spend on dining out</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Monthly Spending Breakdown</h3>
                <p className="text-gray-600">See where your $4,200 paycheck really goes</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Rent</span>
                  <span className="font-semibold">$1,400</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{width: '33%'}}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Dining Out</span>
                  <span className="font-semibold">$680</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{width: '16%'}}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Groceries</span>
                  <span className="font-semibold">$420</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{width: '10%'}}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Transportation</span>
                  <span className="font-semibold">$320</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{width: '8%'}}></div>
                </div>
                
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600">
                    💡 <strong>Insight:</strong> You&apos;re spending $680/month on dining out. 
                    Reducing this by just 30% could save you $2,448/year!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Get started in under 5 minutes
            </h2>
            <p className="text-xl text-gray-600">
              No complicated setup. No manual data entry. Just upload and understand.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Download Your Statements</h3>
              <p className="text-gray-600">
                Log into Chase online banking or Venmo and download your transaction history as a CSV file.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload to CashCheck</h3>
              <p className="text-gray-600">
                Drag and drop your files. We&apos;ll automatically detect the format and import your transactions.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">See Your Insights</h3>
              <p className="text-gray-600">
                View your spending by category, track trends over time, and discover where you can save money.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link 
              href="/login"
              className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Start Your Free Analysis
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your data stays private</h2>
            <p className="text-xl text-gray-600">We take security seriously</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <Shield className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Bank-Level Security</h3>
              <p className="text-gray-600">All data is encrypted and stored securely</p>
            </div>
            
            <div className="text-center">
              <Clock className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Account Access</h3>
              <p className="text-gray-600">We never connect to your bank accounts directly</p>
            </div>
            
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">You Control Your Data</h3>
              <p className="text-gray-600">Delete your account and data anytime</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to take control of your money?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Join thousands who&apos;ve already discovered where their money really goes
          </p>
          <Link 
            href="/login"
            className="bg-white text-green-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
          >
            Get Started Free - No Credit Card Required
          </Link>
          <p className="text-green-200 mt-4 text-sm">
            Upload your first statement and see results in minutes
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-4">CashCheck</div>
            <p className="text-gray-400 mb-8">
              Finally understand where your money goes
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-400">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
              © 2025 CashCheck. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}