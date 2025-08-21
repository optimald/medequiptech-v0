'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Upload, FileText, CheckCircle, AlertCircle, XCircle } from 'lucide-react'

interface ImportResult {
  total_rows: number
  valid_jobs: number
  errors: Array<{
    row: number
    error: string
    data: any
  }>
  duplicates: Array<{
    row: number
    reason: string
    existing_job_id: string
    data: any
  }>
}

export default function AdminImportPage() {
  const [file, setFile] = useState<File | null>(null)
  const [csvData, setCsvData] = useState<any[]>([])
  const [mapping, setMapping] = useState({
    job_type: '',
    title: '',
    company_name: '',
    customer_name: '',
    model: '',
    priority: '',
    status: '',
    met_date: '',
    shipping_state: '',
    shipping_city: '',
    external_id: ''
  })
  const [previewResult, setPreviewResult] = useState<ImportResult | null>(null)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith('.csv')) {
      setError('Please select a CSV file')
      return
    }

    setFile(file)
    setError('')

    try {
      const text = await file.text()
      const lines = text.split('\n')
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
      const rows = lines.slice(1).filter(line => line.trim()).map(line => {
        const values = line.split(',').map(v => v.trim().replace(/"/g, ''))
        const row: any = {}
        headers.forEach((header, index) => {
          row[header] = values[index] || ''
        })
        return row
      })

      setCsvData(rows)
      
      // Auto-map common field names
      const autoMapping: { [key: string]: string } = {}
      headers.forEach(header => {
        const lowerHeader = header.toLowerCase()
        if (lowerHeader.includes('type') || lowerHeader.includes('job')) autoMapping.job_type = header
        if (lowerHeader.includes('title') || lowerHeader.includes('name')) autoMapping.title = header
        if (lowerHeader.includes('company')) autoMapping.company_name = header
        if (lowerHeader.includes('customer')) autoMapping.customer_name = header
        if (lowerHeader.includes('model')) autoMapping.model = header
        if (lowerHeader.includes('priority')) autoMapping.priority = header
        if (lowerHeader.includes('status')) autoMapping.status = header
        if (lowerHeader.includes('date') || lowerHeader.includes('met')) autoMapping.met_date = header
        if (lowerHeader.includes('state')) autoMapping.shipping_state = header
        if (lowerHeader.includes('city')) autoMapping.shipping_city = header
        if (lowerHeader.includes('id') || lowerHeader.includes('external')) autoMapping.external_id = header
      })

      setMapping(prev => ({ ...prev, ...autoMapping }))
    } catch (error) {
      setError('Failed to read CSV file')
    }
  }

  const previewImport = async () => {
    if (!csvData.length) return

    try {
      setLoading(true)
      const response = await fetch('/api/imports/csv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          csv_data: csvData,
          mapping_json: mapping,
          dry_run: true
        })
      })

      if (response.ok) {
        const data = await response.json()
        setPreviewResult(data.details)
        setError('')
      } else {
        const data = await response.json()
        setError(`Preview failed: ${data.error}`)
      }
    } catch (error) {
      setError('Failed to preview import')
    } finally {
      setLoading(false)
    }
  }

  const executeImport = async () => {
    if (!csvData.length) return

    try {
      setLoading(true)
      const response = await fetch('/api/imports/csv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          csv_data: csvData,
          mapping_json: mapping,
          dry_run: false
        })
      })

      if (response.ok) {
        const data = await response.json()
        setImportResult(data)
        setPreviewResult(null)
        setError('')
      } else {
        const data = await response.json()
        setError(`Import failed: ${data.error}`)
      }
    } catch (error) {
      setError('Failed to execute import')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFile(null)
    setCsvData([])
    setMapping({
      job_type: '',
      title: '',
      company_name: '',
      customer_name: '',
      model: '',
      priority: '',
      status: '',
      met_date: '',
      shipping_state: '',
      shipping_city: '',
      external_id: ''
    })
    setPreviewResult(null)
    setImportResult(null)
    setError('')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">CSV Import</h1>
        <p className="text-muted-foreground">
          Import jobs from Google Sheets or CSV files
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!csvData.length ? (
        /* File Upload Section */
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="h-5 w-5" />
              <span>Upload CSV File</span>
            </CardTitle>
            <CardDescription>
              Select a CSV file exported from Google Sheets or other sources
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="csv-file">CSV File</Label>
                <Input
                  id="csv-file"
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                />
              </div>
              
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium mb-2">Required Fields</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Job Type (tech/trainer)</li>
                  <li>• Title</li>
                  <li>• Company Name</li>
                  <li>• Customer Name</li>
                  <li>• Model</li>
                  <li>• Priority (P0/P1/P2/SCOTT)</li>
                  <li>• Status</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Field Mapping Section */
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Field Mapping</span>
              </CardTitle>
              <CardDescription>
                Map CSV columns to database fields
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="job_type">Job Type *</Label>
                  <Select value={mapping.job_type || "none"} onValueChange={(value) => setMapping(prev => ({ ...prev, job_type: value === 'none' ? '' : value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select CSV column" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">-- Select CSV column --</SelectItem>
                      {Object.keys(csvData[0] || {}).map(header => (
                        <SelectItem key={header} value={header}>{header}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Select value={mapping.title || "none"} onValueChange={(value) => setMapping(prev => ({ ...prev, title: value === 'none' ? '' : value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select CSV column" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">-- Select CSV column --</SelectItem>
                      {Object.keys(csvData[0] || {}).map(header => (
                        <SelectItem key={header} value={header}>{header}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company_name">Company Name *</Label>
                  <Select value={mapping.company_name || "none"} onValueChange={(value) => setMapping(prev => ({ ...prev, company_name: value === 'none' ? '' : value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select CSV column" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">-- Select CSV column --</SelectItem>
                      {Object.keys(csvData[0] || {}).map(header => (
                        <SelectItem key={header} value={header}>{header}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customer_name">Customer Name *</Label>
                  <Select value={mapping.customer_name || "none"} onValueChange={(value) => setMapping(prev => ({ ...prev, customer_name: value === 'none' ? '' : value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select CSV column" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">-- Select CSV column --</SelectItem>
                      {Object.keys(csvData[0] || {}).map(header => (
                        <SelectItem key={header} value={header}>{header}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model">Model *</Label>
                  <Select value={mapping.model || "none"} onValueChange={(value) => setMapping(prev => ({ ...prev, model: value === 'none' ? '' : value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select CSV column" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">-- Select CSV column --</SelectItem>
                      {Object.keys(csvData[0] || {}).map(header => (
                        <SelectItem key={header} value={header}>{header}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority *</Label>
                  <Select value={mapping.priority || "none"} onValueChange={(value) => setMapping(prev => ({ ...prev, priority: value === 'none' ? '' : value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select CSV column" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">-- Select CSV column --</SelectItem>
                      {Object.keys(csvData[0] || {}).map(header => (
                        <SelectItem key={header} value={header}>{header}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select value={mapping.status || "none"} onValueChange={(value) => setMapping(prev => ({ ...prev, status: value === 'none' ? '' : value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select CSV column" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">-- Select CSV column --</SelectItem>
                      {Object.keys(csvData[0] || {}).map(header => (
                        <SelectItem key={header} value={header}>{header}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="met_date">MET Date</Label>
                  <Select value={mapping.met_date || "none"} onValueChange={(value) => setMapping(prev => ({ ...prev, met_date: value === 'none' ? '' : value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select CSV column" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">-- Select CSV column --</SelectItem>
                      {Object.keys(csvData[0] || {}).map(header => (
                        <SelectItem key={header} value={header}>{header}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shipping_state">Shipping State</Label>
                  <Select value={mapping.shipping_state || "none"} onValueChange={(value) => setMapping(prev => ({ ...prev, shipping_state: value === 'none' ? '' : value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select CSV column" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">-- Select CSV column --</SelectItem>
                      {Object.keys(csvData[0] || {}).map(header => (
                        <SelectItem key={header} value={header}>{header}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shipping_city">Shipping City</Label>
                  <Select value={mapping.shipping_city || "none"} onValueChange={(value) => setMapping(prev => ({ ...prev, shipping_city: value === 'none' ? '' : value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select CSV column" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">-- Select CSV column --</SelectItem>
                      {Object.keys(csvData[0] || {}).map(header => (
                        <SelectItem key={header} value={header}>{header}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="external_id">External ID</Label>
                  <Select value={mapping.external_id || "none"} onValueChange={(value) => setMapping(prev => ({ ...prev, external_id: value === 'none' ? '' : value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select CSV column" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">-- Select CSV column --</SelectItem>
                      {Object.keys(csvData[0] || {}).map(header => (
                        <SelectItem key={header} value={header}>{header}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex space-x-3 pt-6">
                <Button onClick={resetForm} variant="outline">
                  Reset
                </Button>
                <Button 
                  onClick={previewImport} 
                  disabled={loading || !Object.values(mapping).some(v => v)}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <FileText className="h-4 w-4 mr-2" />
                  )}
                  Preview Import
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Preview Results */}
          {previewResult && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Preview Results</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{previewResult.total_rows}</div>
                    <div className="text-sm text-blue-800">Total Rows</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{previewResult.valid_jobs}</div>
                    <div className="text-sm text-green-800">Valid Jobs</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{previewResult.errors.length}</div>
                    <div className="text-sm text-yellow-800">Errors</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{previewResult.duplicates.length}</div>
                    <div className="text-sm text-orange-800">Duplicates</div>
                  </div>
                </div>

                {previewResult.errors.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium mb-2 text-yellow-800">Errors Found:</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {previewResult.errors.map((error, index) => (
                        <div key={index} className="p-2 bg-yellow-50 rounded text-sm">
                          <span className="font-medium">Row {error.row}:</span> {error.error}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {previewResult.duplicates.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium mb-2 text-orange-800">Duplicates Found:</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {previewResult.duplicates.map((duplicate, index) => (
                        <div key={index} className="p-2 bg-orange-50 rounded text-sm">
                          <span className="font-medium">Row {duplicate.row}:</span> {duplicate.reason}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex space-x-3">
                  <Button onClick={resetForm} variant="outline">
                    Cancel
                  </Button>
                  <Button 
                    onClick={executeImport} 
                    disabled={loading || previewResult.errors.length > 0}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <CheckCircle className="h-4 w-4 mr-2" />
                    )}
                    Execute Import
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Import Results */}
          {importResult && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Import Complete</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{importResult.total_rows}</div>
                    <div className="text-sm text-blue-800">Total Rows</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{importResult.valid_jobs}</div>
                    <div className="text-sm text-green-800">Imported Jobs</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{importResult.errors.length}</div>
                    <div className="text-sm text-yellow-800">Errors</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{importResult.duplicates.length}</div>
                    <div className="text-sm text-orange-800">Duplicates</div>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-green-600 font-medium mb-4">
                    Successfully imported {importResult.valid_jobs} jobs!
                  </p>
                  <Button onClick={resetForm}>
                    Import Another File
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
