'use client'

import { useAuth } from '@/lib/auth-context'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, User, GraduationCap, Building2, Shield, AlertCircle, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import Header from '@/components/Header'

interface UserProfile {
  full_name: string
  role_tech: boolean
  role_trainer: boolean
  is_approved: boolean
  base_city?: string
  base_state?: string
}

export default function Dashboard() {
  const { user, isDemoUser, demoRole } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    openJobs: 0,
    myBids: 0,
    awardedJobs: 0
  })

  useEffect(() => {
    if (user) {
      fetchUserProfile()
      fetchUserStats()
    }
  }, [user])

  const fetchUserProfile = async () => {
    try {
      // For demo users, create a synthetic profile based on their role
      if (isDemoUser && demoRole) {
        const demoProfile: UserProfile = {
          full_name: `Demo ${demoRole.charAt(0).toUpperCase() + demoRole.slice(1)}`,
          role_tech: demoRole === 'technician' || demoRole === 'admin',
          role_trainer: demoRole === 'trainer' || demoRole === 'admin',
          is_approved: true, // Demo users are pre-approved
          base_city: 'Demo City',
          base_state: 'CA'
        }
        setProfile(demoProfile)
        setLoading(false)
        return
      }

      // For regular users, fetch profile from API
      const response = await fetch('/api/users/profile')
      if (response.ok) {
        const data = await response.json()
        setProfile(data.profile)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserStats = async () => {
    try {
      // For demo users, create synthetic stats
      if (isDemoUser && demoRole) {
        const demoStats = {
          openJobs: demoRole === 'technician' || demoRole === 'trainer' ? 12 : 0,
          myBids: demoRole === 'technician' || demoRole === 'trainer' ? 3 : 0,
          awardedJobs: demoRole === 'technician' || demoRole === 'trainer' ? 2 : 0
        }
        setStats(demoStats)
        return
      }

      // For regular users, fetch stats from API
      const response = await fetch('/api/users/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  // Determine user role and type
  const userRole = isDemoUser ? demoRole : 
    profile?.role_tech && profile?.role_trainer ? 'both' :
    profile?.role_tech ? 'technician' :
    profile?.role_trainer ? 'trainer' : 'medspa'

  const userType = isDemoUser ? demoRole : 
    profile?.role_tech && profile?.role_trainer ? 'admin' :
    profile?.role_tech ? 'technician' :
    profile?.role_trainer ? 'trainer' : 'medspa'

  // Show approval pending message if not approved (but demo users are always approved)
  if (!isDemoUser && profile && !profile.is_approved) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">Account Pending Approval</h1>
            <p className="text-muted-foreground">
              Your account is currently under review by our admin team.
            </p>
          </div>
          
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
              <CardDescription>
                This usually takes 1-2 business days. You'll be notified via email.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-medium mb-2">What happens next?</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Admin will review your profile and credentials</li>
                  <li>• You'll receive an email notification once approved</li>
                  <li>• After approval, you can bid on jobs and access the platform</li>
                </ul>
              </div>
              <p className="text-sm text-muted-foreground">
                This usually takes 1-2 business days. You'll be notified via email.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Render role-specific dashboard
  switch (userType) {
    case 'technician':
      return <TechnicianDashboard profile={profile} stats={stats} isDemoUser={isDemoUser} />
    case 'trainer':
      return <TrainerDashboard profile={profile} stats={stats} isDemoUser={isDemoUser} />
    case 'medspa':
      return <MedSpaDashboard profile={profile} stats={stats} isDemoUser={isDemoUser} />
    case 'admin':
      return <AdminDashboard profile={profile} stats={stats} isDemoUser={isDemoUser} />
    default:
      return <DefaultDashboard profile={profile} stats={stats} isDemoUser={isDemoUser} />
  }
}

function TechnicianDashboard({ profile, stats, isDemoUser }: { profile: UserProfile | null, stats: any, isDemoUser: boolean }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Technician Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {profile?.full_name || 'Technician'}! Manage your laser equipment repair jobs.
            {isDemoUser && <span className="ml-2 text-blue-600">(Demo Mode)</span>}
          </p>
        </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tech Jobs</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.openJobs}</div>
            <p className="text-xs text-muted-foreground">
              Available for bidding
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Bids</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.myBids}</div>
            <p className="text-xs text-muted-foreground">
              Active bids placed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Awarded Jobs</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.awardedJobs}</div>
            <p className="text-xs text-muted-foreground">
              Currently working
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Find Tech Jobs</CardTitle>
            <CardDescription>
              Browse available laser equipment repair and maintenance jobs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/jobs?job_type=tech&status=open">
                View Open Tech Jobs
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Bids</CardTitle>
            <CardDescription>
              Track your bid status and manage active bids
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/bids">
                View My Bids
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Your latest job interactions and updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-3 bg-muted rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">New bid placed on VBeam Perfecta PM</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
              <Badge variant="secondary">Pending</Badge>
            </div>
            
            <div className="flex items-center space-x-4 p-3 bg-muted rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Job awarded: GentleMax Pro Maintenance</p>
                <p className="text-xs text-muted-foreground">1 day ago</p>
              </div>
              <Badge variant="default">Awarded</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}

function TrainerDashboard({ profile, stats, isDemoUser }: { profile: UserProfile | null, stats: any, isDemoUser: boolean }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Trainer Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {profile?.full_name || 'Trainer'}! Manage your staff training and certification jobs.
            {isDemoUser && <span className="ml-2 text-blue-600">(Demo Mode)</span>}
          </p>
        </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Trainer Jobs</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.openJobs}</div>
            <p className="text-xs text-muted-foreground">
              Available for bidding
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Bids</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.myBids}</div>
            <p className="text-xs text-muted-foreground">
              Active bids placed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Awarded Jobs</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.awardedJobs}</div>
            <p className="text-xs text-muted-foreground">
              Currently training
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Find Trainer Jobs</CardTitle>
            <CardDescription>
              Browse available staff training and certification opportunities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/jobs?job_type=trainer&status=open">
                View Open Trainer Jobs
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Bids</CardTitle>
            <CardDescription>
              Track your bid status and manage active bids
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/bids">
                View My Bids
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Your latest training job interactions and updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-3 bg-muted rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">New bid placed on BBL Hero Staff Training</p>
                <p className="text-xs text-muted-foreground">3 hours ago</p>
              </div>
              <Badge variant="secondary">Pending</Badge>
            </div>
            
            <div className="flex items-center space-x-4 p-3 bg-muted rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Job awarded: Picosure Training Session</p>
                <p className="text-xs text-muted-foreground">2 days ago</p>
              </div>
              <Badge variant="default">Awarded</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}

