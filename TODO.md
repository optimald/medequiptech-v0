# MED Equipment Tech V0 - Implementation To-Do List

## Project Setup & Infrastructure

### Environment & Configuration
- [ ] **TODO** Set up Vercel project for frontend + API
- [ ] **TODO** Set up Supabase project (DB + Auth)
- [ ] **TODO** Configure environment variables (DATABASE_URL, SUPABASE_ANON_KEY, RESEND_API_KEY, etc.)
- [ ] **TODO** Set up Resend account and verify domain (SPF/DKIM)
- [ ] **TODO** Set up Twilio account (optional V0)
- [ ] **TODO** Set up AWS S3 bucket for future attachments (optional V0)

### Database Setup
- [ ] **TODO** Create Supabase database with Postgres
- [ ] **TODO** Execute DDL scripts for core tables (profiles, jobs, bids, awards, etc.)
- [ ] **TODO** Set up Row Level Security (RLS) policies
- [ ] **TODO** Create database indexes for performance
- [ ] **TODO** Set up Supabase Auth with email+password

## Frontend Development

### Core Structure
- [ ] **TODO** Initialize Next.js project with App Router
- [ ] **TODO** Set up Tailwind CSS and shadcn/ui components
- [ ] **TODO** Configure PWA settings for Vercel deployment
- [ ] **TODO** Set up authentication context and providers

### Public Pages (No Login Required)
- [ ] **TODO** Create public job board landing page
- [ ] **TODO** Implement job listing grid/table with limited fields
- [ ] **TODO** Add job filtering by role, city, state
- [ ] **TODO** Create job teaser/detail view (limited info)
- [ ] **TODO** Add "Create account to bid" CTA buttons
- [ ] **TODO** Implement search functionality for public jobs

### Authentication Pages
- [ ] **TODO** Create user signup form (email+password, roles, basic info)
- [ ] **TODO** Create user signin form
- [ ] **TODO** Implement email verification flow
- [ ] **TODO** Create approval pending page for unapproved users

### User Dashboard (After Approval)
- [ ] **TODO** Create user account dashboard with approval status
- [ ] **TODO** Implement open jobs view (filterable by role)
- [ ] **TODO** Create job detail page for bidding
- [ ] **TODO** Add bid placement form (ask_price + note)
- [ ] **TODO** Create user's bid history view
- [ ] **TODO** Implement bid withdrawal functionality
- [ ] **TODO** Create user profile management page

### Admin/Dispatcher Dashboard
- [ ] **TODO** Create admin dashboard with counts (Open, Bidding, Pending Approvals)
- [ ] **TODO** Implement jobs management table with filters
- [ ] **TODO** Create job detail view with bids tab
- [ ] **TODO** Add job award functionality
- [ ] **TODO** Create user approval management interface
- [ ] **TODO** Implement CSV import wizard for jobs
- [ ] **TODO** Create bulk email blast interface (TOP PRIORITY)
- [ ] **TODO** Add settings page for templates, skills, regions

## Backend Development

### API Routes
- [ ] **TODO** Implement `/api/auth/signup` endpoint
- [ ] **TODO** Implement `/api/auth/signin` endpoint
- [ ] **TODO** Create `/api/jobs/public` endpoint for public job board
- [ ] **TODO** Create `/api/jobs/:id/public` endpoint for job details
- [ ] **TODO** Implement `/api/jobs` CRUD endpoints (admin only)
- [ ] **TODO** Create `/api/bids` endpoints (create, withdraw)
- [ ] **TODO** Implement `/api/jobs/:id/award` endpoint
- [ ] **TODO** Create `/api/imports/csv` endpoint for job imports
- [ ] **TODO** Implement `/api/email/bulk` endpoint for email campaigns
- [ ] **TODO** Add `/api/alerts/signup` and `/api/alerts/bid` endpoints
- [ ] **TODO** Create `/api/resend/webhook` endpoint for email events

### Business Logic
- [ ] **TODO** Implement user approval workflow
- [ ] **TODO** Add job status transition logic (OPEN → BIDDING → AWARDED)
- [ ] **TODO** Create bid validation and processing
- [ ] **TODO** Implement award workflow with notifications
- [ ] **TODO** Add CSV import parsing and validation
- [ ] **TODO** Create email campaign segmentation logic
- [ ] **TODO** Implement notification system (email/SMS)

