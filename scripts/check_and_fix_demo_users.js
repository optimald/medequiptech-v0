import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables')
  process.exit(1)
}

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

const DEMO_USERS = {
  technician: { email: 'demo.technician@medequiptech.com', password: 'demo123', role: 'technician' },
  trainer: { email: 'demo.trainer@medequiptech.com', password: 'demo123', role: 'trainer' },
  medspa: { email: 'demo.medspa@medequiptech.com', password: 'demo123', role: 'medspa' },
  admin: { email: 'demo.admin@medequiptech.com', password: 'demo123', role: 'admin' }
}

async function checkAndFixDemoUsers() {
  console.log('🔍 Checking demo users status...\n')

  for (const [role, userData] of Object.entries(DEMO_USERS)) {
    console.log(`📋 Checking ${role} user: ${userData.email}`)
    
    try {
      // Check if user exists in auth.users
      const { data: authUser, error: authError } = await supabase.auth.admin.getUserByEmail(userData.email)
      
      if (authError) {
        console.log(`   ❌ Auth user not found: ${authError.message}`)
        continue
      }

      if (authUser.user) {
        console.log(`   ✅ Auth user exists: ${authUser.user.id}`)
        
        // Check if profile exists
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', authUser.user.id)
          .single()

        if (profileError || !profile) {
          console.log(`   ⚠️  Profile missing, creating...`)
          
          // Create profile
          const profileData = {
            user_id: authUser.user.id,
            full_name: `Demo ${role.charAt(0).toUpperCase() + role.slice(1)}`,
            phone: '555-000-0000',
            role_tech: role === 'technician' || role === 'admin',
            role_trainer: role === 'trainer' || role === 'admin',
            base_city: 'Demo City',
            base_state: 'CA',
            service_radius_mi: 50,
            is_approved: true, // Demo users are pre-approved
            role_admin: role === 'admin'
          }

          const { error: insertError } = await supabase
            .from('profiles')
            .insert(profileData)

          if (insertError) {
            console.log(`   ❌ Failed to create profile: ${insertError.message}`)
          } else {
            console.log(`   ✅ Profile created successfully`)
          }
        } else {
          console.log(`   ✅ Profile exists: ${profile.full_name}`)
          
          // Update role_admin if needed
          if (role === 'admin' && !profile.role_admin) {
            console.log(`   🔄 Updating role_admin to true...`)
            const { error: updateError } = await supabase
              .from('profiles')
              .update({ role_admin: true })
              .eq('user_id', authUser.user.id)
            
            if (updateError) {
              console.log(`   ❌ Failed to update role_admin: ${updateError.message}`)
            } else {
              console.log(`   ✅ role_admin updated successfully`)
            }
          }
        }
      }
    } catch (error) {
      console.log(`   ❌ Error checking user: ${error.message}`)
    }
    
    console.log('')
  }

  console.log('🎉 Demo users check completed!')
}

// Run the check
checkAndFixDemoUsers().catch(console.error)
