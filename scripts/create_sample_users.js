const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Sample users that need approval
const sampleUsers = [
  {
    email: 'john.tech@example.com',
    password: 'password123',
    full_name: 'John Smith',
    phone: '555-0101',
    role_tech: true,
    role_trainer: false,
    base_city: 'Salt Lake City',
    base_state: 'UT',
    service_radius_mi: 150,
    skills: ['Laser repair', 'Preventive maintenance', 'Troubleshooting'],
    tech_skills: ['VBeam Perfecta', 'GentleMax Pro', 'Picosure'],
    trainer_specialties: null
  },
  {
    email: 'sarah.trainer@example.com',
    password: 'password123',
    full_name: 'Sarah Johnson',
    phone: '555-0102',
    role_tech: false,
    role_trainer: true,
    base_city: 'Denver',
    base_state: 'CO',
    service_radius_mi: 200,
    skills: ['Staff training', 'Safety protocols', 'Treatment procedures'],
    tech_skills: null,
    trainer_specialties: ['BBL Hero', 'Picosure', 'General laser safety']
  },
  {
    email: 'mike.both@example.com',
    password: 'password123',
    full_name: 'Mike Rodriguez',
    phone: '555-0103',
    role_tech: true,
    role_trainer: true,
    base_city: 'Phoenix',
    base_state: 'AZ',
    service_radius_mi: 180,
    skills: ['Equipment repair', 'Staff training', 'Installation'],
    tech_skills: ['All major brands', 'Custom modifications'],
    trainer_specialties: ['Comprehensive training', 'Certification programs']
  },
  {
    email: 'lisa.medspa@example.com',
    password: 'password123',
    full_name: 'Lisa Chen',
    phone: '555-0104',
    role_tech: false,
    role_trainer: false,
    base_city: 'Las Vegas',
    base_state: 'NV',
    service_radius_mi: 100,
    skills: ['Practice management', 'Equipment coordination'],
    tech_skills: null,
    trainer_specialties: null
  },
  {
    email: 'david.tech@example.com',
    password: 'password123',
    full_name: 'David Wilson',
    phone: '555-0105',
    role_tech: true,
    role_trainer: false,
    base_city: 'Boise',
    base_state: 'ID',
    service_radius_mi: 120,
    skills: ['Emergency repairs', 'Parts replacement', 'Calibration'],
    tech_skills: ['Cynosure', 'Lumenis', 'Cutera'],
    trainer_specialties: null
  }
];

async function createSampleUsers() {
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

  console.log('🚀 Creating sample users that need approval...\n');

  for (const user of sampleUsers) {
    try {
      console.log(`Creating user: ${user.full_name} (${user.email})...`);

      // Create user in auth.users
      const { data: userData, error: userError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        user_metadata: {
          full_name: user.full_name,
          role_tech: user.role_tech,
          role_trainer: user.role_trainer,
          is_demo: false
        },
        email_confirm: true // Auto-confirm for testing
      });

      if (userError) {
        console.error(`❌ Failed to create user ${user.email}:`, userError.message);
        continue;
      }

      // Create profile in public.profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: userData.user.id,
          full_name: user.full_name,
          phone: user.phone,
          role_tech: user.role_tech,
          role_trainer: user.role_trainer,
          skills: user.skills,
          tech_skills: user.tech_skills,
          trainer_specialties: user.trainer_specialties,
          base_city: user.base_city,
          base_state: user.base_state,
          service_radius_mi: user.service_radius_mi,
          is_approved: false, // These users need approval
          notif_email: true,
          notif_sms: false
        });

      if (profileError) {
        console.error(`❌ Failed to create profile for ${user.email}:`, profileError.message);
        // Try to clean up the created user
        await supabase.auth.admin.deleteUser(userData.user.id);
        continue;
      }

      console.log(`✅ Successfully created user: ${user.full_name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Password: ${user.password}`);
      console.log(`   Roles: ${user.role_tech ? 'Technician' : ''}${user.role_tech && user.role_trainer ? ' + ' : ''}${user.role_trainer ? 'Trainer' : ''}`);
      console.log(`   Location: ${user.base_city}, ${user.base_state}`);
      console.log(`   Status: Pending Approval\n`);

    } catch (error) {
      console.error(`❌ Error creating user ${user.email}:`, error.message);
    }
  }

  console.log('🎉 Sample user creation completed!');
  console.log('\n📋 Summary:');
  console.log('- These users are created with is_approved = false');
  console.log('- They will appear in the admin approval queue');
  console.log('- You can test the approval workflow with these accounts');
  console.log('\n🔑 Login credentials:');
  sampleUsers.forEach(user => {
    console.log(`   ${user.email} / ${user.password}`);
  });
}

// Run the script
createSampleUsers().catch(console.error);
