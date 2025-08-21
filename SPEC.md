Awesome—here’s the tightened, **full V0 build spec** incorporating your answers and the “backup if Rails slips” plan. It’s lean, explicit, and ready to hand to a dev (Tommy or a parallel team).

# 0) Scope Summary (V0)

* **Public job board** (limited info) that funnels non‑logged‑in Techs/Trainers to sign up.
* **Email+password auth**; Admin must **approve** users before they can bid.
* **Jobs intake** by **MRP staff only** (start from a Google Sheet import; ongoing CSV).
* **Bidding workflow**: approved users **bid on open jobs**; Admin reviews and **awards**.
* **Bulk email**: Admin curates lists of **open Tech or Trainer jobs** and sends email blasts.
* **MRP‑triggered notifications only** (no auto daily runs for V0).
* **Admin alerts**: on **new signups** and on **each bid**.
* **AI CLI to DB (Supabase)** for quick ops/queries.
* **Stack**: Next.js (Vercel) + Supabase Postgres + Resend (email) + Twilio (SMS, optional V0) + AWS (files or future runtime).

---

# 1) Architecture (pragmatic + fast)

* **Frontend**: Next.js (App Router), Tailwind, shadcn/ui, hosted on **Vercel** (PWA).
* **Backend**: Next.js API routes (Vercel) for auth, jobs, bids, mail; serverless-friendly.
* **DB**: **Supabase Postgres** (+ Row Level Security for field users).
* **Auth**: Supabase Auth (email+password). Admin approval gate in `profiles.is_approved`.
* **Email**: **Resend** for transactional & bulk (domain + templates).
* **SMS**: **Twilio** (optional in V0; wire the provider and a toggle).
* **Files**: AWS S3 (or Supabase Storage) for attachments (V0 optional).
* **AI CLI**: Node/TS CLI hitting Supabase; prompt→SQL guardrailed (feature flag).

ENV (Vercel): `DATABASE_URL`, `SUPABASE_ANON_KEY`, `RESEND_API_KEY`, `TWILIO_*`, `APP_BASE_URL`, `ADMIN_ALERT_EMAILS`.

---

# 2) Roles & Permissions

* **Public**: view limited job cards (no addresses/contact), search/filter.
* **Tech / Trainer** (field): sign up; once **approved**, can bid on Open jobs matching role.
* **Dispatcher (MRP staff)**: CRUD jobs, import CSV, curate & send bulk emails, review bids, award.
* **Admin**: all dispatcher rights + user approvals, settings, templates, skills/regions.
* (**Note**: Trainers and Techs have separate role tags; users may be both.)

---

# 3) Data Model (tables & key fields)

### users (auth handled by Supabase)

* `id`, `email` (unique), `password_hash` (Supabase), `created_at`

### profiles

* `user_id` (PK, FK → users.id)
* `full_name`, `phone`, `role_tech` (bool), `role_trainer` (bool)
* `skills` (jsonb), `trainer_specialties` (jsonb), `tech_skills` (jsonb)
* `base_city`, `base_state`, `service_radius_mi`
* `is_approved` (bool, default false)
* `notif_email` (bool), `notif_sms` (bool)
* `created_at`, `updated_at`

### jobs

* `id` (uuid, PK), `external_id` (nullable, from sheet)
* `job_type` (enum: `tech` | `trainer`) ← used for curation
* **Business fields (from you)**:
  `company_name`, `customer_name`, `model`,
  `priority` (enum: `P0`|`P1`|`P2`|`SCOTT`),
  `status` (enum below),
  `met_date` (date), `shipping_state`, `shipping_city`
* **Operational**: `title`, `address_line1`, `address_line2`, `zip`, `contact_name`, `contact_phone`, `contact_email`,
  `instructions_public`, `instructions_private`,
  `sla_due_at`, `created_by`, `updated_at`, `source_tag`

**Status enum (separate from priority):**
`OPEN` → `BIDDING` → `AWARDED` → `SCHEDULED` → `IN_PROGRESS` → `AWAITING_PARTS` → `COMPLETED` → `CANCELED`

### bids

* `id`, `job_id` → jobs.id, `bidder_id` → profiles.user\_id
* `ask_price` (numeric), `note` (text), `created_at`, `status` (enum: `submitted`|`withdrawn`|`accepted`|`rejected`)

