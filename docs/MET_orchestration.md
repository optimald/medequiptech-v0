# **🏗 Platforms and Their Purposes**

**1\. Salesforce Sales Cloud (Sales)**

* Purpose: Manage **Opportunities, Quotes, Orders**.

* Trigger: When a device is sold, traded in, or purchased on mrp.io.

* Output: Auto-creates a **Service Cloud Case** for fulfillment.

**2\. Salesforce Service Cloud (Service)**

* Purpose: Manage **Cases, Entitlements, SLAs, Customer Support**.

* Used by: Customer service staff (CSRs) and management.

* Trigger: Any customer support issue (broken device, handpiece, training request).

* Output: Case Router sends job request to MET; syncs updates from MET/Jira back to Case.

**3\. MET (Marketplace for External Service Providers)**

* Purpose: Coordinate **external service providers** (techs, trainers, drivers, medical directors).

* Flow:

  * Case Router pushes job request into MET.

  * Providers **bid** on jobs.

  * **Office staff selects winning bid** (not auto-awarded).

  * Providers execute tasks, log checklists, upload artifacts.

  * Job Sync posts updates into Salesforce Service Case.

**4\. Jira (Biomed/Internal Depot Service)**

* Purpose: Manage **internal refurb workflows**.

* Model: Each device \= Jira issue; subtasks \= refurb steps (Diagnostic, Repair, QA, Pack, Ready).

* Sync: IMS records device history; Salesforce Service Case shows milestones for customer visibility.

**5\. IMS (Inventory Management System / Device Master)**

* Purpose: **Canonical truth of devices**: serials, configs, ownership, refurb history.

* Inputs: Device events from Jira (biomed), MET (field work), Warehouse (parts consumption).

* Outputs: Unified device history visible to execs/support.

**6\. Warehouse/Catalog API**

* Purpose: **Stock, reservation, fulfillment of parts**.

* Called by: MET when part requested.

* Syncs to: IMS (parts consumed), SAP (financials).

**7\. SAP (Finance/ERP)**

* Purpose: **Financial \+ inventory control**.

* Functions: Parts PRs, invoices, AP/AR, payouts to contractors.

* Integrations: Receives consumption events from Warehouse/Jira; receives payout requests from MET.

**8\. Parts Prediction Engine**

* Purpose: **Predict parts needs** based on symptoms, error codes, and device history.

* Inputs: Device symptoms, error codes, model, previous repair history, failure patterns.

* Outputs: Suggested parts list with confidence scores, alternative parts, estimated costs.

* Integration: Called by Service Cloud during case creation, updated by MET during execution.

**9\. Parts Orchestrator**

* Purpose: **Coordinate parts movement** from warehouse to tech to return.

* Functions: Parts reservation, dispatch, tracking, return processing, cost reconciliation.

* Integrations: Warehouse API, MET, SAP, IMS, return shipping providers.

* Workflow: Reserve → Dispatch → Consume/Return → Reconcile → Report.

---

# **📱 Notification Standards & Parts Handling Protocols**

## **Notification Delivery Methods**

### **Customer Notifications**
* **Primary**: Email (confirmation, updates, completion)
* **Secondary**: SMS (urgent alerts, appointment reminders)
* **Escalation**: Outbound phone call (SLA breaches, critical issues)
* **Preference**: Customer-selected in Service Cloud profile

### **Provider Notifications**
* **Primary**: Push notification via MET mobile app
* **Secondary**: SMS (job awards, urgent updates)
* **Fallback**: Email (detailed instructions, documentation)

### **Internal Staff Notifications**
* **Primary**: Slack/Teams integration
* **Secondary**: Email (detailed reports, escalations)
* **Critical**: SMS (SLA breaches, system outages)

## **Parts Handling Strategy**

### **Pre-Visit Parts Planning**
1. **Initial Diagnosis**: CSR gathers symptoms, error codes, device history
2. **Parts Prediction**: System suggests likely parts based on symptoms + device model
3. **Parts Reservation**: Warehouse reserves predicted parts for tech pickup
4. **Tech Dispatch**: Tech arrives with pre-selected parts package

### **Parts Management During Visit**
1. **Confirmation**: Tech confirms actual parts needed vs. predicted
2. **Usage**: Parts consumed are logged in MET → IMS + SAP
3. **Returns**: Unused expensive parts (>$100) must be returned within 24h
4. **Additional Needs**: If more parts required, tech requests via MET → immediate dispatch

