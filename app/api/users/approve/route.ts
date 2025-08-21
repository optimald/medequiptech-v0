import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, action, reason } = body

    // Validation
    if (!user_id || !action) {
      return NextResponse.json(
        { error: 'Missing required fields: user_id, action' },
        { status: 400 }
      )
    }

    if (!['approve', 'deny'].includes(action)) {
      return NextResponse.json(
        { error: 'Action must be either "approve" or "deny"' },
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

    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('is_approved')
      .eq('user_id', user.id)
      .single()

    if (profileError || !profile || !profile.is_approved) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    // Get the user to be approved/denied
    const { data: targetProfile, error: targetProfileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user_id)
      .single()

    if (targetProfileError || !targetProfile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      )
    }

    // Check if user is already in the requested state
    if (action === 'approve' && targetProfile.is_approved) {
      return NextResponse.json(
        { error: 'User is already approved' },
        { status: 400 }
      )
    }

    if (action === 'deny' && !targetProfile.is_approved) {
      return NextResponse.json(
        { error: 'User is already not approved' },
        { status: 400 }
      )
    }

    // Update approval status
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        is_approved: action === 'approve',
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user_id)

    if (updateError) {
      console.error('Error updating profile:', updateError)
      return NextResponse.json(
        { error: 'Failed to update user approval status' },
        { status: 500 }
      )
    }

    // If approving, send welcome email
    if (action === 'approve') {
      try {
        await sendWelcomeEmail({
          user_id: user_id,
          full_name: targetProfile.full_name,
          email: targetProfile.email
        })
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError)
        // Don't fail the approval if email fails
      }
    }

    // Log the action
    try {
      await supabase
        .from('notifications')
        .insert({
          type: 'user_approval',
          payload: {
            action,
            reason,
            admin_user_id: user.id,
            target_user_id: user_id,
            timestamp: new Date().toISOString()
          },
          channel: 'system',
          to: 'admin',
          status: 'sent'
        })
    } catch (logError) {
      console.error('Failed to log approval action:', logError)
      // Don't fail the approval if logging fails
    }

    return NextResponse.json({
      message: `User ${action}d successfully`,
      user_id,
      action,
      is_approved: action === 'approve'
    })

  } catch (error) {
    console.error('User approval error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET - Get pending approvals
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit

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

    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('is_approved')
      .eq('user_id', user.id)
      .single()

    if (profileError || !profile || !profile.is_approved) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    // Get pending approvals
    const { data: pendingUsers, error: pendingError } = await supabase
      .from('profiles')
      .select(`
        *,
        auth_users:user_id(email, created_at)
      `)
      .eq('is_approved', false)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (pendingError) {
      console.error('Error fetching pending users:', pendingError)
      return NextResponse.json(
        { error: 'Failed to fetch pending users' },
        { status: 500 }
      )
    }

    // Get total count
    const { count: totalPending } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('is_approved', false)

    const totalPages = Math.ceil((totalPending || 0) / limit)

    return NextResponse.json({
      pending_users: pendingUsers || [],
      pagination: {
        page,
        limit,
        total: totalPending || 0,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    })

  } catch (error) {
    console.error('Pending approvals error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function sendWelcomeEmail(userData: {
  user_id: string
  full_name: string
  email: string
}) {
  // TODO: Implement Resend email sending
  // For now, just log the welcome email
  console.log('WELCOME EMAIL:', userData)
}
