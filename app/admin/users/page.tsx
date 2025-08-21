'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, User, Mail, Phone, MapPin, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

interface PendingUser {
  user_id: string
  full_name: string
  email: string
  phone?: string
  role_tech: boolean
  role_trainer: boolean
  base_city?: string
  base_state?: string
  created_at: string
}

export default function AdminUsersPage() {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    fetchPendingUsers()
  }, [])

  const fetchPendingUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/users/approve')
      if (response.ok) {
        const data = await response.json()
        setPendingUsers(data.pending_users || [])
      } else {
        setError('Failed to fetch pending users')
      }
    } catch (error) {
      setError('Failed to fetch pending users')
    } finally {
      setLoading(false)
    }
  }

  const handleUserAction = async (userId: string, action: 'approve' | 'deny', reason?: string) => {
    try {
      setActionLoading(userId)
      const response = await fetch('/api/users/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          action,
          reason
        })
      })

      if (response.ok) {
        // Remove user from pending list
        setPendingUsers(prev => prev.filter(user => user.user_id !== userId))
        // Show success message
        setError('')
      } else {
        const data = await response.json()
        setError(`Failed to ${action} user: ${data.error}`)
      }
    } catch (error) {
      setError(`Failed to ${action} user`)
    } finally {
      setActionLoading(null)
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
        <h1 className="text-3xl font-bold mb-2">User Management</h1>
        <p className="text-muted-foreground">
          Review and approve new user registrations
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {pendingUsers.length === 0 ? (
        <Card>
          <CardHeader className="text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <CardTitle className="text-2xl">No Pending Approvals</CardTitle>
            <CardDescription>
              All user registrations have been reviewed and processed.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="space-y-6">
          {pendingUsers.map((user) => (
            <Card key={user.user_id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <User className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <CardTitle className="text-xl">{user.full_name}</CardTitle>
                      <CardDescription className="flex items-center space-x-2">
                        <Mail className="h-4 w-4" />
                        <span>{user.email}</span>
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {user.role_tech && <Badge variant="default">Technician</Badge>}
                    {user.role_trainer && <Badge variant="default">Trainer</Badge>}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Contact Information</Label>
                    <div className="space-y-1">
                      {user.phone && (
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Phone className="h-4 w-4" />
                          <span>{user.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span>{user.email}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Location</Label>
                    <div className="space-y-1">
                      {user.base_city && user.base_state && (
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{user.base_city}, {user.base_state}</span>
                        </div>
                      )}
                      <div className="text-sm text-muted-foreground">
                        Registered: {new Date(user.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button
                    onClick={() => handleUserAction(user.user_id, 'approve')}
                    disabled={actionLoading === user.user_id}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    {actionLoading === user.user_id ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <CheckCircle className="h-4 w-4 mr-2" />
                    )}
                    Approve User
                  </Button>
                  
                  <Button
                    onClick={() => handleUserAction(user.user_id, 'deny')}
                    disabled={actionLoading === user.user_id}
                    variant="destructive"
                    className="flex-1"
                  >
                    {actionLoading === user.user_id ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <XCircle className="h-4 w-4 mr-2" />
                    )}
                    Deny User
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
