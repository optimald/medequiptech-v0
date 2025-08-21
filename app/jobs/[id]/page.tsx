'use client'

import { useAuth } from '@/lib/auth-context'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, MapPin, Calendar, Building2, User, AlertCircle, DollarSign, MessageSquare } from 'lucide-react'
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
  address_line1: string
  address_line2?: string
  zip: string
  contact_name: string
  contact_phone: string
  contact_email: string
  instructions_public: string
  instructions_private: string
  job_type: string
  created_at: string
  bids?: Array<{
    id: string
    ask_price: number
    bidder_id: string
    status: string
    created_at: string
    note?: string
    profiles?: {
      full_name: string
      base_city: string
      base_state: string
    }
  }>
}

export default function JobDetailPage() {
  const { user, isDemoUser, demoRole } = useAuth()
  const params = useParams()
  const router = useRouter()
  const jobId = params.id as string
  
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [showBidForm, setShowBidForm] = useState(false)
  const [bidAmount, setBidAmount] = useState('')
  const [bidNote, setBidNote] = useState('')
  const [submittingBid, setSubmittingBid] = useState(false)

  useEffect(() => {
    if (jobId) {
      fetchJobDetails()
    }
  }, [jobId])

  const fetchJobDetails = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/jobs/${jobId}/public`)
      if (response.ok) {
        const data = await response.json()
        setJob(data.job)
      } else {
        console.error('Failed to fetch job details')
      }
    } catch (error) {
      console.error('Error fetching job details:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!bidAmount || !user) return

    try {
      setSubmittingBid(true)
      const response = await fetch('/api/bids', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          job_id: jobId,
          ask_price: parseFloat(bidAmount),
          note: bidNote
        }),
      })

      if (response.ok) {
        // Refresh job details to show new bid
        await fetchJobDetails()
        setShowBidForm(false)
        setBidAmount('')
        setBidNote('')
        alert('Bid submitted successfully!')
      } else {
        const error = await response.json()
        alert(`Failed to submit bid: ${error.error}`)
      }
    } catch (error) {
      console.error('Error submitting bid:', error)
      alert('Failed to submit bid. Please try again.')
    } finally {
      setSubmittingBid(false)
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!job) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle>Job Not Found</CardTitle>
            <CardDescription>
              The job you're looking for doesn't exist or has been removed.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/jobs">
              <Button>Back to Jobs</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle>Please Log In</CardTitle>
            <CardDescription>
              You need to be logged in to view job details and place bids.
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
      <div className="mb-6">
        <Link href="/jobs" className="text-blue-600 hover:underline">
          ← Back to Jobs
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Job Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Header */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl mb-2">{job.title}</CardTitle>
                  <div className="flex items-center gap-2 mb-4">
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
                </div>
                {job.status === 'OPEN' && (
                  <Button 
                    onClick={() => setShowBidForm(!showBidForm)}
                    className="min-w-[120px]"
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    {showBidForm ? 'Cancel' : 'Place Bid'}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <Building2 className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="font-medium">Company:</span>
                    <span className="ml-2">{job.company_name}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="font-medium">Customer:</span>
                    <span className="ml-2">{job.customer_name}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="font-medium">Location:</span>
                    <span className="ml-2">{job.shipping_city}, {job.shipping_state}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="font-medium">MET Date:</span>
                    <span className="ml-2">{new Date(job.met_date).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="text-sm">
                    <span className="font-medium">Model:</span>
                    <span className="ml-2">{job.model}</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Address:</span>
                    <div className="ml-2 mt-1">
                      <div>{job.address_line1}</div>
                      {job.address_line2 && <div>{job.address_line2}</div>}
                      <div>{job.shipping_city}, {job.shipping_state} {job.zip}</div>
                    </div>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Contact:</span>
                    <div className="ml-2 mt-1">
                      <div>{job.contact_name}</div>
                      <div>{job.contact_phone}</div>
                      <div>{job.contact_email}</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Job Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Job Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Public Instructions:</h4>
                <p className="text-sm text-muted-foreground">{job.instructions_public}</p>
              </div>
              {job.instructions_private && (
                <div>
                  <h4 className="font-medium mb-2">Private Instructions:</h4>
                  <p className="text-sm text-muted-foreground">{job.instructions_private}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Bid Form */}
          {showBidForm && (
            <Card>
              <CardHeader>
                <CardTitle>Place Your Bid</CardTitle>
                <CardDescription>
                  Submit your bid for this job. Include your asking price and any relevant notes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBidSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="bidAmount" className="block text-sm font-medium mb-2">
                      Bid Amount ($)
                    </label>
                    <Input
                      id="bidAmount"
                      type="number"
                      step="0.01"
                      min="0"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      placeholder="Enter your bid amount"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="bidNote" className="block text-sm font-medium mb-2">
                      Notes (Optional)
                    </label>
                    <Textarea
                      id="bidNote"
                      value={bidNote}
                      onChange={(e) => setBidNote(e.target.value)}
                      placeholder="Add any relevant notes about your bid..."
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" disabled={submittingBid}>
                      {submittingBid ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        'Submit Bid'
                      )}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowBidForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Job Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Job Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <Badge className={getStatusColor(job.status)}>
                    {job.status}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Priority:</span>
                  <Badge className={getPriorityColor(job.priority)}>
                    {job.priority}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Type:</span>
                  <Badge variant="outline">
                    {job.job_type === 'tech' ? 'Technician' : 'Trainer'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Bids:</span>
                  <span className="font-medium">{job.bids?.length || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Bids */}
          {job.bids && job.bids.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Current Bids</CardTitle>
                <CardDescription>
                  {job.bids.length} bid{job.bids.length !== 1 ? 's' : ''} received
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {job.bids.map((bid) => (
                    <div key={bid.id} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-lg">${bid.ask_price}</span>
                        <Badge variant="outline" className="text-xs">
                          {bid.status}
                        </Badge>
                      </div>
                      {bid.profiles && (
                        <div className="text-sm text-muted-foreground">
                          {bid.profiles.full_name} • {bid.profiles.base_city}, {bid.profiles.base_state}
                        </div>
                      )}
                      {bid.note && (
                        <div className="text-sm mt-2 p-2 bg-muted rounded">
                          {bid.note}
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground mt-2">
                        {new Date(bid.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
