import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <Image
                src="/logo.avif"
                alt="MED Equipment Tech Logo"
                width={180}
                height={180}
                className="rounded-lg shadow-lg"
                priority
              />
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Connect with medical equipment technicians and trainers. Find opportunities, 
              place bids, and grow your business.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {/* Technician Card */}
            <div className="group bg-card rounded-xl border shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
              <div className="w-full h-56 relative overflow-hidden">
                <Image
                  src="/tech.jpeg"
                  alt="Laser Technician"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <div className="absolute top-4 right-4">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Technician
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-foreground">For Technicians</h3>
                </div>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  Access exclusive job opportunities, submit competitive bids, and build lasting relationships with MedSpa practices nationwide.
                </p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Browse open service opportunities
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Submit competitive bids
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Grow your client base
                  </div>
                </div>
                <Link
                  href="/jobs"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold text-center block group-hover:shadow-lg"
                >
                  View Tech Jobs
                </Link>
              </div>
            </div>
            
            {/* Trainer Card */}
            <div className="group bg-card rounded-xl border shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
              <div className="w-full h-56 relative overflow-hidden">
                <Image
                  src="/teacher.jpeg"
                  alt="Laser Trainer"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <div className="absolute top-4 right-4">
                  <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Trainer
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-foreground">For Trainers</h3>
                </div>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  Share your expertise with MedSpa staff, conduct device training sessions, and establish yourself as a trusted industry educator.
                </p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Find training opportunities
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Connect with practices
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Build your reputation
                  </div>
                </div>
                <Link
                  href="/jobs"
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-4 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 font-semibold text-center block group-hover:shadow-lg"
                >
                  View Trainer Jobs
                </Link>
              </div>
            </div>
            
            {/* MedSpa Practice Card */}
            <div className="group bg-card rounded-xl border shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
              <div className="w-full h-56 relative overflow-hidden">
                <Image
                  src="/practice.jpeg"
                  alt="MedSpa Practice"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <div className="absolute top-4 right-4">
                  <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Practice
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-foreground">For MedSpa Practices</h3>
                </div>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  Get your laser equipment back online quickly with qualified technicians and comprehensive training for your staff.
                </p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Quick equipment repair
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Staff training support
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Minimize downtime
                  </div>
                </div>
                <Link
                  href="/equipment-help"
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-4 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 font-semibold text-center block group-hover:shadow-lg"
                >
                  Get Equipment Help
                </Link>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              Ready to get started?
            </p>
            <div className="space-x-4">
              <Link
                href="/auth/signup"
                className="inline-block bg-secondary text-secondary-foreground px-6 py-3 rounded-md hover:bg-secondary/80 transition-colors"
              >
                Sign Up
              </Link>
              <Link
                href="/auth/signin"
                className="inline-block border border-input bg-background px-6 py-3 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <Image
                src="/logo.avif"
                alt="MED Equipment Tech Logo"
                width={60}
                height={60}
                className="rounded-lg"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-300">© 2025 Powered by</span>
              <Image
                src="/mrp-powered-by.png"
                alt="Powered by MRP"
                width={120}
                height={30}
                className="h-8 w-auto"
              />
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-6 pt-6 text-center">
            <p className="text-sm text-gray-400">
              Connecting medical equipment professionals with opportunities worldwide
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
