# MED Equipment Tech V0

A job board and bidding platform for medical equipment technicians and trainers, built with Next.js, Supabase, and Resend.

## 🚀 Project Overview

MED Equipment Tech V0 is a comprehensive platform that connects medical equipment technicians and trainers with job opportunities. The system features a public job board, user authentication with admin approval, bidding workflows, and bulk email campaigns.

## ✨ Key Features

- **Public Job Board**: View open jobs without registration
- **User Authentication**: Email/password signup with admin approval
- **Bidding System**: Approved users can bid on open jobs
- **Admin Management**: Job management, user approval, and award workflows
- **Bulk Email Campaigns**: Curate and send targeted job notifications
- **CSV Import**: Import jobs from Google Sheets or CSV files
- **AI CLI Tool**: Natural language queries for database operations

## 🏗️ Architecture

- **Frontend**: Next.js 14 with App Router, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API routes with serverless functions
- **Database**: Supabase (PostgreSQL) with Row Level Security
- **Authentication**: Supabase Auth
- **Email**: Resend for transactional and bulk emails
- **SMS**: Twilio (optional in V0)
- **Deployment**: Vercel
- **Storage**: AWS S3 (optional in V0)

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Resend account
- Vercel account (for deployment)

### Environment Variables

Create a `.env.local` file with:

```bash
# Supabase
DATABASE_URL=your_supabase_database_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Email (Resend)
RESEND_API_KEY=your_resend_api_key

# SMS (Twilio - optional)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# App
APP_BASE_URL=your_app_url
ADMIN_ALERT_EMAILS=admin1@example.com,admin2@example.com
```

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd medequiptech-V0
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
```bash
# Run the DDL scripts in your Supabase SQL editor
# See /database/schema.sql
```

4. Start the development server:
```bash
npm run dev
```

## 📊 Database Schema

The application uses the following core tables:

- `profiles` - User profiles with approval status
- `jobs` - Job listings with status and priority
- `bids` - User bids on jobs
- `awards` - Job awards to users
- `email_campaigns` - Bulk email campaigns
- `notifications` - System notifications

## 🔐 Security Features

- Row Level Security (RLS) policies
- Admin approval required for bidding
- Rate limiting on authentication endpoints
- Input validation and sanitization
- Secure API endpoints with proper authorization

## 📧 Email Templates

The system includes several email templates:

- Signup alerts for admins
- New bid notifications
- Bulk job announcements
- Award notices
- Welcome emails for approved users

## 🚀 Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main branch

### Database Migration

1. Export your Google Sheet to CSV
2. Use the CSV import wizard in the admin interface
3. Validate the import with dry-run functionality
4. Commit the import

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login

### Job Endpoints

- `GET /api/jobs/public` - Public job listings
- `GET /api/jobs/:id/public` - Public job details
- `GET /api/jobs` - Admin job management
- `POST /api/jobs` - Create new job (admin)
- `PUT /api/jobs/:id` - Update job (admin)

### Bidding Endpoints

- `POST /api/bids` - Submit bid
- `DELETE /api/bids/:id` - Withdraw bid

### Admin Endpoints

- `POST /api/jobs/:id/award` - Award job to bidder
- `POST /api/imports/csv` - Import jobs from CSV
- `POST /api/email/bulk` - Send bulk email campaign

## 🤖 AI CLI Tool

The AI CLI tool allows natural language queries to the database:

```bash
# Install CLI globally
npm install -g @medequiptech/cli

# Run queries
met ai "show open trainer jobs in UT sorted by met_date"
met ai "bids count & avg ask_price per state for tech jobs, last 14 days"
```

## 📋 Development Roadmap

### V0 (Current)
- [x] Project specification and planning
- [ ] Core infrastructure setup
- [ ] Basic authentication and user management
- [ ] Job board and bidding system
- [ ] Admin dashboard and workflows
- [ ] CSV import functionality
- [ ] Bulk email campaigns
- [ ] AI CLI tool

### Future Versions
- SMS notifications and keyword responses
- File attachments and photo support
- Advanced scheduling and parts management
- Customer portal
- Mobile app

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software owned by Slickrock Holdings.

## 🆘 Support

For support and questions, contact:
- Email: badger@slickrockholdings.com
- Project Issues: [GitHub Issues](https://github.com/your-org/medequiptech-V0/issues)

## 🙏 Acknowledgments

- Built with Next.js and the Vercel platform
- Database powered by Supabase
- Email services by Resend
- UI components by shadcn/ui
