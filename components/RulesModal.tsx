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
  const [formData, setFormData] = useState({
    pattern: '',
    matchType: 'CONTAINS' as const,
    direction: 'NONE' as const,
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Categorization Rules</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-600">
              Rules automatically categorize transactions based on patterns in descriptions.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 inline-flex items-center text-sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Rule
            </button>
          </div>

          {/* Add/Edit Rule Form */}
          {showForm && (
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingRule ? 'Edit Rule' : 'Add New Rule'}
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pattern *
                    </label>
                    <input
                      type="text"
                      value={formData.pattern}
                      onChange={(e) => setFormData(prev => ({ ...prev, pattern: e.target.value }))}
                      placeholder="e.g., Amazon, Starbucks, SALARY"
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Match Type
                    </label>
                    <select
                      value={formData.matchType}
                      onChange={(e) => setFormData(prev => ({ ...prev, matchType: e.target.value as any }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="CONTAINS">Contains</option>
                      <option value="REGEX">Regular Expression</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Direction
                    </label>
                    <select
                      value={formData.direction}
                      onChange={(e) => setFormData(prev => ({ ...prev, direction: e.target.value as any }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="NONE">Any Amount</option>
                      <option value="INFLOW">Positive Only</option>
                      <option value="OUTFLOW">Negative Only</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account (Optional)
                    </label>
                    <select
                      value={formData.accountId}
                      onChange={(e) => setFormData(prev => ({ ...prev, accountId: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <input
                      type="number"
                      value={formData.priority}
                      onChange={(e) => setFormData(prev => ({ ...prev, priority: Number(e.target.value) }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      min="1"
                      max="1000"
                    />
                    <p className="text-xs text-gray-500 mt-1">Lower numbers = higher priority</p>
                  </div>
                </div>
                
                <div className="flex items-center mt-4">
                  <input
                    type="checkbox"
                    checked={formData.enabled}
                    onChange={(e) => setFormData(prev => ({ ...prev, enabled: e.target.checked }))}
                    className="mr-2 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Enabled</span>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                  >
                    {editingRule ? 'Update Rule' : 'Create Rule'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Rules List */}
          <div className="bg-white rounded-lg border overflow-hidden">
            {loading ? (
              <div className="text-center py-8">
                <div className="text-gray-500">Loading rules...</div>
              </div>
            ) : rules.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-500">No rules created yet</div>
                <div className="text-gray-400 text-sm mt-2">Add a rule to automatically categorize transactions</div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Priority
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pattern
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Account
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Direction
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {rules.map((rule) => (
                      <tr key={rule.id} className={rule.enabled ? '' : 'opacity-50'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {rule.priority}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>
                            <span className="font-medium">{rule.pattern}</span>
                            <div className="text-xs text-gray-500">({rule.matchType})</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {rule.categoryName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {rule.accountName || 'Any'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {rule.direction === 'INFLOW' ? 'Positive' : rule.direction === 'OUTFLOW' ? 'Negative' : 'Any'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            rule.enabled 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {rule.enabled ? 'Enabled' : 'Disabled'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => handleEdit(rule)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(rule.id)}
                            className="text-red-600 hover:text-red-900"
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
        </div>
      </div>
    </div>
  )
}