### **Parts Return Process**
1. **Unused Parts**: Tech scans unused parts in MET app
2. **Return Label**: System generates return shipping label
3. **Warehouse Credit**: Parts returned to available inventory
4. **Cost Avoidance**: Prevents expensive parts from being stranded

### **Follow-up Parts Scenarios**
1. **Wrong Parts Sent**: Tech requests correct parts → immediate dispatch
2. **Additional Diagnosis**: Tech discovers secondary issues → new parts request
3. **Return Visit**: If parts unavailable, schedule follow-up visit
4. **Cost Tracking**: All parts movements logged in SAP for billing reconciliation

### **Cost Management & Returns**
1. **Parts Threshold**: Parts >$100 require return within 24h
2. **Return Process**: Tech scans unused parts → system generates return label → warehouse credit
3. **Cost Avoidance**: Prevents expensive parts from being stranded at client sites
4. **Billing Impact**: Unused parts returned = no charge to client; used parts = full billing
5. **Inventory Accuracy**: Real-time updates prevent stock discrepancies and financial losses

---

# **🎭 Actors and Their Responsibilities**

### **Internal Staff**

* **Sales Rep (Salesforce Sales)**: Closes deals, enters orders, trade-ins.

* **CSR (Salesforce Service)**: Intake customer requests, create Cases, communicate updates.

* **Ops Staff (Service \+ MET Admin)**: Select winning bids in MET, monitor SLA compliance, handle escalations.

* **Depot/Biomed Staff (Jira)**: Diagnostic, refurb, QA, packaging.

* **Finance Staff (SAP)**: Invoice, manage PRs, reconcile costs.

* **Admins (cross-system)**: Approve providers, manage entitlements, oversee integrations.

### **External Service Providers (MET)**

* **Field Techs**: On-site diagnostics/repairs, parts requests, installs.

* **Trainers**: Conduct device training sessions.

* **Drivers**: Pickups, deliveries, loaner logistics.

* **Medical Directors**: Specialized oversight tasks (approvals, compliance).

### **Customers**

* **Clinic Staff / Physicians**: Initiate support (calls/emails/orders), receive devices, loaners, or training, provide satisfaction feedback at close.

---

# **🔄 Standard Flow Components (used in all cases)**

1. **Initiation**: Event occurs → Salesforce Sales (sales) or Salesforce Service (support).

2. **Case Creation**: Sales Cloud → Service Case OR CSR → Service Case.

3. **Case Router → MET**: Request posted as job in MET marketplace.

4. **Bidding**: External providers see request, submit bids.

5. **Office Staff Selection**: Internal ops staff select winning bid in MET.

6. **Execution**: Provider performs task → MET logs progress.

7. **Biomed (if refurb required)**: Jira tracks refurb → IMS updated.

8. **Parts**: Pre-visit diagnosis → Parts prediction → Warehouse reservation → Tech pickup → On-site confirmation → Returns management → SAP/IMS sync.

9. **Sync**: MET & Jira post back to Salesforce Service → CSR sees full timeline.

10. **Notifications**:

* Customer gets confirmation (email), updates (email/SMS), completion (email), satisfaction survey (email).

* Provider gets job award (push), scheduling details (push), parts updates (push/SMS), urgent alerts (SMS).

* Internal ops notified of SLA risks/updates (Slack/Teams), critical issues (SMS).

11. **Closeout**:

* Salesforce Service Case marked closed.

* IMS updated with final device/parts history.

* SAP reconciles billing, payouts, costs.

12. **Client Satisfaction**: Post-completion survey (NPS, feedback) triggered automatically from Salesforce Service → email/SMS to client.

Alright Ryan — here comes the **full deep-dive**. Each of the **10 use cases** gets the **step-by-step verbose process flow** with:

* **Case origin** (Salesforce Sales vs Salesforce Service)

* **Actors** (internal staff, external service providers, client)

* **System touchpoints** (Sales Cloud, Service Cloud, MET, Jira, IMS, Warehouse, SAP)

* **Notifications** at every handoff

* **Bidding/award** detail (providers bid in MET, ops staff select winner)

* **Outcome \+ client follow-up**

---

# **🔹 USE CASE 1 — Sales trade-in lot → Pickup → Biomed refurb → Resale**