function MedSpaDashboard({ profile, stats, isDemoUser }: { profile: UserProfile | null, stats: any, isDemoUser: boolean }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">MedSpa Practice Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {profile?.full_name || 'MedSpa Practice'}! Manage your equipment service and staff training needs.
            {isDemoUser && <span className="ml-2 text-blue-600">(Demo Mode)</span>}
              </p>
            </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Equipment Help</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Request</div>
            <p className="text-xs text-muted-foreground">
              Get technical support
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Staff Training</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Request</div>
            <p className="text-xs text-muted-foreground">
              Schedule training sessions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Currently in progress
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Equipment Help</CardTitle>
            <CardDescription>
              Submit a request for laser equipment repair or maintenance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/equipment-help">
                Request Equipment Help
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Staff Training</CardTitle>
            <CardDescription>
              Request staff training and certification services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/request-trainer">
                Request Training
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Your latest service requests and updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-3 bg-muted rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Equipment help request submitted</p>
                <p className="text-xs text-muted-foreground">1 day ago</p>
              </div>
              <Badge variant="secondary">Pending</Badge>
            </div>
            
            <div className="flex items-center space-x-4 p-3 bg-muted rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Staff training session completed</p>
                <p className="text-xs text-muted-foreground">3 days ago</p>
              </div>
              <Badge variant="default">Completed</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}

function AdminDashboard({ profile, stats, isDemoUser }: { profile: UserProfile | null, stats: any, isDemoUser: boolean }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {profile?.full_name || 'Administrator'}! Manage the platform and users.
            {isDemoUser && <span className="ml-2 text-blue-600">(Demo Mode)</span>}
          </p>
        </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Jobs</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.openJobs || 0}</div>
            <p className="text-xs text-muted-foreground">
              Available for bidding
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingApprovals || 0}</div>
            <p className="text-xs text-muted-foreground">
              Users awaiting approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              Registered users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Bids</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.myBids || 0}</div>
            <p className="text-xs text-muted-foreground">
              Current bids
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Manage Jobs</CardTitle>
            <CardDescription>
              Create, edit, and manage job listings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/admin/jobs">
                Manage Jobs
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Approvals</CardTitle>
            <CardDescription>
              Review and approve new user registrations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/admin/users">
                Review Users
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Email Campaigns</CardTitle>
            <CardDescription>
              Send bulk emails to users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/admin/email">
                Send Emails
              </Link>
            </Button>
          </CardContent>
        </Card>
              </div>
              
      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest platform activities and updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-3 bg-muted rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">New user registration: John Doe</p>
                <p className="text-xs text-muted-foreground">1 hour ago</p>
              </div>
              <Badge variant="secondary">Pending</Badge>
              </div>
              
            <div className="flex items-center space-x-4 p-3 bg-muted rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Job awarded: VBeam Perfecta Maintenance</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
              <Badge variant="default">Completed</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}

function DefaultDashboard({ profile, stats, isDemoUser }: { profile: UserProfile | null, stats: any, isDemoUser: boolean }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {profile?.full_name || 'User'}! Manage your account and activities.
            {isDemoUser && <span className="ml-2 text-blue-600">(Demo Mode)</span>}
          </p>
        </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Jobs</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.openJobs || 0}</div>
            <p className="text-xs text-muted-foreground">
              Available for bidding
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Bids</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.myBids || 0}</div>
            <p className="text-xs text-muted-foreground">
              Active bids placed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Awarded Jobs</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.awardedJobs || 0}</div>
            <p className="text-xs text-muted-foreground">
              Currently working
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Browse Jobs</CardTitle>
            <CardDescription>
              View available jobs and place bids
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/jobs">
                View Jobs
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Bids</CardTitle>
            <CardDescription>
              Track your bid status and manage active bids
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/bids">
                View My Bids
              </Link>
            </Button>
          </CardContent>
        </Card>
            </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Your latest platform interactions and updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-3 bg-muted rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Account created successfully</p>
                <p className="text-xs text-muted-foreground">Just now</p>
              </div>
              <Badge variant="default">Completed</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
        </div>
    </div>
  )
}
