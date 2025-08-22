'use client'

import { useAuth } from '@/lib/auth-context'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, MapPin, Calendar, Building2, User, DollarSign, MessageSquare, Award, CheckCircle, X } from 'lucide-react'
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
  awarded_to?: string
  awarded_at?: string
}

interface Bid {
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
    role_tech: boolean
    role_trainer: boolean
  }
}

interface Award {
  id: string
  job_id: string
  bid_id: string
  awarded_user_id: string
  awarded_by: string
  award_amount: number
  notes?: string
  status: string
  created_at: string
}

export default function AdminJobDetailPage() {
  const { user } = useAuth()
  const params = useParams()
  const router = useRouter()
  const jobId = params.id as string
  
  const [job, setJob] = useState<Job | null>(null)
  const [bids, setBids] = useState<Bid[]>([])
  const [awards, setAwards] = useState<Award[]>([])
  const [loading, setLoading] = useState(true)
  const [showAwardModal, setShowAwardModal] = useState(false)
  const [selectedBid, setSelectedBid] = useState<Bid | null>(null)
  const [awardNotes, setAwardNotes] = useState('')
  const [awarding, setAwarding] = useState(false)

  useEffect(() => {
    if (jobId) {
      fetchJobDetails()
    }
  }, [jobId])

  const fetchJobDetails = async () => {
    try {
      setLoading(true)
      
      // Fetch job details
      const jobResponse = await fetch(`/api/jobs/${jobId}`)
      if (jobResponse.ok) {
        const jobData = await jobResponse.json()
        setJob(jobData.job)
      }
      
      // Fetch bids
      const bidsResponse = await fetch(`/api/jobs/${jobId}/bids`)
      if (bidsResponse.ok) {
        const bidsData = await bidsResponse.json()
        setBids(bidsData.bids || [])
      }
      
      // Fetch awards
      const awardsResponse = await fetch(`/api/jobs/${jobId}/awards`)
      if (awardsResponse.ok) {
        const awardsData = await awardsResponse.json()
        setAwards(awardsData.awards || [])
      }
    } catch (error) {
      console.error('Error fetching job details:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAwardJob = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedBid || !job) return

    setAwarding(true)
    try {
      const response = await fetch(`/api/jobs/${jobId}/award`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bid_id: selectedBid.id,
          awarded_user_id: selectedBid.bidder_id,
          notes: awardNotes
        }),
      })

      if (response.ok) {
        // Refresh job details
        await fetchJobDetails()
        setShowAwardModal(false)
        setSelectedBid(null)
        setAwardNotes('')
        alert('Job awarded successfully!')
      } else {
        const error = await response.json()
        alert(`Failed to award job: ${error.error}`)
      }
    } catch (error) {
      console.error('Error awarding job:', error)
      alert('Failed to award job. Please try again.')
    } finally {
      setAwarding(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'P0': return 'bg-red-100 text-red-800'
      case 'P1': return 'bg-orange-100 text-orange-800'
      case 'P2': return 'bg-yellow-100 text-yellow-800'
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
            <Link href="/admin/jobs">
              <Button>Back to Jobs</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const activeBids = bids.filter(bid => bid.status === 'submitted')
  const hasActiveAward = awards.some(award => award.status === 'active')

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/admin/jobs" className="text-blue-600 hover:underline">
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
                {job.status === 'BIDDING' && activeBids.length > 0 && !hasActiveAward && (
                  <Button 
                    onClick={() => setShowAwardModal(true)}
                    className="min-w-[120px]"
                  >
                    <Award className="h-4 w-4 mr-2" />
                    Award Job
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
                  <span className="font-medium">{activeBids.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Bids */}
          {activeBids.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Current Bids</CardTitle>
                <CardDescription>
                  {activeBids.length} active bid{activeBids.length !== 1 ? 's' : ''}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activeBids.map((bid) => (
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

          {/* Awards History */}
          {awards.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Awards History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {awards.map((award) => (
                    <div key={award.id} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-lg">${award.award_amount}</span>
                        <Badge className={award.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {award.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Awarded on {new Date(award.created_at).toLocaleDateString()}
                      </div>
                      {award.notes && (
                        <div className="text-sm mt-2 p-2 bg-muted rounded">
                          {award.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Award Job Modal */}
      {showAwardModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Award Job</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAwardModal(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <form onSubmit={handleAwardJob} className="space-y-4">
              <div>
                <Label htmlFor="bidSelect">Select Bid</Label>
                <Select
                  value={selectedBid?.id || ''}
                  onValueChange={(value) => {
                    const bid = activeBids.find(b => b.id === value)
                    setSelectedBid(bid || null)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a bid to award" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeBids.map((bid) => (
                      <SelectItem key={bid.id} value={bid.id}>
                        ${bid.ask_price} - {bid.profiles?.full_name || 'Unknown Bidder'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="awardNotes">Award Notes (Optional)</Label>
                <Textarea
                  id="awardNotes"
                  value={awardNotes}
                  onChange={(e) => setAwardNotes(e.target.value)}
                  placeholder="Add any notes about this award..."
                  rows={3}
                />
              </div>
              
              <div className="flex gap-2">
                <Button type="submit" disabled={!selectedBid || awarding}>
                  {awarding ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Awarding...
                    </>
                  ) : (
                    <>
                      <Award className="h-4 w-4 mr-2" />
                      Award Job
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAwardModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
