'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Upload, Settings, LogOut, Users, Filter, ChevronLeft, ChevronRight } from 'lucide-react'
import UploadModal from '@/components/UploadModal'

interface PageData {
  tiles: {
    incomeCents: number
    expenseCents: number
    netCents: number
  }
  byCategory: Array<{
    category: string
    expensesCents: number
  }>
  byAccount: Array<{
    account: string
    incomeCents: number
    expensesCents: number
  }>
  counters: {
    uncategorized: number
    reviewTransfers: number
  }
  categories: Array<{
    id: string
    name: string
    kind: string
  }>
  accounts: Array<{
    id: string
    displayName: string
  }>
}

interface TransactionRow {
  id: string
  date: string
  account: string
  description: string
  amountCents: number
  categoryId: string | null
  categoryName: string | null
  isTransfer: boolean
  transferCandidate: boolean
  notes: string
}

interface TransactionsResponse {
  rows: TransactionRow[]
  page: number
  pageSize: number
  total: number
}

export default function Dashboard() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentMonth, setCurrentMonth] = useState(() => {
    const today = new Date()
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`
  })
  
  const [pageData, setPageData] = useState<PageData | null>(null)
  const [transactions, setTransactions] = useState<TransactionsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [showTransactions, setShowTransactions] = useState(true)
  const [showUploadModal, setShowUploadModal] = useState(false)
  
  // Transaction filters
  const [filters, setFilters] = useState({
    accountId: '',
    categoryId: '',
    q: '',
    includeTransfers: false,
    onlyCandidates: false
  })
  
  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100)
  }
  
  const fetchPageData = async () => {
    try {
      const response = await fetch(`/api/page-data?month=${currentMonth}`)
      if (response.ok) {
        const data = await response.json()
        setPageData(data)
      }
    } catch (error) {
      console.error('Failed to fetch page data:', error)
    }
  }
  
  const fetchTransactions = async () => {
    try {
      const params = new URLSearchParams({
        month: currentMonth,
        page: '1',
        pageSize: '100'
      })
      
      if (filters.accountId) params.set('accountId', filters.accountId)
      if (filters.categoryId) params.set('categoryId', filters.categoryId)
      if (filters.q) params.set('q', filters.q)
      if (filters.includeTransfers) params.set('includeTransfers', 'true')
      if (filters.onlyCandidates) params.set('onlyCandidates', 'true')
      
      const response = await fetch(`/api/transactions?${params}`)
      if (response.ok) {
        const data = await response.json()
        setTransactions(data)
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error)
    }
  }
  
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }
  
  const handleFilterClick = (filterType: 'uncategorized' | 'reviewTransfers') => {
    if (filterType === 'uncategorized') {
      setFilters(prev => ({ ...prev, categoryId: 'null', onlyCandidates: false }))
    } else {
      setFilters(prev => ({ ...prev, onlyCandidates: true, categoryId: '' }))
    }
  }
  
  const handleUploadSuccess = () => {
    // Refresh page data after successful upload
    fetchPageData()
    fetchTransactions()
  }
  
  const navigateMonth = (direction: 'prev' | 'next') => {
    const [year, month] = currentMonth.split('-').map(Number)
    let newYear = year
    let newMonth = month
    
    if (direction === 'prev') {
      newMonth--
      if (newMonth < 1) {
        newMonth = 12
        newYear--
      }
    } else {
      newMonth++
      if (newMonth > 12) {
        newMonth = 1
        newYear++
      }
    }
    
    setCurrentMonth(`${newYear}-${String(newMonth).padStart(2, '0')}`)
  }
  
  const formatMonthDisplay = (monthStr: string) => {
    const [year, month] = monthStr.split('-')
    const date = new Date(parseInt(year), parseInt(month) - 1)
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }
  
  useEffect(() => {
    fetchPageData()
    fetchTransactions()
    setLoading(false)
  }, [currentMonth])
  
  useEffect(() => {
    fetchTransactions()
  }, [filters])
  
  if (loading || !pageData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">FinClick</h1>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigateMonth('prev')}
                  className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                  title="Previous month"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <div className="px-3 py-2 text-lg font-semibold text-gray-900 min-w-[180px] text-center">
                  {formatMonthDisplay(currentMonth)}
                </div>
                <button
                  onClick={() => navigateMonth('next')}
                  className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                  title="Next month"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setShowUploadModal(true)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                title="Upload CSV"
              >
                <Upload className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                <Users className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                <Settings className="h-5 w-5" />
              </button>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Section */}
        <>
          {/* Tiles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow border border-green-200">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <div className="w-6 h-6 bg-green-600 rounded"></div>
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Income</h3>
                    <p className="text-3xl font-bold text-green-700">
                      {formatCurrency(pageData.tiles.incomeCents)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow border border-red-200">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <div className="w-6 h-6 bg-red-600 rounded"></div>
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Expenses</h3>
                    <p className="text-3xl font-bold text-red-700">
                      {formatCurrency(pageData.tiles.expenseCents)}
                    </p>
                  </div>
                </div>
              </div>
              <div className={`bg-white p-6 rounded-lg shadow border ${pageData.tiles.netCents >= 0 ? 'border-green-200' : 'border-red-200'}`}>
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg ${pageData.tiles.netCents >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                    <div className={`w-6 h-6 rounded ${pageData.tiles.netCents >= 0 ? 'bg-green-600' : 'bg-red-600'}`}></div>
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Net</h3>
                    <p className={`text-3xl font-bold ${pageData.tiles.netCents >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                      {formatCurrency(pageData.tiles.netCents)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Badges */}
            <div className="flex space-x-4 mb-8">
              {pageData.counters.uncategorized > 0 && (
                <button
                  onClick={() => handleFilterClick('uncategorized')}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-yellow-600 transition-colors"
                >
                  Uncategorized ({pageData.counters.uncategorized})
                </button>
              )}
              {pageData.counters.reviewTransfers > 0 && (
                <button
                  onClick={() => handleFilterClick('reviewTransfers')}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors"
                >
                  Review transfers ({pageData.counters.reviewTransfers})
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* By Category */}
              <div className="bg-white p-6 rounded-lg shadow border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Expenses by Category</h3>
                <div className="space-y-3">
                  {pageData.byCategory.map((item) => (
                    <div key={item.category} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                      <span className="text-sm font-medium text-gray-700">{item.category}</span>
                      <span className="font-semibold text-gray-900">{formatCurrency(item.expensesCents)}</span>
                    </div>
                  ))}
                  {pageData.byCategory.length === 0 && (
                    <div className="text-center text-gray-500 py-4">No expenses this month</div>
                  )}
                </div>
              </div>
              
              {/* By Account */}
              <div className="bg-white p-6 rounded-lg shadow border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">By Account</h3>
                <div className="space-y-4">
                  {pageData.byAccount.map((item) => (
                    <div key={item.account} className="p-3 bg-gray-50 rounded-lg">
                      <div className="font-semibold text-gray-900 mb-2">{item.account}</div>
                      <div className="flex justify-between text-sm">
                        <span className="text-green-700 font-medium">
                          Income: {formatCurrency(item.incomeCents)}
                        </span>
                        <span className="text-red-700 font-medium">
                          Expenses: {formatCurrency(item.expensesCents)}
                        </span>
                      </div>
                    </div>
                  ))}
                  {pageData.byAccount.length === 0 && (
                    <div className="text-center text-gray-500 py-4">No account data this month</div>
                  )}
                </div>
              </div>
            </div>
        </>
        
        {/* Transactions Section */}
        <div className="space-y-6 mt-12">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Transactions</h2>
          </div>
            
            {/* Filters */}
            <div className="bg-white p-6 rounded-lg shadow border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Transactions</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Account</label>
                  <select
                    value={filters.accountId}
                    onChange={(e) => setFilters(prev => ({ ...prev, accountId: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">All Accounts</option>
                    {pageData.accounts.map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.displayName}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={filters.categoryId}
                    onChange={(e) => setFilters(prev => ({ ...prev, categoryId: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">All Categories</option>
                    <option value="null">Uncategorized</option>
                    {pageData.categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                  <input
                    type="text"
                    placeholder="Search descriptions..."
                    value={filters.q}
                    onChange={(e) => setFilters(prev => ({ ...prev, q: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
                  <div className="flex flex-col space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.includeTransfers}
                        onChange={(e) => setFilters(prev => ({ ...prev, includeTransfers: e.target.checked }))}
                        className="mr-2 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-700">Include Transfers</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.onlyCandidates}
                        onChange={(e) => setFilters(prev => ({ ...prev, onlyCandidates: e.target.checked }))}
                        className="mr-2 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-700">Review Only</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Transactions Table */}
            {transactions && (
              <div className="bg-white rounded-lg shadow border overflow-hidden">
                <div className="px-6 py-4 border-b bg-gray-50">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Transaction History
                    </h3>
                    <div className="text-sm font-medium text-gray-700">
                      Showing {transactions.rows.length} of {transactions.total} transactions
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-100 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                          Date
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                          Account
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                          Description
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                          Amount
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                          Category
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {transactions.rows.map((tx) => (
                        <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {new Date(tx.date).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric',
                              year: 'numeric' 
                            })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                            {tx.account}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                            <div className="flex items-center">
                              <span className="truncate">{tx.description}</span>
                              <div className="ml-2 flex space-x-1">
                                {tx.isTransfer && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500 text-white">
                                    Transfer
                                  </span>
                                )}
                                {tx.transferCandidate && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-500 text-white">
                                    Review
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${
                            tx.amountCents >= 0 ? 'text-green-700' : 'text-red-700'
                          }`}>
                            {formatCurrency(tx.amountCents)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                              tx.categoryName 
                                ? 'bg-gray-100 text-gray-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {tx.categoryName || 'Uncategorized'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {transactions.rows.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-gray-500 text-lg">No transactions found</div>
                    <div className="text-gray-400 text-sm mt-2">Try adjusting your filters or upload some CSV data</div>
                  </div>
                )}
              </div>
            )}
        </div>
      </div>
      
      {/* Upload Modal */}
      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onSuccess={handleUploadSuccess}
      />
    </div>
  )
}