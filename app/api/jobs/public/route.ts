import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'OPEN'
    const jobType = searchParams.get('job_type')
    const state = searchParams.get('state')
    const city = searchParams.get('city')
    const priority = searchParams.get('priority')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
      },
      filters: {
        status,
        job_type: jobType,
        state,
        city,
        priority
      }
    })

  } catch (error) {
    console.error('Public jobs API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
