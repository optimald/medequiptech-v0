'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Plus, Search, Filter, Eye, Edit, Trash2, X } from 'lucide-react'
import Link from 'next/link'

interface Job {
  id: string
  title: string
  job_type: 'tech' | 'trainer'
  company_name: string
  customer_name: string
  model: string
  priority: 'P0' | 'P1' | 'P2' | 'SCOTT'
  status: string
  met_date: string
  shipping_city: string
  shipping_state: string
  created_at: string
}

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({
    status: '',
    job_type: '',
    priority: '',
    search: ''
  })
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [creatingJob, setCreatingJob] = useState(false)
  const [newJob, setNewJob] = useState({
    title: '',
    job_type: 'tech' as 'tech' | 'trainer',
    company_name: '',
    customer_name: '',
    model: '',
    priority: 'P2' as 'P0' | 'P1' | 'P2' | 'SCOTT',
    met_date: '',
    shipping_city: '',
    shipping_state: '',
    address_line1: '',
    address_line2: '',
    zip: '',
    contact_name: '',
    contact_phone: '',
    contact_email: '',
    instructions_public: '',
    instructions_private: ''
  })

  useEffect(() => {
    fetchJobs()
  }, [filters])

  const fetchJobs = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value)
      })

      const response = await fetch(`/api/jobs?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setJobs(data.jobs || [])
      } else {
        setError('Failed to fetch jobs')
      }
    } catch (error) {
      setError('Failed to fetch jobs')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreatingJob(true)
    
    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newJob),
      })

      if (response.ok) {
        setShowCreateModal(false)
        setNewJob({
          title: '',
          job_type: 'tech',
          company_name: '',
          customer_name: '',
          model: '',
          priority: 'P2',
          met_date: '',
          shipping_city: '',
          shipping_state: '',
          address_line1: '',
          address_line2: '',
          zip: '',
          contact_name: '',
          contact_phone: '',
          contact_email: '',
          instructions_public: '',
          instructions_private: ''
        })
        fetchJobs() // Refresh the jobs list
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to create job')
      }
    } catch (error) {
      setError('Failed to create job')
    } finally {
      setCreatingJob(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'P0': return 'bg-red-100 text-red-800'
      case 'P1': return 'bg-orange-100 text-orange-800'
      case 'P2': return 'bg-blue-100 text-blue-800'
      case 'SCOTT': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'bg-green-100 text-green-800'
      case 'BIDDING': return 'bg-blue-100 text-blue-800'
      case 'AWARDED': return 'bg-purple-100 text-purple-800'
      case 'COMPLETED': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Job Management</h1>
            <p className="text-muted-foreground">
              Create, edit, and manage jobs and bids
            </p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create New Job
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                placeholder="Search jobs..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={filters.status || "all"} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value === 'all' ? '' : value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="OPEN">Open</SelectItem>
                  <SelectItem value="BIDDING">Bidding</SelectItem>
                  <SelectItem value="AWARDED">Awarded</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="job_type">Job Type</Label>
              <Select value={filters.job_type || "all"} onValueChange={(value) => setFilters(prev => ({ ...prev, job_type: value === 'all' ? '' : value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="tech">Technician</SelectItem>
                  <SelectItem value="trainer">Trainer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={filters.priority || "all"} onValueChange={(value) => setFilters(prev => ({ ...prev, priority: value === 'all' ? '' : value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="All Priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="P0">P0 - Critical</SelectItem>
                  <SelectItem value="P1">P1 - High</SelectItem>
                  <SelectItem value="P2">P2 - Medium</SelectItem>
                  <SelectItem value="SCOTT">SCOTT - Special</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Jobs List */}
      {jobs.length === 0 ? (
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">No Jobs Found</CardTitle>
            <CardDescription>
              {Object.values(filters).some(f => f) 
                ? 'Try adjusting your filters' 
                : 'Create your first job to get started'
              }
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <Card key={job.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold">{job.title}</h3>
                      <Badge className={getPriorityColor(job.priority)}>
                        {job.priority}
                      </Badge>
                      <Badge className={getStatusColor(job.status)}>
                        {job.status}
                      </Badge>
                      <Badge variant="outline">
                        {job.job_type === 'tech' ? 'Technician' : 'Trainer'}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium">Company:</span> {job.company_name}
                      </div>
                      <div>
                        <span className="font-medium">Customer:</span> {job.customer_name}
                      </div>
                      <div>
                        <span className="font-medium">Model:</span> {job.model}
                      </div>
                      <div>
                        <span className="font-medium">Location:</span> {job.shipping_city}, {job.shipping_state}
                      </div>
                      <div>
                        <span className="font-medium">MET Date:</span> {new Date(job.met_date).toLocaleDateString()}
                      </div>
                      <div>
                        <span className="font-medium">Created:</span> {new Date(job.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/jobs/${job.id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Link>
                    </Button>
                    
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/jobs/${job.id}/edit`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Job Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Create New Job</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCreateModal(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleCreateJob} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title *</Label>
                  <Input
                    id="title"
                    value={newJob.title}
                    onChange={(e) => setNewJob(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., VBeam Perfecta Maintenance"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="job_type">Job Type *</Label>
                  <Select value={newJob.job_type} onValueChange={(value) => setNewJob(prev => ({ ...prev, job_type: value as 'tech' | 'trainer' }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tech">Technician</SelectItem>
                      <SelectItem value="trainer">Trainer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company_name">Company Name *</Label>
                  <Input
                    id="company_name"
                    value={newJob.company_name}
                    onChange={(e) => setNewJob(prev => ({ ...prev, company_name: e.target.value }))}
                    placeholder="e.g., ABC MedSpa"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customer_name">Customer Name *</Label>
                  <Input
                    id="customer_name"
                    value={newJob.customer_name}
                    onChange={(e) => setNewJob(prev => ({ ...prev, customer_name: e.target.value }))}
                    placeholder="e.g., John Smith"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model">Equipment Model *</Label>
                  <Input
                    id="model"
                    value={newJob.model}
                    onChange={(e) => setNewJob(prev => ({ ...prev, model: e.target.value }))}
                    placeholder="e.g., VBeam Perfecta"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority *</Label>
                  <Select value={newJob.priority} onValueChange={(value) => setNewJob(prev => ({ ...prev, priority: value as 'P0' | 'P1' | 'P2' | 'SCOTT' }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="P0">P0 - Critical</SelectItem>
                      <SelectItem value="P1">P1 - High</SelectItem>
                      <SelectItem value="P2">P2 - Medium</SelectItem>
                      <SelectItem value="SCOTT">SCOTT - Special</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="met_date">MET Date *</Label>
                  <Input
                    id="met_date"
                    type="date"
                    value={newJob.met_date}
                    onChange={(e) => setNewJob(prev => ({ ...prev, met_date: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shipping_city">City *</Label>
                  <Input
                    id="shipping_city"
                    value={newJob.shipping_city}
                    onChange={(e) => setNewJob(prev => ({ ...prev, shipping_city: e.target.value }))}
                    placeholder="e.g., Miami"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shipping_state">State *</Label>
                  <Input
                    id="shipping_state"
                    value={newJob.shipping_state}
                    onChange={(e) => setNewJob(prev => ({ ...prev, shipping_state: e.target.value }))}
                    placeholder="e.g., FL"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zip">ZIP Code *</Label>
                  <Input
                    id="shipping_zip"
                    value={newJob.zip}
                    onChange={(e) => setNewJob(prev => ({ ...prev, zip: e.target.value }))}
                    placeholder="e.g., 33101"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_name">Contact Name *</Label>
                  <Input
                    id="contact_name"
                    value={newJob.contact_name}
                    onChange={(e) => setNewJob(prev => ({ ...prev, contact_name: e.target.value }))}
                    placeholder="e.g., Jane Doe"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_phone">Contact Phone *</Label>
                  <Input
                    id="contact_phone"
                    value={newJob.contact_phone}
                    onChange={(e) => setNewJob(prev => ({ ...prev, contact_phone: e.target.value }))}
                    placeholder="e.g., (305) 555-0123"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_email">Contact Email *</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={newJob.contact_email}
                    onChange={(e) => setNewJob(prev => ({ ...prev, contact_email: e.target.value }))}
                    placeholder="e.g., jane@abcmedspa.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address_line1">Address Line 1 *</Label>
                <Input
                  id="address_line1"
                  value={newJob.address_line1}
                  onChange={(e) => setNewJob(prev => ({ ...prev, address_line1: e.target.value }))}
                  placeholder="e.g., 123 Main Street"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address_line2">Address Line 2</Label>
                <Input
                  id="address_line2"
                  value={newJob.address_line2}
                  onChange={(e) => setNewJob(prev => ({ ...prev, address_line2: e.target.value }))}
                  placeholder="e.g., Suite 100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instructions_public">Public Instructions</Label>
                <Textarea
                  id="instructions_public"
                  value={newJob.instructions_public}
                  onChange={(e) => setNewJob(prev => ({ ...prev, instructions_public: e.target.value }))}
                  placeholder="Instructions visible to technicians/trainers"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instructions_private">Private Instructions</Label>
                <Textarea
                  id="instructions_private"
                  value={newJob.instructions_private}
                  onChange={(e) => setNewJob(prev => ({ ...prev, instructions_private: e.target.value }))}
                  placeholder="Internal instructions (admin only)"
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={creatingJob}>
                  {creatingJob ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Job'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
