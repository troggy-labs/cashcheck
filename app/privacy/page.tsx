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
                <li><strong>Analytics:</strong> How you use our features to improve our service (aggregated and anonymized).</li>
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
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-green-800 mb-2">🔒 Bank-Level Security</h3>
                <p className="text-green-700">
                  We use the same security standards as major financial institutions to protect your data.
                </p>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Encryption</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>In Transit:</strong> All data transmission uses TLS 1.3 encryption</li>
                <li><strong>At Rest:</strong> Database encryption using AES-256 encryption standards</li>
                <li><strong>File Uploads:</strong> Encrypted processing and storage of uploaded statements</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Access Controls</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Multi-factor authentication for administrative access</li>
                <li>Role-based access controls with minimal necessary permissions</li>
                <li>Regular security audits and penetration testing</li>
                <li>Automated monitoring for suspicious activity</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Data Isolation</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Your financial data is isolated in secure, session-specific containers</li>
                <li>No sharing of data between different user accounts</li>
                <li>Automatic data purging for inactive sessions</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. What We Don&apos;t Do</h2>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-800 mb-3">❌ We Never:</h3>
                <ul className="list-disc pl-6 space-y-2 text-red-700">
                  <li><strong>Connect to your bank accounts directly</strong> - You upload files you download yourself</li>
                  <li><strong>Sell your financial data</strong> - Your transaction data is never shared with third parties</li>
                  <li><strong>Store banking credentials</strong> - We never ask for or store your banking login information</li>
                  <li><strong>Share data with advertisers</strong> - Your spending patterns remain completely private</li>
                  <li><strong>Use your data for marketing</strong> - No targeted ads based on your financial information</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Retention & Deletion</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Retention Period</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Active Sessions:</strong> Data retained while your session is active (up to 48 hours of inactivity)</li>
                <li><strong>Account History:</strong> Historical data retained for up to 7 years for financial record-keeping purposes</li>
                <li><strong>Logs:</strong> Security and access logs retained for 90 days</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Your Deletion Rights</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Immediate Deletion:</strong> You can delete your account and all associated data at any time</li>
                <li><strong>Selective Deletion:</strong> Remove specific transactions, categories, or import files</li>
                <li><strong>Automatic Cleanup:</strong> Inactive sessions are automatically purged after 48 hours</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Legal Compliance</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Regulatory Standards</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>CCPA Compliance:</strong> California Consumer Privacy Act rights respected</li>
                <li><strong>GDPR Compliance:</strong> European data protection standards applied globally</li>
                <li><strong>SOX Compliance:</strong> Financial data handling meets Sarbanes-Oxley standards</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Legal Disclosures</h3>
              <p>
                We may disclose information only when required by law, court order, or to protect 
                the rights, property, or safety of CashCheck, our users, or others. Any such 
                disclosure will be limited to the minimum necessary information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Your Privacy Rights</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Access Rights</h3>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>View all your stored data</li>
                    <li>Download your transaction history</li>
                    <li>See how your data is categorized</li>
                  </ul>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Control Rights</h3>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Modify or correct your data</li>
                    <li>Delete specific transactions</li>
                    <li>Export your data in standard formats</li>
                  </ul>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Deletion Rights</h3>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Delete your entire account</li>
                    <li>Remove imported files</li>
                    <li>Clear transaction history</li>
                  </ul>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Portability Rights</h3>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Export data in CSV format</li>
                    <li>Download categorization rules</li>
                    <li>Transfer data to other services</li>
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

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">No Tracking</h3>
              <p>
                We do <strong>not</strong> use:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Third-party analytics cookies (like Google Analytics)</li>
                <li>Advertising or marketing cookies</li>
                <li>Social media tracking pixels</li>
                <li>Cross-site tracking technologies</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Changes to This Policy</h2>
              
              <p>
                We may update this Privacy Policy to reflect changes in our practices or legal requirements. 
                When we make material changes:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>We&apos;ll notify you via email (if you&apos;ve provided one)</li>
                <li>We&apos;ll display a prominent notice in the application</li>
                <li>We&apos;ll update the &quot;Last Updated&quot; date at the top of this policy</li>
                <li>Continued use of our service constitutes acceptance of the updated policy</li>
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
                
                <div className="mt-6 pt-6 border-t border-gray-300">
                  <p className="text-sm text-gray-600">
                    For immediate account deletion or data removal requests, you can also use the 
                    &quot;Delete Account&quot; feature in your CashCheck dashboard.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}