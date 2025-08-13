'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, Settings, LogOut, Users, ChevronLeft, ChevronRight, Trash2, ArrowUpRight, ArrowDownRight, PiggyBank } from 'lucide-react'
import UploadModal from '@/components/UploadModal'
import StatCard from '@/components/StatCard'
import RulesModal from '@/components/RulesModal'
import Checkbox from '@/components/Checkbox'
import CashCheckLogo from '@/components/CashCheckLogo'

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
  const [currentMonth, setCurrentMonth] = useState(() => {
    const today = new Date()
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`
  })
  
  const [pageData, setPageData] = useState<PageData | null>(null)
  const [transactions, setTransactions] = useState<TransactionsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [sessionInitialized, setSessionInitialized] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showRulesModal, setShowRulesModal] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<{
    show: boolean
    transactionId?: string
    deleteAll?: boolean
    selectedIds?: string[]
  }>({ show: false })
  const [selectedTransactions, setSelectedTransactions] = useState<Set<string>>(new Set())
  
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
  
  const initializeSession = async () => {
    try {
      const response = await fetch('/api/auth/login', { method: 'GET' })
      if (response.ok) {
        const data = await response.json()
        setSessionInitialized(true)
        console.log('Session initialized:', data.sessionId, data.isNewSession ? '(new)' : '(existing)')
      }
    } catch (error) {
      console.error('Failed to initialize session:', error)
    }
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
        pageSize: '200'
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
  
  const handleSelectTransaction = (transactionId: string, checked: boolean) => {
    setSelectedTransactions(prev => {
      const newSet = new Set(prev)
      if (checked) {
        newSet.add(transactionId)
      } else {
        newSet.delete(transactionId)
      }
      return newSet
    })
  }

  const handleSelectAll = (checked: boolean) => {
    if (!transactions) return
    
    setSelectedTransactions(checked 
      ? new Set(transactions.rows.map(tx => tx.id))
      : new Set()
    )
  }

  const handleDeleteTransaction = async (transactionId?: string, deleteAll?: boolean, selectedIds?: string[]) => {
    try {
      if (selectedIds && selectedIds.length > 0) {
        // Bulk delete selected transactions
        const response = await fetch('/api/transactions/bulk-delete', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ids: selectedIds })
        })
        
        if (response.ok) {
          setSelectedTransactions(new Set())
          fetchPageData()
          fetchTransactions()
          setDeleteConfirm({ show: false })
        } else {
          console.error('Failed to delete selected transactions')
        }
      } else {
        // Single delete or delete all
        const params = new URLSearchParams()
        if (deleteAll) {
          params.set('all', 'true')
        } else if (transactionId) {
          params.set('id', transactionId)
        }
        
        const response = await fetch(`/api/transactions?${params}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          fetchPageData()
          fetchTransactions()
          setDeleteConfirm({ show: false })
        } else {
          console.error('Failed to delete transaction(s)')
        }
      }
    } catch (error) {
      console.error('Delete error:', error)
    }
  }
  
  // Initialize session on first load
  useEffect(() => {
    initializeSession()
  }, [])
  
  // Fetch data when session is ready and month changes
  useEffect(() => {
    if (!sessionInitialized) return
    
    fetchPageData()
    fetchTransactions()
    setSelectedTransactions(new Set()) // Clear selection when month changes
    setLoading(false)
  }, [currentMonth, sessionInitialized])
  
  useEffect(() => {
    if (!sessionInitialized) return
    
    fetchTransactions()
    setSelectedTransactions(new Set()) // Clear selection when filters change
  }, [filters, sessionInitialized])
  
  if (loading || !sessionInitialized || !pageData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">
          {!sessionInitialized ? 'Initializing session...' : 'Loading...'}
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-30 glass border-b border-brand-200/20 shadow-soft">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <CashCheckLogo size="lg" />
              <nav className="flex items-center space-x-3">
                <button
                  onClick={() => navigateMonth('prev')}
                  className="p-2 text-brand-600 hover:text-brand-900 hover:bg-brand-50 rounded-lg transition-all duration-200"
                  title="Previous month"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <div className="px-4 py-2 text-xl font-semibold text-brand-900 min-w-[200px] text-center">
                  {formatMonthDisplay(currentMonth)}
                </div>
                <button
                  onClick={() => navigateMonth('next')}
                  className="p-2 text-brand-600 hover:text-brand-900 hover:bg-brand-50 rounded-lg transition-all duration-200"
                  title="Next month"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </nav>
            </div>
            
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setShowUploadModal(true)}
                className="p-3 text-brand-600 hover:text-brand-700 hover:bg-brand-50 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                title="Upload CSV"
              >
                <Upload className="h-5 w-5" />
              </button>
              <button className="p-3 text-brand-600 hover:text-brand-700 hover:bg-brand-50 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md">
                <Users className="h-5 w-5" />
              </button>
              <button 
                onClick={() => setShowRulesModal(true)}
                className="p-3 text-brand-600 hover:text-brand-700 hover:bg-brand-50 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                title="Manage Rules"
              >
                <Settings className="h-5 w-5" />
              </button>
              <button
                onClick={handleLogout}
                className="p-3 text-danger-600 hover:text-danger-700 hover:bg-danger-50 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-10">
        {/* Dashboard Section */}
        <>
          {/* Tiles */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <StatCard
              title="Income"
              amount={formatCurrency(pageData.tiles.incomeCents)}
              color="success"
              icon={ArrowUpRight}
            />
            <StatCard
              title="Expenses"
              amount={formatCurrency(pageData.tiles.expenseCents)}
              color="danger"
              icon={ArrowDownRight}
            />
            <StatCard
              title="Net"
              amount={formatCurrency(pageData.tiles.netCents)}
              color={pageData.tiles.netCents >= 0 ? 'success' : 'danger'}
              icon={PiggyBank}
            />
          </section>

            {/* Action Badges */}
            <section className="flex flex-wrap gap-4 mb-12">
              {pageData.counters.uncategorized > 0 && (
                <button
                  onClick={() => handleFilterClick('uncategorized')}
                  className="bg-gradient-to-r from-warning-500 to-warning-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:from-warning-600 hover:to-warning-700 transition-all duration-200 shadow-soft hover:shadow-medium transform hover:-translate-y-0.5"
                >
                  Uncategorized ({pageData.counters.uncategorized})
                </button>
              )}
              {pageData.counters.reviewTransfers > 0 && (
                <button
                  onClick={() => handleFilterClick('reviewTransfers')}
                  className="bg-gradient-to-r from-accent-500 to-accent-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:from-accent-600 hover:to-accent-700 transition-all duration-200 shadow-soft hover:shadow-medium transform hover:-translate-y-0.5"
                >
                  Review transfers ({pageData.counters.reviewTransfers})
                </button>
              )}
            </section>
            
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* By Category */}
              <article className="surface-elevated rounded-2xl shadow-soft animate-slideUp p-6">
                <h3 className="text-xl font-semibold text-brand-900 mb-6">Expenses by Category</h3>
                <div className="space-y-3">
                  {pageData.byCategory.map((item) => (
                    <div key={item.category} className="flex justify-between items-center py-3 border-b border-brand-100/50 last:border-b-0 hover:bg-brand-50/30 rounded-lg px-3 -mx-3 transition-colors">
                      <span className="text-sm font-medium text-brand-700">{item.category}</span>
                      <span className="font-semibold text-brand-900">{formatCurrency(item.expensesCents)}</span>
                    </div>
                  ))}
                  {pageData.byCategory.length === 0 && (
                    <div className="text-center text-brand-500 py-8">No expenses this month</div>
                  )}
                </div>
              </article>
              
              {/* By Account */}
              <article className="surface-elevated rounded-2xl shadow-soft animate-slideUp p-6">
                <h3 className="text-xl font-semibold text-brand-900 mb-6">By Account</h3>
                <div className="space-y-5">
                  {pageData.byAccount.map((item) => (
                    <div key={item.account} className="p-4 bg-brand-50/50 rounded-xl border border-brand-100/50 hover:bg-brand-50 transition-colors">
                      <div className="font-semibold text-brand-900 mb-3">{item.account}</div>
                      <div className="flex justify-between text-sm">
                        <span className="text-success-700 font-medium">
                          Income: {formatCurrency(item.incomeCents)}
                        </span>
                        <span className="text-danger-700 font-medium">
                          Expenses: {formatCurrency(item.expensesCents)}
                        </span>
                      </div>
                    </div>
                  ))}
                  {pageData.byAccount.length === 0 && (
                    <div className="text-center text-brand-500 py-8">No account data this month</div>
                  )}
                </div>
              </article>
            </section>
        </>
        
        {/* Transactions Section */}
        <div className="space-y-6 mt-12">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-brand-900">Transactions</h2>
            <div className="flex items-center space-x-3">
              {selectedTransactions.size > 0 && (
                <button
                  onClick={() => setDeleteConfirm({ 
                    show: true, 
                    selectedIds: Array.from(selectedTransactions) 
                  })}
                  className="bg-danger-600 text-white px-4 py-2 rounded-md hover:bg-danger-700 inline-flex items-center text-sm"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Selected ({selectedTransactions.size})
                </button>
              )}
              <button
                onClick={() => setDeleteConfirm({ show: true, deleteAll: true })}
                className="bg-danger-600 text-white px-4 py-2 rounded-md hover:bg-danger-700 inline-flex items-center text-sm"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </button>
            </div>
          </div>
            
            {/* Filters */}
            <div className="bg-white/70 backdrop-blur rounded-2xl shadow-sm border border-brand-100 animate-fadeIn">
              <h3 className="text-lg font-semibold text-brand-900 mb-4">Filter Transactions</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-brand-700 mb-2">Account</label>
                  <select
                    value={filters.accountId}
                    onChange={(e) => setFilters(prev => ({ ...prev, accountId: e.target.value }))}
                    className="w-full border border-brand-300 rounded-md px-3 py-2 text-brand-900 focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
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
                  <label className="block text-sm font-medium text-brand-700 mb-2">Category</label>
                  <select
                    value={filters.categoryId}
                    onChange={(e) => setFilters(prev => ({ ...prev, categoryId: e.target.value }))}
                    className="w-full border border-brand-300 rounded-md px-3 py-2 text-brand-900 focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
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
                  <label className="block text-sm font-medium text-brand-700 mb-2">Search</label>
                  <input
                    type="text"
                    placeholder="Search descriptions..."
                    value={filters.q}
                    onChange={(e) => setFilters(prev => ({ ...prev, q: e.target.value }))}
                    className="w-full border border-brand-300 rounded-md px-3 py-2 text-brand-900 placeholder-brand-500 focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-brand-700 mb-2">Options</label>
                  <div className="flex flex-col space-y-2">
                    <Checkbox
                      checked={filters.includeTransfers}
                      onChange={(e) => setFilters(prev => ({ ...prev, includeTransfers: e.target.checked }))}
                      labelClassName="text-sm text-brand-700"
                    >
                      Include Transfers
                    </Checkbox>
                    <Checkbox
                      checked={filters.onlyCandidates}
                      onChange={(e) => setFilters(prev => ({ ...prev, onlyCandidates: e.target.checked }))}
                      labelClassName="text-sm text-brand-700"
                    >
                      Review Only
                    </Checkbox>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Transactions Table */}
            {transactions && (
              <div className="bg-white rounded-lg shadow border overflow-hidden">
                <div className="px-6 py-4 border-b bg-brand-50">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-brand-900">
                      Transaction History
                    </h3>
                    <div className="text-sm font-medium text-brand-700">
                      Showing {transactions.rows.length} of {transactions.total} transactions
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-brand-100 border-b border-brand-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-brand-900">
                          <Checkbox
                            checked={transactions.rows.length > 0 && selectedTransactions.size === transactions.rows.length}
                            onChange={(e) => handleSelectAll(e.target.checked)}
                          />
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-brand-900">
                          Date
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-brand-900">
                          Account
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-brand-900">
                          Description
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-brand-900">
                          Amount
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-brand-900">
                          Category
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-brand-900">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-100">
                      {transactions.rows.map((tx) => (
                        <tr key={tx.id} className="hover:bg-brand-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Checkbox
                              checked={selectedTransactions.has(tx.id)}
                              onChange={(e) => handleSelectTransaction(tx.id, e.target.checked)}
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-brand-900">
                            {new Date(tx.date).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric',
                              year: 'numeric' 
                            })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-brand-700">
                            {tx.account}
                          </td>
                          <td className="px-6 py-4 text-sm text-brand-900 max-w-xs">
                            <div className="flex items-center">
                              <span className="truncate">{tx.description}</span>
                              <div className="ml-2 flex space-x-1">
                                {tx.isTransfer && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-accent-500 text-white">
                                    Transfer
                                  </span>
                                )}
                                {tx.transferCandidate && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-warning-500 text-white">
                                    Review
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${
                            tx.amountCents >= 0 ? 'text-success-700' : 'text-danger-700'
                          }`}>
                            {formatCurrency(tx.amountCents)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                              tx.categoryName 
                                ? 'bg-brand-100 text-brand-800'
                                : 'bg-warning-100 text-warning-800'
                            }`}>
                              {tx.categoryName || 'Uncategorized'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => setDeleteConfirm({ show: true, transactionId: tx.id })}
                              className="text-danger-600 hover:text-danger-900 hover:bg-danger-50 p-1 rounded"
                              title="Delete transaction"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {transactions.rows.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-brand-500 text-lg">No transactions found</div>
                    <div className="text-brand-400 text-sm mt-2">Try adjusting your filters or upload some CSV data</div>
                  </div>
                )}
              </div>
            )}
        </div>
      </main>
      
      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-danger-100 rounded-full flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-danger-600" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-brand-900">
                  {deleteConfirm.deleteAll 
                    ? 'Delete All Transactions' 
                    : deleteConfirm.selectedIds
                    ? `Delete ${deleteConfirm.selectedIds.length} Selected Transaction${deleteConfirm.selectedIds.length > 1 ? 's' : ''}`
                    : 'Delete Transaction'
                  }
                </h3>
                <p className="text-sm text-brand-600 mt-1">
                  {deleteConfirm.deleteAll 
                    ? 'This will permanently delete all transactions. This action cannot be undone.'
                    : deleteConfirm.selectedIds
                    ? `This will permanently delete ${deleteConfirm.selectedIds.length} selected transaction${deleteConfirm.selectedIds.length > 1 ? 's' : ''}. This action cannot be undone.`
                    : 'This will permanently delete this transaction. This action cannot be undone.'
                  }
                </p>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirm({ show: false })}
                className="px-4 py-2 text-sm font-medium text-brand-700 bg-brand-100 hover:bg-brand-200 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteTransaction(deleteConfirm.transactionId, deleteConfirm.deleteAll, deleteConfirm.selectedIds)}
                className="px-4 py-2 text-sm font-medium text-white bg-danger-600 hover:bg-danger-700 rounded-md"
              >
                {deleteConfirm.deleteAll 
                  ? 'Delete All' 
                  : deleteConfirm.selectedIds
                  ? 'Delete Selected'
                  : 'Delete'
                }
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Upload Modal */}
      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onSuccess={handleUploadSuccess}
      />
      
      {/* Rules Modal */}
      <RulesModal
        isOpen={showRulesModal}
        onClose={() => setShowRulesModal(false)}
        categories={pageData?.categories || []}
        accounts={pageData?.accounts || []}
        onRuleChange={() => {
          // Refresh page data when rules change
          fetchPageData()
          fetchTransactions()
        }}
      />
    </div>
  )
}