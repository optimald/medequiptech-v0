import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

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
      .select('is_approved, role_tech, role_trainer')
      .eq('user_id', user.id)
      .single()

    if (profileError || !profile || !profile.is_approved) {
      return NextResponse.json(
        { error: 'User must be approved to place bids' },
        { status: 403 }
      )
    }

    // Get job details to check if user can bid on this job type
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('job_type, status, title')
      .eq('id', job_id)
      .single()

    if (jobError || !job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }

    // Check if job is open for bidding
    if (!['OPEN', 'BIDDING'].includes(job.status)) {
      return NextResponse.json(
        { error: 'Job is not open for bidding' },
        { status: 400 }
      )
    }

    // Check if user has the right role for this job
    if (job.job_type === 'tech' && !profile.role_tech) {
      return NextResponse.json(
        { error: 'Only technicians can bid on tech jobs' },
        { status: 403 }
      )
    }

    if (job.job_type === 'trainer' && !profile.role_trainer) {
      return NextResponse.json(
        { error: 'Only trainers can bid on trainer jobs' },
        { status: 403 }
      )
    }

    // Check if user already has a bid on this job
    const { data: existingBid, error: bidCheckError } = await supabase
      .from('bids')
      .select('id')
      .eq('job_id', job_id)
      .eq('bidder_id', user.id)
      .eq('status', 'submitted')
      .single()

    if (bidCheckError && bidCheckError.code !== 'PGRST116') {
      console.error('Error checking existing bid:', bidCheckError)
      return NextResponse.json(
        { error: 'Failed to check existing bid' },
        { status: 500 }
      )
    }

    if (existingBid) {
      return NextResponse.json(
        { error: 'You already have a bid on this job' },
        { status: 400 }
      )
    }

    // Create the bid
    const { data: newBid, error: createError } = await supabase
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

    if (createError) {
      console.error('Error creating bid:', createError)
      return NextResponse.json(
        { error: 'Failed to create bid' },
        { status: 500 }
      )
    }

    // Update job status to BIDDING if it was OPEN
    if (job.status === 'OPEN') {
      const { error: updateError } = await supabase
        .from('jobs')
        .update({ status: 'BIDDING' })
        .eq('id', job_id)

      if (updateError) {
        console.error('Error updating job status:', updateError)
        // Don't fail the bid creation if status update fails
      }
    }

    // Send notification to admin about new bid
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
      
      if (bidderProfile) {
        // Send bid alert email
        const result = await emailService.sendBidAlert({
          job_title: job.title || 'Unknown Job',
          bidder_name: bidderProfile.full_name || 'Unknown Bidder',
          bidder_location: `${bidderProfile.base_city || 'Unknown'}, ${bidderProfile.base_state || 'Unknown'}`,
          ask_price,
          job_id: job_id
        }, adminEmails)
        
        if (result.success) {
          console.log('Bid alert email sent successfully')
        } else {
          console.error('Failed to send bid alert email:', result.error)
        }
      }
    } catch (emailError) {
      console.error('Error sending bid alert email:', emailError)
      // Don't fail the bid creation if email fails
    }

    return NextResponse.json({
      message: 'Bid placed successfully',
      bid: newBid
    }, { status: 201 })

  } catch (error) {
    console.error('Bid creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
      )
  }
}
