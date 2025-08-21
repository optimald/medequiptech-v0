const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Sample jobs for testing
const sampleJobs = [
  {
    job_type: 'tech',
    title: 'VBeam Perfecta Maintenance',
    company_name: 'LaserMed Solutions',
    customer_name: 'Dr. Sarah Williams',
    model: 'VBeam Perfecta',
    priority: 'P1',
    status: 'OPEN',
    met_date: '2024-02-15',
    shipping_city: 'Salt Lake City',
    shipping_state: 'UT',
    address_line1: '123 Medical Plaza',
    address_line2: 'Suite 200',
    zip: '84102',
    contact_name: 'Dr. Sarah Williams',
    contact_phone: '801-555-0100',
    contact_email: 'dr.williams@lasermed.com',
    instructions_public: 'Routine maintenance and calibration needed',
    instructions_private: 'Check for any error codes and verify pulse energy output'
  },
  {
    job_type: 'trainer',
    title: 'BBL Hero Staff Training',
    company_name: 'Beauty & Wellness Clinic',
    customer_name: 'Nurse Lisa Chen',
    model: 'BBL Hero',
    priority: 'P2',
    status: 'OPEN',
    met_date: '2024-02-20',
    shipping_city: 'Denver',
    shipping_state: 'CO',
    address_line1: '456 Wellness Drive',
    address_line2: 'Building A',
    zip: '80202',
    contact_name: 'Nurse Lisa Chen',
    contact_phone: '303-555-0200',
    contact_email: 'lisa.chen@beautywellness.com',
    instructions_public: 'Staff training on BBL Hero operation and safety protocols',
    instructions_private: 'Focus on skin type assessment and treatment parameter selection'
  },
  {
    job_type: 'tech',
    title: 'GentleMax Pro Repair',
    company_name: 'Dermatology Associates',
    customer_name: 'Dr. Michael Rodriguez',
    model: 'GentleMax Pro',
    priority: 'P0',
    status: 'OPEN',
    met_date: '2024-02-10',
    shipping_city: 'Phoenix',
    shipping_state: 'AZ',
    address_line1: '789 Dermatology Way',
    address_line2: 'Floor 3',
    zip: '85001',
    contact_name: 'Dr. Michael Rodriguez',
    contact_phone: '602-555-0300',
    contact_email: 'dr.rodriguez@dermassoc.com',
    instructions_public: 'Equipment not powering on, needs immediate attention',
    instructions_private: 'Check power supply and main board. May need replacement parts.'
  },
  {
    job_type: 'trainer',
    title: 'Picosure Training Session',
    company_name: 'Advanced Aesthetics',
    customer_name: 'Dr. Jennifer Smith',
    model: 'Picosure',
    priority: 'P1',
    status: 'OPEN',
    met_date: '2024-02-25',
    shipping_city: 'Las Vegas',
    shipping_state: 'NV',
    address_line1: '321 Aesthetic Avenue',
    address_line2: 'Suite 150',
    zip: '89101',
    contact_name: 'Dr. Jennifer Smith',
    contact_phone: '702-555-0400',
    contact_email: 'dr.smith@advancedaesthetics.com',
    instructions_public: 'Comprehensive training for new staff members',
    instructions_private: 'Cover tattoo removal protocols, skin type assessment, and post-treatment care'
  },
  {
    job_type: 'tech',
    title: 'Cynosure Elite Maintenance',
    company_name: 'Cosmetic Surgery Center',
    customer_name: 'Dr. Robert Wilson',
    model: 'Cynosure Elite',
    priority: 'P2',
    status: 'OPEN',
    met_date: '2024-02-18',
    shipping_city: 'Boise',
    shipping_state: 'ID',
    address_line1: '654 Cosmetic Court',
    address_line2: 'Medical Building',
    zip: '83702',
    contact_name: 'Dr. Robert Wilson',
    contact_phone: '208-555-0500',
    contact_email: 'dr.wilson@cosmeticsurgery.com',
    instructions_public: 'Scheduled maintenance and performance optimization',
    instructions_private: 'Check laser alignment, clean optics, and verify energy output calibration'
  }
];

async function createSampleJobs() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('Missing environment variables. Please check your .env.local file.');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  console.log('🚀 Creating sample jobs...\n');

  for (const job of sampleJobs) {
    try {
      console.log(`Creating job: ${job.title}...`);

      // Create job
      const { data: jobData, error: jobError } = await supabase
        .from('jobs')
        .insert({
          ...job,
          source_tag: 'sample_data'
        })
        .select()
        .single();

      if (jobError) {
        console.error(`❌ Failed to create job ${job.title}:`, jobError.message);
        continue;
      }

      console.log(`✅ Successfully created job: ${job.title}`);
      console.log(`   Type: ${job.job_type}`);
      console.log(`   Priority: ${job.priority}`);
      console.log(`   Status: ${job.status}`);
      console.log(`   Location: ${job.shipping_city}, ${job.shipping_state}`);
      console.log(`   MET Date: ${job.met_date}\n`);

    } catch (error) {
      console.error(`❌ Error creating job ${job.title}:`, error.message);
    }
  }

  console.log('🎉 Sample job creation completed!');
  console.log('\n📋 Summary:');
  console.log('- Created jobs with various types, priorities, and statuses');
  console.log('- Jobs are set to OPEN status for testing');
  console.log('- You can now test the admin job management interface');
}

// Run the script
createSampleJobs().catch(console.error);