### awards

* `id`, `job_id`, `awarded_user_id`, `awarded_by`, `awarded_at`

### imports

* `id`, `source` (`google_sheet`|`csv`), `mapping_json`, `created_by`, `created_at`, `row_count`

### email\_campaigns

* `id`, `created_by`, `segment_json` (filters), `job_ids` (uuid\[]), `subject`, `template_key`, `sent_at`, `status`

### notifications

* `id`, `type` (`signup_alert`|`new_bid_alert`|`manual_job_send`), `payload` (jsonb), `channel` (`email`|`sms`), `to`, `status`, `sent_at`, `error`

*(Optional V0)* `attachments`, `events_audit`

**Indexes**: jobs(priority, status), jobs(job\_type), bids(job\_id), bids(bidder\_id), profiles(is\_approved).

---

# 4) Google Sheet Import (the 71 jobs)

* **Required columns (map wizard)**: `company_name`, `customer_name`, `model`, `priority`, `status`, `met_date`, `shipping_state`, `shipping_city`, `job_type` (tech/trainer).
* **Optional**: `external_id`, `address`, `contact_name/phone/email`.
* Steps:

  1. Admin uploads CSV (exported from Google Sheet).
  2. Mapping UI → preview normalization (state codes, dates).
  3. **Dry‑run report** (new/updates/skips).
  4. Commit import; set `source_tag = “sheet:YYYY‑MM‑DD”`.

De‑dupe key: `external_id` OR (`customer_name` + `model` + `met_date`).

---

# 5) Core Flows

### 5.1 Public Job Board (no login)

* Grid/table of **Open** jobs with limited fields: `title`, `job_type`, `shipping_city/state`, `met_date`, `priority` (badge).
* Click → **Job teaser**: brief description + **“Create account to bid”** CTA (no contact/address).

### 5.2 Signup & Approval

1. User signs up (email+password), selects **Tech**, **Trainer**, or both; provides basics (name, phone, city/state).
2. Profile saved with `is_approved = false`.
3. **Admin email via Resend**: “New signup pending approval”.
4. Admin screen: approve/deny; on approve → user can bid; (optional) send welcome email/template.

### 5.3 Bidding

* Approved user opens **job detail** (Open/Bidding only) → enters `ask_price` + (optional) note → submit.
* **Admin email** on each bid (Resend).
* Job status auto‑moves `OPEN → BIDDING` when first bid arrives (configurable).
* Users can withdraw their bid before award.

### 5.4 Awarding

* Admin reviews **Bids tab** on job: sorted by price, distance (if available), and role fit.
* Click **Award** → select bidder → creates `awards` row; sets job `status = AWARDED`.
* Send emails:

  * **To awardee**: job awarded, next steps (Admin‑triggered template).
  * **To other bidders**: “Not awarded” (optional toggle).

### 5.5 Admin Bulk Email (Top Priority)

* **Curate list**: filters for jobs by `job_type=tech|trainer`, `status in (OPEN,BIDDING)`, `priority`, `state/city`, `met_date range`.
* Preview recipients: **all approved profiles** matching job type (+ optional skills/region).
* Compose in Resend template (variables: job list summary, CTA link to job board).
* **Send now**. Store campaign in `email_campaigns` with segment and job\_ids.
* Metrics (basic): delivered/failed counts from Resend webhook (V0 optional).

### 5.6 Manual Notifications (MRP‑triggered)

* From a job or list view, Admin can **Send Email** (and/or SMS if enabled) to:

  * Assigned awardee, all bidders, or all approved users of a role within state/region.
* Templates: **New Jobs**, **Reminder to Bid**, **Award Notice**, **Schedule Request**.

---

# 6) Status vs Priority

* **Priority (business urgency)**: `P0` (critical), `P1`, `P2`, `SCOTT` (internal special).
* **Status (lifecycle)**: as enumerated above.
  *(V0 rule: priority does not auto‑drive sends; Admin manually triggers sends.)*

---

# 7) Minimal Screens

**Public**

* Job List (limited info) → Job Teaser → Sign Up

**Tech/Trainer (after approval)**

* My Account (approval state banner)
* Open Jobs (filterable) → Job Detail → Place/Withdraw Bid
* My Bids (status columns)
* Profile (roles, skills, region, notifications)

