import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      segment_json, 
      job_ids, 
      template_key, 
      subject,
      preview_only = false 
    } = body

    // Validation
    if (!segment_json || !template_key || !subject) {
      return NextResponse.json(
        { error: 'Missing required fields: segment_json, template_key, subject' },
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
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    // Build recipient query based on segment
    let recipientQuery = supabase
      .from('profiles')
      .select(`
        user_id,
        full_name,
        email:auth.users!inner(email),
        role_tech,
        role_trainer,
        base_city,
        base_state,
        service_radius_mi
      `)
      .eq('is_approved', true)

    // Apply segment filters
    if (segment_json.job_type) {
      if (segment_json.job_type === 'tech') {
        recipientQuery = recipientQuery.eq('role_tech', true)
      } else if (segment_json.job_type === 'trainer') {
        recipientQuery = recipientQuery.eq('role_trainer', true)
      }
    }

    if (segment_json.states && segment_json.states.length > 0) {
      recipientQuery = recipientQuery.in('base_state', segment_json.states)
    }

    if (segment_json.cities && segment_json.cities.length > 0) {
      recipientQuery = recipientQuery.in('base_city', segment_json.cities)
    }

    if (segment_json.min_radius) {
      recipientQuery = recipientQuery.gte('service_radius_mi', segment_json.min_radius)
    }

    // Get recipients
    const { data: recipients, error: recipientsError } = await recipientQuery

    if (recipientsError) {
      console.error('Error fetching recipients:', recipientsError)
      return NextResponse.json(
        { error: 'Failed to fetch recipients' },
        { status: 500 }
      )
    }

    // Get job details if job_ids provided
    let jobs: any[] = []
    if (job_ids && job_ids.length > 0) {
      const { data: jobsData, error: jobsError } = await supabase
        .from('jobs')
        .select(`
          id,
          title,
          company_name,
          customer_name,
          model,
          priority,
          met_date,
          shipping_city,
          shipping_state,
          job_type
        `)
        .in('id', job_ids)
        .in('status', ['OPEN', 'BIDDING'])
        .order('priority', { ascending: true })
        .order('met_date', { ascending: true })

      if (jobsError) {
        console.error('Error fetching jobs:', jobsError)
        return NextResponse.json(
          { error: 'Failed to fetch jobs' },
          { status: 500 }
        )
      }
      jobs = jobsData || []
    }

    // Prepare email data
    const emailData = {
      recipients: recipients || [],
      jobs,
      segment: segment_json,
      template: template_key,
      subject,
      total_recipients: recipients?.length || 0,
      total_jobs: jobs.length
    }

    if (preview_only) {
      return NextResponse.json({
        message: 'Preview generated successfully',
        preview: emailData
      })
    }

    // TODO: Implement actual email sending via Resend
    // For now, just log the campaign
    console.log('BULK EMAIL CAMPAIGN:', emailData)

    // Store campaign record
    const { data: campaign, error: campaignError } = await supabase
      .from('email_campaigns')
      .insert({
        created_by: user.id,
        segment_json: segment_json,
        job_ids: job_ids || [],
        subject,
        template_key,
        status: 'sent',
        sent_at: new Date().toISOString()
      })
      .select()
      .single()

    if (campaignError) {
      console.error('Error storing campaign:', campaignError)
      // Don't fail the email send for this
    }

    // TODO: Send emails via Resend
    // This would involve:
    // 1. Looping through recipients
    // 2. Personalizing template for each recipient
    // 3. Sending via Resend API
    // 4. Tracking delivery status

    return NextResponse.json({
      message: 'Bulk email campaign initiated',
      campaign_id: campaign?.id,
      recipients_count: emailData.total_recipients,
      jobs_count: emailData.total_jobs,
      note: 'Email sending not yet implemented - see logs for campaign details'
    })

  } catch (error) {
    console.error('Bulk email error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET - Get campaign history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit

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
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    // Get campaigns
    const { data: campaigns, error: campaignsError } = await supabase
      .from('email_campaigns')
      .select(`
        *,
        profiles!created_by(full_name)
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (campaignsError) {
      console.error('Error fetching campaigns:', campaignsError)
      return NextResponse.json(
        { error: 'Failed to fetch campaigns' },
        { status: 500 }
      )
    }

    // Get total count
    const { count: totalCampaigns } = await supabase
      .from('email_campaigns')
      .select('*', { count: 'exact', head: true })

    const totalPages = Math.ceil((totalCampaigns || 0) / limit)

    return NextResponse.json({
      campaigns: campaigns || [],
      pagination: {
        page,
        limit,
        total: totalCampaigns || 0,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    })

  } catch (error) {
    console.error('Campaign history error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
      )
  }
}
