import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: job_id } = params
    const body = await request.json()
    const { awarded_user_id } = body

    if (!job_id || !awarded_user_id) {
      return NextResponse.json(
        { error: 'Missing required fields: job_id, awarded_user_id' },
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

    // Check if job exists and is in a state that can be awarded
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('id, status, title, job_type')
      .eq('id', job_id)
      .in('status', ['OPEN', 'BIDDING'])
      .single()

    if (jobError || !job) {
      return NextResponse.json(
        { error: 'Job not found or not available for award' },
        { status: 404 }
      )
    }

    // Check if the awarded user has an active bid on this job
    const { data: bid, error: bidError } = await supabase
      .from('bids')
      .select('id, ask_price, note')
      .eq('job_id', job_id)
      .eq('bidder_id', awarded_user_id)
      .eq('status', 'submitted')
      .single()

    if (bidError || !bid) {
      return NextResponse.json(
        { error: 'User does not have an active bid on this job' },
        { status: 400 }
      )
    }

    // Check if the awarded user is approved and has the right role
    const { data: awardedProfile, error: awardedProfileError } = await supabase
      .from('profiles')
      .select('is_approved, role_tech, role_trainer')
      .eq('user_id', awarded_user_id)
      .single()

    if (awardedProfileError || !awardedProfile) {
      return NextResponse.json(
        { error: 'Awarded user profile not found' },
        { status: 404 }
      )
    }

    if (!awardedProfile.is_approved) {
      return NextResponse.json(
        { error: 'Cannot award job to unapproved user' },
        { status: 400 }
      )
    }

    // Check role compatibility
    if (job.job_type === 'tech' && !awardedProfile.role_tech) {
      return NextResponse.json(
        { error: 'Cannot award technician job to non-technician user' },
        { status: 400 }
      )
    }

    if (job.job_type === 'trainer' && !awardedProfile.role_trainer) {
      return NextResponse.json(
        { error: 'Cannot award trainer job to non-trainer user' },
        { status: 400 }
      )
    }

    // Create award record
    const { data: award, error: awardError } = await supabase
      .from('awards')
      .insert({
        job_id,
        awarded_user_id,
        awarded_by: user.id
      })
      .select()
      .single()

    if (awardError) {
      console.error('Error creating award:', awardError)
      return NextResponse.json(
        { error: 'Failed to create award' },
        { status: 500 }
      )
    }

    // Update job status to AWARDED
    const { error: jobUpdateError } = await supabase
      .from('jobs')
      .update({ status: 'AWARDED' })
      .eq('id', job_id)

    if (jobUpdateError) {
      console.error('Error updating job status:', jobUpdateError)
      // Try to rollback the award
      await supabase.from('awards').delete().eq('id', award.id)
      return NextResponse.json(
        { error: 'Failed to update job status' },
        { status: 500 }
      )
    }

    // Update the winning bid status to accepted
    const { error: bidUpdateError } = await supabase
      .from('bids')
      .update({ status: 'accepted' })
      .eq('id', bid.id)

    if (bidUpdateError) {
      console.error('Error updating bid status:', bidUpdateError)
      // Don't fail the award for this
    }

    // Update all other bids to rejected
    const { error: rejectBidsError } = await supabase
      .from('bids')
      .update({ status: 'rejected' })
      .eq('job_id', job_id)
      .neq('bidder_id', awarded_user_id)
      .eq('status', 'submitted')

    if (rejectBidsError) {
      console.error('Error rejecting other bids:', rejectBidsError)
      // Don't fail the award for this
    }

    // Send award notice email (we'll implement this next)
    try {
      await sendAwardNotice({
        job_id,
        job_title: job.title,
        awarded_user_id,
        ask_price: bid.ask_price
      })
    } catch (emailError) {
      console.error('Failed to send award notice email:', emailError)
      // Don't fail the award if email fails
    }

    return NextResponse.json({
      message: 'Job awarded successfully',
      award: {
        id: award.id,
        job_id: award.job_id,
        awarded_user_id: award.awarded_user_id,
        awarded_at: award.awarded_at
      }
    })

  } catch (error) {
    console.error('Job award error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
      )
  }
}

async function sendAwardNotice(awardData: {
  job_id: string
  job_title: string
  awarded_user_id: string
  ask_price: number
}) {
  // TODO: Implement Resend email sending
  // For now, just log the notice
  console.log('AWARD NOTICE:', awardData)
}
