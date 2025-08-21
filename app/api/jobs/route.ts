import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// GET - List jobs with filters (admin only)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const jobType = searchParams.get('job_type')
    const priority = searchParams.get('priority')
    const state = searchParams.get('state')
    const city = searchParams.get('city')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = (page - 1) * limit

    // Get user from auth cookie
    const cookieStore = cookies()
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Get user session
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      cookieStore.get('sb-access-token')?.value
    )

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Check if user is admin (approved user)
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('is_approved')
      .eq('user_id', user.id)
      .single()

    if (profileError || !profile || !profile.is_approved) {
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
        bids(id, ask_price, bidder_id, status, created_at),
        profiles!bids(bidder_id)(full_name, role_tech, role_trainer, base_city, base_state)
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Apply filters
    if (status) {
      query = query.eq('status', status)
    }
    
    if (jobType) {
      query = query.eq('job_type', jobType)
    }
    
    if (priority) {
      query = query.eq('priority', priority)
    }
    
    if (state) {
      query = query.eq('shipping_state', state)
    }
    
    if (city) {
      query = query.eq('shipping_city', city)
    }

    // Get total count for pagination
    let countQuery = supabase
      .from('jobs')
      .select('id', { count: 'exact', head: true })

    // Apply same filters to count query
    if (status) countQuery = countQuery.eq('status', status)
    if (jobType) countQuery = countQuery.eq('job_type', jobType)
    if (priority) countQuery = countQuery.eq('priority', priority)
    if (state) countQuery = countQuery.eq('shipping_state', state)
    if (city) countQuery = countQuery.eq('shipping_city', city)

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

// POST - Create new job (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      job_type, 
      title, 
      company_name, 
      customer_name, 
      model, 
      priority, 
      status, 
      met_date, 
      shipping_state, 
      shipping_city,
      address_line1,
      address_line2,
      zip,
      contact_name,
      contact_phone,
      contact_email,
      instructions_public,
      instructions_private,
      external_id
    } = body

    // Validation
    if (!job_type || !title || !company_name || !customer_name || !model || !priority || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get user from auth cookie
    const cookieStore = cookies()
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Get user session
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      cookieStore.get('sb-access-token')?.value
    )

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('is_approved')
      .eq('user_id', user.id)
      .single()

    if (profileError || !profile || !profile.is_approved) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    // Create job
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .insert({
        job_type,
        title,
        company_name,
        customer_name,
        model,
        priority,
        status,
        met_date,
        shipping_state,
        shipping_city,
        address_line1,
        address_line2,
        zip,
        contact_name,
        contact_phone,
        contact_email,
        instructions_public,
        instructions_private,
        external_id,
        created_by: user.id
      })
      .select()
      .single()

    if (jobError) {
      console.error('Error creating job:', jobError)
      return NextResponse.json(
        { error: 'Failed to create job' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Job created successfully',
      job
    })

  } catch (error) {
    console.error('Job creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
