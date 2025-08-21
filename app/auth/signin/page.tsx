'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Eye, EyeOff, User, GraduationCap, Building2, Shield } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function SignIn() {
  const { signIn, signInDemo } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const { error: signInError } = await signIn(email, password)
      
      if (signInError) {
        setError(signInError.message || 'Failed to sign in')
      } else {
        // Redirect to dashboard on successful signin
        router.push('/dashboard')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }



  const roleOptions = [
    {
      id: 'technician',
      title: 'Technician',
      description: 'Laser equipment repair & maintenance',
      icon: User,
      borderColor: 'border-blue-200'
    },
    {
      id: 'trainer',
      title: 'Trainer',
      description: 'Staff training & certification',
      icon: GraduationCap,
      borderColor: 'border-green-200'
    },
    {
      id: 'medspa',
      title: 'MedSpa Practice',
      description: 'Equipment help & staff training',
      icon: Building2,
      borderColor: 'border-purple-200'
    },
    {
      id: 'admin',
      title: 'Admin',
      description: 'Platform management & oversight',
      icon: Shield,
      borderColor: 'border-slate-200'
    }
  ]

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Link href="/">
              <Image
                src="/logo.avif"
                alt="MED Equipment Tech Logo"
                width={64}
                height={64}
                className="rounded-lg"
                priority
              />
            </Link>
          </div>
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {/* Demo Login Section */}
          <div className="mb-6">
            <div className="text-center mb-4">
              <Label className="text-sm font-medium text-muted-foreground">Quick Demo Access</Label>
              <p className="text-xs text-muted-foreground mt-1">Try the platform without creating an account</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {roleOptions.map((role) => {
                const IconComponent = role.icon
                return (
                  <button
                    key={`demo-${role.id}`}
                    type="button"
                    onClick={async () => {
                      setIsLoading(true)
                      setError('')
                      
                      try {
                        const { error: demoError } = await signInDemo(role.id)
                        
                        if (demoError) {
                          setError(demoError.message || 'Failed to sign in demo user')
                        } else {
                          // Redirect to dashboard on successful demo signin
                          router.push('/dashboard')
                        }
                      } catch (err) {
                        setError('An unexpected error occurred')
                      } finally {
                        setIsLoading(false)
                      }
                    }}
                    disabled={isLoading}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                      isLoading 
                        ? 'opacity-50 cursor-not-allowed bg-muted'
                        : `${role.borderColor} bg-background hover:bg-accent hover:shadow-md`
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <IconComponent className="w-4 h-4" />
                      <div>
                        <div className="font-medium text-sm">Demo {role.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {role.description}
                        </div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          {/* Regular Sign-in Form */}
          <div className="mb-6">
            <div className="text-center mb-4">
              <Label className="text-sm font-medium">Sign In with Your Account</Label>
              <p className="text-xs text-muted-foreground mt-1">Enter your credentials to access your account</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h3 className="text-sm font-medium mb-3 text-center">Demo Account Credentials</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Technician:</span>
                <span className="font-mono">demo.technician@medequiptech.com</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Trainer:</span>
                <span className="font-mono">demo.trainer@medequiptech.com</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">MedSpa Practice:</span>
                <span className="font-mono">demo.medspa@medequiptech.com</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Admin:</span>
                <span className="font-mono">demo.admin@medequiptech.com</span>
              </div>
              <div className="text-center mt-2">
                <span className="text-muted-foreground">Password for all accounts: </span>
                <span className="font-mono font-medium">demo123</span>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link
                href="/auth/signup"
                className="text-primary hover:underline font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
