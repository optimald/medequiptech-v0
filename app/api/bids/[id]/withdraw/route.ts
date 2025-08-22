import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bidId = params.id
    const body = await request.json()
    const { reason } = body

    if (!bidId) {
      return NextResponse.json(
        { error: 'Bid ID is required' },
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

    // Check if user is approved
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('is_approved')
      .eq('user_id', user.id)
      .single()

    if (profileError || !profile || !profile.is_approved) {
      return NextResponse.json(
        { error: 'User must be approved to withdraw bids' },
        { status: 403 }
      )
    }

    // Get the bid to verify ownership and status
    const { data: bid, error: bidError } = await supabase
      .from('bids')
      .select('*')
      .eq('id', bidId)
      .eq('bidder_id', user.id)
      .single()

    if (bidError || !bid) {
      return NextResponse.json(
        { error: 'Bid not found or access denied' },
        { status: 404 }
      )
    }

    // Check if bid can be withdrawn
    if (bid.status !== 'submitted') {
      return NextResponse.json(
        { error: 'Only submitted bids can be withdrawn' },
        { status: 400 }
      )
    }

    // Withdraw the bid
    const { error: updateError } = await supabase
      .from('bids')
      .update({ 
        status: 'withdrawn',
        withdrawn_at: new Date().toISOString(),
        withdrawal_reason: reason || null
      })
      .eq('id', bidId)

    if (updateError) {
      console.error('Error withdrawing bid:', updateError)
      return NextResponse.json(
        { error: 'Failed to withdraw bid' },
        { status: 500 }
      )
    }

    // Check if this was the only bid on the job, and if so, revert job status to OPEN
    const { data: remainingBids, error: remainingBidsError } = await supabase
      .from('bids')
      .select('id')
      .eq('job_id', bid.job_id)
      .eq('status', 'submitted')

    if (remainingBidsError) {
      console.error('Error checking remaining bids:', remainingBidsError)
      // Don't fail the withdrawal if this check fails
    } else if (!remainingBids || remainingBids.length === 0) {
      // No more submitted bids, revert job to OPEN status
      const { error: jobUpdateError } = await supabase
        .from('jobs')
        .update({ status: 'OPEN' })
        .eq('id', bid.job_id)

      if (jobUpdateError) {
        console.error('Error updating job status:', jobUpdateError)
        // Don't fail the withdrawal if job status update fails
      }
    }

    // Send notification to admin about bid withdrawal
    try {
      // Import email service dynamically to avoid issues in API routes
      const { emailService } = await import('@/lib/email-service')
      
      // Get admin emails from environment or use a default
      const adminEmails = process.env.ADMIN_ALERT_EMAILS?.split(',') || ['admin@medequiptech.com']
      
      // Get bidder profile info
      const { data: bidderProfile } = await supabase
        .from('profiles')
        .select('full_name, base_city, base_state')
        .eq('user_id', user.id)
        .single()
      
      // Get job details
      const { data: jobDetails } = await supabase
        .from('jobs')
        .select('title')
        .eq('id', bid.job_id)
        .single()
      
      if (bidderProfile && jobDetails) {
        // Send bid withdrawal alert email
        const result = await emailService.sendBidAlert({
          job_title: jobDetails.title || 'Unknown Job',
          bidder_name: bidderProfile.full_name || 'Unknown Bidder',
          bidder_location: `${bidderProfile.base_city || 'Unknown'}, ${bidderProfile.base_state || 'Unknown'}`,
          ask_price: bid.ask_price,
          job_id: bid.job_id
        }, adminEmails)
        
        if (result.success) {
          console.log('Bid withdrawal alert email sent successfully')
        } else {
          console.error('Failed to send bid withdrawal alert email:', result.error)
        }
      }
    } catch (emailError) {
      console.error('Error sending bid withdrawal alert email:', emailError)
      // Don't fail the bid withdrawal if email fails
    }

    return NextResponse.json({
      message: 'Bid withdrawn successfully',
      bid_id: bidId
    })

  } catch (error) {
    console.error('Bid withdrawal error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
      )
  }
}