**Admin/Dispatcher**

* Dashboard (counts: Open, Bidding, Approvals pending)
* Jobs (table with filters, bulk select → **Send Email**)
* Job Detail (fields, bids tab, award button)
* **Email Blast** (segment builder, template select, send)
* Users (pending approvals, approve/deny)
* Import (CSV wizard, dry‑run, commit)
* Settings (templates, skills, states/regions)

---

# 8) Integrations & Setup (V0)

**Resend**

* Verify domain (SPF/DKIM), set from address (e.g., `ops@met.example`).
* Templates: `signup_alert_admin`, `new_bid_alert_admin`, `bulk_jobs_blast`, `award_notice`, `welcome_approved`.
* Webhooks → `/api/resend/webhook` to capture events (optional).

**Twilio** (optional in V0)

* Messaging Service + phone number; env vars; endpoint `/api/sms/send`.
* Keywords not required for V0 (no auto flows).

**Supabase**

* Projects: DB + Auth; RLS policies (field users see only public fields on open jobs + their own bids).
* SQL (DDL below).
* Service role key stored on server only.

**Vercel**

* Projects: frontend + API, protect env vars, preview → production.

**AWS (optional V0)**

* S3 bucket for future attachments; signed URL helper.

---

# 9) API (HTTP, JSON)

`POST /api/auth/signup` → {email, password, role\_tech, role\_trainer, name, phone, city, state}
`POST /api/auth/signin`
`GET /api/jobs/public?status=open&job_type=tech|trainer&state=UT&city=Salt%20Lake`
`GET /api/jobs/:id/public` (limited fields)
`GET /api/jobs` (admin) with filters
`POST /api/jobs` (admin)
`PUT /api/jobs/:id` (admin)
`POST /api/bids` (auth; requires approved) → {job\_id, ask\_price, note}
`DELETE /api/bids/:id` (auth; owner withdraw)
`POST /api/jobs/:id/award` (admin) → {user\_id}
`POST /api/imports/csv` (admin; multipart)
`POST /api/email/bulk` (admin) → {segment\_json, job\_ids?, template\_key, subject}
`POST /api/alerts/signup` (system)
`POST /api/alerts/bid` (system)
`POST /api/resend/webhook` (events)

---

# 10) DDL (Postgres / Supabase) — core tables

```sql
create type job_type as enum ('tech','trainer');
create type job_status as enum (
  'OPEN','BIDDING','AWARDED','SCHEDULED','IN_PROGRESS','AWAITING_PARTS','COMPLETED','CANCELED'
);
create type job_priority as enum ('P0','P1','P2','SCOTT');

create table profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  phone text,
  role_tech boolean default false,
  role_trainer boolean default false,
  skills jsonb default '[]',
  trainer_specialties jsonb default '[]',
  tech_skills jsonb default '[]',
  base_city text,
  base_state text,
  service_radius_mi int,
  is_approved boolean default false,
  notif_email boolean default true,
  notif_sms boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table jobs (
  id uuid primary key default gen_random_uuid(),
  external_id text,
  job_type job_type not null,
  title text,
  company_name text,
  customer_name text,
  model text,
  priority job_priority not null default 'P2',
  status job_status not null default 'OPEN',
  met_date date,
  shipping_state text,
  shipping_city text,
  address_line1 text,
  address_line2 text,
  zip text,
  contact_name text,
  contact_phone text,
  contact_email text,
  instructions_public text,
  instructions_private text,
  sla_due_at timestamptz,
  created_by uuid,
  source_tag text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index idx_jobs_type_status on jobs(job_type, status);
create index idx_jobs_priority on jobs(priority);

create type bid_status as enum ('submitted','withdrawn','accepted','rejected');

create table bids (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references jobs(id) on delete cascade,
  bidder_id uuid not null references profiles(user_id) on delete cascade,
  ask_price numeric(12,2) not null,
  note text,
  status bid_status not null default 'submitted',
  created_at timestamptz default now()
);
create index idx_bids_job on bids(job_id);
create index idx_bids_bidder on bids(bidder_id);

create table awards (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references jobs(id) on delete cascade,
  awarded_user_id uuid not null references profiles(user_id) on delete set null,
  awarded_by uuid,
  awarded_at timestamptz default now()
);

create table email_campaigns (
  id uuid primary key default gen_random_uuid(),
  created_by uuid,
  segment_json jsonb not null,
  job_ids uuid[] default '{}',
  subject text not null,
  template_key text not null,
  sent_at timestamptz,
  status text,
  created_at timestamptz default now()
);

create table notifications (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  payload jsonb not null,
  channel text not null,
  "to" text not null,
  status text,
  sent_at timestamptz,
  error text,
  created_at timestamptz default now()
);
```

