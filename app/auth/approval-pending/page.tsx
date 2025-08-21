'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function ApprovalPending() {
  const { user, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Redirect if not authenticated
    if (!user) {
      router.push('/auth/signin')
    }
  }, [user, router])

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="flex justify-center mb-4">
          <Image
            src="/logo.avif"
            alt="MED Equipment Tech Logo"
            width={80}
            height={80}
            className="rounded-lg"
          />
        </div>
        
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Account Pending Approval
          </h2>
          <p className="text-muted-foreground mb-6">
            Thank you for joining MED Equipment Tech! Your account is currently under review 
            by our admin team. This usually takes 24-48 hours.
          </p>
          
          <div className="bg-card p-6 rounded-lg border shadow-sm mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              What we're reviewing:
            </h3>
            <ul className="text-left text-sm text-muted-foreground space-y-2">
              <li className="flex items-start">
                <span className="bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">✓</span>
                Your professional qualifications
              </li>
              <li className="flex items-start">
                <span className="bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">✓</span>
                Service area and availability
              </li>
              <li className="flex items-start">
                <span className="bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">✓</span>
                Role selection (Tech/Trainer)
              </li>
            </ul>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg mb-6">
            <p className="text-sm text-muted-foreground">
              <strong>Current Status:</strong> Pending Admin Review
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              You'll receive an email notification once your account is approved.
            </p>
          </div>
          
          <p className="text-sm text-muted-foreground mb-6">
            Have questions about your application? Contact us at{' '}
            <a href="mailto:badger@slickrockholdings.com" className="text-primary hover:text-primary/90 font-medium">
              badger@slickrockholdings.com
            </a>
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleSignOut}
            className="block w-full bg-secondary text-secondary-foreground px-6 py-3 rounded-md hover:bg-secondary/80 transition-colors"
          >
            Sign Out
          </button>
          
          <Link
            href="/"
            className="block w-full border border-input bg-background px-6 py-3 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
