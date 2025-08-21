-- MED Equipment Tech V0 - Mock Data Migration Script
-- This script inserts mock data from CSV files into the database tables
-- Run this after the schema.sql has been applied

-- First, let's create some demo users for authentication
-- Note: These are demo users that don't require real email verification

-- Insert demo profiles for technicians
INSERT INTO profiles (
    user_id,
    full_name,
    phone,
    role_tech,
    role_trainer,
    skills,
    tech_skills,
    base_city,
    base_state,
    service_radius_mi,
    is_approved,
    created_at,
    updated_at
) VALUES 
-- Technicians
(
    gen_random_uuid(),
    'John Smith',
    '555-123-4567',
    true,
    false,
    '["IPL", "PDL", "CO2", "Laser Deck"]',
    '["IPL", "PDL", "CO2", "Laser Deck"]',
    'Los Angeles',
    'CA',
    100,
    true,
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'Sarah Johnson',
    '555-234-5678',
    true,
    false,
    '["IPL", "RF", "Ultrasound", "Body Contouring"]',
    '["IPL", "RF", "Ultrasound", "Body Contouring"]',
    'Dallas',
    'TX',
    150,
    true,
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'Mike Chen',
    '555-345-6789',
    true,
    false,
    '["CO2", "Fractional", "IPL", "PDL"]',
    '["CO2", "Fractional", "IPL", "PDL"]',
    'Brooklyn',
    'NY',
    75,
    true,
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'Lisa Rodriguez',
    '555-456-7890',
    true,
    false,
    '["PDL", "Vascular", "IPL", "Laser Safety"]',
    '["PDL", "Vascular", "IPL", "Laser Safety"]',
    'Miami',
    'FL',
    120,
    true,
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'David Thompson',
    '555-567-8901',
    true,
    false,
    '["IPL", "CO2", "PDL", "RF", "Ultrasound"]',
    '["IPL", "CO2", "PDL", "RF", "Ultrasound"]',
    'Chicago',
    'IL',
    200,
    true,
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'Emily Davis',
    '555-678-9012',
    true,
    false,
    '["RF", "Ultrasound", "Body Contouring", "IPL"]',
    '["RF", "Ultrasound", "Body Contouring", "IPL"]',
    'Seattle',
    'WA',
    100,
    true,
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'Robert Wilson',
    '555-789-0123',
    true,
    false,
    '["CO2", "IPL", "PDL", "Surgical Lasers"]',
    '["CO2", "IPL", "PDL", "Surgical Lasers"]',
    'Atlanta',
    'GA',
    150,
    true,
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'Jennifer Lee',
    '555-890-1234',
    true,
    false,
    '["IPL", "RF", "Ultrasound", "Body Contouring"]',
    '["IPL", "RF", "Ultrasound", "Body Contouring"]',
    'Charlotte',
    'NC',
    125,
    true,
    NOW(),
    NOW()
);

