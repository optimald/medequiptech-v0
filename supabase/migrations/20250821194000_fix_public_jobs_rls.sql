-- Fix RLS policies for public jobs access
-- The issue is that jobs policies are checking profiles table, causing infinite recursion

-- Drop the problematic jobs policies
DROP POLICY IF EXISTS "jobs_select_policy" ON jobs;

-- Create a new, simplified jobs policy that doesn't check profiles for public access
CREATE POLICY "jobs_public_select_policy" ON jobs
    FOR SELECT USING (
        -- Public jobs (OPEN, BIDDING) are always accessible
        status IN ('OPEN', 'BIDDING')
    );

-- Create a separate policy for authenticated users to see all jobs
CREATE POLICY "jobs_authenticated_select_policy" ON jobs
    FOR SELECT USING (
        -- Authenticated users can see all jobs
        auth.uid() IS NOT NULL
    );

-- Keep the existing insert and update policies for admins
-- (These are already correct and don't cause recursion)
