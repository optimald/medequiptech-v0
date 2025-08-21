import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const jobType = searchParams.get('job_type')
    const priority = searchParams.get('priority')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit

    // Create Supabase client with auth context
    const supabase = createRouteHandlerClient({ cookies })

    // Get user session
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role_admin')
      .eq('user_id', user.id)
      .single()

    if (profileError || !profile || !profile.role_admin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    // Build query
    let query = supabase
      .from('jobs')
      .select(`
        *,
        bids(id, ask_price, bidder_id, status, created_at)
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Apply filters
    if (status && status !== 'all') {
      query = query.eq('status', status)
    }
    
    if (jobType && jobType !== 'all') {
      query = query.eq('job_type', jobType)
    }
    
    if (priority && priority !== 'all') {
      query = query.eq('priority', priority)
    }

    // Get total count for pagination
    let countQuery = supabase
      .from('jobs')
      .select('id', { count: 'exact', head: true })

    // Apply same filters to count query
    if (status && status !== 'all') {
      countQuery = countQuery.eq('status', status)
    }
    if (jobType && jobType !== 'all') {
      countQuery = countQuery.eq('job_type', jobType)
    }
    if (priority && priority !== 'all') {
      countQuery = countQuery.eq('priority', priority)
    }

    // Execute queries
    const [jobsResult, countResult] = await Promise.all([
      query,
      countQuery
    ])

    if (jobsResult.error) {
      console.error('Error fetching jobs:', jobsResult.error)
      return NextResponse.json(
        { error: 'Failed to fetch jobs' },
        { status: 500 }
      )
    }

    if (countResult.error) {
      console.error('Error counting jobs:', countResult.error)
      return NextResponse.json(
        { error: 'Failed to count jobs' },
        { status: 500 }
      )
    }

    const totalJobs = countResult.count || 0
    const totalPages = Math.ceil(totalJobs / limit)

    return NextResponse.json({
      jobs: jobsResult.data || [],
      pagination: {
        page,
        limit,
        total: totalJobs,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    })

  } catch (error) {
    console.error('Admin jobs API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
      )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Create Supabase client with auth context
    const supabase = createRouteHandlerClient({ cookies })

    // Get user session
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role_admin')
      .eq('user_id', user.id)
      .single()

    if (profileError || !profile || !profile.role_admin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    // Create new job
    const { data: newJob, error: createError } = await supabase
      .from('jobs')
      .insert({
        ...body,
        created_by: user.id
      })
      .select()
      .single()

    if (createError) {
      console.error('Error creating job:', createError)
      return NextResponse.json(
        { error: 'Failed to create job' },
        { status: 500 }
      )
    }

    return NextResponse.json({ job: newJob }, { status: 201 })

  } catch (error) {
    console.error('Create job error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
      )
  }
}