### Email System
- [ ] **TODO** Set up Resend email templates
- [ ] **TODO** Create signup alert email for admins
- [ ] **TODO** Implement new bid alert emails
- [ ] **TODO** Create bulk jobs blast email template
- [ ] **TODO** Add award notice email template
- [ ] **TODO** Implement welcome email for approved users
- [ ] **TODO** Set up email webhook handling

## Data Import & Migration

### Google Sheet Import
- [ ] **TODO** Export Google Sheet to CSV format
- [ ] **TODO** Create CSV mapping interface for field mapping
- [ ] **TODO** Implement data normalization (state codes, dates)
- [ ] **TODO** Add dry-run import functionality with validation report
- [ ] **TODO** Create import commit functionality
- [ ] **TODO** Add duplicate detection logic
- [ ] **TODO** Implement source tagging for imports

## AI CLI Tool

### CLI Development
- [ ] **TODO** Create Node.js/TypeScript CLI tool
- [ ] **TODO** Implement natural language to SQL conversion
- [ ] **TODO** Add schema context for LLM prompts
- [ ] **TODO** Create read-only query execution
- [ ] **TODO** Add security guardrails (deny DDL/DML)
- [ ] **TODO** Implement parameterized SQL generation
- [ ] **TODO** Add table display formatting

## Testing & Quality Assurance

### Testing
- [ ] **TODO** Write unit tests for core business logic
- [ ] **TODO** Create integration tests for API endpoints
- [ ] **TODO** Test user approval workflow
- [ ] **TODO** Test bidding and award processes
- [ ] **TODO** Validate CSV import functionality
- [ ] **TODO** Test email sending and webhooks
- [ ] **TODO** Verify RLS policies and security

### Security & Validation
- [ ] **TODO** Implement rate limiting for auth endpoints
- [ ] **TODO** Add CAPTCHA for signup (if abuse detected)
- [ ] **TODO** Validate all input data and sanitize
- [ ] **TODO** Test RLS policies thoroughly
- [ ] **TODO** Verify admin-only endpoint protection

## Deployment & Launch

### Pre-Launch
- [ ] **TODO** Deploy to Vercel staging environment
- [ ] **TODO** Test all functionality in staging
- [ ] **TODO** Import 71 jobs from Google Sheet
- [ ] **TODO** Spot-check 10 jobs for accuracy
- [ ] **TODO** Deploy to production environment

### Launch Activities
- [ ] **TODO** Publish public job board
- [ ] **TODO** Invite 5 trusted Techs/Trainers for testing
- [ ] **TODO** Approve test users
- [ ] **TODO** Test bidding workflow with test users
- [ ] **TODO** Send first curated bulk email campaign

## Documentation & Training

### Documentation
- [ ] **TODO** Create user manual for Techs/Trainers
- [ ] **TODO** Write admin/dispatcher user guide
- [ ] **TODO** Document API endpoints and usage
- [ ] **TODO** Create troubleshooting guide
- [ ] **TODO** Document email templates and variables

### Training
- [ ] **TODO** Train MRP staff on job management
- [ ] **TODO** Train admins on user approval process
- [ ] **TODO** Create video tutorials for key workflows
- [ ] **TODO** Set up support system for users

## Post-Launch Monitoring

### Monitoring & Analytics
- [ ] **TODO** Set up error monitoring and logging
- [ ] **TODO** Track email delivery rates and failures
- [ ] **TODO** Monitor system performance and usage
- [ ] **TODO** Collect user feedback and usage analytics
- [ ] **TODO** Set up alerts for system issues

### Maintenance
- [ ] **TODO** Plan regular database maintenance
- [ ] **TODO** Schedule email template updates
- [ ] **TODO** Plan feature enhancements for post-V0
- [ ] **TODO** Monitor and update dependencies

## Priority Legend
- **CRITICAL**: Must complete for V0 launch
- **HIGH**: Important for core functionality
- **MEDIUM**: Nice to have for V0
- **LOW**: Post-V0 enhancements

## Estimated Timeline
- **Phase 1** (Weeks 1-2): Infrastructure, basic auth, job management
- **Phase 2** (Weeks 3-4): Bidding system, user approval, email system
- **Phase 3** (Weeks 5-6): CSV import, bulk email, AI CLI
- **Phase 4** (Weeks 7-8): Testing, deployment, launch preparation
