import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const jobId = params.id

    if (!jobId) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      )
    }

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

    // Get all awards for this job
    const { data: awards, error: awardsError } = await supabase
      .from('awards')
      .select(`
        id,
        job_id,
        bid_id,
        awarded_user_id,
        awarded_by,
        award_amount,
        notes,
        status,
        created_at
      `)
      .eq('job_id', jobId)
      .order('created_at', { ascending: false })

    if (awardsError) {
      console.error('Error fetching awards:', awardsError)
      return NextResponse.json(
        { error: 'Failed to fetch awards' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      awards: awards || []
    })

  } catch (error) {
    console.error('Awards fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
