export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            MED Equipment Tech
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Connect with medical equipment technicians and trainers. Find opportunities, 
            place bids, and grow your business.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <h3 className="text-xl font-semibold mb-2">For Technicians</h3>
            <p className="text-muted-foreground mb-4">
              Browse open tech jobs, submit competitive bids, and grow your client base.
            </p>
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
              View Tech Jobs
            </button>
          </div>
          
          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <h3 className="text-xl font-semibold mb-2">For Trainers</h3>
            <p className="text-muted-foreground mb-4">
              Find training opportunities and connect with companies needing your expertise.
            </p>
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
              View Trainer Jobs
            </button>
          </div>
          
          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <h3 className="text-xl font-semibold mb-2">For Companies</h3>
            <p className="text-muted-foreground mb-4">
              Post jobs, review bids, and find qualified professionals for your needs.
            </p>
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
              Post a Job
            </button>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            Ready to get started?
          </p>
          <div className="space-x-4">
            <button className="bg-secondary text-secondary-foreground px-6 py-3 rounded-md hover:bg-secondary/80 transition-colors">
              Sign Up
            </button>
            <button className="border border-input bg-background px-6 py-3 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
              Sign In
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
