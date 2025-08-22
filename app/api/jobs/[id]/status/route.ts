import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const jobId = params.id
    const body = await request.json()
    const { status, notes } = body

    if (!jobId || !status) {
      return NextResponse.json(
        { error: 'Job ID and status are required' },
        { status: 400 }
      )
    }

    // Validate status
    const validStatuses = ['OPEN', 'BIDDING', 'AWARDED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be one of: ' + validStatuses.join(', ') },
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
        { error: 'Admin access required to update job status' },
        { status: 403 }
      )
    }

    // Get the current job to validate the status change
    const { data: currentJob, error: jobError } = await supabase
      .from('jobs')
      .select('status, title')
      .eq('id', jobId)
      .single()

    if (jobError || !currentJob) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }

    // Validate status transition
    const validTransitions: Record<string, string[]> = {
      'OPEN': ['BIDDING', 'CANCELLED'],
      'BIDDING': ['AWARDED', 'CANCELLED'],
      'AWARDED': ['IN_PROGRESS', 'CANCELLED'],
      'IN_PROGRESS': ['COMPLETED', 'CANCELLED'],
      'COMPLETED': [], // Terminal state
      'CANCELLED': []  // Terminal state
    }

    const allowedTransitions = validTransitions[currentJob.status] || []
    if (!allowedTransitions.includes(status)) {
      return NextResponse.json(
        { error: `Cannot transition from ${currentJob.status} to ${status}. Allowed transitions: ${allowedTransitions.join(', ')}` },
        { status: 400 }
      )
    }

    // Update the job status
    const updateData: any = { 
      status,
      updated_at: new Date().toISOString()
    }

    if (notes) {
      updateData.status_notes = notes
    }

    const { error: updateError } = await supabase
      .from('jobs')
      .update(updateData)
      .eq('id', jobId)

    if (updateError) {
      console.error('Error updating job status:', updateError)
      return NextResponse.json(
        { error: 'Failed to update job status' },
        { status: 500 }
      )
    }

    // Send notifications to relevant users about status change
    try {
      // Import email service dynamically to avoid issues in API routes
      const { emailService } = await import('@/lib/email-service')
      
      // Get admin emails from environment or use a default
      const adminEmails = process.env.ADMIN_ALERT_EMAILS?.split(',') || ['admin@medequiptech.com']
      
      // Send status change notification to admins
      const result = await emailService.sendEmail(adminEmails.map(email => ({ email })), {
        subject: `Job Status Updated: ${currentJob.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Job Status Updated</h2>
            <p>A job status has been updated:</p>
            
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Job Details</h3>
              <p><strong>Title:</strong> ${currentJob.title}</p>
              <p><strong>Job ID:</strong> ${jobId}</p>
              <p><strong>Status Change:</strong> ${currentJob.status} → ${status}</p>
              ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
            </div>
            
            <p>Review this job in the admin dashboard.</p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
              <p style="color: #64748b; font-size: 14px;">
                This is an automated notification from MedEquipTech.
              </p>
            </div>
          </div>
        `,
        text: `
Job Status Updated

A job status has been updated:

Job Details:
- Title: ${currentJob.title}
- Job ID: ${jobId}
- Status Change: ${currentJob.status} → ${status}
${notes ? `- Notes: ${notes}` : ''}

Review this job in the admin dashboard.

---
This is an automated notification from MedEquipTech.
        `
      })
      
      if (result.success) {
        console.log('Job status change notification email sent successfully')
      } else {
        console.error('Failed to send job status change notification email:', result.error)
      }
    } catch (emailError) {
      console.error('Error sending job status change notification email:', emailError)
      // Don't fail the status update if email fails
    }

    return NextResponse.json({
      message: 'Job status updated successfully',
      job_id: jobId,
      old_status: currentJob.status,
      new_status: status
    })

  } catch (error) {
    console.error('Job status update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
      )
  }
}
