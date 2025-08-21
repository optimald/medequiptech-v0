import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      )
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Get job details (limited public fields)
    const { data: job, error } = await supabase
      .from('jobs')
      .select(`
        id,
        job_type,
        title,
        company_name,
        customer_name,
        model,
        priority,
        status,
        met_date,
        shipping_city,
        shipping_state,
        instructions_public
      `)
      .eq('id', id)
      .in('status', ['OPEN', 'BIDDING'])
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Job not found or not publicly accessible' },
          { status: 404 }
        )
      }
      console.error('Error fetching job:', error)
      return NextResponse.json(
        { error: 'Failed to fetch job details' },
        { status: 500 }
      )
    }

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }

    // Get bid count for this job (public info)
    const { count: bidCount } = await supabase
      .from('bids')
      .select('*', { count: 'exact', head: true })
      .eq('job_id', id)
      .eq('status', 'submitted')

    return NextResponse.json({
      job: {
        ...job,
        bid_count: bidCount || 0
      }
    })

  } catch (error) {
    console.error('Public job detail API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
