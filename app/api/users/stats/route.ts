import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
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

    // Get user profile to determine role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role_tech, role_trainer, role_admin')
      .eq('user_id', user.id)
      .single()

    if (profileError) {
      console.error('Error fetching profile:', profileError)
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    let stats = {}

    if (profile.role_admin) {
      // Admin stats
      const [openJobsResult, totalUsersResult, pendingApprovalsResult, activeBidsResult] = await Promise.all([
        supabase.from('jobs').select('id', { count: 'exact', head: true }).eq('status', 'OPEN'),
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('is_approved', false),
        supabase.from('bids').select('id', { count: 'exact', head: true }).eq('status', 'submitted')
      ])

      stats = {
        openJobs: openJobsResult.count || 0,
        totalUsers: totalUsersResult.count || 0,
        pendingApprovals: pendingApprovalsResult.count || 0,
        myBids: activeBidsResult.count || 0  // For admin, this represents total active bids
      }
    } else if (profile.role_tech || profile.role_trainer) {
      // Tech/Trainer stats
      const [openJobsResult, myBidsResult, awardedJobsResult] = await Promise.all([
        supabase.from('jobs').select('id', { count: 'exact', head: true })
          .eq('status', 'OPEN')
          .eq('job_type', profile.role_tech ? 'tech' : 'trainer'),
        supabase.from('bids').select('id', { count: 'exact', head: true })
          .eq('bidder_id', user.id)
          .in('status', ['submitted', 'accepted']),
        supabase.from('awards').select('id', { count: 'exact', head: true })
          .eq('awarded_user_id', user.id)
      ])

      stats = {
        openJobs: openJobsResult.count || 0,
        myBids: myBidsResult.count || 0,
        awardedJobs: awardedJobsResult.count || 0
      }
    } else {
      // MedSpa stats
      stats = {
        openJobs: 0,
        myBids: 0,
        awardedJobs: 0
      }
    }

    return NextResponse.json({ stats })

  } catch (error) {
    console.error('Stats fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
      )
  }
}
