'use client'

import { useAuth } from '@/lib/auth-context'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Loader2, Save, User, Phone, MapPin, Settings, Shield, CheckCircle, XCircle } from 'lucide-react'
import Header from '@/components/Header'

interface Profile {
  id: string
  user_id: string
  full_name: string
  phone: string
  role_tech: boolean
  role_trainer: boolean
  role_admin: boolean
  base_city: string
  base_state: string
  service_radius_mi: number
  is_approved: boolean
  created_at: string
  updated_at: string
}

export default function ProfilePage() {
  const { user, isDemoUser, demoRole } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    full_name: '',
    phone: '',
    base_city: '',
    base_state: '',
    service_radius_mi: 50
  })

  useEffect(() => {
    if (!user) {
      router.push('/auth/signin')
      return
    }

    fetchProfile()
  }, [user, router, isDemoUser, demoRole])

  const fetchProfile = async () => {
    try {
      // For demo users, create a synthetic profile based on their role
      if (isDemoUser && demoRole) {
        const demoProfile: Profile = {
          id: 'demo-profile',
          user_id: user?.id || 'demo-user',
          full_name: `Demo ${demoRole.charAt(0).toUpperCase() + demoRole.slice(1)}`,
          phone: '555-000-0000',
          role_tech: demoRole === 'technician' || demoRole === 'admin',
          role_trainer: demoRole === 'trainer' || demoRole === 'admin',
          role_admin: demoRole === 'admin',
          base_city: 'Demo City',
          base_state: 'CA',
          service_radius_mi: 50,
          is_approved: true, // Demo users are pre-approved
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        setProfile(demoProfile)
        setEditForm({
          full_name: demoProfile.full_name,
          phone: demoProfile.phone,
          base_city: demoProfile.base_city,
          base_state: demoProfile.base_state,
          service_radius_mi: demoProfile.service_radius_mi
        })
        setLoading(false)
        return
      }

      // For regular users, fetch profile from API
      const response = await fetch('/api/users/profile')
      if (response.ok) {
        const data = await response.json()
        setProfile(data.profile)
        setEditForm({
          full_name: data.profile.full_name || '',
          phone: data.profile.phone || '',
          base_city: data.profile.base_city || '',
          base_state: data.profile.base_state || '',
          service_radius_mi: data.profile.service_radius_mi || 50
        })
      } else {
        setError('Failed to fetch profile')
      }
    } catch (err) {
      setError('Failed to fetch profile')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      // For demo users, just update local state
      if (isDemoUser && demoRole) {
        if (profile) {
          const updatedProfile = {
            ...profile,
            ...editForm,
            updated_at: new Date().toISOString()
          }
          setProfile(updatedProfile)
          setSuccess('Profile updated successfully (Demo Mode - changes not saved)')
          setIsEditing(false)
        }
        setSaving(false)
        return
      }

      // For regular users, save to API
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      })

      if (response.ok) {
        setSuccess('Profile updated successfully')
        setIsEditing(false)
        fetchProfile() // Refresh profile data
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to update profile')
      }
    } catch (err) {
      setError('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditForm({
      full_name: profile?.full_name || '',
      phone: profile?.phone || '',
      base_city: profile?.base_city || '',
      base_state: profile?.base_state || '',
      service_radius_mi: profile?.service_radius_mi || 50
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-12">
          <p className="text-gray-500">Profile not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600">Manage your account information and preferences</p>
        </div>

        {/* Profile Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Account Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                {profile.is_approved ? (
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500 mr-2" />
                )}
                <span className="text-sm font-medium">
                  {profile.is_approved ? 'Approved' : 'Pending Approval'}
                </span>
              </div>
              {isDemoUser && (
                <Badge variant="secondary">Demo Mode</Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Profile Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Profile Information
            </CardTitle>
            <CardDescription>
              Your personal and contact information
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <Input
                      value={editForm.full_name}
                      onChange={(e) => setEditForm(prev => ({ ...prev, full_name: e.target.value }))}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone</label>
                    <Input
                      value={editForm.phone}
                      onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">City</label>
                    <Input
                      value={editForm.base_city}
                      onChange={(e) => setEditForm(prev => ({ ...prev, base_city: e.target.value }))}
                      placeholder="Enter your city"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">State</label>
                    <Input
                      value={editForm.base_state}
                      onChange={(e) => setEditForm(prev => ({ ...prev, base_state: e.target.value }))}
                      placeholder="Enter your state"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Service Radius (miles)</label>
                    <Input
                      type="number"
                      value={editForm.service_radius_mi}
                      onChange={(e) => setEditForm(prev => ({ ...prev, service_radius_mi: parseInt(e.target.value) || 50 }))}
                      min="1"
                      max="500"
                    />
                  </div>
                </div>
                <div className="flex space-x-3 pt-4">
                  <Button onClick={handleSave} disabled={saving}>
                    {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Full Name</label>
                    <p className="text-gray-900">{profile.full_name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Phone</label>
                    <p className="text-gray-900">{profile.phone}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">City</label>
                    <p className="text-gray-900">{profile.base_city}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">State</label>
                    <p className="text-gray-900">{profile.base_state}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Service Radius</label>
                    <p className="text-gray-900">{profile.service_radius_mi} miles</p>
                  </div>
                </div>
                <div className="pt-4">
                  <Button onClick={() => setIsEditing(true)}>
                    <Settings className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Roles and Permissions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Roles and Permissions
            </CardTitle>
            <CardDescription>
              Your assigned roles and capabilities on the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {profile.role_tech && (
                <Badge className="bg-blue-100 text-blue-800">Technician</Badge>
              )}
              {profile.role_trainer && (
                <Badge className="bg-green-100 text-green-800">Trainer</Badge>
              )}
              {profile.role_admin && (
                <Badge className="bg-purple-100 text-purple-800">Admin</Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>
              Your account details and settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Email</label>
                <p className="text-gray-900">{user?.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Member Since</label>
                <p className="text-gray-900">
                  {new Date(profile.created_at).toLocaleDateString()}
                </p>
              </div>
              {profile.updated_at !== profile.created_at && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Last Updated</label>
                  <p className="text-gray-900">
                    {new Date(profile.updated_at).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Error and Success Messages */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">{error}</p>
          </div>
        )}
        {success && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-800">{success}</p>
          </div>
        )}
      </div>
    </div>
  )
}
