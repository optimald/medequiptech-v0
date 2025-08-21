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

    // TODO: Send notification to admin about bid withdrawal
    // TODO: Send email notification

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
