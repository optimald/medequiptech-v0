# MED Equipment Tech V0 - Database Setup

This directory contains the database setup and migration scripts for the MED Equipment Tech platform.

## Files

- `schema.sql` - Main database schema with tables, indexes, RLS policies, and functions
- `migrate_mock_data.sql` - Mock data migration script with sample profiles, jobs, and bids
- `README.md` - This file

## Setup Instructions

### 1. Apply the Schema

First, apply the database schema:

```bash
# Using Supabase CLI
supabase db reset

# Or manually apply the schema
psql -h your-host -U your-user -d your-database -f schema.sql
```

### 2. Run the Mock Data Migration

After the schema is applied, run the mock data migration:

```bash
# Using Supabase CLI
supabase db reset --db-url "your-connection-string"

# Or manually apply the migration
psql -h your-host -U your-user -d your-database -f migrate_mock_data.sql
```

## What the Migration Creates

### Profiles (16 total)
- **8 Technicians** with various skills (IPL, CO2, PDL, RF, etc.)
- **8 Trainers** with different specialties and coverage areas
- All profiles are pre-approved for immediate use

### Jobs (10 total)
- **5 Technician jobs** (equipment repair/maintenance)
- **5 Trainer jobs** (staff training and certification)
- Mix of priorities (P1, P2) and statuses (OPEN, BIDDING, AWARDED)

### Sample Data
- **Bids** - Random bids on open jobs
- **Awards** - Some jobs automatically awarded
- **Email campaigns** - Sample marketing campaigns
- **Notifications** - Sample system notifications
- **Import records** - Tracking of data imports

## Data Structure

### Technician Profiles
- Skills: IPL, PDL, CO2, RF, Ultrasound, Body Contouring
- Locations: CA, TX, NY, FL, IL, WA, GA, NC
- Service radius: 75-200 miles

### Trainer Profiles
- Specialties: Various laser manufacturers and training types
- Coverage: Regional with travel flexibility
- Focus: Staff development and certification

### Job Types
- **Tech jobs**: Equipment maintenance, calibration, repairs
- **Trainer jobs**: Staff training, certification, safety protocols

## Testing the Platform

After running the migration, you can:

1. **Browse jobs** at `/jobs` - See public job listings
2. **Sign up** as different user types - Test the signup flow
3. **View dashboard** - See sample data and statistics
4. **Test bidding** - Submit bids on open jobs
5. **Demo mode** - Use role-based demo signin

## Notes

- All mock data uses realistic but fictional information
- Phone numbers and emails are placeholder values
- Jobs reference real laser device models and common issues
- Skills and specialties match industry standards
- Data is designed to demonstrate all platform features

## Troubleshooting

If you encounter issues:

1. **Check RLS policies** - Ensure policies allow demo data access
2. **Verify schema** - Make sure all tables and functions exist
3. **Check permissions** - Ensure proper database user permissions
4. **Review logs** - Check for any SQL errors during migration

## Next Steps

After successful migration:

1. Test the platform functionality
2. Customize data for your specific needs
3. Add real user accounts as needed
4. Configure email and notification settings
5. Set up production data import processes
