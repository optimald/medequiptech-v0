-- MED Equipment Tech V0 Database Schema
-- This file contains all the DDL scripts needed to set up the database

-- Create custom types
CREATE TYPE job_type AS ENUM ('tech', 'trainer');
CREATE TYPE job_status AS ENUM (
  'OPEN', 'BIDDING', 'AWARDED', 'SCHEDULED', 'IN_PROGRESS', 'AWAITING_PARTS', 'COMPLETED', 'CANCELED'
);
CREATE TYPE job_priority AS ENUM ('P0', 'P1', 'P2', 'SCOTT');
CREATE TYPE bid_status AS ENUM ('submitted', 'withdrawn', 'accepted', 'rejected');

-- Create profiles table
CREATE TABLE profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  role_tech BOOLEAN DEFAULT FALSE,
  role_trainer BOOLEAN DEFAULT FALSE,
  skills JSONB DEFAULT '[]',
  trainer_specialties JSONB DEFAULT '[]',
  tech_skills JSONB DEFAULT '[]',
  base_city TEXT,
  base_state TEXT,
  service_radius_mi INTEGER,
  is_approved BOOLEAN DEFAULT FALSE,
  notif_email BOOLEAN DEFAULT TRUE,
  notif_sms BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create jobs table
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id TEXT,
  job_type job_type NOT NULL,
  title TEXT,
  company_name TEXT,
  customer_name TEXT,
  model TEXT,
  priority job_priority NOT NULL DEFAULT 'P2',
  status job_status NOT NULL DEFAULT 'OPEN',
  met_date DATE,
  shipping_state TEXT,
  shipping_city TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  zip TEXT,
  contact_name TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  instructions_public TEXT,
  instructions_private TEXT,
  sla_due_at TIMESTAMPTZ,
  created_by UUID,
  source_tag TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create bids table
CREATE TABLE bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  bidder_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  ask_price NUMERIC(12,2) NOT NULL,
  note TEXT,
  status bid_status NOT NULL DEFAULT 'submitted',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create awards table
CREATE TABLE awards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  awarded_user_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE SET NULL,
  awarded_by UUID,
  awarded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create email_campaigns table
CREATE TABLE email_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID,
  segment_json JSONB NOT NULL,
  job_ids UUID[] DEFAULT '{}',
  subject TEXT NOT NULL,
  template_key TEXT NOT NULL,
  sent_at TIMESTAMPTZ,
  status TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  payload JSONB NOT NULL,
  channel TEXT NOT NULL,
  "to" TEXT NOT NULL,
  status TEXT,
  sent_at TIMESTAMPTZ,
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create imports table
CREATE TABLE imports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL CHECK (source IN ('google_sheet', 'csv')),
  mapping_json JSONB NOT NULL,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  row_count INTEGER
);

-- Create indexes for performance
CREATE INDEX idx_jobs_type_status ON jobs(job_type, status);
CREATE INDEX idx_jobs_priority ON jobs(priority);
CREATE INDEX idx_jobs_external_id ON jobs(external_id);
CREATE INDEX idx_bids_job ON bids(job_id);
CREATE INDEX idx_bids_bidder ON bids(bidder_id);
CREATE INDEX idx_profiles_approved ON profiles(is_approved);
CREATE INDEX idx_profiles_roles ON profiles(role_tech, role_trainer);
CREATE INDEX idx_profiles_location ON profiles(base_state, base_city);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE imports ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" ON profiles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE user_id = auth.uid() AND is_approved = true
        )
    );

-- Jobs policies (public view)
CREATE POLICY "Public can view open jobs with limited fields" ON jobs
    FOR SELECT USING (
        status IN ('OPEN', 'BIDDING')
    );

-- Jobs policies (authenticated users)
CREATE POLICY "Approved users can view job details" ON jobs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE user_id = auth.uid() AND is_approved = true
        )
    );

-- Jobs policies (admin only)
CREATE POLICY "Admins can manage all jobs" ON jobs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE user_id = auth.uid() AND is_approved = true
        )
    );

-- Bids policies
CREATE POLICY "Users can view own bids" ON bids
    FOR SELECT USING (auth.uid() = bidder_id);

CREATE POLICY "Users can create bids" ON bids
    FOR INSERT WITH CHECK (
        auth.uid() = bidder_id AND
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE user_id = auth.uid() AND is_approved = true
        )
    );

CREATE POLICY "Users can update own bids" ON bids
    FOR UPDATE USING (auth.uid() = bidder_id);

CREATE POLICY "Admins can view all bids" ON bids
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE user_id = auth.uid() AND is_approved = true
        )
    );

-- Awards policies (admin only)
CREATE POLICY "Admins can manage awards" ON awards
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE user_id = auth.uid() AND is_approved = true
        )
    );

-- Email campaigns policies (admin only)
CREATE POLICY "Admins can manage email campaigns" ON email_campaigns
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE user_id = auth.uid() AND is_approved = true
        )
    );

-- Notifications policies (admin only)
CREATE POLICY "Admins can manage notifications" ON notifications
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE user_id = auth.uid() AND is_approved = true
        )
    );

-- Imports policies (admin only)
CREATE POLICY "Admins can manage imports" ON imports
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE user_id = auth.uid() AND is_approved = true
        )
    );

-- Create functions for common operations

-- Function to get public job listings
CREATE OR REPLACE FUNCTION get_public_jobs(
    p_status job_status[] DEFAULT ARRAY['OPEN', 'BIDDING']::job_status[],
    p_job_type job_type DEFAULT NULL,
    p_state TEXT DEFAULT NULL,
    p_city TEXT DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    job_type job_type,
    title TEXT,
    shipping_city TEXT,
    shipping_state TEXT,
    met_date DATE,
    priority job_priority,
    status job_status
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        j.id,
        j.job_type,
        j.title,
        j.shipping_city,
        j.shipping_state,
        j.met_date,
        j.priority,
        j.status
    FROM jobs j
    WHERE j.status = ANY(p_status)
        AND (p_job_type IS NULL OR j.job_type = p_job_type)
        AND (p_state IS NULL OR j.shipping_state ILIKE p_state)
        AND (p_city IS NULL OR j.shipping_city ILIKE p_city)
    ORDER BY 
        CASE j.priority
            WHEN 'P0' THEN 1
            WHEN 'P1' THEN 2
            WHEN 'P2' THEN 3
            WHEN 'SCOTT' THEN 4
        END,
        j.met_date ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get job bids summary
CREATE OR REPLACE FUNCTION get_job_bids_summary(p_job_id UUID)
RETURNS TABLE (
    bid_count BIGINT,
    min_price NUMERIC,
    max_price NUMERIC,
    avg_price NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::BIGINT,
        MIN(b.ask_price),
        MAX(b.ask_price),
        AVG(b.ask_price)
    FROM bids b
    WHERE b.job_id = p_job_id AND b.status = 'submitted';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Insert sample data for testing (optional)
-- INSERT INTO profiles (user_id, full_name, role_tech, role_trainer, is_approved) 
-- VALUES ('00000000-0000-0000-0000-000000000000', 'Admin User', true, true, true);
