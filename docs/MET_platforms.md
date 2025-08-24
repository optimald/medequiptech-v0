Platform Blueprints — What Each Does (and Does Not Do)
MET (Marketplace & Field Execution — external providers)

Purpose: The one and only surface for external service actors (techs, trainers, drivers, medical directors) to bid, schedule, execute, document, and get paid.

Primary users: External providers; internal Ops who review bids and select winners (never auto‑award).

Core capabilities (does):

Job intake from Salesforce Service (via Case Router) and from customer portal when applicable.

Bidding marketplace: eligibility by geo/skills/compliance; Ops selects winner; audit trail of bid rationale.

Scheduling & dispatch with SLA awareness and travel time estimates.

On‑site & remote workflows: checklists, notes, photos/video, barcode/QR scans, e‑signatures, timestamped status (En‑route, On‑site, Completed, Cannot Complete).

Parts request initiation; hands off to Parts Orchestrator; shows ETAs to provider and client.

Artifacts storage (links/URIs) and secure sharing back to Case.

Provider onboarding: KYC, certs, W‑9, banking; micro‑training modules; re‑credential cadence.

Payments: initiate payouts to providers (Stripe Connect/Adyen), holdbacks/chargebacks, dispute notes.

Notifications: SMS/email/push to providers & clients (policy‑driven); appointment reminders; SLA warnings.

Events out: Job.Awarded/EnRoute/OnSite/NeedsPart/Completed → Job Sync → Salesforce Service; device/part events → IMS.

Explicit boundaries (does NOT):

No customer case management, SLAs, or entitlements logic (reads from Service if needed).

No device master; references imsDeviceId, but IMS is the ledger.

No financial GL/AP/AR (that’s SAP). MET initiates payouts; SAP records money truth.

No internal biomed workflows; that’s Jira.

No Salesforce logins for contractors (unit economics & adoption risk).

Anti‑patterns to avoid:

Dual‑surfacing jobs in Lightning for contractors.

Syncing full device records into MET (store references only).

Auto‑awarding without human review (you lose quality control).

Key KPIs:

First‑visit fix rate; on‑time arrival; SLA hit rate; bid‑to‑award time; job margin; provider CSAT; client CSAT.

Salesforce Service Cloud (Customer Support, Entitlements, SLAs)

Purpose: The internal surface for CSRs and managers to intake requests, enforce entitlements/SLAs, communicate with customers, and view the unified timeline.

Primary users: CSRs, Support Managers, Executives (read).

Core capabilities (does):

Case management: creation (phone/email/web), ownership, priorities, queues.

Entitlements & SLAs: coverage rules, timers, escalations, breach alerts.

Customer comms: email/SMS templates, call logging, knowledge base.

Case → MET routing: Platform Events/Flows/Callouts to Case Router; stores MET Job links and worklogs via Job Sync.

Visibility: read‑only mirror of MET and Jira milestones; attachments/links; device snapshot (from IMS).

Surveys: trigger CSAT/NPS at close; track feedback.

Explicit boundaries (does NOT):

No contractor execution UI; external actors never log in here.

No internal biomed workflow (Jira does this).

No parts procurement or inventory (Warehouse/SAP).

No provider payouts (SAP/MET).

Not the source of device truth (IMS is).

Anti‑patterns to avoid:

Giving Salesforce Service seats to contractors.

Bloated syncs of full job/device data; store only what support needs.

Key KPIs:

Time to respond/resolve; SLA adherence; deflection via remote assist; survey scores; reopen rate.

Salesforce Sales Cloud (Sales, Quotes, Orders)

Purpose: The internal surface for sales to manage pipeline, quotes, trade‑ins, and orders—then hand off to Service.

Primary users: Sales reps, Sales Ops, Leadership.

Core capabilities (does):

Opportunities/Quotes/Orders for new sales and trade‑ins.

Trigger handoffs: on Close/Won → auto‑create Service Case for fulfillment/install.

Account/Contact/Asset records (asset here is a snapshot for Sales context; IMS holds canonical device).

Visibility into delivery/installation/training status via read models from Service/MET/Jira.

Explicit boundaries (does NOT):

No case management or SLAs (Service does).

No biomed tracking (Jira).

No device master (IMS).

No provider dispatch (MET).

Anti‑patterns to avoid:

Sales using Service Cases as deal notes.

Trying to make Sales Cloud a fulfillment system.

Key KPIs:

Cycle time to fulfillment kickoff; install/training completion rate post‑sale; revenue recognized vs. delays due to readiness.

Jira (Biomed / Depot Internal Workflow)

Purpose: The internal workbench for biomed refurb/repair at the depot.

Primary users: Biomed techs, Depot managers, QA.

Core capabilities (does):

Device‑centric issues: one Jira Issue per device refurb keyed to imsDeviceId.

Workflow: Intake → Diagnostic → Parts Allocated/Backordered → Repair → QA → Pack → Ready.

Subtasks/checklists with required evidence (photos, measurements, calibration certs).

Parts logging (what was requested/used); connects to Parts Orchestrator for allocation and to SAP for costs.

Milestones out to Service (customer‑visible) and to IMS (immutable history).

Explicit boundaries (does NOT):

No customer‑facing comms; no CSAT.

No external provider dispatch.

Not the system of device identity; IMS is.

Not inventory; uses Warehouse/SAP for stock and PR/PO.

