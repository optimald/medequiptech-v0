import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
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

    // Get pending users
    const { data: pendingUsers, error: usersError } = await supabase
      .from('profiles')
      .select(`
        user_id,
        full_name,
        phone,
        role_tech,
        role_trainer,
        base_city,
        base_state,
        service_radius_mi,
        created_at,
        auth.users!inner(email)
      `)
      .eq('is_approved', false)
      .order('created_at', { ascending: false })

    if (usersError) {
      console.error('Error fetching pending users:', usersError)
      return NextResponse.json(
        { error: 'Failed to fetch pending users' },
        { status: 500 }
      )
    }

    return NextResponse.json({ users: pendingUsers || [] })

  } catch (error) {
    console.error('Error fetching pending users:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
      )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, action, reason } = body

    if (!user_id || !action || !['approve', 'deny'].includes(action)) {
      return NextResponse.json(
        { error: 'Missing or invalid parameters' },
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

    if (action === 'approve') {
      // Approve user
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ is_approved: true })
        .eq('user_id', user_id)

      if (updateError) {
        console.error('Error approving user:', updateError)
        return NextResponse.json(
          { error: 'Failed to approve user' },
          { status: 500 }
        )
      }

      // TODO: Send welcome email to approved user
      // TODO: Send notification to admin

      return NextResponse.json({ message: 'User approved successfully' })

    } else if (action === 'deny') {
      // Deny user (mark as denied or delete)
      const { error: deleteError } = await supabase
        .from('profiles')
        .delete()
        .eq('user_id', user_id)

      if (deleteError) {
        console.error('Error denying user:', deleteError)
        return NextResponse.json(
          { error: 'Failed to deny user' },
          { status: 500 }
        )
      }

      // TODO: Send notification to admin
      return NextResponse.json({ message: 'User denied successfully' })
    }

  } catch (error) {
    console.error('Error processing user approval:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
      )
  }
}
