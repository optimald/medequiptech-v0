'use client'

import { useAuth } from '@/lib/auth-context'
import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Search, MapPin, Calendar, DollarSign, MessageSquare, Eye, Building2, Lock, UserPlus } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface Job {
  id: string
  title: string
  company_name: string
  customer_name?: string
  model: string
  priority: string
  status: string
  met_date: string
  shipping_city: string
  shipping_state: string
  instructions_public?: string
  job_type: string
  created_at: string
  can_bid?: boolean
  requires_account?: boolean
  job_summary?: string
  bids?: Array<{
    id: string
    ask_price: number
    bidder_id: string
    status: string
    created_at: string
  }>
}

interface UserAccess {
  authenticated: boolean
  approved: boolean
  role_tech: boolean
  role_trainer: boolean
}

export default function JobsPage() {
  const { user, isDemoUser, demoRole } = useAuth()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [jobTypeFilter, setJobTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [userAccess, setUserAccess] = useState<UserAccess>({
    authenticated: false,
    approved: false,
    role_tech: false,
    role_trainer: false
  })

  // Update URL when filters change
  const updateURL = (newJobType: string, newStatus: string) => {
    const params = new URLSearchParams()
    if (newJobType && newJobType !== 'all') params.set('job_type', newJobType)
    if (newStatus && newStatus !== 'all') params.set('status', newStatus)
    
    const newURL = params.toString() ? `?${params.toString()}` : ''
    router.replace(`/jobs${newURL}`)
  }

  // Handle job type filter change
  const handleJobTypeChange = (value: string) => {
    setJobTypeFilter(value)
    updateURL(value, statusFilter)
  }

  // Handle status filter change
  const handleStatusChange = (value: string) => {
    setStatusFilter(value)
    updateURL(jobTypeFilter, value)
  }

  // Handle getting current location
  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          // For now, we'll just show coordinates
          // In a real app, you'd reverse geocode this to get city/state
          setSearchTerm(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`)
        },
        (error) => {
          console.error('Error getting location:', error)
          // Fallback to a default location
          setSearchTerm('Las Vegas, NV')
        }
      )
    } else {
      // Fallback for browsers that don't support geolocation
      setSearchTerm('Las Vegas, NV')
    }
  }

  // Handle resetting all filters
  const handleResetFilters = () => {
    setSearchTerm('')
    setJobTypeFilter('all')
    setStatusFilter('all')
    updateURL('all', 'all')
  }

  useEffect(() => {
    // Initialize filters from URL parameters
    const urlJobType = searchParams.get('job_type')
    const urlStatus = searchParams.get('status')
    
    if (urlJobType && (urlJobType === 'tech' || urlJobType === 'trainer')) {
      setJobTypeFilter(urlJobType)
    }
    
    if (urlStatus) {
      setStatusFilter(urlStatus)
    }
  }, [searchParams])

  // Set userAccess for demo users when they first load
  useEffect(() => {
    if (user && isDemoUser && demoRole) {
      setUserAccess({
        authenticated: true,
        approved: true,
        role_tech: demoRole === 'technician' || demoRole === 'admin',
        role_trainer: demoRole === 'trainer' || demoRole === 'admin'
      })
    }
  }, [user, isDemoUser, demoRole])

  // Handle job filtering and fetching
  useEffect(() => {
    if (user) {
      // Auto-filter by user role for tech/trainer users if no URL parameter
      if (isDemoUser && !searchParams.get('job_type')) {
        if (demoRole === 'technician' && jobTypeFilter !== 'tech') {
          setJobTypeFilter('tech')
          updateURL('tech', statusFilter)
        } else if (demoRole === 'trainer' && jobTypeFilter !== 'trainer') {
          setJobTypeFilter('trainer')
          updateURL('trainer', statusFilter)
        }
      }
      
      // For authenticated users, enforce role-based filtering
      // Only apply role-based filtering if userAccess has been loaded
      if (userAccess.authenticated) {
        if (userAccess.role_tech && !userAccess.role_trainer) {
          // Technician only - can only see tech jobs
          if (jobTypeFilter !== 'tech') {
            setJobTypeFilter('tech')
            updateURL('tech', statusFilter)
          }
        } else if (userAccess.role_trainer && !userAccess.role_tech) {
          // Trainer only - can only see trainer jobs
          if (jobTypeFilter !== 'trainer') {
            setJobTypeFilter('trainer')
            updateURL('trainer', statusFilter)
          }
        }
      }
      
      fetchJobs()
    } else {
      // Public user - fetch jobs without authentication
      fetchJobs()
    }
  }, [user, jobTypeFilter, statusFilter, isDemoUser, demoRole, searchParams])

  const fetchJobs = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      
      if (user) {
        // Authenticated users - include all filters
        if (jobTypeFilter && jobTypeFilter !== 'all') params.append('job_type', jobTypeFilter)
        if (statusFilter && statusFilter !== 'all') params.append('status', statusFilter)
      } else {
        // Public users - only show open jobs and filter by job type
        params.append('status', 'OPEN')
        if (jobTypeFilter && jobTypeFilter !== 'all') params.append('job_type', jobTypeFilter)
      }
      
      const response = await fetch(`/api/jobs/public?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setJobs(data.jobs || [])
        setUserAccess(data.user_access || {
          authenticated: false,
          approved: false,
          role_tech: false,
          role_trainer: false
        })
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
    if (user) {
      // Authenticated users - use existing filtering logic
      // Search filtering
      const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           job.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           job.model.toLowerCase().includes(searchTerm.toLowerCase())
      
      // Job type filtering
      const matchesJobType = !jobTypeFilter || jobTypeFilter === 'all' || job.job_type === jobTypeFilter
      
      // Status filtering
      const matchesStatus = !statusFilter || statusFilter === 'all' || job.status === statusFilter
      
      // Role-based filtering - ensure users only see jobs they can work on
      const matchesRole = !userAccess.authenticated || 
                         (userAccess.role_tech && job.job_type === 'tech') ||
                         (userAccess.role_trainer && job.job_type === 'trainer') ||
                         (userAccess.role_tech && userAccess.role_trainer) // Admin users can see all
      
      return matchesSearch && matchesJobType && matchesStatus && matchesRole
    } else {
      // Public users - location-based filtering only
      // State filtering (searchTerm is used for state)
      const matchesState = !searchTerm || searchTerm === 'all' || job.shipping_state === searchTerm
      
      // Job type filtering
      const matchesJobType = !jobTypeFilter || jobTypeFilter === 'all' || job.job_type === jobTypeFilter
      
      // Radius filtering (statusFilter is used for radius)
      const matchesRadius = !statusFilter || statusFilter === 'all' || true // TODO: Implement actual radius calculation
      
      return matchesState && matchesJobType && matchesRadius
    }
  })

    // Show different content based on authentication status
  if (!user && !userAccess.authenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header with Logo */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <Image
                  src="/logo.avif"
                  alt="MedEquipTech"
                  width={200}
                  height={60}
                  className="h-12 w-auto"
                />
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  href="/auth/signin"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Available Jobs</h1>
            <p className="text-muted-foreground">
              Browse available equipment service jobs in your area
            </p>
          </div>

          {/* Public Call-to-Action */}
          <Card className="mb-6 bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <UserPlus className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-blue-900 mb-2">
                  Get Full Access to Job Details
                </h3>
                <p className="text-blue-700 mb-4">
                  Sign up to view company information, specific locations, and place bids on available jobs. 
                  Join our community of qualified technicians and trainers.
                </p>
                <div className="flex gap-4 justify-center">
                  <Link href="/auth/signup">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Sign Up Now
                    </Button>
                  </Link>
                  <Link href="/auth/signin">
                    <Button variant="outline">
                      Sign In
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location-based Filters for Public Users */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="space-y-4">
                {/* Address Input with Geolocation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location (City, State)
                  </label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter city and state (e.g., Las Vegas, NV)"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleGetCurrentLocation}
                      variant="outline"
                      size="sm"
                      className="whitespace-nowrap"
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      Use My Location
                    </Button>
                  </div>
                  {/* Popular Cities Quick Select */}
                  <div className="mt-2 flex flex-wrap gap-2">
                    {[
                      'Las Vegas, NV', 'Los Angeles, CA', 'Phoenix, AZ', 
                      'Salt Lake City, UT', 'Denver, CO', 'Dallas, TX',
                      'Miami, FL', 'New York, NY', 'Chicago, IL'
                    ].map((city) => (
                      <button
                        key={city}
                        onClick={() => setSearchTerm(city)}
                        className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                          searchTerm === city
                            ? 'bg-blue-100 border-blue-300 text-blue-700'
                            : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Job Type and Radius */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                    <Select value={jobTypeFilter} onValueChange={handleJobTypeChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="tech">Equipment Service</SelectItem>
                        <SelectItem value="trainer">Training</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Radius (miles)</label>
                    <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="50 miles" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="25">25 miles</SelectItem>
                        <SelectItem value="50">50 miles</SelectItem>
                        <SelectItem value="100">100 miles</SelectItem>
                        <SelectItem value="200">200 miles</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button
                      onClick={handleResetFilters}
                      variant="outline"
                      className="w-full"
                    >
                      Reset Filters
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Jobs List - Public View (Optimized Cards) */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : filteredJobs.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">No jobs found in your selected area.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredJobs.map((job) => (
                <Card key={job.id} className="hover:shadow-md transition-shadow h-full">
                  <CardContent className="p-4">
                    <div className="h-full flex flex-col">
                      {/* Job Header */}
                      <div className="mb-3">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                          {job.title}
                        </h3>
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <Building2 className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="truncate">{job.model}</span>
                        </div>
                      </div>

                      {/* Location Info */}
                      <div className="flex items-center text-sm text-gray-600 mb-4">
                        <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span>{job.shipping_city}, {job.shipping_state}</span>
                      </div>



                      {/* Call to Action */}
                      <div className="mt-auto">
                        <Link href="/auth/signup" className="block">
                          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-sm py-2">
                            <UserPlus className="h-4 w-4 mr-2" />
                            Sign Up for Details
                          </Button>
                        </Link>
                        <p className="text-xs text-gray-500 text-center mt-2">
                          Create account to view company details & bid
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Authenticated user view
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Logo */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Image
                src="/logo.avif"
                alt="MedEquipTech"
                width={200}
                height={60}
                className="h-12 w-auto"
              />
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Available Jobs
            {userAccess.role_tech && !userAccess.role_trainer && ' (Technician Only)'}
            {userAccess.role_trainer && !userAccess.role_tech && ' (Trainer Only)'}
          </h1>
          <p className="text-muted-foreground">
            {userAccess.role_tech && !userAccess.role_trainer && 'Browse and bid on available equipment service jobs'}
            {userAccess.role_trainer && !userAccess.role_tech && 'Browse and bid on available training jobs'}
            {(!userAccess.role_tech && !userAccess.role_trainer) && 'Browse and bid on available equipment service jobs'}
          </p>
        </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          {/* Role-based filter notice */}
          {userAccess.role_tech && !userAccess.role_trainer && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> As a technician, you can only view and bid on equipment service jobs.
              </p>
            </div>
          )}
          {userAccess.role_trainer && !userAccess.role_tech && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>Note:</strong> As a trainer, you can only view and bid on training jobs.
              </p>
            </div>
          )}
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
              <Select 
                value={jobTypeFilter} 
                onValueChange={handleJobTypeChange}
                disabled={userAccess.role_tech && !userAccess.role_trainer || userAccess.role_trainer && !userAccess.role_tech}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  {(!userAccess.role_tech || userAccess.role_trainer) && (
                    <SelectItem value="all">All Types</SelectItem>
                  )}
                  {userAccess.role_tech && (
                    <SelectItem value="tech">Technician</SelectItem>
                  )}
                  {userAccess.role_trainer && (
                    <SelectItem value="trainer">Trainer</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={statusFilter} onValueChange={handleStatusChange}>
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

      {/* Jobs List - Authenticated View */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : filteredJobs.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">
              {userAccess.role_tech && !userAccess.role_trainer && 'No equipment service jobs found matching your criteria.'}
              {userAccess.role_trainer && !userAccess.role_tech && 'No training jobs found matching your criteria.'}
              {(!userAccess.role_tech && !userAccess.role_trainer) && 'No jobs found matching your criteria.'}
            </p>
            {userAccess.authenticated && (
              <p className="text-sm text-muted-foreground mt-2">
                {userAccess.role_tech && !userAccess.role_trainer && 'Only equipment service jobs are available for technicians.'}
                {userAccess.role_trainer && !userAccess.role_tech && 'Only training jobs are available for trainers.'}
              </p>
            )}
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
                          {job.bids ? `${job.bids.length} bids` : '0 bids'}
                        </div>
                      </div>
            </div>
          </div>
          
                  <div className="flex flex-col gap-2">
                    <Link href={`/jobs/${job.id}`}>
                      <Button variant="outline" className="w-full">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </Link>
                    {job.can_bid ? (
                      <Link href={`/jobs/${job.id}`}>
                        <Button className="w-full">
                          <DollarSign className="h-4 w-4 mr-2" />
                          Place Bid
                        </Button>
                      </Link>
                    ) : (
                      <Button variant="outline" className="w-full" disabled>
                        <Lock className="h-4 w-4 mr-2" />
                        {job.job_type === 'tech' ? 'Techs Only' : 'Trainers Only'}
                      </Button>
                    )}
                  </div>
          </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      </div>
    </div>
  )
}