Anti‑patterns to avoid:

Letting Jira drift into a second helpdesk.

Storing financials directly in Jira (keep costs in SAP).

Key KPIs:

Depot cycle time, first‑pass QA rate, parts backorder impact, rework rate.

IMS (Device Master / Immutable History)

Purpose: Canonical device ledger—serials, models, configurations, ownership, and evented history across field and depot.

Primary users: System‑of‑record (no broad human UI); Admins/Analysts read; all systems write/read by ID.

Core capabilities (does):

Identity: imsDeviceId for every device/handpiece/major subcomponent.

History: append‑only events from MET (field), Jira (biomed), Warehouse/SAP (parts).

Read models: device status, owner, last service, parts lineage for support/exec reporting.

Integrity: dedupe/merge rules, provenance (who/when wrote what), export for audits.

Explicit boundaries (does NOT):

No case management, SLAs, or dispatch.

No inventory accounting or financial posting.

No provider UI; minimal admin console only.

Anti‑patterns to avoid:

Turning IMS into a workflow engine.

Allowing other systems to fork identity (keep one device ID namespace).

Key KPIs:

Identity coverage (% devices with IMS ID), event latency, data quality (conflict rate).

SAP (ERP — Finance, AP/AR, Inventory, Procurement)

Purpose: Money and inventory truth. PR/PO, Goods Receipt/Issue, AP/AR, invoicing, payouts.

Primary users: Finance, Procurement, Warehouse/Inventory Ops.

Core capabilities (does):

Procurement: PR/PO for backordered parts; vendor management.

Inventory: stock valuation, movements (Goods Issue/Receipt) from Warehouse.

Billing: invoices/credits for repairs, sales, warranty accounting.

Payouts: vendor/contractor settlements (can be initiated by MET; SAP records).

Reporting: costs by device/job/contract; margin reporting.

Explicit boundaries (does NOT):

No dispatch, cases, or provider workflows.

No device identity (only item numbers/serials for inventory; IMS is canonical device).

No customer comms; no SLA logic.

Anti‑patterns to avoid:

Forcing field or depot teams into SAP UI for operational tasks.

Encoding business process branching in SAP that belongs in MET/Jira/Service.

Key KPIs:

PR→PO lead time; parts stockouts; DSO/DSPO; cost per repair; payout timeliness.

Warehouse/Catalog API (Stock & Fulfillment Service)

Purpose: Programmatic interface for availability, reservation, pick/pack/ship, and returns.

Primary users: Called by Parts Orchestrator; Warehouse staff work in their own backend UI.

Core capabilities (does):

Stock queries & reservations by SKU and location.

Allocations & shipments (labels, tracking).

Returns and restocking for unused/incorrect parts.

Explicit boundaries (does NOT):

No customer/provider UI; headless service.

No financial postings (SAP handles).

No device identity (IMS handles).

Key KPIs:

Allocation time, ship SLA, return rate, mis‑pick rate.

Glue Services
Case Router (Service → MET)

Does: Listens to Salesforce Service (Platform Events/Flow/Callout) and creates MET Jobs; writes back Job link/status.
Doesn’t: Decide winners, schedule, or store business data long‑term.
Notes: Idempotent by caseId; retries & DLQ; schema‑versioned payloads.

Job Sync (MET → Service)

Does: Mirrors job statuses/worklogs/artifacts back to Service Cases.
Doesn’t: Execute business rules; keeps Service lightweight.
Notes: Filter noise; only push customer‑relevant milestones.

Parts Orchestrator (MET → Warehouse/SAP/IMS)

Does: Turns parts requests into allocations/PRs; propagates ETAs; posts consumption to IMS/SAP.
Doesn’t: Own inventory or finance; it orchestrates.
Notes: Entitlement checks; compatibility (via IMS); returns flow.

Notification Service

Does: Policy‑driven SMS/email/push/voice across events (Case open, Award, ETA, Arrival, Done, SLA risk).
Doesn’t: Author business logic; it executes channel policy.
Notes: Quiet hours, retries, templates, localization.

Identity & Access

Internal: Entra/Okta SSO for Salesforce/Jira/Admin. SCIM for lifecycle.
External: B2C/Auth0 for MET; magic link + TOTP; KYC for payouts.
Boundary: No Salesforce accounts for 1099s.

Quick Reference — “Who lives where”
Persona	Primary Surface	Sees/Does
CSR/Support	Salesforce Service	Cases, SLAs, comms, read MET/Jira milestones
Sales Rep	Salesforce Sales	Opps, Orders; triggers Service handoff
Biomed/Depot	Jira	Refurb workflow; posts milestones/parts
Providers (tech/trainer/driver/MD)	MET	Bid, execute, document, get paid
Finance/Procurement	SAP	PR/PO, AP/AR, payouts, costs
Device Record	IMS	Identity & immutable history
Warehouse Ops	Warehouse Backend	Stock, pick/pack/ship; API drives automation
Notification Channels (policy default)

Client: Case opened (email), Job awarded (SMS+email), day‑before reminder (SMS), “tech en‑route” (SMS), completed summary (email), survey (email).

Provider: New bid opportunities (push), award (push+SMS), schedule changes (push+SMS), en‑route reminders (push).

Ops/CSR: SLA risk (push/email), no‑bids in window (email), parts backorder (email).