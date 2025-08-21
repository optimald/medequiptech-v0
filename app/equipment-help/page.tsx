'use client'

import { useAuth } from '@/lib/auth-context'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Loader2, AlertCircle, CheckCircle, Building2, User, MapPin, Calendar } from 'lucide-react'
import Link from 'next/link'

interface EquipmentHelpForm {
  title: string
  model: string
  priority: string
  issue_description: string
  contact_name: string
  contact_phone: string
  contact_email: string
  address_line1: string
  address_line2: string
  city: string
  state: string
  zip: string
  preferred_date: string
  additional_notes: string
}

export default function EquipmentHelpPage() {
  const { user, isDemoUser, demoRole } = useAuth()
  const [formData, setFormData] = useState<EquipmentHelpForm>({
    title: '',
    model: '',
    priority: 'P2',
    issue_description: '',
    contact_name: '',
    contact_phone: '',
    contact_email: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    zip: '',
    preferred_date: '',
    additional_notes: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (field: keyof EquipmentHelpForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          job_type: 'tech',
          title: formData.title,
          company_name: 'MedSpa Practice', // Will be updated with actual company name
          customer_name: formData.contact_name,
          model: formData.model,
          priority: formData.priority,
          status: 'OPEN',
          met_date: formData.preferred_date,
          shipping_city: formData.city,
          shipping_state: formData.state,
          address_line1: formData.address_line1,
          address_line2: formData.address_line2,
          zip: formData.zip,
          contact_name: formData.contact_name,
          contact_phone: formData.contact_phone,
          contact_email: formData.contact_email,
          instructions_public: formData.issue_description,
          instructions_private: formData.additional_notes,
          source_tag: 'medspa_request'
        }),
      })

      if (response.ok) {
        setSubmitted(true)
        setFormData({
          title: '',
          model: '',
          priority: 'P2',
          issue_description: '',
          contact_name: '',
          contact_phone: '',
          contact_email: '',
          address_line1: '',
          address_line2: '',
          city: '',
          state: '',
          zip: '',
          preferred_date: '',
          additional_notes: ''
        })
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to submit request')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle>Please Log In</CardTitle>
            <CardDescription>
              You need to be logged in to request equipment help.
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

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <CardTitle className="text-2xl">Request Submitted Successfully!</CardTitle>
            <CardDescription>
              Your equipment help request has been submitted and will be reviewed by our team.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              We'll notify you once a technician is assigned to your request.
            </p>
            <div className="flex gap-2 justify-center">
              <Link href="/dashboard">
                <Button variant="outline">Back to Dashboard</Button>
              </Link>
              <Button onClick={() => setSubmitted(false)}>
                Submit Another Request
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/dashboard" className="text-blue-600 hover:underline">
          ← Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold mt-4 mb-2">Request Equipment Help</h1>
        <p className="text-muted-foreground">
          Submit a request for laser equipment repair, maintenance, or technical support.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Equipment Help Request Form</CardTitle>
            <CardDescription>
              Fill out the form below to request technical assistance for your laser equipment.
              Our team will review your request and assign an appropriate technician.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Display */}
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <span className="text-red-700">{error}</span>
                </div>
              )}

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium mb-2">
                    Request Title *
                  </label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g., VBeam Perfecta Maintenance"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="model" className="block text-sm font-medium mb-2">
                    Equipment Model *
                  </label>
                  <Input
                    id="model"
                    value={formData.model}
                    onChange={(e) => handleInputChange('model', e.target.value)}
                    placeholder="e.g., VBeam Perfecta, GentleMax Pro"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="priority" className="block text-sm font-medium mb-2">
                    Priority Level *
                  </label>
                  <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="P0">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-red-100 text-red-800">P0 - Critical</Badge>
                          <span className="text-sm text-muted-foreground">Equipment down, urgent</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="P1">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-orange-100 text-orange-800">P1 - High</Badge>
                          <span className="text-sm text-muted-foreground">Affecting operations</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="P2">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-yellow-100 text-yellow-800">P2 - Normal</Badge>
                          <span className="text-sm text-muted-foreground">Scheduled maintenance</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label htmlFor="preferred_date" className="block text-sm font-medium mb-2">
                    Preferred Service Date *
                  </label>
                  <Input
                    id="preferred_date"
                    type="date"
                    value={formData.preferred_date}
                    onChange={(e) => handleInputChange('preferred_date', e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Issue Description */}
              <div>
                <label htmlFor="issue_description" className="block text-sm font-medium mb-2">
                  Describe the Issue *
                </label>
                <Textarea
                  id="issue_description"
                  value={formData.issue_description}
                  onChange={(e) => handleInputChange('issue_description', e.target.value)}
                  placeholder="Please describe the problem with your equipment, any error messages, and what you've already tried..."
                  rows={4}
                  required
                />
              </div>

              {/* Contact Information */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="contact_name" className="block text-sm font-medium mb-2">
                      Contact Name *
                    </label>
                    <Input
                      id="contact_name"
                      value={formData.contact_name}
                      onChange={(e) => handleInputChange('contact_name', e.target.value)}
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="contact_phone" className="block text-sm font-medium mb-2">
                      Phone Number *
                    </label>
                    <Input
                      id="contact_phone"
                      value={formData.contact_phone}
                      onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                      placeholder="(555) 123-4567"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="contact_email" className="block text-sm font-medium mb-2">
                      Email Address *
                    </label>
                    <Input
                      id="contact_email"
                      type="email"
                      value={formData.contact_email}
                      onChange={(e) => handleInputChange('contact_email', e.target.value)}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Service Location */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Service Location</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="address_line1" className="block text-sm font-medium mb-2">
                      Street Address *
                    </label>
                    <Input
                      id="address_line1"
                      value={formData.address_line1}
                      onChange={(e) => handleInputChange('address_line1', e.target.value)}
                      placeholder="123 Main Street"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="address_line2" className="block text-sm font-medium mb-2">
                      Suite/Unit (Optional)
                    </label>
                    <Input
                      id="address_line2"
                      value={formData.address_line2}
                      onChange={(e) => handleInputChange('address_line2', e.target.value)}
                      placeholder="Suite 100"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium mb-2">
                      City *
                    </label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="City"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium mb-2">
                      State *
                    </label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      placeholder="State"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="zip" className="block text-sm font-medium mb-2">
                      ZIP Code *
                    </label>
                    <Input
                      id="zip"
                      value={formData.zip}
                      onChange={(e) => handleInputChange('zip', e.target.value)}
                      placeholder="12345"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <label htmlFor="additional_notes" className="block text-sm font-medium mb-2">
                  Additional Notes (Optional)
                </label>
                <Textarea
                  id="additional_notes"
                  value={formData.additional_notes}
                  onChange={(e) => handleInputChange('additional_notes', e.target.value)}
                  placeholder="Any additional information that might be helpful for our technicians..."
                  rows={3}
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-6 border-t">
                <Link href={
                  user && (isDemoUser ? demoRole === 'medspa' : user.user_metadata?.role === 'medspa') 
                    ? "/dashboard" 
                    : "/"
                }>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" disabled={submitting} className="flex-1">
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting Request...
                    </>
                  ) : (
                    'Submit Equipment Help Request'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
