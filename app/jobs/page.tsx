'use client'

import { useAuth } from '@/lib/auth-context'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Search, MapPin, Calendar, DollarSign, MessageSquare, Eye, Building2 } from 'lucide-react'
import Link from 'next/link'

interface Job {
  id: string
  title: string
  company_name: string
  customer_name: string
  model: string
  priority: string
  status: string
  met_date: string
  shipping_city: string
  shipping_state: string
  instructions_public: string
  job_type: string
  created_at: string
  bids?: Array<{
    id: string
    ask_price: number
    bidder_id: string
    status: string
    created_at: string
  }>
}

export default function JobsPage() {
  const { user, isDemoUser, demoRole } = useAuth()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [jobTypeFilter, setJobTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    if (user) {
      // Auto-filter by user role for tech/trainer users
      if (isDemoUser) {
        if (demoRole === 'technician') {
          setJobTypeFilter('tech')
        } else if (demoRole === 'trainer') {
          setJobTypeFilter('trainer')
        }
      }
      fetchJobs()
    }
  }, [user, jobTypeFilter, statusFilter, isDemoUser, demoRole])

  const fetchJobs = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (jobTypeFilter) params.append('jobType', jobTypeFilter)
      if (statusFilter) params.append('status', statusFilter)
      
      const response = await fetch(`/api/jobs/public?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setJobs(data.jobs || [])
      } else {
        console.error('Failed to fetch jobs')
      }
    } catch (error) {
      console.error('Error fetching jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'P0': return 'bg-red-100 text-red-800'
      case 'P1': return 'bg-orange-100 text-orange-800'
      case 'P2': return 'bg-yellow-100 text-yellow-800'
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

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.model.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle>Please Log In</CardTitle>
            <CardDescription>
              You need to be logged in to view available jobs.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/auth/signin">
              <Button>Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Available Jobs</h1>
        <p className="text-muted-foreground">
          Browse and bid on available equipment service jobs
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Input
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <Select value={jobTypeFilter} onValueChange={setJobTypeFilter}>
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
            <div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                              <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="OPEN">Open</SelectItem>
            <SelectItem value="BIDDING">Bidding</SelectItem>
            <SelectItem value="AWARDED">Awarded</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Button onClick={fetchJobs} variant="outline" className="w-full">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Jobs List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : filteredJobs.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">No jobs found matching your criteria.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold">{job.title}</h3>
                      <div className="flex gap-2">
                        <Badge className={getPriorityColor(job.priority)}>
                          {job.priority}
                        </Badge>
                        <Badge className={getStatusColor(job.status)}>
                          {job.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Building2 className="h-4 w-4 mr-2" />
                          {job.company_name}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-2" />
                          {job.shipping_city}, {job.shipping_state}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-2" />
                          MET: {new Date(job.met_date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          {job.bids?.length || 0} bids
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4">
                      {job.instructions_public}
                    </p>

                    <div className="flex items-center gap-2 text-sm">
                      <Badge variant="outline">{job.job_type === 'tech' ? 'Technician' : 'Trainer'}</Badge>
                      <span className="text-muted-foreground">Model: {job.model}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 min-w-[120px]">
                    <Link href={`/jobs/${job.id}`}>
                      <Button variant="outline" className="w-full">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </Link>
                    {job.status === 'OPEN' && (
                      <Link href={`/jobs/${job.id}/bid`}>
                        <Button className="w-full">
                          <DollarSign className="h-4 w-4 mr-2" />
                          Place Bid
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