-- Insert demo profiles for trainers
INSERT INTO profiles (
    user_id,
    full_name,
    phone,
    role_tech,
    role_trainer,
    skills,
    trainer_specialties,
    base_city,
    base_state,
    service_radius_mi,
    is_approved,
    created_at,
    updated_at
) VALUES 
(
    gen_random_uuid(),
    'Amanda Foster',
    '555-111-2222',
    false,
    true,
    '["Aesthetic Lasers", "Training", "Certification"]',
    '["Candela", "Lumenis", "Cynosure", "Sciton"]',
    'Los Angeles',
    'CA',
    500,
    true,
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'Michael Chang',
    '555-222-3333',
    false,
    true,
    '["IPL", "RF Training", "Staff Development"]',
    '["BTL", "InMode", "Alma", "Venus"]',
    'Dallas',
    'TX',
    300,
    true,
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'Jessica Martinez',
    '555-333-4444',
    false,
    true,
    '["CO2 Training", "Fractional Lasers", "Safety"]',
    '["Lumenis", "Cynosure", "Cutera", "Sciton"]',
    'Miami',
    'FL',
    400,
    true,
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'Christopher Brown',
    '555-444-5555',
    false,
    true,
    '["Body Contouring", "RF Training", "Advanced Techniques"]',
    '["BTL", "InMode", "Alma", "Venus"]',
    'New York',
    'NY',
    200,
    true,
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'Rachel Green',
    '555-555-6666',
    false,
    true,
    '["Vascular Lasers", "PDL Training", "Clinical Applications"]',
    '["Candela", "VBeam", "GentleMax", "Cynosure"]',
    'Chicago',
    'IL',
    250,
    true,
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'Daniel Kim',
    '555-666-7777',
    false,
    true,
    '["New Technologies", "Innovation", "Best Practices"]',
    '["Alma", "InMode", "BTL", "Venus"]',
    'Seattle',
    'WA',
    300,
    true,
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'Ashley Taylor',
    '555-777-8888',
    false,
    true,
    '["IPL Training", "Aesthetic Applications", "Safety Protocols"]',
    '["Lumenis", "Cynosure", "Candela", "BTL"]',
    'Atlanta',
    'GA',
    200,
    true,
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'Ryan Anderson',
    '555-888-9999',
    false,
    true,
    '["Surgical Lasers", "Advanced Procedures", "Clinical Training"]',
    '["Lumenis", "Cynosure", "Cutera", "Sciton"]',
    'Charlotte',
    'NC',
    175,
    true,
    NOW(),
    NOW()
);

