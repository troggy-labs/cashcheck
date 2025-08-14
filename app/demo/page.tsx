'use client'

import { useState, useEffect, useCallback } from 'react'
import { Upload, Settings, LogOut, Users, ChevronLeft, ChevronRight, Trash2, ArrowUpRight, ArrowDownRight, PiggyBank, ExternalLink, Play } from 'lucide-react'
import StatCard from '@/components/StatCard'
import Checkbox from '@/components/Checkbox'
import CashCheckLogo from '@/components/CashCheckLogo'
import Link from 'next/link'

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

export default function DemoPage() {
  const [currentMonth] = useState('2024-12')
  const [pageData, setPageData] = useState<PageData | null>(null)
  const [transactions, setTransactions] = useState<TransactionsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedTransactions, setSelectedTransactions] = useState<Set<string>>(new Set())
  
  // Demo filters
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
  
  const fetchDemoPageData = useCallback(async () => {
    try {
      const response = await fetch(`/api/page-data?month=${currentMonth}&demo=true`)
      if (response.ok) {
        const data = await response.json()
        setPageData(data)
      }
    } catch (error) {
      console.error('Failed to fetch demo page data:', error)
    }
  }, [currentMonth])
  
  const fetchDemoTransactions = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        month: currentMonth,
        page: '1',
        pageSize: '200',
        demo: 'true'
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
      console.error('Failed to fetch demo transactions:', error)
    }
  }, [currentMonth, filters])
  
  const navigateMonth = () => {
    // In demo, just show a message
    alert('This is a demo! In the real app, you can navigate between months with your actual data.')
  }
  
  const formatMonthDisplay = (monthStr: string) => {
    const [year, month] = monthStr.split('-')
    const date = new Date(parseInt(year), parseInt(month) - 1)
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) + ' (Demo)'
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

  const handleFilterClick = (filterType: 'uncategorized' | 'reviewTransfers') => {
    if (filterType === 'uncategorized') {
      setFilters(prev => ({ ...prev, categoryId: 'null', onlyCandidates: false }))
    } else {
      setFilters(prev => ({ ...prev, onlyCandidates: true, categoryId: '' }))
    }
  }
  
  // Load demo data on mount
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchDemoPageData(),
        fetchDemoTransactions()
      ])
      setLoading(false)
    }
    
    loadData()
  }, [currentMonth, fetchDemoPageData, fetchDemoTransactions])

  useEffect(() => {
    fetchDemoTransactions()
  }, [filters, fetchDemoTransactions])
  
  if (loading || !pageData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading demo data...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Demo Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <Play className="w-6 h-6" />
              <div>
                <div className="font-semibold">🎬 Interactive Demo</div>
                <div className="text-sm text-blue-100">This is sample data to showcase CashCheck&apos;s features</div>
              </div>
            </div>
            <Link 
              href="/login"
              className="inline-flex items-center bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg"
            >
              Try With Your Own Data
              <ExternalLink className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </div>

      {/* Header - Exact same as real app */}
      <header className="sticky top-0 z-30 glass border-b border-brand-200/20 shadow-soft">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <CashCheckLogo size="lg" />
              <nav className="flex items-center space-x-3">
                <button
                  onClick={() => navigateMonth()}
                  className="p-2 text-brand-600 hover:text-brand-900 hover:bg-brand-50 rounded-lg transition-all duration-200"
                  title="Previous month"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <div className="px-4 py-2 text-xl font-semibold text-brand-900 min-w-[200px] text-center">
                  {formatMonthDisplay(currentMonth)}
                </div>
                <button
                  onClick={() => navigateMonth()}
                  className="p-2 text-brand-600 hover:text-brand-900 hover:bg-brand-50 rounded-lg transition-all duration-200"
                  title="Next month"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </nav>
            </div>
            
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => alert('This is a demo! Click "Try With Your Own Data" to upload real files.')}
                className="p-3 text-brand-600 hover:text-brand-700 hover:bg-brand-50 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                title="Upload CSV (Demo)"
              >
                <Upload className="h-5 w-5" />
              </button>
              <button className="p-3 text-brand-600 hover:text-brand-700 hover:bg-brand-50 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md">
                <Users className="h-5 w-5" />
              </button>
              <button 
                onClick={() => alert('This is a demo! Click "Try With Your Own Data" to access settings.')}
                className="p-3 text-brand-600 hover:text-brand-700 hover:bg-brand-50 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                title="Manage Rules (Demo)"
              >
                <Settings className="h-5 w-5" />
              </button>
              <Link
                href="/login"
                className="p-3 text-brand-600 hover:text-brand-700 hover:bg-brand-50 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                title="Start Your Own Session"
              >
                <LogOut className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-10">
        {/* Dashboard Section - Exact same as real app */}
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

        {/* Transactions Section */}
        <div className="space-y-6 mt-12">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-brand-900">Transactions</h2>
            <div className="text-sm text-brand-500">
              Demo data - {transactions?.total || 0} transactions
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
                            onClick={() => alert('This is a demo! In the real app, you can delete transactions.')}
                            className="text-danger-600 hover:text-danger-900 hover:bg-danger-50 p-1 rounded"
                            title="Delete transaction (Demo)"
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
    </div>
  )
}