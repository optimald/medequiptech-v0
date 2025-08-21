'use client'

import { useAuth } from '@/lib/auth-context'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, User, GraduationCap, Building2, Shield, AlertCircle, CheckCircle } from 'lucide-react'
import Link from 'next/link'

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

  // Show approval pending message if not approved
  if (!isDemoUser && profile && !profile.is_approved) {
    return (
      <div className="container mx-auto px-4 py-8">
        {/* Header with Logo and Title */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-2">Account Pending Approval</h1>
            <p className="text-muted-foreground">
              Your account is currently under review by our admin team.
            </p>
          </div>
          <img src="/logo.avif" alt="MED Equipment Tech" className="h-8 w-auto" />
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
    )
  }

  // Render role-specific dashboard
  switch (userType) {
    case 'technician':
      return <TechnicianDashboard profile={profile} stats={stats} />
    case 'trainer':
      return <TrainerDashboard profile={profile} stats={stats} />
    case 'medspa':
      return <MedSpaDashboard profile={profile} stats={stats} />
    case 'admin':
      return <AdminDashboard profile={profile} stats={stats} />
    default:
      return <DefaultDashboard profile={profile} stats={stats} />
  }
}

function TechnicianDashboard({ profile, stats }: { profile: UserProfile | null, stats: any }) {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with Logo and Title */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Technician Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {profile?.full_name || 'Technician'}! Manage your laser equipment repair jobs.
          </p>
        </div>
        <img src="/logo.avif" alt="MED Equipment Tech" className="h-8 w-auto" />
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
            <CardTitle className="text-sm font-medium">My Active Bids</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.myBids}</div>
            <p className="text-xs text-muted-foreground">
              Pending review
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
  )
}

function TrainerDashboard({ profile, stats }: { profile: UserProfile | null, stats: any }) {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with Logo and Title */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Trainer Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {profile?.full_name || 'Trainer'}! Manage your staff training and certification jobs.
          </p>
        </div>
        <img src="/logo.avif" alt="MED Equipment Tech" className="h-8 w-auto" />
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
            <CardTitle className="text-sm font-medium">My Active Bids</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.myBids}</div>
            <p className="text-xs text-muted-foreground">
              Pending review
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
  )
}

function MedSpaDashboard({ profile, stats }: { profile: UserProfile | null, stats: any }) {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with Logo and Title */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">MedSpa Practice Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {profile?.full_name || 'MedSpa Practice'}! Get equipment help and staff training.
          </p>
        </div>
        <img src="/logo.avif" alt="MED Equipment Tech" className="h-8 w-auto" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Equipment Help</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Available</div>
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
            <div className="text-2xl font-bold">Available</div>
            <p className="text-xs text-muted-foreground">
              Certification programs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Support Status</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Active</div>
            <p className="text-xs text-muted-foreground">
              Full access granted
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Equipment Support</CardTitle>
            <CardDescription>
              Get help with laser equipment issues and maintenance
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
              Schedule staff training and certification sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/equipment-help">
                Request Trainer
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Information */}
      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
          <CardDescription>
            Understanding your MedSpa Practice access
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-4 p-3 bg-muted rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Equipment Help</p>
                <p className="text-xs text-muted-foreground">
                  Contact our technical team for immediate assistance with laser equipment issues, 
                  maintenance questions, and troubleshooting support.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 p-3 bg-muted rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Staff Training</p>
                <p className="text-xs text-muted-foreground">
                  Schedule comprehensive training sessions for your staff on laser equipment operation, 
                  safety protocols, and treatment procedures.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function AdminDashboard({ profile, stats }: { profile: UserProfile | null, stats: any }) {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with Logo and Title */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {profile?.full_name || 'Admin'}! Manage the platform and oversee operations.
          </p>
        </div>
        <img src="/logo.avif" alt="MED Equipment Tech" className="h-8 w-auto" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Jobs</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
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
            <CardTitle className="text-sm font-medium">Active Bids</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeBids || 0}</div>
            <p className="text-xs text-muted-foreground">
              Under review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              Registered accounts
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>
              Approve new users and manage existing accounts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/admin/users">
                Manage Users
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Job Management</CardTitle>
            <CardDescription>
              Create, edit, and manage jobs and bids
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/jobs">
                Manage Jobs
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bulk Email</CardTitle>
            <CardDescription>
              Send curated email campaigns to users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/email">
                Send Campaigns
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
          <CardDescription>
            Platform overview and recent activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-3 bg-muted rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Platform Status</p>
                <p className="text-xs text-muted-foreground">All systems operational</p>
              </div>
              <Badge variant="default">Healthy</Badge>
            </div>
            
            <div className="flex items-center space-x-4 p-3 bg-muted rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Recent Signups</p>
                <p className="text-xs text-muted-foreground">3 new users this week</p>
              </div>
              <Badge variant="secondary">New</Badge>
            </div>

            <div className="flex items-center space-x-4 p-3 bg-muted rounded-lg">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Pending Actions</p>
                <p className="text-xs text-muted-foreground">5 jobs need review</p>
              </div>
              <Badge variant="secondary">Action Required</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function DefaultDashboard({ profile, stats }: { profile: UserProfile | null, stats: any }) {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with Logo and Title */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {profile?.full_name || 'User'}!
          </p>
        </div>
        <img src="/logo.avif" alt="MED Equipment Tech" className="h-8 w-auto" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Status</CardTitle>
          <CardDescription>
            Your current account information and status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Name:</span>
              <span>{profile?.full_name || 'Not set'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Location:</span>
              <span>{profile?.base_city && profile?.base_state ? 
                `${profile.base_city}, ${profile.base_state}` : 'Not set'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Roles:</span>
              <div className="flex space-x-2">
                {profile?.role_tech && <Badge variant="default">Technician</Badge>}
                {profile?.role_trainer && <Badge variant="default">Trainer</Badge>}
                {!profile?.role_tech && !profile?.role_trainer && <Badge variant="secondary">MedSpa Practice</Badge>}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
