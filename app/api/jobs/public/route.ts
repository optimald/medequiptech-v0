import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Debug environment variables
    console.log('Environment check:', {
      hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      url: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 20) + '...',
      keyPrefix: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) + '...'
    })

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase environment variables')
      return NextResponse.json(
        { error: 'Configuration error' },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'OPEN'
    const jobType = searchParams.get('job_type')
    const state = searchParams.get('state')
    const city = searchParams.get('city')
    const priority = searchParams.get('priority')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit

    // Create Supabase client for public database queries
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Try to get authenticated user
    let authenticatedUser = null
    let userProfile = null
    
    try {
      const supabaseAuth = createRouteHandlerClient({ cookies })
      const { data: { user } } = await supabaseAuth.auth.getUser()
      if (user) {
        authenticatedUser = user
        // Get user profile to check approval and role
        const { data: profile } = await supabaseAuth
          .from('profiles')
          .select('is_approved, role_tech, role_trainer')
          .eq('user_id', user.id)
          .single()
        userProfile = profile
      }
    } catch (authError) {
      // User not authenticated, continue with public access
      console.log('User not authenticated, showing public view')
    }

    // Build query for public jobs (limited fields, only open/bidding)
    let query = supabase
      .from('jobs')
      .select(`
        id,
        job_type,
        title,
        shipping_city,
        shipping_state,
        met_date,
        priority,
        status,
        company_name,
        model
      `)
      .in('status', ['OPEN', 'BIDDING'])
      .order('priority', { ascending: true })
      .order('met_date', { ascending: true })
      .range(offset, offset + limit - 1)

    // Apply filters
    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    if (jobType) {
      query = query.eq('job_type', jobType)
    }

    if (state) {
      query = query.eq('shipping_state', state)
    }

    if (city) {
      query = query.eq('shipping_city', city)
    }

    if (priority) {
      query = query.eq('priority', priority)
    }

    // Get total count for pagination
    let countQuery = supabase
      .from('jobs')
      .select('id', { count: 'exact', head: true })
      .in('status', ['OPEN', 'BIDDING'])

    // Apply same filters to count query
    if (status && status !== 'all') {
      countQuery = countQuery.eq('status', status)
    }
    if (jobType) {
      countQuery = countQuery.eq('job_type', jobType)
    }
    if (state) {
      countQuery = countQuery.eq('shipping_state', state)
    }
    if (city) {
      countQuery = countQuery.eq('shipping_city', city)
    }
    if (priority) {
      countQuery = countQuery.eq('priority', priority)
    }

    console.log('Executing queries...')

    // Execute queries
    const [jobsResult, countResult] = await Promise.all([
      query,
      countQuery
    ])

    if (jobsResult.error) {
      console.error('Error fetching jobs:', jobsResult.error)
      return NextResponse.json(
        { error: 'Failed to fetch jobs: ' + jobsResult.error.message },
        { status: 500 }
      )
    }

    if (countResult.error) {
      console.error('Error counting jobs:', countResult.error)
      return NextResponse.json(
        { error: 'Failed to count jobs: ' + countResult.error.message },
        { status: 500 }
      )
    }

    const totalJobs = countResult.count || 0
    const totalPages = Math.ceil(totalJobs / limit)

    // Process jobs based on authentication status
    let processedJobs = jobsResult.data || []
    
    if (!authenticatedUser || !userProfile?.is_approved) {
      // Public view - limited information but show device and general location
      processedJobs = processedJobs.map(job => ({
        ...job,
        // Keep device/model visible for public users
        model: job.model,
        // Show general location (state only) but hide specific city
        shipping_city: 'Location Hidden',
        shipping_state: job.shipping_state, // Keep state visible
        // Remove sensitive fields for public users
        company_name: 'Company Name Hidden',
        // Add public-friendly fields
        can_bid: false,
        requires_account: true,
        job_summary: `${job.job_type === 'tech' ? 'Equipment Service' : 'Training'} needed for ${job.model} in ${job.shipping_state}`
      }))
    } else {
      // Authenticated and approved user - full information
      processedJobs = processedJobs.map(job => {
        const canBid = (
          (job.job_type === 'tech' && userProfile.role_tech) ||
          (job.job_type === 'trainer' && userProfile.role_trainer)
        )
        
        return {
          ...job,
          can_bid: canBid,
          requires_account: false,
          job_summary: `${job.job_type === 'tech' ? 'Equipment Service' : 'Training'} needed for ${job.model}`
        }
      })
    }

    console.log(`Successfully fetched ${processedJobs.length} jobs`)

    return NextResponse.json({
      jobs: processedJobs,
      pagination: {
        page,
        limit,
        total: totalJobs,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      filters: {
        status,
        job_type: jobType,
        state,
        city,
        priority
      },
      user_access: {
        authenticated: !!authenticatedUser,
        approved: !!userProfile?.is_approved,
        role_tech: userProfile?.role_tech || false,
        role_trainer: userProfile?.role_trainer || false
      }
    })

  } catch (error) {
    console.error('Public jobs API error:', error)
    return NextResponse.json(
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    )
  }
}
