import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      csv_data, 
      mapping_json, 
      dry_run = true,
      source_tag = 'csv_import'
    } = body

    // Validation
    if (!csv_data || !Array.isArray(csv_data) || csv_data.length === 0) {
      return NextResponse.json(
        { error: 'CSV data is required and must be an array' },
        { status: 400 }
      )
    }

    if (!mapping_json) {
      return NextResponse.json(
        { error: 'Field mapping is required' },
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

    // Process CSV data
    const processedJobs = []
    const errors = []
    const duplicates = []
    const newJobs = []

    for (let i = 0; i < csv_data.length; i++) {
      const row = csv_data[i]
      const rowNumber = i + 2 // +2 because CSV has header and we're 0-indexed

      try {
        // Map CSV fields to database fields
        const jobData = mapCsvRowToJob(row, mapping_json)
        
        // Validate required fields
        const validationError = validateJobData(jobData)
        if (validationError) {
          errors.push({
            row: rowNumber,
            error: validationError,
            data: row
          })
          continue
        }

        // Check for duplicates
        const duplicateCheck = await checkForDuplicates(supabase, jobData)
        if (duplicateCheck.isDuplicate) {
          duplicates.push({
            row: rowNumber,
            reason: duplicateCheck.reason,
            existing_job_id: duplicateCheck.existing_job_id,
            data: jobData
          })
          continue
        }

        // Normalize data
        const normalizedJob = normalizeJobData(jobData)
        
        processedJobs.push({
          row: rowNumber,
          status: 'valid',
          data: normalizedJob
        })

        if (!dry_run) {
          newJobs.push(normalizedJob)
        }

      } catch (error) {
        errors.push({
          row: rowNumber,
          error: `Processing error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          data: row
        })
      }
    }

    // If dry run, return analysis
    if (dry_run) {
      return NextResponse.json({
        message: 'Dry run completed',
        summary: {
          total_rows: csv_data.length,
          valid_jobs: processedJobs.length,
          errors: errors.length,
          duplicates: duplicates.length
        },
        details: {
          valid_jobs: processedJobs,
          errors,
          duplicates
        }
      })
    }

    // If not dry run, import the jobs
    if (newJobs.length === 0) {
      return NextResponse.json({
        message: 'No valid jobs to import',
        summary: {
          total_rows: csv_data.length,
          valid_jobs: 0,
          errors: errors.length,
          duplicates: duplicates.length
        }
      })
    }

    // Import jobs
    const { data: importedJobs, error: importError } = await supabase
      .from('jobs')
      .insert(newJobs)
      .select()

    if (importError) {
      console.error('Error importing jobs:', importError)
      return NextResponse.json(
        { error: 'Failed to import jobs' },
        { status: 500 }
      )
    }

    // Create import record
    const { error: recordError } = await supabase
      .from('imports')
      .insert({
        source: 'csv',
        mapping_json: mapping_json,
        created_by: user.id,
        row_count: newJobs.length
      })

    if (recordError) {
      console.error('Error creating import record:', recordError)
      // Don't fail the import for this
    }

    return NextResponse.json({
      message: 'Jobs imported successfully',
      summary: {
        total_rows: csv_data.length,
        imported_jobs: importedJobs.length,
        errors: errors.length,
        duplicates: duplicates.length
      },
      imported_jobs: importedJobs,
      errors,
      duplicates
    })

  } catch (error) {
    console.error('CSV import error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function mapCsvRowToJob(row: any, mapping: any) {
  const job: any = {}
  
  // Map each field according to the mapping
  Object.keys(mapping).forEach(dbField => {
    const csvField = mapping[dbField]
    if (csvField && row[csvField] !== undefined) {
      job[dbField] = row[csvField]
    }
  })

  return job
}

function validateJobData(jobData: any) {
  const requiredFields = ['job_type', 'title', 'company_name', 'customer_name', 'model', 'priority', 'status']
  
  for (const field of requiredFields) {
    if (!jobData[field]) {
      return `Missing required field: ${field}`
    }
  }

  // Validate job_type
  if (!['tech', 'trainer'].includes(jobData.job_type)) {
    return `Invalid job_type: ${jobData.job_type}. Must be 'tech' or 'trainer'`
  }

  // Validate priority
  if (!['P0', 'P1', 'P2', 'SCOTT'].includes(jobData.priority)) {
    return `Invalid priority: ${jobData.priority}. Must be P0, P1, P2, or SCOTT`
  }

  // Validate status
  if (!['OPEN', 'BIDDING', 'AWARDED', 'SCHEDULED', 'IN_PROGRESS', 'AWAITING_PARTS', 'COMPLETED', 'CANCELED'].includes(jobData.status)) {
    return `Invalid status: ${jobData.status}`
  }

  return null
}

async function checkForDuplicates(supabase: any, jobData: any) {
  // Check by external_id if available
  if (jobData.external_id) {
    const { data: existingByExternalId } = await supabase
      .from('jobs')
      .select('id')
      .eq('external_id', jobData.external_id)
      .single()

    if (existingByExternalId) {
      return {
        isDuplicate: true,
        reason: 'external_id already exists',
        existing_job_id: existingByExternalId.id
      }
    }
  }

  // Check by customer + model + met_date combination
  if (jobData.customer_name && jobData.model && jobData.met_date) {
    const { data: existingByCombination } = await supabase
      .from('jobs')
      .select('id')
      .eq('customer_name', jobData.customer_name)
      .eq('model', jobData.model)
      .eq('met_date', jobData.met_date)
      .single()

    if (existingByCombination) {
      return {
        isDuplicate: true,
        reason: 'customer + model + met_date combination already exists',
        existing_job_id: existingByCombination.id
      }
    }
  }

  return { isDuplicate: false }
}

function normalizeJobData(jobData: any) {
  const normalized = { ...jobData }

  // Normalize state codes (e.g., "Utah" -> "UT")
  if (normalized.shipping_state) {
    normalized.shipping_state = normalizeStateCode(normalized.shipping_state)
  }

  // Normalize dates
  if (normalized.met_date) {
    normalized.met_date = normalizeDate(normalized.met_date)
  }

  // Set default values
  if (!normalized.status) {
    normalized.status = 'OPEN'
  }

  if (!normalized.priority) {
    normalized.priority = 'P2'
  }

  // Add source tag
  normalized.source_tag = 'csv_import'

  return normalized
}

function normalizeStateCode(state: string) {
  const stateMap: { [key: string]: string } = {
    'alabama': 'AL', 'alaska': 'AK', 'arizona': 'AZ', 'arkansas': 'AR', 'california': 'CA',
    'colorado': 'CO', 'connecticut': 'CT', 'delaware': 'DE', 'florida': 'FL', 'georgia': 'GA',
    'hawaii': 'HI', 'idaho': 'ID', 'illinois': 'IL', 'indiana': 'IN', 'iowa': 'IA',
    'kansas': 'KS', 'kentucky': 'KY', 'louisiana': 'LA', 'maine': 'ME', 'maryland': 'MD',
    'massachusetts': 'MA', 'michigan': 'MI', 'minnesota': 'MN', 'mississippi': 'MS', 'missouri': 'MO',
    'montana': 'MT', 'nebraska': 'NE', 'nevada': 'NV', 'new hampshire': 'NH', 'new jersey': 'NJ',
    'new mexico': 'NM', 'new york': 'NY', 'north carolina': 'NC', 'north dakota': 'ND', 'ohio': 'OH',
    'oklahoma': 'OK', 'oregon': 'OR', 'pennsylvania': 'PA', 'rhode island': 'RI', 'south carolina': 'SC',
    'south dakota': 'SD', 'tennessee': 'TN', 'texas': 'TX', 'utah': 'UT', 'vermont': 'VT',
    'virginia': 'VA', 'washington': 'WA', 'west virginia': 'WV', 'wisconsin': 'WI', 'wyoming': 'WY'
  }

  const normalized = state.toLowerCase().trim()
  return stateMap[normalized] || state.toUpperCase()
}

function normalizeDate(dateStr: string) {
  // Handle various date formats
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date: ${dateStr}`)
  }
  return date.toISOString().split('T')[0] // Return YYYY-MM-DD format
}