**Actors**: Sales Rep (internal), CSR (internal), Ops Coordinator (internal), External Driver, Depot/Biomed Techs (internal), Client Clinic Staff.

**Flow**:

1. **Sales Rep** closes trade-in deal in **Salesforce Sales (Opportunity → Closed/Won)**.

   * Auto-trigger → **Salesforce Service Case: “Trade-in Lot Intake.”**

   * **Notification**: CSR & Ops Coordinator alerted (Service).

2. **Case Router → MET Job** created: “Pickup Device Lot.”

   * Job posted in **MET marketplace**.

   * External drivers see job, **bid**.

   * **Notification**: Ops Coordinator sees incoming bids.

3. **Ops Coordinator** selects winning bid in **MET**.

   * Winning driver notified via SMS/push.

   * Client clinic staff notified of scheduled pickup window.

4. **Driver arrives on-site** (MET).

   * Scans serials into **MET → IMS** creates/updates device IDs.

   * Capture chain-of-custody signature, uploaded to MET → syncs to **Service Case**.

5. **Depot intake**:

   * Each device auto-creates **Jira Issue** (one per device, tied to IMS ID).

   * Biomed Tech runs workflow: Diagnostic → Repair → QA → Pack.

   * **Parts requests** via MET → Warehouse API → SAP (cost) → IMS (parts consumption).

   * Milestones synced to **Service Case** (e.g., “Diagnostic complete”).

6. **Devices refurbished & ready**.

   * **IMS** updated with refurb history.

   * **SAP** reconciles costs.

   * **Salesforce Sales** inventory record marked “Available for Resale.”

   * Device listed on **mrp.io** tied to IMS ID.

7. **Notifications**:

   * CSR updates clinic: “Trade-in processed.”

   * Internal Slack/Teams notification: lot intake complete.

8. **Closeout**: **Salesforce Service Case closed.**

   * Client satisfaction email sent: “How was your trade-in process?”

   * Outcome: Device enters resale pipeline with full refurb history.

---

# **🔹 USE CASE 2 — Web purchase (mrp.io) → Biomed refurb → Delivery → Training**

**Actors**: Client (buyer), CSR, Ops Coordinator, External Driver, External Trainer, Depot Techs.

**Flow**:

1. **Client buys device on mrp.io**.

   * **Salesforce Sales Order** created.

   * Auto-creates **Salesforce Service Case: “Fulfill Purchased Device.”**

2. **IMS** assigns purchased device to client (status: “Pending Prep”).

3. **Depot Biomed (Jira)** refurbishes device: Diagnostic → Repair → QA → Pack.

   * **Parts** as needed via Warehouse → SAP.

   * Jira milestones (“QA Passed,” “Ready to Ship”) posted back to Service Case.

4. **Case Router** posts two **MET Jobs**:

   * Delivery (Driver).

   * Training (Trainer).

5. **Providers bid** on jobs in MET.

   * Ops Coordinator selects winners.

   * Driver/Trainer notified; client notified of schedule.

6. **Delivery executed**: Driver scans device → IMS updated (ownership: clinic).

   * Delivery photo & signature uploaded in MET → sync to Case.

7. **Training executed**: Trainer logs attendees, checklists, and uploads signed training doc → sync to Case.

8. **Notifications**:

   * Client: “Delivery scheduled,” “Training completed.”

   * Internal: CSR sees timeline in Service Case.

9. **Closeout**: Case closed, SAP invoices reconciled.

   * Satisfaction survey sent to client: “How was your new device install & training?”

---

# **🔹 USE CASE 3 — Device broken → On-site service tech dispatched**

**Actors**: Client Clinic, CSR, Ops Coordinator, External Tech, Warehouse/SAP, IMS.

**Flow**:

1. **Client calls CSR** → **Salesforce Service Case** created.

   * Entitlement checked: is client covered?

   * SLA clock started.

2. **Case Router** creates **MET Job: On-site Repair**.

   * Posted to marketplace; techs **bid**.

   * Ops Coordinator selects winner.

3. **Pre-visit parts planning**:

   * CSR gathers symptoms, error codes, device history.

   * **Parts Prediction Engine** suggests likely parts based on symptoms + device model.

   * **Parts Orchestrator** reserves predicted parts for tech pickup.

   * Tech arrives with pre-selected parts package.

