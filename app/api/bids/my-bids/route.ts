import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
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

    // Fetch all bids for the user with job details
    const { data: bids, error: bidsError } = await supabase
      .from('bids')
      .select(`
        id,
        job_id,
        user_id,
        amount,
        message,
        status,
        created_at,
        jobs (
          id,
          title,
          job_type,
          company_name,
          customer_name,
          priority,
          status,
          met_date,
          shipping_city,
          shipping_state
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (bidsError) {
      console.error('Error fetching bids:', bidsError);
      return NextResponse.json(
        { error: 'Failed to fetch bids' },
        { status: 500 }
      );
    }

    // Transform the data to flatten the job details
    const transformedBids = bids?.map(bid => ({
      id: bid.id,
      job_id: bid.job_id,
      user_id: bid.user_id,
      amount: bid.amount,
      message: bid.message,
      status: bid.status,
      created_at: bid.created_at,
      job: bid.jobs
    })) || [];

    return NextResponse.json({
      bids: transformedBids,
      count: transformedBids.length
    });

  } catch (error) {
    console.error('Error in my-bids API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
