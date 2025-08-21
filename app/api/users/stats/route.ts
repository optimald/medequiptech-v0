import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function GET(request: NextRequest) {
  try {
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

    // Get user profile to determine role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role_tech, role_trainer, is_approved')
      .eq('user_id', user.id)
      .single()

    if (profileError) {
      console.error('Error fetching profile:', profileError)
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    let stats = {
      openJobs: 0,
      myBids: 0,
      awardedJobs: 0,
      pendingApprovals: 0,
      activeBids: 0,
      totalUsers: 0
    }

    // If user is approved, get their stats
    if (profile.is_approved) {
      // Get open jobs count (filtered by user's role)
      let jobTypeFilter = []
      if (profile.role_tech) jobTypeFilter.push('tech')
      if (profile.role_trainer) jobTypeFilter.push('trainer')

      if (jobTypeFilter.length > 0) {
        const { count: openJobsCount } = await supabase
          .from('jobs')
          .select('*', { count: 'exact', head: true })
          .in('status', ['OPEN', 'BIDDING'])
          .in('job_type', jobTypeFilter)

        stats.openJobs = openJobsCount || 0
      }

      // Get user's active bids count
      const { count: myBidsCount } = await supabase
        .from('bids')
        .select('*', { count: 'exact', head: true })
        .eq('bidder_id', user.id)
        .eq('status', 'submitted')

      stats.myBids = myBidsCount || 0

      // Get user's awarded jobs count
      const { count: awardedJobsCount } = await supabase
        .from('awards')
        .select('*', { count: 'exact', head: true })
        .eq('awarded_user_id', user.id)

      stats.awardedJobs = awardedJobsCount || 0
    }

    // If user is admin (has both roles), get admin stats
    if (profile.role_tech && profile.role_trainer && profile.is_approved) {
      // Get pending approvals count
      const { count: pendingApprovalsCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('is_approved', false)

      stats.pendingApprovals = pendingApprovalsCount || 0

      // Get total active bids count
      const { count: activeBidsCount } = await supabase
        .from('bids')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'submitted')

      stats.activeBids = activeBidsCount || 0

      // Get total users count
      const { count: totalUsersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

      stats.totalUsers = totalUsersCount || 0
    }

    return NextResponse.json({
      stats
    })

  } catch (error) {
    console.error('Stats fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