-- Insert demo jobs (open tickets) based on mock data
INSERT INTO jobs (
    external_id,
    job_type,
    title,
    company_name,
    customer_name,
    model,
    priority,
    status,
    met_date,
    shipping_state,
    shipping_city,
    contact_name,
    contact_phone,
    contact_email,
    instructions_public,
    instructions_private,
    created_at,
    updated_at
) VALUES 
-- Technician Jobs
(
    'OPS-001',
    'tech',
    'VBeam Perfecta PM & Calibration',
    'Beauty MedSpa',
    'Dr. Sarah Williams',
    'VBeam Perfecta',
    'P1',
    'OPEN',
    '2025-08-25',
    'CA',
    'Los Angeles',
    'Dr. Sarah Williams',
    '555-123-4567',
    'dr.williams@beautymedspa.com',
    'PM with dye kit replacement, DI filter change, and full calibration',
    'System showing error codes for dye pump assembly. Requires immediate attention.',
    NOW(),
    NOW()
),
(
    'OPS-002',
    'tech',
    'GentleMax Pro Maintenance',
    'Glow Aesthetics',
    'Dr. Michael Chen',
    'GentleMax Pro',
    'P2',
    'OPEN',
    '2025-08-26',
    'TX',
    'Dallas',
    'Dr. Michael Chen',
    '555-234-5678',
    'dr.chen@glowaesthetics.com',
    'Standard PM with flash lamp replacement, dual filter change, and energy calibration',
    'System needs maintenance code reset after service.',
    NOW(),
    NOW()
),
(
    'OPS-003',
    'tech',
    'M22 IPL System Service',
    'Radiance MedSpa',
    'Dr. Lisa Rodriguez',
    'M22',
    'P1',
    'BIDDING',
    '2025-08-27',
    'NY',
    'Brooklyn',
    'Dr. Lisa Rodriguez',
    '555-345-6789',
    'dr.rodriguez@radiancemedspa.com',
    'PM with DI filter replacement, coolant flush, and IPL calibration',
    'Possible HV relay causing noise. May need replacement.',
    NOW(),
    NOW()
),
(
    'OPS-004',
    'tech',
    'Icon Flash Lamp Replacement',
    'Perfect Skin Center',
    'Dr. David Thompson',
    'Icon',
    'P2',
    'OPEN',
    '2025-08-24',
    'IL',
    'Chicago',
    'Dr. David Thompson',
    '555-456-7890',
    'dr.thompson@perfectskin.com',
    'Flash lamp replacement needed with system calibration',
    'System showing lamp hours exceeded. Warranty service.',
    NOW(),
    NOW()
),
(
    'OPS-005',
    'tech',
    'Sciton Halo Fractional Service',
    'Elite Dermatology',
    'Dr. Jennifer Lee',
    'Sciton Halo',
    'P1',
    'OPEN',
    '2025-08-28',
    'FL',
    'Miami',
    'Dr. Jennifer Lee',
    '555-567-8901',
    'dr.lee@elitedermatology.com',
    'PM with fractional handpiece calibration, DI filter replacement, and energy verification',
    'System needs software update after maintenance.',
    NOW(),
    NOW()
),
-- Trainer Jobs
(
    'OPS-006',
    'trainer',
    'BBL Hero Staff Training',
    'Advanced Aesthetics',
    'Dr. Christopher Brown',
    'BBL Hero',
    'P2',
    'OPEN',
    '2025-08-29',
    'GA',
    'Atlanta',
    'Dr. Christopher Brown',
    '555-678-9012',
    'dr.brown@advancedaesthetics.com',
    'Staff training on BBL Hero system operation and safety protocols',
    'New staff members need comprehensive training on device operation.',
    NOW(),
    NOW()
),
(
    'OPS-007',
    'trainer',
    'Picosure Training Session',
    'Precision MedSpa',
    'Dr. Rachel Green',
    'Picosure',
    'P1',
    'BIDDING',
    '2025-08-30',
    'WA',
    'Seattle',
    'Dr. Rachel Green',
    '555-789-0123',
    'dr.green@precisionmedspa.com',
    'Advanced Picosure training for experienced staff',
    'Staff needs advanced techniques training for new procedures.',
    NOW(),
    NOW()
),
(
    'OPS-008',
    'trainer',
    'Alma Harmony RF Training',
    'Beauty & Beyond',
    'Dr. Ryan Anderson',
    'Alma Harmony',
    'P2',
    'OPEN',
    '2025-08-31',
    'NC',
    'Charlotte',
    'Dr. Ryan Anderson',
    '555-890-1234',
    'dr.anderson@beautyandbeyond.com',
    'RF calibration training and advanced treatment protocols',
    'Staff needs training on new RF protocols and safety measures.',
    NOW(),
    NOW()
),
(
    'OPS-009',
    'trainer',
    'InMode Morpheus Training',
    'Glow Medical Spa',
    'Dr. Amanda Foster',
    'InMode Morpheus',
    'P1',
    'OPEN',
    '2025-09-01',
    'CA',
    'San Francisco',
    'Dr. Amanda Foster',
    '555-111-2222',
    'dr.foster@glowmedicalspa.com',
    'Comprehensive training on Morpheus RF system',
    'New device installation requires full staff training.',
    NOW(),
    NOW()
),
(
    'OPS-010',
    'trainer',
    'BTL Emsella Training Program',
    'Elite Aesthetics',
    'Dr. Jessica Martinez',
    'BTL Emsella',
    'P2',
    'OPEN',
    '2025-09-02',
    'FL',
    'Orlando',
    'Dr. Jessica Martinez',
    '555-222-3333',
    'dr.martinez@eliteaesthetics.com',
    'Emsella chair operation and treatment protocols training',
    'Staff needs training on new pelvic floor treatment protocols.',
    NOW(),
    NOW()
);

-- Create some sample bids for demonstration
-- Note: We'll need to reference actual profile IDs, so let's create some sample bids
INSERT INTO bids (
    job_id,
    bidder_id,
    ask_price,
    note,
    status,
    created_at
) 
SELECT 
    j.id,
    p.user_id,
    CASE 
        WHEN j.job_type = 'tech' THEN 150.00 + (random() * 100)
        ELSE 200.00 + (random() * 150)
    END,
    CASE 
        WHEN j.job_type = 'tech' THEN 'Experienced technician available for immediate service. Will provide detailed report and photos.'
        ELSE 'Certified trainer with 10+ years experience. Customized training program included.'
    END,
    'submitted',
    NOW()