4. **Tech executes on-site repair**:

   * Opens MET checklist; confirms parts needed vs. predicted.

   * If additional parts required → requests via MET → immediate dispatch.

   * If parts unused → scans for return → system generates return label.

   * IMS records part allocation/consumption events.

4. **Execution**: Tech completes repair; logs photos, notes, customer signature in MET.

5. **Sync**: MET → Salesforce Service Case: status updated, worklog posted.

   * CSR can relay updates to client proactively.

6. **Notifications**:

   * Client: appointment confirmed (email), "Tech en route" (SMS), "Parts arriving" (email), "Repair completed" (email).

   * Tech: awarded job (push), parts pickup reminder (push), additional parts dispatch (push/SMS).

   * Ops: SLA risk alerts if no bid in 2 hours (Slack), parts return tracking (Slack).

7. **Closeout**: Service Case closed.

   * Client gets satisfaction email: “Was your device repaired successfully?”

   * IMS updated: parts consumed, repair recorded.

   * SAP: costs reconciled.

---

# **🔹 USE CASE 4 — Sales sells new device → Biomed refurb → Electrical prep → Delivery → Training**

**Actors**: Client Clinic, Sales Rep, CSR, Ops Coordinator, Depot Techs, External Electrician, External Driver, External Trainer.

**Flow**:

1. **Sales Rep closes sale** → **Salesforce Sales Opportunity → Order.**

2. Auto-creates **Salesforce Service Case: “New Device Install.”**

3. **Depot Biomed (Jira)** runs refurb/QA → IMS updated.

4. **Case Router → MET Jobs** created:

   * Electrical prep (Electrician).

   * Delivery (Driver).

   * Training (Trainer).

5. **Providers bid** → Ops Coordinator selects winners.

6. **Execution sequence**:

   * Electrician installs outlet; uploads photo/meter proof.

   * Driver delivers device → scans to IMS.

   * Trainer conducts training → logs attendees, checklists.

7. **Notifications**:

   * Client: schedule confirmations, completion alerts.

   * Internal: CSR sees all in Service Case.

8. **Closeout**: Case closed.

   * SAP invoices reconciled.

   * Client satisfaction email.

   * IMS reflects device owner \+ install status.

---

# **🔹 USE CASE 5 — Device broken → Depot refurb with loaner**

**Actors**: Client Clinic, CSR, Ops Coordinator, External Driver, External Tech (Loaner Setup), Depot Biomed.

**Flow**:

1. **CSR logs Service Case**: Device failure, entitlement checked.

2. **Case Router** posts 2 MET Jobs:

   * Pickup Broken Device (Driver).

   * Deliver Loaner Device (Driver \+ Tech for setup).

3. **Bidding** → Ops Coordinator selects drivers/tech.

4. **Execution**:

   * Driver picks up broken device → IMS: status “In Depot.”

   * Loaner delivered → IMS: loaner status “Assigned.”

   * Tech sets up loaner onsite → checklist complete.

5. **Depot Biomed (Jira)** refurbishes broken device.

   * IMS updated at each step.

   * SAP logs parts costs.

6. **Return loop**:

   * Once refurb done, MET Job for redelivery \+ loaner pickup.

   * IMS reverses statuses.

7. **Notifications**:

   * Client: pickup confirmation, loaner tracking, repair ETA.

   * Internal: SLA breach alerts if refurb \> ETA.

8. **Closeout**: Service Case closed.

   * SAP reconciles costs.

   * Satisfaction survey sent.

---

# **🔹 USE CASE 6 — Customer handpiece broken → Ship (FedEx) → Depot refurb**

**Actors**: Client Clinic, CSR, Carrier, Depot Biomed Techs.

**Flow**:

1. **CSR logs Service Case**: Handpiece rebuild.

2. **Return label** generated from Salesforce Service; emailed to client.

3. **Client ships via FedEx/UPS**. Tracking auto-linked to Case.

4. **Depot Biomed (Jira)** rebuilds handpiece.

   * Parts via Warehouse/SAP.

   * IMS updated with rebuild.

5. **Return shipment** generated → tracking posted to Case.

6. **Notifications**: Client notified when part arrives, when refurb complete, when shipped back.

7. **Closeout**: Case closed, SAP invoicing if billable.

   * Satisfaction survey sent.

---

# **7a) Customer device broken → on‑site repair (field service)**

