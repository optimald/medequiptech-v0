import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const importType = formData.get('importType') as string

    if (!file || !importType) {
      return NextResponse.json(
        { error: 'File and import type are required' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.name.endsWith('.csv')) {
      return NextResponse.json(
        { error: 'Only CSV files are supported' },
        { status: 400 }
      )
    }

    // Validate import type
    const validTypes = ['jobs', 'users', 'contacts']
    if (!validTypes.includes(importType)) {
      return NextResponse.json(
        { error: 'Invalid import type. Must be one of: ' + validTypes.join(', ') },
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
        { error: 'Admin access required to import data' },
        { status: 403 }
      )
    }

    // Read and parse CSV file
    const csvText = await file.text()
    const lines = csvText.split('\n').filter(line => line.trim())
    
    if (lines.length < 2) {
      return NextResponse.json(
        { error: 'CSV file must have at least a header row and one data row' },
        { status: 400 }
      )
    }

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
    const dataRows = lines.slice(1)

    // Process based on import type
    let importResult: any = {}
    let errors: string[] = []

    if (importType === 'jobs') {
      importResult = await processJobsImport(supabase, headers, dataRows)
    } else if (importType === 'users') {
      importResult = await processUsersImport(supabase, headers, dataRows)
    } else if (importType === 'contacts') {
      importResult = await processContactsImport(supabase, headers, dataRows)
    }

    // Log the import
    const { error: logError } = await supabase
      .from('imports')
      .insert({
        import_type: importType,
        file_name: file.name,
        file_size: file.size,
        records_processed: importResult.processed || 0,
        records_imported: importResult.imported || 0,
        errors: errors.length > 0 ? errors.join('; ') : null,
        imported_by: user.id
      })

    if (logError) {
      console.error('Error logging import:', logError)
      // Don't fail the import if logging fails
    }

    return NextResponse.json({
      message: 'Import completed',
      ...importResult,
      errors: errors.length > 0 ? errors : undefined
    })

  } catch (error) {
    console.error('CSV import error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
      )
  }
}

async function processJobsImport(supabase: any, headers: string[], dataRows: string[]) {
  const processed = dataRows.length
  let imported = 0
  const errors: string[] = []

  for (let i = 0; i < dataRows.length; i++) {
    try {
      const values = dataRows[i].split(',').map(v => v.trim().replace(/"/g, ''))
      const rowData: any = {}
      
      headers.forEach((header, index) => {
        rowData[header] = values[index] || null
      })

      // Validate required fields
      if (!rowData.title || !rowData.job_type || !rowData.priority) {
        errors.push(`Row ${i + 2}: Missing required fields`)
        continue
      }

      // Insert job
      const { error: insertError } = await supabase
        .from('jobs')
        .insert({
          title: rowData.title,
          job_type: rowData.job_type,
          priority: rowData.priority,
          status: 'OPEN',
          company_name: rowData.company_name || 'Unknown',
          customer_name: rowData.customer_name || rowData.company_name || 'Unknown',
          model: rowData.model || 'Unknown',
          shipping_city: rowData.shipping_city || 'Unknown',
          shipping_state: rowData.shipping_state || 'Unknown',
          met_date: rowData.met_date || new Date().toISOString(),
          instructions_public: rowData.instructions_public || null
        })

      if (insertError) {
        errors.push(`Row ${i + 2}: ${insertError.message}`)
      } else {
        imported++
      }
    } catch (error) {
      errors.push(`Row ${i + 2}: Processing error`)
    }
  }

  return { processed, imported, errors }
}

async function processUsersImport(supabase: any, headers: string[], dataRows: string[]) {
  const processed = dataRows.length
  let imported = 0
  const errors: string[] = []

  for (let i = 0; i < dataRows.length; i++) {
    try {
      const values = dataRows[i].split(',').map(v => v.trim().replace(/"/g, ''))
      const rowData: any = {}
      
      headers.forEach((header, index) => {
        rowData[header] = values[index] || null
      })

      // Validate required fields
      if (!rowData.email || !rowData.full_name) {
        errors.push(`Row ${i + 2}: Missing required fields`)
        continue
      }

      // Check if user already exists
      const { data: existingUser } = await supabase.auth.admin.getUserByEmail(rowData.email)
      
      if (existingUser) {
        errors.push(`Row ${i + 2}: User already exists`)
        continue
      }

      // Create user account
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: rowData.email,
        password: rowData.password || 'temp123',
        email_confirm: true
      })

      if (createError) {
        errors.push(`Row ${i + 2}: ${createError.message}`)
        continue
      }

      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: newUser.user.id,
          full_name: rowData.full_name,
          phone: rowData.phone || null,
          role_tech: rowData.role_tech === 'true' || rowData.role_tech === '1',
          role_trainer: rowData.role_trainer === 'true' || rowData.role_trainer === '1',
          base_city: rowData.base_city || null,
          base_state: rowData.base_state || null,
          service_radius_mi: parseInt(rowData.service_radius_mi) || 50,
          is_approved: false // Require admin approval
        })

      if (profileError) {
        errors.push(`Row ${i + 2}: ${profileError.message}`)
        // Try to clean up the created user
        await supabase.auth.admin.deleteUser(newUser.user.id)
      } else {
        imported++
      }
    } catch (error) {
      errors.push(`Row ${i + 2}: Processing error`)
    }
  }

  return { processed, imported, errors }
}

async function processContactsImport(supabase: any, headers: string[], dataRows: string[]) {
  const processed = dataRows.length
  let imported = 0
  const errors: string[] = []

  for (let i = 0; i < dataRows.length; i++) {
    try {
      const values = dataRows[i].split(',').map(v => v.trim().replace(/"/g, ''))
      const rowData: any = {}
      
      headers.forEach((header, index) => {
        rowData[header] = values[index] || null
      })

      // Validate required fields
      if (!rowData.name || !rowData.email) {
        errors.push(`Row ${i + 2}: Missing required fields`)
        continue
      }

      // Insert contact (assuming you have a contacts table)
      // For now, just log the contact data
      console.log('Contact import:', rowData)
      imported++
    } catch (error) {
      errors.push(`Row ${i + 2}: Processing error`)
    }
  }

  return { processed, imported, errors }
}
