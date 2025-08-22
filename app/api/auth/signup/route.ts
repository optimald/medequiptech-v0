import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, full_name, phone, role_tech, role_trainer, base_city, base_state, service_radius_mi } = body

    // Validation
    if (!email || !password || !full_name) {
      return NextResponse.json(
        { error: 'Missing required fields: email, password, full_name' },
        { status: 400 }
      )
    }

    if (!role_tech && !role_trainer) {
      return NextResponse.json(
        { error: 'Must select at least one role (technician or trainer)' },
        { status: 400 }
      )
    }

    // Create Supabase client with service role
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Check if user already exists
    const { data: existingUser } = await supabase.auth.admin.listUsers()
    const userExists = existingUser.users.some(user => user.email === email)
    
    if (userExists) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Create user
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        full_name,
        role_tech,
        role_trainer,
        is_demo: false
      },
      email_confirm: true // Auto-confirm for V0
    })

    if (userError) {
      console.error('Error creating user:', userError)
      return NextResponse.json(
        { error: 'Failed to create user account' },
        { status: 500 }
      )
    }

    // Create profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        user_id: userData.user.id,
        full_name,
        phone,
        role_tech,
        role_trainer,
        base_city,
        base_state,
        service_radius_mi: service_radius_mi || 100,
        is_approved: false, // Requires admin approval
        notif_email: true,
        notif_sms: false
      })

    if (profileError) {
      console.error('Error creating profile:', profileError)
      // Try to clean up the created user
      await supabase.auth.admin.deleteUser(userData.user.id)
      return NextResponse.json(
        { error: 'Failed to create user profile' },
        { status: 500 }
      )
    }

    // Send admin alert email (we'll implement this next)
    try {
      await sendAdminSignupAlert({
        full_name,
        email,
        role_tech,
        role_trainer,
        base_city,
        base_state
      })
    } catch (emailError) {
      console.error('Failed to send admin alert email:', emailError)
      // Don't fail the signup if email fails
    }

    return NextResponse.json({
      message: 'User created successfully. Awaiting admin approval.',
      user_id: userData.user.id
    })

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function sendAdminSignupAlert(userData: {
  full_name: string
  email: string
  role_tech: boolean
  role_trainer: boolean
  base_city?: string
  base_state?: string
}) {
  try {
    // Import email service dynamically to avoid issues in API routes
    const { emailService } = await import('@/lib/email-service')
    
    // Get admin emails from environment or use a default
    const adminEmails = process.env.ADMIN_ALERT_EMAILS?.split(',') || ['admin@medequiptech.com']
    
    // Send admin alert email
    const result = await emailService.sendSignupAlert(userData, adminEmails)
    
    if (result.success) {
      console.log('Admin signup alert email sent successfully')
    } else {
      console.error('Failed to send admin signup alert email:', result.error)
    }
  } catch (error) {
    console.error('Error sending admin signup alert email:', error)
  }
}