**Actors (fictitious):**

* Client: Dr. **Ava Romero** (Clinic Manager: **Paige Liu**)

* Internal: CSR **Nate Cole** (Service), Ops Coordinator **Jules Park**, Finance **Iris Nguyen**

* External (MET): Field Tech **Zane Ortiz** (+ competing bidders)

**Systems used:**  
 Salesforce **Service Cloud** (CSR/Case), **MET** (bidding, dispatch, on‑site workflow), **Parts Orchestrator** (service), **Warehouse/Catalog API**, **SAP** (finance), **IMS** (device history)

**End‑to‑end flow:**

1. **Intake (Service)**

   * Paige calls support → CSR Nate opens **Salesforce Service Case** (“Device down — error 47”).

   * CSR verifies **Entitlement/SLA** in Service; attaches contact & site details.

   * **Notification (email/SMS)** to Paige: “Case \#500… created. We’re sourcing a tech now.”

2. **Route to MET (Case Router)**

   * Case hits rule “Field repair required” → **Case Router** posts **MET Job: On‑site Repair** (caseId, device serial if known, priority/SLA respondBy, geo).

   * **Notification** to Ops Jules: “New job posted for bidding.”

3. **Bidding (MET)**

   * Job visible to eligible techs by geo/skills. **All providers bid** (ETA, price, notes).

   * **Ops selects winner** (never auto‑award). Losers get polite decline notice.

   * **Notifications**:

     * Zane (winner): award \+ schedule window.

     * Paige (client): “Tech assigned; ETA window …”

     * CSR sees assignment reflected on the **Service Case**.

4. **Pre‑visit parts planning (Service + Parts Orchestrator)**

   * CSR Nate gathers symptoms, error codes, device history from Paige.

   * **Parts Prediction Engine** suggests likely parts based on symptoms + device model.

   * **Parts Orchestrator** reserves predicted parts for tech pickup.

   * **Notifications**: Paige gets "Parts being prepared" (email); Ops sees parts reservation (Slack).

5. **Pre‑visit checks (MET)**

   * Zane reviews pre-selected parts package and confirms readiness.

   * If additional parts needed: submits **Parts.Requested** (SKU or category) from MET.

   * **Parts Orchestrator** queries **Warehouse**:

     * In stock → immediate dispatch to site; **SAP** logs reservation.

     * OOS → create **Purchase Request** in SAP; **ETA** returned.

   * **Notifications**: Paige gets ETA if additional parts shipping; Ops sees any OOS risk.

5. **On‑site repair (MET)**

   * Zane taps **En‑route** → **On‑site**; timestamps flow to Service Case.

   * Guided checklist: diagnostics → corrective steps → safety tests.

   * Parts confirmation: scans used parts → **Parts.Consumed** → **IMS** logs device history; **SAP** posts cost.

   * Parts return: scans unused expensive parts (>$100) → **Parts.Return** → system generates return label.

   * Media capture: photos/video; customer **signature** on completion.

6. **Job wrap & sync**

   * MET emits `Job.Completed` with worklog/artifacts.

   * **Job Sync** updates **Service Case** status \+ attaches worklog links.

   * CSR reviews and messages Paige: “Resolved. Notes attached.”

7. **Closeout & follow‑up**

   * CSR closes **Service Case**.

   * **Satisfaction survey** auto‑sent (NPS \+ free‑text).

   * **Finance** (SAP) posts bill if out‑of‑entitlement; payout to provider as per MET policy.

**SLAs & guardrails**

* Respond within X hours (Service). Alert Ops if **no bids** in 2 hours.

* Identity: provider only in **MET** (no Salesforce seat).

* Idempotent events: retries on failed sync.

**Edge cases**

* **Cannot complete on‑site** → automatically fork to 7b (depot with loaner) or schedule second visit.

* **Unsafe site / access denied** → document in MET, CSR escalates.

* **Wrong parts sent** → tech requests correct parts via MET → immediate dispatch → return visit if needed.

* **Additional parts discovered** → tech requests via MET → immediate dispatch → completes repair same visit.

* **Expensive parts unused** → tech scans for return → system generates return label → warehouse credit within 24h.

**KPIs**

* Response time, **first‑visit fix rate**, MTTR, parts prediction accuracy, parts return rate, client CSAT/NPS, margin per job.

**Outcome**

