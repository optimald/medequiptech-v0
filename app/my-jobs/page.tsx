'use client'

import { useAuth } from '@/lib/auth-context'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, Calendar, MapPin, DollarSign, Clock, CheckCircle, AlertCircle, PlayCircle } from 'lucide-react'
import Link from 'next/link'

interface AwardedJob {
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
  address_line1: string
  address_line2?: string
  zip: string
  contact_name: string
  contact_phone: string
  contact_email: string
  instructions_public: string
  instructions_private: string
  created_at: string
  awarded_at?: string
  completed_at?: string
  bid_amount?: number
}

export default function MyJobsPage() {
  const { user, isDemoUser, demoRole } = useAuth()
  const [jobs, setJobs] = useState<AwardedJob[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('upcoming')

  useEffect(() => {
    if (user) {
      fetchMyJobs()
    }
  }, [user])

  const fetchMyJobs = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/users/my-jobs')
      if (response.ok) {
        const data = await response.json()
        setJobs(data.jobs || [])
      } else {
        console.error('Failed to fetch my jobs')
      }
    } catch (error) {
      console.error('Error fetching my jobs:', error)
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
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800'
      case 'COMPLETED': return 'bg-green-100 text-green-800'
      case 'UPCOMING': return 'bg-purple-100 text-purple-800'
      case 'ON_HOLD': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS': return <PlayCircle className="h-4 w-4" />
      case 'COMPLETED': return <CheckCircle className="h-4 w-4" />
      case 'UPCOMING': return <Clock className="h-4 w-4" />
      case 'ON_HOLD': return <AlertCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const filterJobsByStatus = (status: string) => {
    return jobs.filter(job => job.status === status)
  }

  const updateJobStatus = async (jobId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/jobs/${jobId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        // Refresh jobs
        await fetchMyJobs()
      } else {
        console.error('Failed to update job status')
      }
    } catch (error) {
      console.error('Error updating job status:', error)
    }
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle>Please Log In</CardTitle>
            <CardDescription>
              You need to be logged in to view your jobs.
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

  const upcomingJobs = filterJobsByStatus('UPCOMING')
  const inProgressJobs = filterJobsByStatus('IN_PROGRESS')
  const completedJobs = filterJobsByStatus('COMPLETED')
  const onHoldJobs = filterJobsByStatus('ON_HOLD')

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/dashboard" className="text-blue-600 hover:underline">
          ← Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold mt-4 mb-2">My Jobs</h1>
        <p className="text-muted-foreground">
          Manage your awarded {isDemoUser ? (demoRole === 'technician' ? 'technician' : 'trainer') : 'service'} jobs
        </p>
      </div>

      {/* Job Status Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingJobs.length}</div>
            <p className="text-xs text-muted-foreground">
              Scheduled jobs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <PlayCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressJobs.length}</div>
            <p className="text-xs text-muted-foreground">
              Currently working
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On Hold</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{onHoldJobs.length}</div>
            <p className="text-xs text-muted-foreground">
              Paused jobs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedJobs.length}</div>
            <p className="text-xs text-muted-foreground">
              Finished jobs
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Job Management Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="upcoming">Upcoming ({upcomingJobs.length})</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress ({inProgressJobs.length})</TabsTrigger>
          <TabsTrigger value="on-hold">On Hold ({onHoldJobs.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedJobs.length})</TabsTrigger>
        </TabsList>

        {/* Upcoming Jobs */}
        <TabsContent value="upcoming" className="space-y-4">
          {upcomingJobs.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">No upcoming jobs scheduled.</p>
              </CardContent>
            </Card>
          ) : (
            upcomingJobs.map((job) => (
              <JobCard 
                key={job.id} 
                job={job} 
                onStatusUpdate={updateJobStatus}
                showActions={true}
              />
            ))
          )}
        </TabsContent>

        {/* In Progress Jobs */}
        <TabsContent value="in-progress" className="space-y-4">
          {inProgressJobs.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">No jobs currently in progress.</p>
              </CardContent>
            </Card>
          ) : (
            inProgressJobs.map((job) => (
              <JobCard 
                key={job.id} 
                job={job} 
                onStatusUpdate={updateJobStatus}
                showActions={true}
              />
            ))
          )}
        </TabsContent>

        {/* On Hold Jobs */}
        <TabsContent value="on-hold" className="space-y-4">
          {onHoldJobs.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">No jobs currently on hold.</p>
              </CardContent>
            </Card>
          ) : (
            onHoldJobs.map((job) => (
              <JobCard 
                key={job.id} 
                job={job} 
                onStatusUpdate={updateJobStatus}
                showActions={true}
              />
            ))
          )}
        </TabsContent>

        {/* Completed Jobs */}
        <TabsContent value="completed" className="space-y-4">
          {completedJobs.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">No completed jobs yet.</p>
              </CardContent>
            </Card>
          ) : (
            completedJobs.map((job) => (
              <JobCard 
                key={job.id} 
                job={job} 
                onStatusUpdate={updateJobStatus}
                showActions={false}
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Job Card Component
function JobCard({ 
  job, 
  onStatusUpdate, 
  showActions 
}: { 
  job: AwardedJob
  onStatusUpdate: (jobId: string, status: string) => void
  showActions: boolean
}) {
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
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800'
      case 'COMPLETED': return 'bg-green-100 text-green-800'
      case 'UPCOMING': return 'bg-purple-100 text-purple-800'
      case 'ON_HOLD': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS': return <PlayCircle className="h-4 w-4" />
      case 'COMPLETED': return <CheckCircle className="h-4 w-4" />
      case 'UPCOMING': return <Clock className="h-4 w-4" />
      case 'ON_HOLD': return <AlertCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
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
                  <div className="flex items-center gap-1">
                    {getStatusIcon(job.status)}
                    {job.status.replace('_', ' ')}
                  </div>
                </Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2" />
                  {job.shipping_city}, {job.shipping_state}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  MET: {new Date(job.met_date).toLocaleDateString()}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Bid: ${job.bid_amount || 'N/A'}
                </div>
                <div className="text-sm text-muted-foreground">
                  Model: {job.model}
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              {job.instructions_public}
            </p>

            <div className="text-sm text-muted-foreground">
              <strong>Contact:</strong> {job.contact_name} • {job.contact_phone} • {job.contact_email}
            </div>
          </div>

          {showActions && (
            <div className="flex flex-col gap-2 min-w-[140px]">
              {job.status === 'UPCOMING' && (
                <>
                  <Button 
                    onClick={() => onStatusUpdate(job.id, 'IN_PROGRESS')}
                    className="w-full"
                  >
                    Start Job
                  </Button>
                  <Button 
                    onClick={() => onStatusUpdate(job.id, 'ON_HOLD')}
                    variant="outline"
                    className="w-full"
                  >
                    Put On Hold
                  </Button>
                </>
              )}
              
              {job.status === 'IN_PROGRESS' && (
                <>
                  <Button 
                    onClick={() => onStatusUpdate(job.id, 'COMPLETED')}
                    className="w-full"
                  >
                    Mark Complete
                  </Button>
                  <Button 
                    onClick={() => onStatusUpdate(job.id, 'ON_HOLD')}
                    variant="outline"
                    className="w-full"
                  >
                    Put On Hold
                  </Button>
                </>
              )}
              
              {job.status === 'ON_HOLD' && (
                <>
                  <Button 
                    onClick={() => onStatusUpdate(job.id, 'IN_PROGRESS')}
                    className="w-full"
                  >
                    Resume Job
                  </Button>
                  <Button 
                    onClick={() => onStatusUpdate(job.id, 'UPCOMING')}
                    variant="outline"
                    className="w-full"
                  >
                    Reschedule
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
