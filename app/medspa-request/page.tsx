'use client'

import { useAuth } from '@/lib/auth-context'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, AlertCircle, CheckCircle, Building2, User, MapPin, Calendar, GraduationCap, Users, Wrench } from 'lucide-react'
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

interface SignUpForm {
  full_name: string
  email: string
  password: string
  confirm_password: string
  company_name: string
  phone: string
  address_line1: string
  address_line2: string
  city: string
  state: string
  zip: string
}

export default function MedSpaRequestPage() {
  const { user, signUp, signIn } = useAuth()
  const [activeTab, setActiveTab] = useState<'equipment' | 'training'>('equipment')
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup')
  
  // Equipment help form state
  const [equipmentForm, setEquipmentForm] = useState<EquipmentHelpForm>({
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

  // Trainer request form state
  const [trainerForm, setTrainerForm] = useState<TrainerRequestForm>({
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

  // Sign up form state
  const [signUpForm, setSignUpForm] = useState<SignUpForm>({
    full_name: '',
    email: '',
    password: '',
    confirm_password: '',
    company_name: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    zip: ''
  })

  // Sign in form state
  const [signInForm, setSignInForm] = useState({
    email: '',
    password: ''
  })

  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleEquipmentInputChange = (field: keyof EquipmentHelpForm, value: string) => {
    setEquipmentForm(prev => ({ ...prev, [field]: value }))
  }

  const handleTrainerInputChange = (field: keyof TrainerRequestForm, value: string) => {
    setTrainerForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSignUpInputChange = (field: keyof SignUpForm, value: string) => {
    setSignUpForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSignInInputChange = (field: 'email' | 'password', value: string) => {
    setSignInForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccess('')

    if (signUpForm.password !== signUpForm.confirm_password) {
      setError('Passwords do not match')
      setSubmitting(false)
      return
    }

    try {
      const result = await signUp(signUpForm.email, signUpForm.password, 'medspa')
      
      if (result.success) {
        setSuccess('Account created successfully! You can now submit your request.')
        // Pre-fill the forms with the signup data
        setEquipmentForm(prev => ({
          ...prev,
          contact_name: signUpForm.full_name,
          contact_email: signUpForm.email,
          contact_phone: signUpForm.phone,
          address_line1: signUpForm.address_line1,
          address_line2: signUpForm.address_line2,
          city: signUpForm.city,
          state: signUpForm.state,
          zip: signUpForm.zip
        }))
        setTrainerForm(prev => ({
          ...prev,
          contact_name: signUpForm.full_name,
          contact_email: signUpForm.email,
          contact_phone: signUpForm.phone,
          address_line1: signUpForm.address_line1,
          address_line2: signUpForm.address_line2,
          city: signUpForm.city,
          state: signUpForm.state,
          zip: signUpForm.zip
        }))
      } else {
        setError(result.error || 'Failed to create account')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccess('')

    try {
      const result = await signIn(signInForm.email, signInForm.password)
      
      if (result.success) {
        setSuccess('Signed in successfully! You can now submit your request.')
      } else {
        setError(result.error || 'Invalid credentials')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEquipmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      setError('Please sign in or create an account first')
      return
    }

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
          title: equipmentForm.title,
          company_name: user.user_metadata?.company_name || 'MedSpa Practice',
          customer_name: equipmentForm.contact_name,
          model: equipmentForm.model,
          priority: equipmentForm.priority,
          status: 'OPEN',
          met_date: equipmentForm.preferred_date,
          shipping_city: equipmentForm.city,
          shipping_state: equipmentForm.state,
          address_line1: equipmentForm.address_line1,
          address_line2: equipmentForm.address_line2,
          zip: equipmentForm.zip,
          contact_name: equipmentForm.contact_name,
          contact_phone: equipmentForm.contact_phone,
          contact_email: equipmentForm.contact_email,
          instructions_public: equipmentForm.issue_description,
          instructions_private: equipmentForm.additional_notes,
          source_tag: 'medspa_request'
        }),
      })

      if (response.ok) {
        setSubmitted(true)
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

  const handleTrainerSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      setError('Please sign in or create an account first')
      return
    }

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
          title: trainerForm.title,
          company_name: user.user_metadata?.company_name || 'MedSpa Practice',
          customer_name: trainerForm.contact_name,
          model: trainerForm.equipment_models,
          priority: trainerForm.priority,
          status: 'OPEN',
          met_date: trainerForm.preferred_date,
          shipping_city: trainerForm.city,
          shipping_state: trainerForm.state,
          address_line1: trainerForm.address_line1,
          address_line2: trainerForm.address_line2,
          zip: trainerForm.zip,
          contact_name: trainerForm.contact_name,
          contact_phone: trainerForm.contact_phone,
          contact_email: trainerForm.contact_email,
          instructions_public: trainerForm.training_description,
          instructions_private: trainerForm.additional_notes,
          source_tag: 'medspa_trainer_request'
        }),
      })

      if (response.ok) {
        setSubmitted(true)
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

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <CardTitle className="text-2xl">Request Submitted Successfully!</CardTitle>
            <CardDescription>
              Your request has been submitted and will be reviewed by our team.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              We'll notify you once a technician or trainer is assigned to your request.
            </p>
            <div className="flex gap-2 justify-center">
              <Button onClick={() => setSubmitted(false)}>
                Submit Another Request
              </Button>
              <Link href="/dashboard">
                <Button variant="outline">Go to Dashboard</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/" className="text-blue-600 hover:underline">
          ← Back to Home
        </Link>
        <h1 className="text-3xl font-bold mt-4 mb-2">MedSpa Services Request</h1>
        <p className="text-muted-foreground">
          Get equipment help or request training for your MedSpa practice.
        </p>
      </div>

      <div className="max-w-6xl mx-auto">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'equipment' | 'training')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="equipment" className="flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              Equipment Help
            </TabsTrigger>
            <TabsTrigger value="training" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Training Request
            </TabsTrigger>
          </TabsList>

          <TabsContent value="equipment" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5" />
                  Equipment Help Request
                </CardTitle>
                <CardDescription>
                  Submit a request for laser equipment repair, maintenance, or technical support.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!user ? (
                  <div className="space-y-6">
                    <div className="text-center py-4">
                      <p className="text-muted-foreground mb-4">
                        Please sign in or create an account to submit your equipment help request.
                      </p>
                      
                      <Tabs value={authMode} onValueChange={(value) => setAuthMode(value as 'signin' | 'signup')} className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="signup">Create Account</TabsTrigger>
                          <TabsTrigger value="signin">Sign In</TabsTrigger>
                        </TabsList>

                        <TabsContent value="signup" className="mt-4">
                          <form onSubmit={handleSignUp} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium">Full Name *</label>
                                <Input
                                  type="text"
                                  value={signUpForm.full_name}
                                  onChange={(e) => handleSignUpInputChange('full_name', e.target.value)}
                                  required
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium">Email *</label>
                                <Input
                                  type="email"
                                  value={signUpForm.email}
                                  onChange={(e) => handleSignUpInputChange('email', e.target.value)}
                                  required
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium">Password *</label>
                                <Input
                                  type="password"
                                  value={signUpForm.password}
                                  onChange={(e) => handleSignUpInputChange('password', e.target.value)}
                                  required
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium">Confirm Password *</label>
                                <Input
                                  type="password"
                                  value={signUpForm.confirm_password}
                                  onChange={(e) => handleSignUpInputChange('confirm_password', e.target.value)}
                                  required
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium">Company Name *</label>
                                <Input
                                  type="text"
                                  value={signUpForm.company_name}
                                  onChange={(e) => handleSignUpInputChange('company_name', e.target.value)}
                                  required
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium">Phone *</label>
                                <Input
                                  type="tel"
                                  value={signUpForm.phone}
                                  onChange={(e) => handleSignUpInputChange('phone', e.target.value)}
                                  required
                                />
                              </div>
                            </div>
                            
                            <div className="space-y-4">
                              <div>
                                <label className="text-sm font-medium">Address Line 1 *</label>
                                <Input
                                  type="text"
                                  value={signUpForm.address_line1}
                                  onChange={(e) => handleSignUpInputChange('address_line1', e.target.value)}
                                  required
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium">Address Line 2</label>
                                <Input
                                  type="text"
                                  value={signUpForm.address_line2}
                                  onChange={(e) => handleSignUpInputChange('address_line2', e.target.value)}
                                />
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <label className="text-sm font-medium">City *</label>
                                  <Input
                                    type="text"
                                    value={signUpForm.city}
                                    onChange={(e) => handleSignUpInputChange('city', e.target.value)}
                                    required
                                  />
                                </div>
                                <div>
                                  <label className="text-sm font-medium">State *</label>
                                  <Input
                                    type="text"
                                    value={signUpForm.city}
                                    onChange={(e) => handleSignUpInputChange('state', e.target.value)}
                                    required
                                  />
                                </div>
                                <div>
                                  <label className="text-sm font-medium">ZIP Code *</label>
                                  <Input
                                    type="text"
                                    value={signUpForm.zip}
                                    onChange={(e) => handleSignUpInputChange('zip', e.target.value)}
                                    required
                                  />
                                </div>
                              </div>
                            </div>

                            {error && (
                              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <AlertCircle className="h-4 w-4 text-red-500" />
                                <span className="text-red-700">{error}</span>
                              </div>
                            )}

                            {success && (
                              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span className="text-green-700">{success}</span>
                              </div>
                            )}

                            <Button type="submit" disabled={submitting} className="w-full">
                              {submitting ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Creating Account...
                                </>
                              ) : (
                                'Create Account'
                              )}
                            </Button>
                          </form>
                        </TabsContent>

                        <TabsContent value="signin" className="mt-4">
                          <form onSubmit={handleSignIn} className="space-y-4">
                            <div>
                              <label className="text-sm font-medium">Email</label>
                              <Input
                                type="email"
                                value={signInForm.email}
                                onChange={(e) => handleSignInInputChange('email', e.target.value)}
                                required
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Password</label>
                              <Input
                                type="password"
                                value={signInForm.password}
                                onChange={(e) => handleSignInInputChange('password', e.target.value)}
                                required
                              />
                            </div>

                            {error && (
                              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <AlertCircle className="h-4 w-4 text-red-500" />
                                <span className="text-red-700">{error}</span>
                              </div>
                            )}

                            {success && (
                              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span className="text-green-700">{success}</span>
                              </div>
                            )}

                            <Button type="submit" disabled={submitting} className="w-full">
                              {submitting ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Signing In...
                                </>
                              ) : (
                                'Sign In'
                              )}
                            </Button>
                          </form>
                        </TabsContent>
                      </Tabs>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleEquipmentSubmit} className="space-y-6">
                    {error && (
                      <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        <span className="text-red-700">{error}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Request Title *</label>
                        <Input
                          type="text"
                          value={equipmentForm.title}
                          onChange={(e) => handleEquipmentInputChange('title', e.target.value)}
                          placeholder="e.g., Laser not powering on"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Equipment Model *</label>
                        <Input
                          type="text"
                          value={equipmentForm.model}
                          onChange={(e) => handleEquipmentInputChange('model', e.target.value)}
                          placeholder="e.g., Cutera Xeo"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Priority *</label>
                        <Select value={equipmentForm.priority} onValueChange={(value) => handleEquipmentInputChange('priority', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="P1">P1 - Critical (Same Day)</SelectItem>
                            <SelectItem value="P2">P2 - High (24-48 hours)</SelectItem>
                            <SelectItem value="P3">P3 - Medium (3-5 days)</SelectItem>
                            <SelectItem value="P4">P4 - Low (1-2 weeks)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Preferred Date</label>
                        <Input
                          type="date"
                          value={equipmentForm.preferred_date}
                          onChange={(e) => handleEquipmentInputChange('preferred_date', e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Issue Description *</label>
                      <Textarea
                        value={equipmentForm.issue_description}
                        onChange={(e) => handleEquipmentInputChange('issue_description', e.target.value)}
                        placeholder="Describe the issue you're experiencing with your equipment..."
                        rows={4}
                        required
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Additional Notes</label>
                      <Textarea
                        value={equipmentForm.additional_notes}
                        onChange={(e) => handleEquipmentInputChange('additional_notes', e.target.value)}
                        placeholder="Any additional information that might be helpful..."
                        rows={3}
                      />
                    </div>

                    <Button type="submit" disabled={submitting} className="w-full">
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Submitting Request...
                        </>
                      ) : (
                        'Submit Equipment Help Request'
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="training" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Training Request
                </CardTitle>
                <CardDescription>
                  Request training for your staff on laser equipment operation and safety.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!user ? (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground mb-4">
                      Please sign in or create an account to submit your training request.
                    </p>
                    
                    <Tabs value={authMode} onValueChange={(value) => setAuthMode(value as 'signin' | 'signup')} className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="signup">Create Account</TabsTrigger>
                        <TabsTrigger value="signin">Sign In</TabsTrigger>
                      </TabsList>

                      <TabsContent value="signup" className="mt-4">
                        <form onSubmit={handleSignUp} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium">Full Name *</label>
                              <Input
                                type="text"
                                value={signUpForm.full_name}
                                onChange={(e) => handleSignUpInputChange('full_name', e.target.value)}
                                required
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Email *</label>
                              <Input
                                type="email"
                                value={signUpForm.email}
                                onChange={(e) => handleSignUpInputChange('email', e.target.value)}
                                required
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Password *</label>
                              <Input
                                type="password"
                                value={signUpForm.password}
                                onChange={(e) => handleSignUpInputChange('password', e.target.value)}
                                required
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Confirm Password *</label>
                              <Input
                                type="password"
                                value={signUpForm.confirm_password}
                                onChange={(e) => handleSignUpInputChange('confirm_password', e.target.value)}
                                required
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Company Name *</label>
                              <Input
                                type="text"
                                value={signUpForm.company_name}
                                onChange={(e) => handleSignUpInputChange('company_name', e.target.value)}
                                required
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Phone *</label>
                              <Input
                                type="tel"
                                value={signUpForm.phone}
                                onChange={(e) => handleSignUpInputChange('phone', e.target.value)}
                                required
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium">Address Line 1 *</label>
                              <Input
                                type="text"
                                value={signUpForm.address_line1}
                                onChange={(e) => handleSignUpInputChange('address_line1', e.target.value)}
                                required
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Address Line 2</label>
                              <Input
                                type="text"
                                value={signUpForm.address_line2}
                                onChange={(e) => handleSignUpInputChange('address_line2', e.target.value)}
                              />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <label className="text-sm font-medium">City *</label>
                                <Input
                                  type="text"
                                  value={signUpForm.city}
                                  onChange={(e) => handleSignUpInputChange('city', e.target.value)}
                                  required
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium">State *</label>
                                <Input
                                  type="text"
                                  value={signUpForm.state}
                                  onChange={(e) => handleSignUpInputChange('state', e.target.value)}
                                  required
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium">ZIP Code *</label>
                                <Input
                                  type="text"
                                  value={signUpForm.zip}
                                  onChange={(e) => handleSignUpInputChange('zip', e.target.value)}
                                  required
                                />
                              </div>
                            </div>
                          </div>

                          {error && (
                            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                              <AlertCircle className="h-4 w-4 text-red-500" />
                              <span className="text-red-700">{error}</span>
                            </div>
                          )}

                          {success && (
                            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="text-red-700">{success}</span>
                            </div>
                          )}

                          <Button type="submit" disabled={submitting} className="w-full">
                            {submitting ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Creating Account...
                              </>
                              ) : (
                                'Create Account'
                              )}
                            </Button>
                          </form>
                        </TabsContent>

                        <TabsContent value="signin" className="mt-4">
                          <form onSubmit={handleSignIn} className="space-y-4">
                            <div>
                              <label className="text-sm font-medium">Email</label>
                              <Input
                                type="email"
                                value={signInForm.email}
                                onChange={(e) => handleSignInInputChange('email', e.target.value)}
                                required
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Password</label>
                              <Input
                                type="password"
                                value={signUpForm.password}
                                onChange={(e) => handleSignInInputChange('password', e.target.value)}
                                required
                              />
                            </div>

                            {error && (
                              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <AlertCircle className="h-4 w-4 text-red-500" />
                                <span className="text-red-700">{error}</span>
                              </div>
                            )}

                            {success && (
                              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span className="text-green-700">{success}</span>
                            </div>
                          )}

                          <Button type="submit" disabled={submitting} className="w-full">
                            {submitting ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Signing In...
                              </>
                            ) : (
                              'Sign In'
                            )}
                          </Button>
                        </form>
                      </TabsContent>
                    </Tabs>
                  </div>
                ) : (
                  <form onSubmit={handleTrainerSubmit} className="space-y-6">
                    {error && (
                      <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        <span className="text-red-700">{error}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Training Title *</label>
                        <Input
                          type="text"
                          value={trainerForm.title}
                          onChange={(e) => handleTrainerInputChange('title', e.target.value)}
                          placeholder="e.g., Laser Safety Training"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Training Type *</label>
                        <Select value={trainerForm.training_type} onValueChange={(value) => handleTrainerInputChange('training_type', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="safety">Safety Training</SelectItem>
                            <SelectItem value="operation">Equipment Operation</SelectItem>
                            <SelectItem value="maintenance">Maintenance Procedures</SelectItem>
                            <SelectItem value="comprehensive">Comprehensive Training</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Equipment Models *</label>
                        <Input
                          type="text"
                          value={trainerForm.equipment_models}
                          onChange={(e) => handleTrainerInputChange('equipment_models', e.target.value)}
                          placeholder="e.g., Cutera Xeo, Lumenis M22"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Staff Count *</label>
                        <Select value={trainerForm.staff_count} onValueChange={(value) => handleTrainerInputChange('staff_count', value)}>
                          <SelectTrigger>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1-3">1-3 staff members</SelectItem>
                            <SelectItem value="4-6">4-6 staff members</SelectItem>
                            <SelectItem value="7-10">7-10 staff members</SelectItem>
                            <SelectItem value="10+">10+ staff members</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Priority *</label>
                        <Select value={trainerForm.priority} onValueChange={(value) => handleTrainerInputChange('priority', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="P1">P1 - Critical (Same Day)</SelectItem>
                            <SelectItem value="P2">P2 - High (24-48 hours)</SelectItem>
                            <SelectItem value="P3">P3 - Medium (3-5 days)</SelectItem>
                            <SelectItem value="P4">P4 - Low (1-2 weeks)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Preferred Date</label>
                        <Input
                          type="date"
                          value={trainerForm.preferred_date}
                          onChange={(e) => handleTrainerInputChange('preferred_date', e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Training Description *</label>
                      <Textarea
                        value={trainerForm.training_description}
                        onChange={(e) => handleTrainerInputChange('training_description', e.target.value)}
                        placeholder="Describe the training you need and any specific requirements..."
                        rows={4}
                        required
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Additional Notes</label>
                      <Textarea
                        value={trainerForm.additional_notes}
                        onChange={(e) => handleTrainerInputChange('additional_notes', e.target.value)}
                        placeholder="Any additional information that might be helpful..."
                        rows={3}
                      />
                    </div>

                    <Button type="submit" disabled={submitting} className="w-full">
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Submitting Request...
                        </>
                      ) : (
                        'Submit Training Request'
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
