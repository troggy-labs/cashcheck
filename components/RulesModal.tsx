'use client'

import { useState, useEffect } from 'react'
import { X, Plus, Trash2, Edit } from 'lucide-react'

interface Rule {
  id: string
  pattern: string
  matchType: 'CONTAINS' | 'REGEX'
  direction: 'INFLOW' | 'OUTFLOW' | 'NONE'
  categoryId: string
  categoryName: string
  accountId: string | null
  accountName: string | null
  priority: number
  enabled: boolean
  createdAt: string
}

interface Category {
  id: string
  name: string
  kind: string
}

interface Account {
  id: string
  displayName: string
}

interface RulesModalProps {
  isOpen: boolean
  onClose: () => void
  categories: Category[]
  accounts: Account[]
  onRuleChange?: () => void
}

export default function RulesModal({
  isOpen,
  onClose,
  categories,
  accounts,
  onRuleChange
}: RulesModalProps) {
  const [rules, setRules] = useState<Rule[]>([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingRule, setEditingRule] = useState<Rule | null>(null)
  
  // Form state
  const [formData, setFormData] = useState<{
    pattern: string
    matchType: Rule['matchType']
    direction: Rule['direction']
    categoryId: string
    accountId: string
    priority: number
    enabled: boolean
  }>({
    pattern: '',
    matchType: 'CONTAINS',
    direction: 'NONE',
    categoryId: '',
    accountId: '',
    priority: 100,
    enabled: true
  })

  const fetchRules = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/rules')
      if (response.ok) {
        const data = await response.json()
        setRules(data)
      }
    } catch (error) {
      console.error('Failed to fetch rules:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingRule ? `/api/rules/${editingRule.id}` : '/api/rules'
      const method = editingRule ? 'PATCH' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          accountId: formData.accountId || null,
          priority: Number(formData.priority)
        })
      })
      
      if (response.ok) {
        await fetchRules()
        resetForm()
        onRuleChange?.()
      } else {
        console.error('Failed to save rule')
      }
    } catch (error) {
      console.error('Error saving rule:', error)
    }
  }

  const handleEdit = (rule: Rule) => {
    setEditingRule(rule)
    setFormData({
      pattern: rule.pattern,
      matchType: rule.matchType,
      direction: rule.direction,
      categoryId: rule.categoryId,
      accountId: rule.accountId || '',
      priority: rule.priority,
      enabled: rule.enabled
    })
    setShowForm(true)
  }

  const handleDelete = async (ruleId: string) => {
    if (!confirm('Are you sure you want to delete this rule?')) return
    
    try {
      const response = await fetch(`/api/rules/${ruleId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        await fetchRules()
        onRuleChange?.()
      }
    } catch (error) {
      console.error('Error deleting rule:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      pattern: '',
      matchType: 'CONTAINS',
      direction: 'NONE',
      categoryId: '',
      accountId: '',
      priority: 100,
      enabled: true
    })
    setEditingRule(null)
    setShowForm(false)
  }

  useEffect(() => {
    if (isOpen) {
      fetchRules()
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 z-50 animate-fadeIn">
      <div className="surface-elevated rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-strong animate-scaleIn">
        <header className="flex items-center justify-between p-8 border-b border-brand-200/50">
          <h2 className="text-2xl font-semibold text-brand-900">Categorization Rules</h2>
          <button
            onClick={onClose}
            className="text-brand-400 hover:text-brand-600 transition-colors p-2 rounded-lg hover:bg-brand-50"
          >
            <X className="h-6 w-6" />
          </button>
        </header>
        
        <main className="p-8 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="flex items-center justify-between mb-8">
            <p className="text-base text-brand-600">
              Rules automatically categorize transactions based on patterns in descriptions.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-accent-500 to-accent-600 text-white px-6 py-3 rounded-xl hover:from-accent-600 hover:to-accent-700 inline-flex items-center text-sm font-semibold transition-all duration-200 shadow-soft hover:shadow-medium transform hover:-translate-y-0.5"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Rule
            </button>
          </div>

          {/* Add/Edit Rule Form */}
          {showForm && (
            <section className="surface rounded-2xl p-8 mb-8 shadow-soft">
              <h3 className="text-xl font-semibold text-brand-900 mb-6">
                {editingRule ? 'Edit Rule' : 'Add New Rule'}
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-brand-700 mb-3">
                      Pattern *
                    </label>
                    <input
                      type="text"
                      value={formData.pattern}
                      onChange={(e) => setFormData(prev => ({ ...prev, pattern: e.target.value }))}
                      placeholder="e.g., Amazon, Starbucks, SALARY"
                      className="w-full border border-brand-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all duration-200"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-brand-700 mb-3">
                      Match Type
                    </label>
                    <select
                      value={formData.matchType}
                      onChange={(e) =>
                        setFormData(prev => ({
                          ...prev,
                          matchType: e.target.value as Rule['matchType']
                        }))
                      }
                      className="w-full border border-brand-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all duration-200"
                    >
                      <option value="CONTAINS">Contains</option>
                      <option value="REGEX">Regular Expression</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-brand-700 mb-3">
                      Category *
                    </label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                      className="w-full border border-brand-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all duration-200"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-brand-700 mb-3">
                      Direction
                    </label>
                    <select
                      value={formData.direction}
                      onChange={(e) =>
                        setFormData(prev => ({
                          ...prev,
                          direction: e.target.value as Rule['direction']
                        }))
                      }
                      className="w-full border border-brand-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all duration-200"
                    >
                      <option value="NONE">Any Amount</option>
                      <option value="INFLOW">Positive Only</option>
                      <option value="OUTFLOW">Negative Only</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-brand-700 mb-3">
                      Account (Optional)
                    </label>
                    <select
                      value={formData.accountId}
                      onChange={(e) => setFormData(prev => ({ ...prev, accountId: e.target.value }))}
                      className="w-full border border-brand-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all duration-200"
                    >
                      <option value="">Any Account</option>
                      {accounts.map(account => (
                        <option key={account.id} value={account.id}>
                          {account.displayName}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-brand-700 mb-3">
                      Priority
                    </label>
                    <input
                      type="number"
                      value={formData.priority}
                      onChange={(e) => setFormData(prev => ({ ...prev, priority: Number(e.target.value) }))}
                      className="w-full border border-brand-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all duration-200"
                      min="1"
                      max="1000"
                    />
                    <p className="text-xs text-brand-500 mt-1">Lower numbers = higher priority</p>
                  </div>
                </div>
                
                <div className="flex items-center mt-4">
                  <input
                    type="checkbox"
                    checked={formData.enabled}
                    onChange={(e) => setFormData(prev => ({ ...prev, enabled: e.target.checked }))}
                    className="mr-2 text-accent-600 focus:ring-accent-500"
                  />
                  <span className="text-sm text-brand-700">Enabled</span>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 text-sm font-semibold text-brand-700 bg-brand-100 hover:bg-brand-200 rounded-xl transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 rounded-xl transition-all duration-200 shadow-soft hover:shadow-medium transform hover:-translate-y-0.5"
                  >
                    {editingRule ? 'Update Rule' : 'Create Rule'}
                  </button>
                </div>
              </form>
            </section>
          )}

          {/* Rules List */}
          <div className="surface-elevated rounded-2xl overflow-hidden shadow-soft">
            {loading ? (
              <div className="text-center py-8">
                <div className="text-brand-500">Loading rules...</div>
              </div>
            ) : rules.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-brand-600 text-lg">No rules created yet</div>
                <div className="text-brand-500 text-sm mt-2">Add a rule to automatically categorize transactions</div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-brand-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-brand-500 uppercase tracking-wider">
                        Priority
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-brand-500 uppercase tracking-wider">
                        Pattern
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-brand-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-brand-500 uppercase tracking-wider">
                        Account
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-brand-500 uppercase tracking-wider">
                        Direction
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-brand-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-brand-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-200">
                    {rules.map((rule) => (
                      <tr key={rule.id} className={rule.enabled ? '' : 'opacity-50'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-brand-900">
                          {rule.priority}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-900">
                          <div>
                            <span className="font-medium">{rule.pattern}</span>
                            <div className="text-xs text-brand-500">({rule.matchType})</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-900">
                          {rule.categoryName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-500">
                          {rule.accountName || 'Any'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-500">
                          {rule.direction === 'INFLOW' ? 'Positive' : rule.direction === 'OUTFLOW' ? 'Negative' : 'Any'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            rule.enabled 
                              ? 'bg-success-100 text-success-800'
                              : 'bg-brand-100 text-brand-800'
                          }`}>
                            {rule.enabled ? 'Enabled' : 'Disabled'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => handleEdit(rule)}
                            className="text-accent-600 hover:text-accent-900"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(rule.id)}
                            className="text-danger-600 hover:text-danger-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}