* Device fixed in field; **IMS** reflects parts & repair; **Service Case** closed; client surveyed.

---

## **🔄 Key Improvements Made**

### **Parts Handling Revolution**
* **Pre-visit planning**: Parts predicted and reserved before tech dispatch
* **First-visit success**: Tech arrives with likely-needed parts package
* **Smart returns**: Expensive unused parts automatically returned within 24h
* **Cost control**: Prevents parts from being stranded at client sites

### **Notification Standardization**
* **Clear delivery methods**: Email (primary), SMS (urgent), Push (providers), Slack (internal)
* **Escalation paths**: Defined notification hierarchy for different urgency levels
* **Customer preferences**: Respects customer-selected notification methods

### **System Integration**
* **Parts Prediction Engine**: AI-powered parts suggestion based on symptoms
* **Parts Orchestrator**: End-to-end parts lifecycle management
* **Real-time tracking**: All parts movements logged and visible across systems

---

# **7b) Customer device broken → bring‑in depot refurb (biomed) \+ loaner out**

**Actors (fictitious):**

* Client: Dr. **Noah Patel** (Coordinator: **Maya Chen**)

* Internal: CSR **Ruth Santos** (Service), Ops **Jules Park**, Depot/Biomed **Leo Vargas** (Jira), Finance **Iris Nguyen**

* External (MET): Driver **Quinn Reeves** (pickup & delivery), Field Tech **Lena Ruiz** (loaner setup)

**Systems used:**  
 Salesforce **Service Cloud**, **MET** (bidding & two+ jobs), **Jira** (biomed), **IMS**, **Warehouse/Catalog**, **SAP**

**End‑to‑end flow:**

1. **Intake (Service)**

   * Maya reports frequent failure → CSR Ruth opens **Service Case**; confirms **entitlement** includes **loaner**.

   * Client notified: case created \+ we’ll dispatch pickup & loaner.

2. **Route to MET (Case Router)**

   * Router posts **two MET jobs**:

     * **Job A: Pickup customer device**.

     * **Job B: Deliver loaner \+ on‑site setup** (requires field tech).

   * Both **open to bidding**; Ops Jules selects winners separately.

3. **Execution: Job A (Pickup)**

   * Driver Quinn wins bid; schedules pickup with Maya.

   * On‑site: scans serial; chain‑of‑custody signature; **IMS** marks **customer device “In Depot transit.”**

   * **Notification** to Service Case & client with tracking note.

4. **Execution: Job B (Loaner)**

   * Tech Lena wins bid; coordinates with Quinn or separately.

   * On‑site: unpacks loaner, function test, brief user handoff; **IMS** sets **loaner “Assigned to Clinic.”**

   * Upload photos, quick‑start doc, client signature.

   * **Notifications**: client gets “loaner active”; CSR sees loaner status on Case.

5. **Depot refurb (Biomed in Jira)**

   * Device arrives; **Jira Issue** auto‑created (keyed to **imsDeviceId**).

   * Biomed Leo: **Diagnostic → Repair → QA → Pack**.

   * **Parts** via Warehouse; **SAP** costs; **IMS** captures consumption & refurb history.

   * Milestones (Diagnostic/QA Passed) mirrored to **Service Case**.

6. **Return & swap back**

   * Router posts **two more MET jobs**:

     * **Job C: Deliver repaired device**.

     * **Job D: Pickup loaner**.

   * Providers bid; Ops selects winners; schedule coordinated with Maya.

   * On delivery, **IMS** flips statuses: customer device \= **Active at Clinic**, loaner \= **Returned/Available**.

7. **Closeout & follow‑up**

   * **Service Case** closed after confirmations.

   * **Satisfaction survey** sent (loaner experience, repair quality).

   * **SAP** reconciles PRs, labor, any billables; MET triggers provider payouts.

**SLAs & guardrails**

* Loaner delivery within SLA window (e.g., 24–48h).

* Clear **loaner agreement** captured in MET (terms, responsibility).

* Depot WIP visibility: Jira → Service Case milestones.

**Edge cases**

* **Loaner shortage** → Ops triage; communicate ETA; potential rental credit.

* **Clinic keeps loaner** → automated reminders; billing rules if overdue.

**KPIs**

* Time to loaner, depot cycle time, % loaner coverage, repeat failure rate post‑repair, client CSAT.

**Outcome**

