import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { job_id, ask_price, note } = body

    // Validation
    if (!job_id || !ask_price) {
      return NextResponse.json(
        { error: 'Missing required fields: job_id, ask_price' },
        { status: 400 }
      )
    }

    if (typeof ask_price !== 'number' || ask_price <= 0) {
      return NextResponse.json(
        { error: 'ask_price must be a positive number' },
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

    // Check if user is approved
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('is_approved, role_tech, role_trainer')
      .eq('user_id', user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      )
    }

    if (!profile.is_approved) {
      return NextResponse.json(
        { error: 'Account must be approved before placing bids' },
        { status: 403 }
      )
    }

    // Check if job exists and is open for bidding
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('id, job_type, status, title')
      .eq('id', job_id)
      .in('status', ['OPEN', 'BIDDING'])
      .single()

    if (jobError || !job) {
      return NextResponse.json(
        { error: 'Job not found or not open for bidding' },
        { status: 404 }
      )
    }

    // Check if user has the right role for this job
    if (job.job_type === 'tech' && !profile.role_tech) {
      return NextResponse.json(
        { error: 'Only technicians can bid on technician jobs' },
        { status: 403 }
      )
    }

    if (job.job_type === 'trainer' && !profile.role_trainer) {
      return NextResponse.json(
        { error: 'Only trainers can bid on trainer jobs' },
        { status: 403 }
      )
    }

    // Check if user already has an active bid on this job
    const { data: existingBid } = await supabase
      .from('bids')
      .select('id')
      .eq('job_id', job_id)
      .eq('bidder_id', user.id)
      .eq('status', 'submitted')
      .single()

    if (existingBid) {
      return NextResponse.json(
        { error: 'You already have an active bid on this job' },
        { status: 409 }
      )
    }

    // Create the bid
    const { data: bid, error: bidError } = await supabase
      .from('bids')
      .insert({
        job_id,
        bidder_id: user.id,
        ask_price,
        note: note || null,
        status: 'submitted'
      })
      .select()
      .single()

    if (bidError) {
      console.error('Error creating bid:', bidError)
      return NextResponse.json(
        { error: 'Failed to create bid' },
        { status: 500 }
      )
    }

    // Update job status to BIDDING if it was OPEN
    if (job.status === 'OPEN') {
      await supabase
        .from('jobs')
        .update({ status: 'BIDDING' })
        .eq('id', job_id)
    }

    // Send admin alert email (we'll implement this next)
    try {
      await sendAdminBidAlert({
        job_id,
        job_title: job.title,
        bidder_id: user.id,
        bidder_email: user.email!,
        ask_price,
        note
      })
    } catch (emailError) {
      console.error('Failed to send admin bid alert email:', emailError)
      // Don't fail the bid if email fails
    }

    return NextResponse.json({
      message: 'Bid placed successfully',
      bid: {
        id: bid.id,
        job_id: bid.job_id,
        ask_price: bid.ask_price,
        note: bid.note,
        status: bid.status,
        created_at: bid.created_at
      }
    })

  } catch (error) {
    console.error('Bid creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function sendAdminBidAlert(bidData: {
  job_id: string
  job_title: string
  bidder_id: string
  bidder_email: string
  ask_price: number
  note?: string
}) {
  // TODO: Implement Resend email sending
  // For now, just log the alert
  console.log('ADMIN ALERT - New bid:', bidData)
}
