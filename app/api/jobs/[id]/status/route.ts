import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the request body
    const { status } = await request.json()
    
    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 })
    }

    // Validate status values
    const validStatuses = ['UPCOMING', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED']
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    // Check if the user has been awarded this job
    const { data: award, error: awardError } = await supabase
      .from('awards')
      .select('id, job_id')
      .eq('awarded_user_id', user.id)
      .eq('job_id', params.id)
      .single()

    if (awardError || !award) {
      return NextResponse.json({ error: 'Job not found or not awarded to you' }, { status: 404 })
    }

    // Update the job status
    const { error: updateError } = await supabase
      .from('jobs')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)

    if (updateError) {
      console.error('Error updating job status:', updateError)
      return NextResponse.json({ error: 'Failed to update job status' }, { status: 500 })
    }

    return NextResponse.json({ 
      message: 'Job status updated successfully',
      status 
    })
  } catch (error) {
    console.error('Error in job status update API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
