import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const jobId = params.id
    const body = await request.json()
    const { bid_id, awarded_user_id, notes } = body

    if (!jobId || !bid_id || !awarded_user_id) {
      return NextResponse.json(
        { error: 'Job ID, bid ID, and awarded user ID are required' },
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
        { error: 'Admin access required to award jobs' },
        { status: 403 }
      )
    }

    // Verify the job exists and is in BIDDING status
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('id, status, title, job_type')
      .eq('id', jobId)
      .eq('status', 'BIDDING')
      .single()

    if (jobError || !job) {
      return NextResponse.json(
        { error: 'Job not found or not in bidding status' },
        { status: 404 }
      )
    }

    // Verify the bid exists and is for this job
    const { data: bid, error: bidError } = await supabase
      .from('bids')
      .select('id, bidder_id, ask_price, status')
      .eq('id', bid_id)
      .eq('job_id', jobId)
      .eq('status', 'submitted')
      .single()

    if (bidError || !bid) {
      return NextResponse.json(
        { error: 'Bid not found or not valid for this job' },
        { status: 404 }
      )
    }

    // Verify the awarded user exists and is approved
    const { data: awardedUser, error: userError } = await supabase
      .from('profiles')
      .select('id, is_approved, role_tech, role_trainer')
      .eq('user_id', awarded_user_id)
      .eq('is_approved', true)
      .single()

    if (userError || !awardedUser) {
      return NextResponse.json(
        { error: 'Awarded user not found or not approved' },
        { status: 404 }
      )
    }

    // Verify the awarded user has the right role for this job
    if (job.job_type === 'tech' && !awardedUser.role_tech) {
      return NextResponse.json(
        { error: 'Awarded user must be a technician for tech jobs' },
        { status: 400 }
      )
    }

    if (job.job_type === 'trainer' && !awardedUser.role_trainer) {
      return NextResponse.json(
        { error: 'Awarded user must be a trainer for trainer jobs' },
        { status: 400 }
      )
    }

    // Start a transaction to update multiple tables
    const { error: awardError } = await supabase
      .from('awards')
      .insert({
        job_id: jobId,
        bid_id: bid_id,
        awarded_user_id: awarded_user_id,
        awarded_by: user.id,
        award_amount: bid.ask_price,
        notes: notes || null,
        status: 'active'
      })

    if (awardError) {
      console.error('Error creating award:', awardError)
      return NextResponse.json(
        { error: 'Failed to create award' },
        { status: 500 }
      )
    }

    // Update the bid status to accepted
    const { error: bidUpdateError } = await supabase
      .from('bids')
      .update({ status: 'accepted' })
      .eq('id', bid_id)

    if (bidUpdateError) {
      console.error('Error updating bid status:', bidUpdateError)
      return NextResponse.json(
        { error: 'Failed to update bid status' },
        { status: 500 }
      )
    }

    // Update job status to AWARDED
    const { error: jobUpdateError } = await supabase
      .from('jobs')
      .update({ 
        status: 'AWARDED',
        awarded_to: awarded_user_id,
        awarded_at: new Date().toISOString()
      })
      .eq('id', jobId)

    if (jobUpdateError) {
      console.error('Error updating job status:', jobUpdateError)
      return NextResponse.json(
        { error: 'Failed to update job status' },
        { status: 500 }
      )
    }

    // Reject all other bids on this job
    const { error: rejectBidsError } = await supabase
      .from('bids')
      .update({ status: 'rejected' })
      .eq('job_id', jobId)
      .neq('id', bid_id)

    if (rejectBidsError) {
      console.error('Error rejecting other bids:', rejectBidsError)
      // Don't fail the award if bid rejection fails
    }

    // Send notification to awarded user
    try {
      // Import email service dynamically to avoid issues in API routes
      const { emailService } = await import('@/lib/email-service')
      
      // Get awarded user email from auth.users
      const { data: awardedUserAuth } = await supabase.auth.admin.getUserById(awarded_user_id)
      
      if (awardedUserAuth?.user?.email) {
        // Get job details for email
        const { data: jobDetails } = await supabase
          .from('jobs')
          .select('title, company_name, shipping_city, shipping_state, met_date')
          .eq('id', jobId)
          .single()
        
        if (jobDetails) {
          // Send job awarded email
          const result = await emailService.sendJobAwarded(
            awardedUserAuth.user.email,
            awardedUser.full_name || 'User',
            {
              title: jobDetails.title,
              company_name: jobDetails.company_name,
              shipping_city: jobDetails.shipping_city,
              shipping_state: jobDetails.shipping_state,
              met_date: jobDetails.met_date
            }
          )
          
          if (result.success) {
            console.log('Job awarded email sent successfully')
          } else {
            console.error('Failed to send job awarded email:', result.error)
          }
        }
      }
    } catch (emailError) {
      console.error('Error sending job awarded email:', emailError)
      // Don't fail the award if email fails
    }

    return NextResponse.json({
      message: 'Job awarded successfully',
      job_id: jobId,
      awarded_user_id: awarded_user_id,
      award_amount: bid.ask_price
    }, { status: 201 })

  } catch (error) {
    console.error('Job award error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
      )
  }
}
