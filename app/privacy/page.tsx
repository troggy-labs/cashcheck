import Link from 'next/link'

export default function PrivacyPolicy() {
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
                href="/login" 
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Privacy Policy Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          
          <div className="prose prose-lg max-w-none text-gray-700 space-y-8">
            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-8">
              <p className="text-blue-800 font-medium mb-2">Last Updated: January 13, 2025</p>
              <p className="text-blue-700">
                At CashCheck, your privacy and financial data security are our top priorities. 
                This policy explains how we collect, use, and protect your information.
              </p>
            </div>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Financial Data</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Transaction Data:</strong> When you upload Chase bank statements or Venmo transaction files, we collect transaction dates, amounts, merchant names, and descriptions.</li>
                <li><strong>Account Information:</strong> Basic account identifiers (like last 4 digits) from your uploaded statements to help organize your data.</li>
                <li><strong>Categories:</strong> Spending categories we assign to your transactions and any custom categories you create.</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Usage Information</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Session Data:</strong> Login timestamps and session activity to maintain your secure connection.</li>
                <li><strong>Analytics:</strong> Basic page views and usage patterns via Simple Analytics (privacy-focused, no personal data collected).</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Technical Information</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Device Information:</strong> Browser type, operating system, and IP address for security purposes.</li>
                <li><strong>Cookies:</strong> Essential cookies for authentication and session management.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Core Services</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Process and categorize your uploaded transaction data</li>
                <li>Generate spending insights and budget analysis</li>
                <li>Detect potential transfer transactions between accounts</li>
                <li>Provide personalized financial recommendations</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Service Improvement</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Improve our automatic categorization algorithms</li>
                <li>Enhance user experience and interface design</li>
                <li>Develop new features based on usage patterns</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Security & Compliance</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Maintain account security and prevent unauthorized access</li>
                <li>Comply with legal obligations and financial regulations</li>
                <li>Investigate and prevent fraudulent activity</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Data Security</h2>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Encryption</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>In Transit:</strong> All data transmission uses TLS 1.3 encryption</li>
                <li><strong>At Rest:</strong> Database encryption using AES-256 encryption standards</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Retention & Deletion</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Retention Period</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Active Sessions:</strong> Data retained while your session is active (up to 48 hours of inactivity)</li>
                <li><strong>Account History:</strong> Historical data retained for up to 7 years for financial record-keeping purposes</li>
                <li><strong>Logs:</strong> Security and access logs retained for 90 days</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Your Privacy Rights</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Access Rights</h3>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>View all your stored data</li>
                    <li>See how your data is categorized</li>
                  </ul>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Control Rights</h3>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Modify or correct your data</li>
                    <li>Delete specific transactions</li>
                  </ul>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Deletion Rights</h3>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Clear transaction history</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Cookies & Tracking</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Essential Cookies</h3>
              <p>
                We use only essential cookies required for:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li><strong>Authentication:</strong> Maintaining your secure login session</li>
                <li><strong>Security:</strong> Preventing cross-site request forgery attacks</li>
                <li><strong>Functionality:</strong> Remembering your preferences during your session</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Simple Analytics</h3>
              <p>
                We use Simple Analytics for basic website analytics, which:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li><strong>No cookies:</strong> Does not use cookies or store personal data</li>
                <li><strong>Privacy-first:</strong> GDPR, CCPA, and PECR compliant</li>
                <li><strong>Anonymous:</strong> Only collects aggregated page view data</li>
                <li><strong>No tracking:</strong> Cannot identify individual users</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">No Invasive Tracking</h3>
              <p>
                We do <strong>not</strong> use:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Google Analytics or similar tracking tools</li>
                <li>Advertising or marketing cookies</li>
                <li>Social media tracking pixels</li>
                <li>Cross-site tracking technologies</li>
                <li>User fingerprinting or behavioral tracking</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Contact Us</h2>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <p className="mb-4">
                  If you have questions about this Privacy Policy or how we handle your data, please contact us:
                </p>
                <div className="space-y-2">
                  <p><strong>Email:</strong> privacy@cashcheck.com</p>
                  <p><strong>Subject Line:</strong> &quot;Privacy Policy Question&quot;</p>
                  <p><strong>Response Time:</strong> Within 48 hours for privacy-related inquiries</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}