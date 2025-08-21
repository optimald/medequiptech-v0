-- Fix infinite recursion in RLS policies - Clean version
-- Drop problematic policies first
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Public can view open jobs with limited fields" ON jobs;
DROP POLICY IF EXISTS "Approved users can view job details" ON jobs;
DROP POLICY IF EXISTS "Admins can manage all jobs" ON jobs;
DROP POLICY IF EXISTS "Users can view own bids" ON bids;
DROP POLICY IF EXISTS "Users can create bids" ON bids;
DROP POLICY IF EXISTS "Users can update own bids" ON bids;
DROP POLICY IF EXISTS "Admins can view all bids" ON bids;
DROP POLICY IF EXISTS "Admins can manage awards" ON awards;
DROP POLICY IF EXISTS "Admins can manage email campaigns" ON email_campaigns;
DROP POLICY IF EXISTS "Admins can manage notifications" ON notifications;
DROP POLICY IF EXISTS "Admins can manage imports" ON imports;

-- Add role_admin field to profiles table if it doesn't exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role_admin BOOLEAN DEFAULT FALSE;

-- Update existing demo admin user to have role_admin = true
UPDATE profiles 
SET role_admin = true 
WHERE email = 'demo.admin@medequiptech.com';

-- Create index for admin role checking
CREATE INDEX IF NOT EXISTS idx_profiles_admin ON profiles(role_admin);

-- Create simplified, efficient RLS policies

-- Profiles policies
CREATE POLICY "profiles_select_policy" ON profiles
    FOR SELECT USING (
        auth.uid() = user_id OR 
        (auth.uid() IS NOT NULL AND EXISTS (
            SELECT 1 FROM profiles p2 
            WHERE p2.user_id = auth.uid() 
            AND p2.is_approved = true 
            AND p2.role_admin = true
        ))
    );

CREATE POLICY "profiles_insert_policy" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "profiles_update_policy" ON profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- Jobs policies - simplified
CREATE POLICY "jobs_select_policy" ON jobs
    FOR SELECT USING (
        status IN ('OPEN', 'BIDDING') OR
        (auth.uid() IS NOT NULL AND EXISTS (
            SELECT 1 FROM profiles p 
            WHERE p.user_id = auth.uid() 
            AND p.is_approved = true
        ))
    );

CREATE POLICY "jobs_insert_policy" ON jobs
    FOR INSERT WITH CHECK (
        auth.uid() IS NOT NULL AND EXISTS (
            SELECT 1 FROM profiles p 
            WHERE p.user_id = auth.uid() 
            AND p.is_approved = true 
            AND p.role_admin = true
        )
    );

CREATE POLICY "jobs_update_policy" ON jobs
    FOR UPDATE USING (
        auth.uid() IS NOT NULL AND EXISTS (
            SELECT 1 FROM profiles p 
            WHERE p.user_id = auth.uid() 
            AND p.is_approved = true 
            AND p.role_admin = true
        )
    );

-- Bids policies
CREATE POLICY "bids_select_policy" ON bids
    FOR SELECT USING (
        auth.uid() = bidder_id OR
        (auth.uid() IS NOT NULL AND EXISTS (
            SELECT 1 FROM profiles p 
            WHERE p.user_id = auth.uid() 
            AND p.is_approved = true 
            AND p.role_admin = true
        ))
    );

CREATE POLICY "bids_insert_policy" ON bids
    FOR INSERT WITH CHECK (
        auth.uid() = bidder_id AND
        EXISTS (
            SELECT 1 FROM profiles p 
            WHERE p.user_id = auth.uid() 
            AND p.is_approved = true
        )
    );

CREATE POLICY "bids_update_policy" ON bids
    FOR UPDATE USING (auth.uid() = bidder_id);

-- Awards policies
CREATE POLICY "awards_select_policy" ON awards
    FOR SELECT USING (
        auth.uid() = awarded_user_id OR
        (auth.uid() IS NOT NULL AND EXISTS (
            SELECT 1 FROM profiles p 
            WHERE p.user_id = auth.uid() 
            AND p.is_approved = true 
            AND p.role_admin = true
        ))
    );

CREATE POLICY "awards_insert_policy" ON awards
    FOR INSERT WITH CHECK (
        auth.uid() IS NOT NULL AND EXISTS (
            SELECT 1 FROM profiles p 
            WHERE p.user_id = auth.uid() 
            AND p.is_approved = true 
            AND p.role_admin = true
        )
    );

-- Email campaigns policies
CREATE POLICY "email_campaigns_select_policy" ON email_campaigns
    FOR SELECT USING (
        auth.uid() IS NOT NULL AND EXISTS (
            SELECT 1 FROM profiles p 
            WHERE p.user_id = auth.uid() 
            AND p.is_approved = true 
            AND p.role_admin = true
        )
    );

CREATE POLICY "email_campaigns_insert_policy" ON email_campaigns
    FOR INSERT WITH CHECK (
        auth.uid() IS NOT NULL AND EXISTS (
            SELECT 1 FROM profiles p 
            WHERE p.user_id = auth.uid() 
            AND p.is_approved = true 
            AND p.role_admin = true
        )
    );

-- Notifications policies
CREATE POLICY "notifications_select_policy" ON notifications
    FOR SELECT USING (
        auth.uid() IS NOT NULL AND EXISTS (
            SELECT 1 FROM profiles p 
            WHERE p.user_id = auth.uid() 
            AND p.is_approved = true 
            AND p.role_admin = true
        )
    );

-- Imports policies
CREATE POLICY "imports_select_policy" ON imports
    FOR SELECT USING (
        auth.uid() IS NOT NULL AND EXISTS (
            SELECT 1 FROM profiles p 
            WHERE p.user_id = auth.uid() 
            AND p.is_approved = true 
            AND p.role_admin = true
        )
    );

CREATE POLICY "imports_insert_policy" ON imports
    FOR INSERT WITH CHECK (
        auth.uid() IS NOT NULL AND EXISTS (
            SELECT 1 FROM profiles p 
            WHERE p.user_id = auth.uid() 
            AND p.is_approved = true 
            AND p.role_admin = true
        )
    );
