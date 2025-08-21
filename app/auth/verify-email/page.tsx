'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function VerifyEmail() {
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
            Check Your Email
          </h2>
          <p className="text-muted-foreground mb-6">
            We've sent you a verification link to confirm your email address. 
            Please check your inbox and click the link to complete your registration.
          </p>
          
          <div className="bg-card p-6 rounded-lg border shadow-sm mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              What happens next?
            </h3>
            <ol className="text-left text-sm text-muted-foreground space-y-2">
              <li className="flex items-start">
                <span className="bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">1</span>
                Verify your email address
              </li>
              <li className="flex items-start">
                <span className="bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">2</span>
                Wait for admin approval (usually within 24 hours)
              </li>
              <li className="flex items-start">
                <span className="bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">3</span>
                Start bidding on jobs once approved
              </li>
            </ol>
          </div>
          
          <p className="text-sm text-muted-foreground mb-6">
            Didn't receive the email? Check your spam folder or{' '}
            <button className="text-primary hover:text-primary/90 font-medium">
              request a new verification link
            </button>
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/"
            className="block w-full bg-secondary text-secondary-foreground px-6 py-3 rounded-md hover:bg-secondary/80 transition-colors"
          >
            Return to Home
          </Link>
          
          <Link
            href="/auth/signin"
            className="block w-full border border-input bg-background px-6 py-3 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}
