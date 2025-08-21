import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the user's profile to check if they're approved
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, is_approved, role_tech, role_trainer')
      .eq('user_id', user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    if (!profile.is_approved) {
      return NextResponse.json({ error: 'Account not approved' }, { status: 403 })
    }

    // Fetch awarded jobs for this user
    const { data: awards, error: awardsError } = await supabase
      .from('awards')
      .select(`
        *,
        jobs (
          id,
          title,
          company_name,
          customer_name,
          model,
          priority,
          status,
          met_date,
          shipping_city,
          shipping_state,
          address_line1,
          address_line2,
          zip,
          contact_name,
          contact_phone,
          contact_email,
          instructions_public,
          instructions_private,
          created_at
        )
      `)
      .eq('awarded_user_id', user.id)
      .order('awarded_at', { ascending: false })

    if (awardsError) {
      console.error('Error fetching awards:', awardsError)
      return NextResponse.json({ error: 'Failed to fetch awarded jobs' }, { status: 500 })
    }

    // Transform the data to match the expected format
    const jobs = awards?.map(award => ({
      id: award.jobs.id,
      title: award.jobs.title,
      company_name: award.jobs.company_name,
      customer_name: award.jobs.customer_name,
      model: award.jobs.model,
      priority: award.jobs.priority,
      status: award.jobs.status,
      met_date: award.jobs.met_date,
      shipping_city: award.jobs.shipping_city,
      shipping_state: award.jobs.shipping_state,
      address_line1: award.jobs.address_line1,
      address_line2: award.jobs.address_line2,
      zip: award.jobs.zip,
      contact_name: award.jobs.contact_name,
      contact_phone: award.jobs.contact_phone,
      contact_email: award.jobs.contact_email,
      instructions_public: award.jobs.instructions_public,
      instructions_private: award.jobs.instructions_private,
      created_at: award.jobs.created_at,
      awarded_at: award.awarded_at,
      bid_amount: award.bid_amount
    })) || []

    return NextResponse.json({ jobs })
  } catch (error) {
    console.error('Error in my-jobs API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