* Clinic downtime minimized via loaner; device professionally refurbished; **IMS** lineage accurate; **Service Case** closed.

---

# **7c) Handpiece (or accessory) broken → ship to depot → rebuild (no sprinter)**

**Actors (fictitious):**

* Client: Dr. **Mila Sandoval** (Coordinator: **Arjun Desai**)

* Internal: CSR **Theo Park** (Service), Depot/Biomed **Nora Blake** (Jira), Ops **Jules Park**, Finance **Iris Nguyen**

* External: Carrier (**FedEx/UPS**)

**Systems used:**  
 Salesforce **Service Cloud**, **Jira** (biomed), **IMS**, **Warehouse/Catalog**, **SAP**, (optional) **MET** parcel job if you want provider tracking surface

**End‑to‑end flow:**

1. **Intake (Service)**

   * Arjun emails photos; CSR Theo creates **Service Case: “Handpiece rebuild.”**

   * Entitlement check (warranty?). Client notified with RMA & packing instructions.

2. **Inbound logistics**

   * **Return label** generated from Service; emailed to Arjun; tracking attached to Case.

   * (Optional) **MET Inbound Parcel** job created for visibility; but carrier webhook is usually enough.

3. **Depot biomed (Jira)**

   * Upon receipt scan, **Jira Issue** auto‑created for the **handpiece** (tie to parent device in **IMS** if applicable).

   * **Diagnostic → Rebuild → QA** workflow.

   * **Parts** via Warehouse; **SAP** PRs/costs; **IMS** logs sub‑component consumption and rebuild history.

4. **Quality & outbound**

   * QA passes; pack; shipping label created; **tracking** posted to Service Case.

   * If config or calibration changes impact main device, **IMS** records configuration change events.

5. **Notifications**

   * Client gets: “We received your handpiece,” “Rebuild in progress,” “Shipped back, tracking …”

   * Internal: CSR sees Jira milestones; Ops alerted if backorder risk on parts.

6. **Billing & close**

   * **SAP**: warranty \= $0; out‑of‑warranty \= invoice; payment captured as policy dictates.

   * **Service Case** closed after delivery confirmed.

   * **Satisfaction survey** sent.

**SLAs & guardrails**

* Door‑to‑door target (e.g., ≤7 business days).

* Pack/ship instructions include **tamper‑evident** requirements to avoid transit damage claims.

* Photos required on inbound to document pre‑existing damages.

**Edge cases**

* **Incomplete package** (missing cord/cap): CSR requests missing items; Case paused.

* **Backordered critical part**: ETA pushed to client; escalation rule to Ops if \>X days.

**KPIs**

* Cycle time, first‑pass QA rate, warranty vs. billable mix, CSAT, rebuild cost per unit.

**Outcome**

* Handpiece rebuilt with full traceability; **IMS** shows sub‑component lineage; **Service Case** closed and surveyed.

---

# **🔹 USE CASE 7d — Virtual FaceTime support**

**Actors**: Client Clinic, CSR, External Virtual Tech.

**Flow**:

1. **CSR creates Salesforce Service Case: Virtual Assist.**

2. **Case Router → MET Job**: Remote Assist.

3. **Providers bid** (remote-certified techs).

   * Ops Coordinator selects winning tech.

4. **Execution**: Tech launches embedded WebRTC video session in MET.

   * Screenshots, notes, resolution steps logged.

5. **Sync**: MET → Service Case with transcript/artifacts.

6. **Notifications**:

   * Client: appointment confirmation, completion summary.

   * CSR: sees resolution logged in Case.

7. **Closeout**: Case closed.

   * IMS updated if config changed.

   * Survey sent.

---

# **🔹 USE CASE 8 — Service Provider Onboarding**

**Actors**: Applicant, Ops Admin, Coordinator.

**Flow**:

1. **Applicant** applies in **MET portal**.

   * Uploads certs, ID, banking.

2. **KYC check** → MET \+ SAP vendor record created.

3. **Ops Coordinator** reviews; Ops Manager approves.

4. **Training modules** (MET e-learning) completed.

5. **Activation**: provider listed in MET marketplace.

6. **Notifications**:

   * Applicant: welcome email, link to jobs.

   * Internal: provider onboarding complete alert.

7. **Closeout**:

   * Provider active.

   * IMS not touched (not device-related).

   * SAP updated with vendor record.  
