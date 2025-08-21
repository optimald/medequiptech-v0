'use client'

import { useAuth } from '@/lib/auth-context'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Loader2, AlertCircle, CheckCircle, GraduationCap, Users, Calendar, MapPin } from 'lucide-react'
import Link from 'next/link'

interface TrainerRequestForm {
  title: string
  training_type: string
  equipment_models: string
  staff_count: string
  priority: string
  training_description: string
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

export default function RequestTrainerPage() {
  const { user, isDemoUser, demoRole } = useAuth()
  const [formData, setFormData] = useState<TrainerRequestForm>({
    title: '',
    training_type: '',
    equipment_models: '',
    staff_count: '',
    priority: 'P2',
    training_description: '',
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

  const handleInputChange = (field: keyof TrainerRequestForm, value: string) => {
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
          job_type: 'trainer',
          title: formData.title,
          company_name: 'MedSpa Practice', // Will be updated with actual company name
          customer_name: formData.contact_name,
          model: formData.equipment_models,
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
          instructions_public: formData.training_description,
          instructions_private: formData.additional_notes,
          source_tag: 'medspa_trainer_request'
        }),
      })

      if (response.ok) {
        setSubmitted(true)
        setFormData({
          title: '',
          training_type: '',
          equipment_models: '',
          staff_count: '',
          priority: 'P2',
          training_description: '',
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
              You need to be logged in to request trainer services.
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
              Your trainer request has been submitted and will be reviewed by our team.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              We'll notify you once a trainer is assigned to your request.
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
        <h1 className="text-3xl font-bold mt-4 mb-2">Request Trainer Services</h1>
        <p className="text-muted-foreground">
          Submit a request for staff training, certification, or equipment operation training.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Trainer Request Form</CardTitle>
            <CardDescription>
              Fill out the form below to request training services for your staff.
              Our team will review your request and assign an appropriate trainer.
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
                    Training Request Title *
                  </label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g., BBL Hero Staff Training"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="training_type" className="block text-sm font-medium mb-2">
                    Training Type *
                  </label>
                  <Select value={formData.training_type} onValueChange={(value) => handleInputChange('training_type', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select training type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new_staff">New Staff Training</SelectItem>
                      <SelectItem value="refresher">Refresher Training</SelectItem>
                      <SelectItem value="certification">Certification Training</SelectItem>
                      <SelectItem value="safety">Safety Protocol Training</SelectItem>
                      <SelectItem value="advanced">Advanced Techniques</SelectItem>
                      <SelectItem value="custom">Custom Training</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="equipment_models" className="block text-sm font-medium mb-2">
                    Equipment Models *
                  </label>
                  <Input
                    id="equipment_models"
                    value={formData.equipment_models}
                    onChange={(e) => handleInputChange('equipment_models', e.target.value)}
                    placeholder="e.g., BBL Hero, Picosure, VBeam Perfecta"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="staff_count" className="block text-sm font-medium mb-2">
                    Number of Staff *
                  </label>
                  <Select value={formData.staff_count} onValueChange={(value) => handleInputChange('staff_count', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select staff count" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-2">1-2 staff members</SelectItem>
                      <SelectItem value="3-5">3-5 staff members</SelectItem>
                      <SelectItem value="6-10">6-10 staff members</SelectItem>
                      <SelectItem value="10+">10+ staff members</SelectItem>
                    </SelectContent>
                  </Select>
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
                          <span className="text-sm text-muted-foreground">Immediate need</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="P1">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-orange-100 text-orange-800">P1 - High</Badge>
                          <span className="text-sm text-muted-foreground">Within 1 week</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="P2">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-yellow-100 text-yellow-800">P2 - Normal</Badge>
                          <span className="text-sm text-muted-foreground">Within 2-4 weeks</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label htmlFor="preferred_date" className="block text-sm font-medium mb-2">
                    Preferred Training Date *
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

              {/* Training Description */}
              <div>
                <label htmlFor="training_description" className="block text-sm font-medium mb-2">
                  Training Requirements *
                </label>
                <Textarea
                  id="training_description"
                  value={formData.training_description}
                  onChange={(e) => handleInputChange('training_description', e.target.value)}
                  placeholder="Please describe the specific training needs, skills to be covered, and any particular focus areas..."
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

              {/* Training Location */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Training Location</h3>
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
                  placeholder="Any additional information about your training needs, scheduling preferences, or special requirements..."
                  rows={3}
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-6 border-t">
                <Link href="/dashboard">
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
                    'Submit Trainer Request'
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
