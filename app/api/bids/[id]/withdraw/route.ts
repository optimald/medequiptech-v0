import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const bidId = params.id;

    // First, verify the bid belongs to the user and is in a withdrawable state
    const { data: existingBid, error: fetchError } = await supabase
      .from('bids')
      .select('id, user_id, status, job_id')
      .eq('id', bidId)
      .single();

    if (fetchError || !existingBid) {
      return NextResponse.json(
        { error: 'Bid not found' },
        { status: 404 }
      );
    }

    // Check if the bid belongs to the authenticated user
    if (existingBid.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized to withdraw this bid' },
        { status: 403 }
      );
    }

    // Check if the bid can be withdrawn (only PENDING bids can be withdrawn)
    if (existingBid.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Only pending bids can be withdrawn' },
        { status: 400 }
      );
    }

    // Update the bid status to WITHDRAWN
    const { error: updateError } = await supabase
      .from('bids')
      .update({ status: 'WITHDRAWN' })
      .eq('id', bidId);

    if (updateError) {
      console.error('Error updating bid status:', updateError);
      return NextResponse.json(
        { error: 'Failed to withdraw bid' },
        { status: 500 }
      );
    }

    // Check if this was the only bid on the job, and if so, revert job status to OPEN
    const { data: otherBids, error: otherBidsError } = await supabase
      .from('bids')
      .select('id')
      .eq('job_id', existingBid.job_id)
      .neq('status', 'WITHDRAWN');

    if (otherBidsError) {
      console.error('Error checking other bids:', otherBidsError);
    } else if (!otherBids || otherBids.length === 0) {
      // No other active bids, revert job status to OPEN
      const { error: jobUpdateError } = await supabase
        .from('jobs')
        .update({ status: 'OPEN' })
        .eq('id', existingBid.job_id);

      if (jobUpdateError) {
        console.error('Error updating job status:', jobUpdateError);
      }
    }

    return NextResponse.json({
      message: 'Bid withdrawn successfully',
      bidId: bidId
    });

  } catch (error) {
    console.error('Error in withdraw bid API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
