import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
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

    // Check if user is approved
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('is_approved')
      .eq('user_id', user.id)
      .single()

    if (profileError || !profile || !profile.is_approved) {
      return NextResponse.json(
        { error: 'User must be approved to view bids' },
        { status: 403 }
      )
    }

    // Build query for user's bids
    let query = supabase
      .from('bids')
      .select(`
        *,
        jobs!inner(
          id,
          title,
          company_name,
          shipping_city,
          shipping_state,
          job_type,
          priority,
          status,
          met_date
        )
      `)
      .eq('bidder_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Apply status filter if provided
    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    // Get total count for pagination
    let countQuery = supabase
      .from('bids')
      .select('id', { count: 'exact', head: true })
      .eq('bidder_id', user.id)

    if (status && status !== 'all') {
      countQuery = countQuery.eq('status', status)
    }

    // Execute queries
    const [bidsResult, countResult] = await Promise.all([
      query,
      countQuery
    ])

    if (bidsResult.error) {
      console.error('Error fetching bids:', bidsResult.error)
      return NextResponse.json(
        { error: 'Failed to fetch bids' },
        { status: 500 }
      )
    }

    if (countResult.error) {
      console.error('Error counting bids:', countResult.error)
      return NextResponse.json(
        { error: 'Failed to count bids' },
        { status: 500 }
      )
    }

    const totalBids = countResult.count || 0
    const totalPages = Math.ceil(totalBids / limit)

    return NextResponse.json({
      bids: bidsResult.data || [],
      pagination: {
        page,
        limit,
        total: totalBids,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    })

  } catch (error) {
    console.error('My bids API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
      )
  }
}