**RLS sketch**

* `jobs`: public select only limited columns where `status in ('OPEN','BIDDING')`.
* `bids`: insert/select by `bidder_id = auth.uid()`.
* `profiles`: field user can select own row; Admin bypass via service key.

---

# 11) Email Templates (Resend)

**1) Admin – New Signup**
Subject: `MET: New signup pending approval`
Vars: `{full_name, email, role_tech, role_trainer, state, city, review_link}`

**2) Admin – New Bid**
Subject: `MET: New bid on {job_title}`
Vars: `{job_id, job_title, bidder_name, ask_price, link}`

**3) Bulk Jobs (Tech/Trainer)**
Subject: `Open {job_type} jobs this week`
Vars: `{job_list_html, cta_link}`

**4) Award Notice (to winner)**
Subject: `Awarded: {job_title}`
Vars: `{job_title, date, city_state, next_steps_link}`

*(Optional)* **Non‑Award Notice** to other bidders.

---

# 12) Admin “Curate & Blast” UX (top priority)

* Filters: `job_type`, `status in (OPEN,BIDDING)`, `priority`, `state`, `city`, `met_date range`.
* Click **Preview Recipients** → lists approved profiles matching `job_type` (+ optional skills/state match).
* Compose (subject + template + dynamic `{job_list}` with top 20 jobs).
* **Send** via Resend, store campaign row, record per‑recipient success/failure if webhooks enabled.

---

# 13) AI CLI (Supabase) (optional)

* **Goal**: ops can run natural language queries safely.
* **Command**: `met ai "<question>"`
  Examples:

  * `met ai "show open trainer jobs in UT sorted by met_date"`
  * `met ai "bids count & avg ask_price per state for tech jobs, last 14 days"`
* **Mechanics**:

  * Local Node tool → calls LLM with schema context → returns **parameterized SQL**.
  * Execute via Supabase service key; display table; **read‑only in V0**.
  * Guardrails: deny DDL/DML; allow SELECT only.

---

# 14) Security & Auditing

* Email verification (Supabase) required before approval.
* Admin approval required for bidding.
* Audit (V0 light): log `bids`, `awards`, `imports`, `email_campaigns` in `notifications` payloads.
* Rate limit auth attempts; captcha on signup if abused.
* Public pages include `noindex`.

---

# 15) Acceptance Criteria (V0)

1. Public can see **Open** jobs (limited), filtered by role/city/state; CTA to sign up.
2. Users can sign up (email+password); Admin receives **signup email**; Admin can **approve**.
3. Approved users can **bid** on **Open** jobs; Admin receives **bid email**; bids list is visible per job.
4. Admin can **award** a bid; awardee receives email.
5. Admin can **curate open jobs** by role and **send a bulk email** to Techs/Trainers.
6. MRP staff can **import the 71 jobs** from the Google Sheet (CSV) into the single DB.
7. No background auto digests; **all sends are admin‑triggered**.
8. AI CLI runs **read‑only** queries against Supabase.

---

# 16) Cutover Plan (Sheet → App)

* Export Google Sheet to CSV.
* Run **dry‑run import**; fix mapping; commit.
* Spot‑check 10 jobs (priority/status).
* Publish public job board.
* Invite 5 trusted Techs/Trainers to sign up → approve → place a test bid.
* Admin sends first curated bulk email (trainer or tech jobs).

---

# 17) Nice‑to‑Have (post‑V0)

* SMS channel parity (Twilio), inbound keyword “BID {id} {price}”.
* Attachments/photos, scheduling, customer portal, parts flow.
* Geo & skills‑based targeting for blasts.
* Soft “BIDDING” → auto “AWARDED” triggers (if single bid under threshold).

---
