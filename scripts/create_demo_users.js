#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Demo users configuration
const demoUsers = [
  {
    email: 'demo.technician@medequiptech.com',
    password: 'demo123',
    role: 'technician',
    full_name: 'Demo Technician',
    user_metadata: {
      role: 'technician',
      full_name: 'Demo Technician',
      is_demo: true
    }
  },
  {
    email: 'demo.trainer@medequiptech.com',
    password: 'demo123',
    role: 'trainer',
    full_name: 'Demo Trainer',
    user_metadata: {
      role: 'trainer',
      full_name: 'Demo Trainer',
      is_demo: true
    }
  },
  {
    email: 'demo.medspa@medequiptech.com',
    password: 'demo123',
    role: 'medspa',
    full_name: 'Demo MedSpa Practice',
    user_metadata: {
      role: 'medspa',
      full_name: 'Demo MedSpa Practice',
      is_demo: true
    }
  },
  {
    email: 'demo.admin@medequiptech.com',
    password: 'demo123',
    role: 'admin',
    full_name: 'Demo Admin',
    user_metadata: {
      role: 'admin',
      full_name: 'Demo Admin',
      is_demo: true
    }
  }
];

async function createDemoUsers() {
  console.log('🚀 Creating demo users for MedEquipTech...\n');

  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('❌ Missing required environment variables:');
    console.error('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅' : '❌');
    console.error('   SUPABASE_SERVICE_ROLE_KEY:', serviceRoleKey ? '✅' : '❌');
    process.exit(1);
  }

  // Create Supabase client with service role
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  try {
    for (const user of demoUsers) {
      console.log(`📝 Creating ${user.role} user: ${user.email}`);
      
      // Create user
      const { data: userData, error: userError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        user_metadata: user.user_metadata,
        email_confirm: true
      });

      if (userError) {
        if (userError.message.includes('already registered')) {
          console.log(`   ⚠️  User ${user.email} already exists, skipping...`);
          continue;
        } else {
          console.error(`   ❌ Error creating user:`, userError.message);
          continue;
        }
      }

      console.log(`   ✅ User created successfully: ${userData.user.id}`);

      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: userData.user.id,
          full_name: user.full_name,
          phone: `555-000-000${demoUsers.indexOf(user) + 1}`,
          role_tech: user.role === 'technician' || user.role === 'admin',
          role_trainer: user.role === 'trainer' || user.role === 'admin',
          skills: getSkillsForRole(user.role),
          tech_skills: user.role === 'technician' ? getTechSkills() : null,
          trainer_specialties: user.role === 'trainer' ? getTrainerSpecialties() : null,
          base_city: getBaseCityForRole(user.role),
          base_state: getBaseStateForRole(user.role),
          service_radius_mi: getServiceRadiusForRole(user.role),
          is_approved: true
        });

      if (profileError) {
        console.error(`   ❌ Error creating profile:`, profileError.message);
      } else {
        console.log(`   ✅ Profile created successfully`);
      }
    }

    console.log('\n🎉 Demo users setup completed!');
    console.log('\n📋 Demo Account Summary:');
    console.log('┌─────────────────┬─────────────────────────────────────┬──────────┐');
    console.log('│ Role            │ Email                               │ Password │');
    console.log('├─────────────────┼─────────────────────────────────────┼──────────┤');
    demoUsers.forEach(user => {
      console.log(`│ ${user.role.padEnd(15)} │ ${user.email.padEnd(35)} │ demo123  │`);
    });
    console.log('└─────────────────┴─────────────────────────────────────┴──────────┘');
    console.log('\n💡 You can now test the demo login buttons on your signin page!');

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    process.exit(1);
  }
}

function getSkillsForRole(role) {
  const skillsMap = {
    technician: ['VBeam', 'GentleMax', 'M22', 'Icon', 'Sciton'],
    trainer: ['BBL Hero', 'Picosure', 'Alma Harmony', 'InMode', 'BTL'],
    medspa: ['Equipment Help', 'Staff Training'],
    admin: ['Platform Management', 'User Oversight', 'System Administration']
  };
  return skillsMap[role] || [];
}

function getTechSkills() {
  return ['Laser Repair', 'Calibration', 'Maintenance', 'Troubleshooting'];
}

function getTrainerSpecialties() {
  return ['Safety Protocols', 'Treatment Protocols', 'Device Operation', 'Staff Certification'];
}

function getBaseCityForRole(role) {
  const cityMap = {
    technician: 'Los Angeles',
    trainer: 'San Francisco',
    medspa: 'Miami',
    admin: 'San Diego'
  };
  return cityMap[role] || 'Unknown';
}

function getBaseStateForRole(role) {
  const stateMap = {
    technician: 'CA',
    trainer: 'CA',
    medspa: 'FL',
    admin: 'CA'
  };
  return stateMap[role] || 'Unknown';
}

function getServiceRadiusForRole(role) {
  const radiusMap = {
    technician: 100,
    trainer: 150,
    medspa: 50,
    admin: 200
  };
  return radiusMap[role] || 100;
}

// Run the script
createDemoUsers().catch(console.error);
