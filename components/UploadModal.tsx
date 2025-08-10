'use client'

import { useState, useRef } from 'react'
import { X, Upload as UploadIcon, CheckCircle, AlertCircle } from 'lucide-react'

interface UploadModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

interface UploadResult {
  imported: number
  duplicates: number
  transferCandidates: number
  message?: string
  detectedFormat?: string
  confidence?: number
}

export default function UploadModal({ isOpen, onClose, onSuccess }: UploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<UploadResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === 'text/csv') {
      setSelectedFile(file)
      setError(null)
    } else {
      setError('Please select a CSV file')
      setSelectedFile(null)
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file && file.type === 'text/csv') {
      setSelectedFile(file)
      setError(null)
    } else {
      setError('Please drop a CSV file')
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      const response = await fetch('/api/import', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (response.ok) {
        setResult(data)
        // Auto-close after success and refresh parent
        setTimeout(() => {
          handleClose()
          onSuccess()
        }, 3000)
      } else {
        setError(data.error || 'Upload failed')
      }
    } catch {
      setError('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleClose = () => {
    setSelectedFile(null)
    setResult(null)
    setError(null)
    setUploading(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Upload CSV File</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>


        {/* File Upload Area */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Upload CSV File
          </label>
          
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            {selectedFile ? (
              <div>
                <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                <p className="text-xs text-gray-500">Click to change file</p>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-600">
                  Drag and drop your CSV file here, or click to browse
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Only CSV files are supported
                </p>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* Supported Formats Info */}
        <div className="mb-6 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
          <h4 className="text-sm font-semibold text-indigo-900 mb-2">Supported CSV Formats:</h4>
          <div className="text-xs text-indigo-800 space-y-3">
            <div>
              <div className="font-medium">Chase Banking CSV:</div>
              <div className="mt-1 text-indigo-700 font-mono">Post Date, Description, Amount</div>
              <div className="mt-1 text-indigo-600 italic">Example: 07/01/2025,PAYROLL,3000.00</div>
            </div>
            <div>
              <div className="font-medium">Venmo CSV:</div>
              <div className="mt-1 text-indigo-700 font-mono">Datetime, Type, From, To, Amount (total), Amount (fee), Note, ID</div>
              <div className="mt-1 text-indigo-600 italic">Example: 07/05/2025 10:22:00,Payment,,Alice,-45.00,0.00,Dinner,TXN1</div>
            </div>
            <div className="mt-2 text-indigo-600 text-xs italic">
              💡 Format will be automatically detected from CSV headers
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
        )}

        {/* Success Result */}
        {result && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center mb-3">
              <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
              <h4 className="text-base font-semibold text-green-900">Upload Successful!</h4>
            </div>
            {result.detectedFormat && (
              <div className="mb-3 p-2 bg-green-100 border border-green-300 rounded text-xs">
                <span className="font-medium text-green-800">
                  📄 Detected format: {result.detectedFormat}
                  {result.confidence && ` (${Math.round(result.confidence * 100)}% confidence)`}
                </span>
              </div>
            )}
            <div className="text-sm text-green-800 space-y-2">
              <div className="flex justify-between items-center py-1 border-b border-green-200">
                <span>New transactions imported:</span>
                <span className="font-bold">{result.imported}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-green-200">
                <span>Duplicates skipped:</span>
                <span className="font-bold">{result.duplicates}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span>Transfer candidates found:</span>
                <span className="font-bold">{result.transferCandidates}</span>
              </div>
              {result.message && (
                <div className="mt-2 p-2 bg-green-100 rounded text-xs font-medium text-green-700">
                  {result.message}
                </div>
              )}
            </div>
            <div className="mt-4 text-center text-sm text-green-700 font-medium">
              🎉 Dashboard will refresh automatically...
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            disabled={uploading}
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-md"
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>
    </div>
  )
}