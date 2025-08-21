'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Mail, Users, Target, Send, Eye } from 'lucide-react'

interface Campaign {
  id: string
  subject: string
  template_key: string
  segment_json: any
  recipients_count: number
  jobs_count: number
  status: string
  created_at: string
}

export default function AdminEmailPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [previewData, setPreviewData] = useState<any>(null)
  const [sending, setSending] = useState(false)

  // Campaign form state
  const [campaignForm, setCampaignForm] = useState({
    subject: '',
    template_key: 'bulk_jobs_blast',
    segment_json: {
      job_type: '',
      states: [],
      cities: [],
      min_radius: 0
    },
    job_ids: []
  })

  useEffect(() => {
    fetchCampaigns()
  }, [])

  const fetchCampaigns = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/email/bulk')
      if (response.ok) {
        const data = await response.json()
        setCampaigns(data.campaigns || [])
      } else {
        setError('Failed to fetch campaigns')
      }
    } catch (error) {
      setError('Failed to fetch campaigns')
    } finally {
      setLoading(false)
    }
  }

  const handleSegmentChange = (field: string, value: any) => {
    setCampaignForm(prev => ({
      ...prev,
      segment_json: {
        ...prev.segment_json,
        [field]: value
      }
    }))
  }

  const previewCampaign = async () => {
    try {
      const response = await fetch('/api/email/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...campaignForm,
          preview_only: true
        })
      })

      if (response.ok) {
        const data = await response.json()
        setPreviewData(data.preview)
      } else {
        const data = await response.json()
        setError(`Preview failed: ${data.error}`)
      }
    } catch (error) {
      setError('Failed to preview campaign')
    }
  }

  const sendCampaign = async () => {
    try {
      setSending(true)
      const response = await fetch('/api/email/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...campaignForm,
          preview_only: false
        })
      })

      if (response.ok) {
        const data = await response.json()
        setError('')
        setPreviewData(null)
        // Reset form
        setCampaignForm({
          subject: '',
          template_key: 'bulk_jobs_blast',
          segment_json: {
            job_type: '',
            states: [],
            cities: [],
            min_radius: 0
          },
          job_ids: []
        })
        // Refresh campaigns list
        fetchCampaigns()
      } else {
        const data = await response.json()
        setError(`Send failed: ${data.error}`)
      }
    } catch (error) {
      setError('Failed to send campaign')
    } finally {
      setSending(false)
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
        <h1 className="text-3xl font-bold mb-2">Bulk Email Campaigns</h1>
        <p className="text-muted-foreground">
          Send curated email campaigns to approved users
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Create Campaign Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Mail className="h-5 w-5" />
              <span>Create New Campaign</span>
            </CardTitle>
            <CardDescription>
              Configure your email campaign targeting and content
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Email Subject</Label>
              <Input
                id="subject"
                placeholder="Enter email subject..."
                value={campaignForm.subject}
                onChange={(e) => setCampaignForm(prev => ({ ...prev, subject: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="template">Email Template</Label>
              <Select 
                value={campaignForm.template_key} 
                onValueChange={(value) => setCampaignForm(prev => ({ ...prev, template_key: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bulk_jobs_blast">Bulk Jobs Blast</SelectItem>
                  <SelectItem value="new_jobs_alert">New Jobs Alert</SelectItem>
                  <SelectItem value="reminder_to_bid">Reminder to Bid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Targeting</Label>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="job_type" className="text-sm">Job Type</Label>
                  <Select 
                    value={campaignForm.segment_json.job_type || "all"} 
                    onValueChange={(value) => handleSegmentChange('job_type', value === 'all' ? '' : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All job types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All job types</SelectItem>
                      <SelectItem value="tech">Technician jobs only</SelectItem>
                      <SelectItem value="trainer">Trainer jobs only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="min_radius" className="text-sm">Minimum Service Radius (miles)</Label>
                  <Input
                    id="min_radius"
                    type="number"
                    placeholder="0"
                    value={campaignForm.segment_json.min_radius}
                    onChange={(e) => handleSegmentChange('min_radius', parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button
                onClick={previewCampaign}
                variant="outline"
                className="flex-1"
                disabled={!campaignForm.subject}
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              
              <Button
                onClick={sendCampaign}
                disabled={!campaignForm.subject || sending}
                className="flex-1"
              >
                {sending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                Send Campaign
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Preview or Campaign History */}
        <div className="space-y-6">
          {previewData ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Campaign Preview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Subject: {campaignForm.subject}</h4>
                    <p className="text-sm text-muted-foreground">
                      Template: {campaignForm.template_key}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{previewData.total_recipients}</div>
                      <div className="text-sm text-blue-800">Recipients</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{previewData.total_jobs}</div>
                      <div className="text-sm text-green-800">Jobs</div>
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    <p><strong>Targeting:</strong></p>
                    <ul className="list-disc list-inside space-y-1 mt-1">
                      {campaignForm.segment_json.job_type && (
                        <li>Job type: {campaignForm.segment_json.job_type}</li>
                      )}
                      {campaignForm.segment_json.min_radius > 0 && (
                        <li>Min service radius: {campaignForm.segment_json.min_radius} miles</li>
                      )}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Recent Campaigns</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {campaigns.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No campaigns sent yet
                  </p>
                ) : (
                  <div className="space-y-3">
                    {campaigns.slice(0, 5).map((campaign) => (
                      <div key={campaign.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{campaign.subject}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(campaign.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{campaign.recipients_count}</div>
                          <div className="text-xs text-muted-foreground">recipients</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