FROM jobs j
CROSS JOIN profiles p
WHERE j.status = 'BIDDING' 
    AND p.is_approved = true
    AND (
        (j.job_type = 'tech' AND p.role_tech = true) OR
        (j.job_type = 'trainer' AND p.role_trainer = true)
    )
    AND random() < 0.3; -- Only create bids for 30% of possible combinations

-- Create some awards for completed jobs
INSERT INTO awards (
    job_id,
    awarded_user_id,
    awarded_by,
    awarded_at
)
SELECT 
    j.id,
    p.user_id,
    p.user_id, -- Self-awarded for demo purposes
    NOW()
FROM jobs j
JOIN profiles p ON (
    (j.job_type = 'tech' AND p.role_tech = true) OR
    (j.job_type = 'trainer' AND p.role_trainer = true)
)
WHERE j.status = 'OPEN' 
    AND p.is_approved = true
    AND random() < 0.2; -- Award 20% of open jobs

-- Update job status for awarded jobs
UPDATE jobs 
SET status = 'AWARDED'
WHERE id IN (SELECT job_id FROM awards);

-- Insert some sample email campaigns
INSERT INTO email_campaigns (
    created_by,
    segment_json,
    job_ids,
    subject,
    template_key,
    status,
    created_at
) VALUES 
(
    (SELECT user_id FROM profiles WHERE full_name = 'John Smith' LIMIT 1),
    '{"role": "tech", "state": "CA", "skills": ["IPL", "CO2"]}',
    ARRAY[(SELECT id FROM jobs WHERE external_id = 'OPS-001' LIMIT 1)],
    'New Service Opportunity in Los Angeles',
    'job_alert',
    'sent',
    NOW()
),
(
    (SELECT user_id FROM profiles WHERE full_name = 'Amanda Foster' LIMIT 1),
    '{"role": "trainer", "state": "CA", "specialties": ["Candela", "Lumenis"]}',
    ARRAY[(SELECT id FROM jobs WHERE external_id = 'OPS-009' LIMIT 1)],
    'Training Opportunity in San Francisco',
    'job_alert',
    'sent',
    NOW()
);

-- Insert sample notifications
INSERT INTO notifications (
    type,
    payload,
    channel,
    "to",
    status,
    created_at
) VALUES 
(
    'job_awarded',
    '{"job_id": "sample", "job_title": "VBeam Perfecta Service", "amount": 250.00}',
    'email',
    'john.smith@lasertech.com',
    'sent',
    NOW()
),
(
    'new_bid',
    '{"job_id": "sample", "bidder_name": "Sarah Johnson", "amount": 180.00}',
    'email',
    'dr.williams@beautymedspa.com',
    'sent',
    NOW()
);

-- Create a sample import record
INSERT INTO imports (
    source,
    mapping_json,
    row_count,
    created_at
) VALUES 
(
    'csv',
    '{"technicians": "mock_technicians.csv", "trainers": "mock_trainers.csv", "jobs": "mock_open_tickets.csv"}',
    28,
    NOW()
);

-- Grant permissions to demo users (if needed)
-- Note: This assumes the RLS policies are properly configured

COMMIT;

-- Display summary of inserted data
SELECT 'Migration Complete' as status;
SELECT COUNT(*) as total_profiles FROM profiles;
SELECT COUNT(*) as total_jobs FROM jobs;
SELECT COUNT(*) as total_bids FROM bids;
SELECT COUNT(*) as total_awards FROM awards;
SELECT COUNT(*) as total_email_campaigns FROM email_campaigns;
SELECT COUNT(*) as total_notifications FROM notifications;
