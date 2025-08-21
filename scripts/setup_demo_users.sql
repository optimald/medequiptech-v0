-- Demo Users Setup Script for MedEquipTech
-- Run this script in the Supabase Dashboard SQL Editor
-- This script creates demo users that can log in to the system

-- First, let's create the demo_credentials table for reference
CREATE TABLE IF NOT EXISTS demo_credentials (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert demo user credentials
INSERT INTO demo_credentials (email, password, role, description) VALUES
('demo.technician@medequiptech.com', 'demo123', 'technician', 'Demo technician account for testing laser equipment repair & maintenance'),
('demo.trainer@medequiptech.com', 'demo123', 'trainer', 'Demo trainer account for testing staff training & certification'),
('demo.medspa@medequiptech.com', 'demo123', 'medspa', 'Demo medspa practice account for testing equipment help & staff training'),
('demo.admin@medequiptech.com', 'demo123', 'admin', 'Demo admin account for testing platform management & oversight')
ON CONFLICT (email) DO NOTHING;

-- Grant permissions
GRANT SELECT ON demo_credentials TO anon, authenticated;

-- Note: To create actual users, you'll need to:
-- 1. Go to Authentication > Users in your Supabase dashboard
-- 2. Click "Add User" for each demo account
-- 3. Use the emails and passwords from the demo_credentials table
-- 4. Set the user metadata to include the role and is_demo flag

-- Example user metadata for each role:
-- Technician: {"role": "technician", "full_name": "Demo Technician", "is_demo": true}
-- Trainer: {"role": "trainer", "full_name": "Demo Trainer", "is_demo": true}
-- MedSpa: {"role": "medspa", "full_name": "Demo MedSpa Practice", "is_demo": true}
-- Admin: {"role": "admin", "full_name": "Demo Admin", "is_demo": true}

-- After creating the users, you can run this to create their profiles:
-- (Replace the UUIDs with the actual user IDs from the auth.users table)

/*
-- Example profile creation (uncomment and update UUIDs after creating users):
INSERT INTO profiles (
    user_id,
    full_name,
    phone,
    role_tech,
    role_trainer,
    skills,
    tech_skills,
    trainer_specialties,
    base_city,
    base_state,
    service_radius_mi,
    is_approved
) VALUES 
-- Replace these UUIDs with actual user IDs from auth.users
('USER_UUID_HERE', 'Demo Technician', '555-000-0001', true, false, 
 '["VBeam", "GentleMax", "M22", "Icon", "Sciton"]', 
 '["Laser Repair", "Calibration", "Maintenance", "Troubleshooting"]', 
 NULL, 'Los Angeles', 'CA', 100, true),
('USER_UUID_HERE', 'Demo Trainer', '555-000-0002', false, true, 
 '["BBL Hero", "Picosure", "Alma Harmony", "InMode", "BTL"]', 
 '["Safety Protocols", "Treatment Protocols", "Device Operation", "Staff Certification"]', 
 'Miami', 'FL', 150, true),
('USER_UUID_HERE', 'Demo MedSpa Practice', '555-000-0003', false, false, 
 '["Equipment Help", "Staff Training"]', 
 NULL, NULL, 'Miami', 'FL', 50, true),
('USER_UUID_HERE', 'Demo Admin', '555-000-0004', true, true, 
 '["Platform Management", "User Oversight", "System Administration"]', 
 NULL, NULL, 'San Diego', 'CA', 200, true);
*/
