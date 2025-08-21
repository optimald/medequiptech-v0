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

    // TODO: Send notifications to relevant users about status change
    // TODO: Send email notifications

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
