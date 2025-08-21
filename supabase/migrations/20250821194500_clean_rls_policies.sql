-- Completely clean up RLS policies to fix infinite recursion
-- Drop ALL existing policies first
DROP POLICY IF EXISTS "profiles_select_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON profiles;
DROP POLICY IF EXISTS "jobs_select_policy" ON jobs;
DROP POLICY IF EXISTS "jobs_insert_policy" ON jobs;
DROP POLICY IF EXISTS "jobs_update_policy" ON jobs;
DROP POLICY IF EXISTS "jobs_public_select_policy" ON jobs;
DROP POLICY IF EXISTS "jobs_authenticated_select_policy" ON jobs;
DROP POLICY IF EXISTS "bids_select_policy" ON bids;
DROP POLICY IF EXISTS "bids_insert_policy" ON bids;
DROP POLICY IF EXISTS "bids_update_policy" ON bids;
DROP POLICY IF EXISTS "awards_select_policy" ON awards;
DROP POLICY IF EXISTS "awards_insert_policy" ON awards;
DROP POLICY IF EXISTS "email_campaigns_select_policy" ON email_campaigns;
DROP POLICY IF EXISTS "email_campaigns_insert_policy" ON email_campaigns;
DROP POLICY IF EXISTS "notifications_select_policy" ON notifications;
DROP POLICY IF EXISTS "imports_select_policy" ON imports;
DROP POLICY IF EXISTS "imports_insert_policy" ON imports;

-- Create simple, non-recursive RLS policies

-- Profiles: Users can only see their own profile, admins can see all
CREATE POLICY "profiles_simple_select" ON profiles
    FOR SELECT USING (
        auth.uid() = user_id OR 
        (auth.uid() IS NOT NULL AND role_admin = true)
    );

CREATE POLICY "profiles_simple_insert" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "profiles_simple_update" ON profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- Jobs: Public access to open jobs, authenticated users see all
CREATE POLICY "jobs_public_access" ON jobs
    FOR SELECT USING (
        status IN ('OPEN', 'BIDDING') OR auth.uid() IS NOT NULL
    );

CREATE POLICY "jobs_admin_insert" ON jobs
    FOR INSERT WITH CHECK (
        auth.uid() IS NOT NULL AND EXISTS (
            SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role_admin = true
        )
    );

CREATE POLICY "jobs_admin_update" ON jobs
    FOR UPDATE USING (
        auth.uid() IS NOT NULL AND EXISTS (
            SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role_admin = true
        )
    );

-- Bids: Users can see their own bids, admins can see all
CREATE POLICY "bids_simple_select" ON bids
    FOR SELECT USING (
        auth.uid() = bidder_id OR 
        (auth.uid() IS NOT NULL AND EXISTS (
            SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role_admin = true
        ))
    );

CREATE POLICY "bids_simple_insert" ON bids
    FOR INSERT WITH CHECK (
        auth.uid() = bidder_id AND EXISTS (
            SELECT 1 FROM profiles WHERE user_id = auth.uid() AND is_approved = true
        )
    );

CREATE POLICY "bids_simple_update" ON bids
    FOR UPDATE USING (auth.uid() = bidder_id);

-- Awards: Users can see their own awards, admins can see all
CREATE POLICY "awards_simple_select" ON awards
    FOR SELECT USING (
        auth.uid() = awarded_user_id OR 
        (auth.uid() IS NOT NULL AND EXISTS (
            SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role_admin = true
        ))
    );

CREATE POLICY "awards_admin_insert" ON awards
    FOR INSERT WITH CHECK (
        auth.uid() IS NOT NULL AND EXISTS (
            SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role_admin = true
        )
    );

-- Email campaigns: Only admins
CREATE POLICY "email_campaigns_admin_only" ON email_campaigns
    FOR ALL USING (
        auth.uid() IS NOT NULL AND EXISTS (
            SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role_admin = true
        )
    );

-- Notifications: Only admins
CREATE POLICY "notifications_admin_only" ON notifications
    FOR ALL USING (
        auth.uid() IS NOT NULL AND EXISTS (
            SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role_admin = true
        )
    );

-- Imports: Only admins
CREATE POLICY "imports_admin_only" ON imports
    FOR ALL USING (
        auth.uid() IS NOT NULL AND EXISTS (
            SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role_admin = true
        )
    );
