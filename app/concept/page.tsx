'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Home, Play, Pause, RotateCcw } from 'lucide-react';

// Platform content from MET_platforms.md
const platforms = [
  {
    name: "Salesforce Sales Cloud",
    purpose: "Internal surface for pipeline, quotes, trade‑ins, orders; hands off to Service.",
    users: ["Sales Reps", "Sales Ops", "Leadership"],
    does: [
      "Opportunities, Quotes, Orders",
      "Close/Won → auto‑create Service Case",
      "Account/Contact visibility",
    ],
    doesNot: [
      "No case management or SLAs",
      "No biomed tracking",
      "Not the device master (IMS is)",
      "No provider dispatch",
    ],
    kpis: ["Fulfillment kickoff time", "Install/training completion", "Revenue recognition vs delays"],
  },
  {
    name: "Salesforce Service Cloud",
    purpose: "Internal surface for CSRs to intake, manage SLAs/entitlements, and communicate with customers.",
    users: ["CSRs", "Support Managers", "Execs (read)"],
    does: [
      "Cases, priorities, queues",
      "Entitlements & SLAs, escalations",
      "Customer email/SMS, knowledge",
      "Route to MET; mirror MET/Jira milestones",
      "Trigger CSAT/NPS at close"
    ],
    doesNot: [
      "No contractor execution UI",
      "No biomed workflow",
      "No inventory or payouts",
      "Not the device master"
    ],
    kpis: ["Time to respond/resolve", "SLA adherence", "Survey scores", "Reopen rate"],
  },
  {
    name: "MET (Marketplace)",
    purpose: "External provider surface to bid, schedule, execute, document, and get paid.",
    users: ["External Techs", "Trainers", "Drivers", "Medical Directors", "Internal Ops for award"],
    does: [
      "Job intake from Service",
      "Bidding marketplace; Ops selects winner",
      "Dispatch & on‑site/remote workflows",
      "Parts requests (via Orchestrator)",
      "Artifacts + e‑signatures",
      "Provider onboarding + payouts",
      "Policy‑driven notifications"
    ],
    doesNot: [
      "No customer case mgmt/SLAs",
      "No device master (IMS is)",
      "No GL/AP/AR (SAP is)",
      "No internal depot workflows (Jira is)"
    ],
    kpis: ["First‑visit fix rate", "On‑time arrival", "SLA hit rate", "Bid→Award time", "Margin", "CSAT"],
  },
  {
    name: "Jira (Depot/Biomed)",
    purpose: "Internal workbench for refurb/repair at depot.",
    users: ["Biomed Techs", "Depot Managers", "QA"],
    does: [
      "One issue per device (keyed to imsDeviceId)",
      "Intake → Diagnostic → Parts → Repair → QA → Pack → Ready",
      "Evidence capture (photos, measures, calibration)",
      "Parts logging; milestones to Service & IMS"
    ],
    doesNot: ["No customer comms", "No external dispatch", "Not the finance or device ledger"],
    kpis: ["Depot cycle time", "First‑pass QA", "Backorder impact", "Rework rate"],
  },
  {
    name: "IMS (Device Master)",
    purpose: "Canonical device ledger for identity, status, ownership, and immutable history.",
    users: ["Systems of record", "Admins/Analysts (read)"],
    does: [
      "Assign imsDeviceId to devices/subcomponents",
      "Append‑only history from MET/Jira/Warehouse/SAP",
      "Read models for support/executive reporting",
    ],
    doesNot: ["No cases/SLAs", "No inventory accounting", "No provider UI"],
    kpis: ["Identity coverage", "Event latency", "Data quality (conflict rate)"]
  },
  {
    name: "Warehouse/Catalog API",
    purpose: "Headless stock, reservation, pick/pack/ship, and returns service.",
    users: ["Parts Orchestrator (programmatic)", "Warehouse Staff (own UI)"],
    does: [
      "Stock queries & reservations",
      "Allocations & shipments (labels, tracking)",
      "Returns & restocking"
    ],
    doesNot: ["No customer/provider UI", "No financial postings", "No device identity"],
    kpis: ["Allocation time", "Ship SLA", "Return rate", "Mis‑pick rate"],
  },
  {
    name: "SAP (ERP)",
    purpose: "Finance, AP/AR, procurement, payouts, and inventory valuation.",
    users: ["Finance", "Procurement", "Warehouse/Inventory Ops"],
    does: ["PR/PO for parts", "Inventory movements", "Invoices/credits", "Vendor payouts", "Margin reporting"],
    doesNot: ["No dispatch/cases/providers UI", "Not device identity"],
    kpis: ["PR→PO lead time", "Stockouts", "DSO/DSPO", "Repair cost", "Payout timeliness"],
  },
  {
    name: "Parts Prediction Engine",
    purpose: "Suggest likely parts based on symptoms, error codes, model, and history.",
    users: ["Service (CSR)", "MET (during execution)"],
    does: ["Recommendations with confidence", "Alternatives & costs", "Continuous updates"],
    doesNot: ["Doesn't allocate or ship (Orchestrator does)"],
    kpis: ["Prediction accuracy", "Impact on first‑visit fix"],
  },
  {
    name: "Parts Orchestrator",
    purpose: "Coordinate parts allocation, dispatch, returns, and reconciliation across Warehouse/IMS/SAP.",
    users: ["MET", "Warehouse"],
    does: ["Reserve → Dispatch → Consume/Return → Reconcile → Report", "ETAs back to provider & client"],
    doesNot: ["No inventory ownership or GL", "No customer UI"],
    kpis: ["Time to allocate", "Return compliance", "Cost leakage avoided"],
  },
  {
    name: "Notification Service",
    purpose: "Policy‑driven delivery across Email/SMS/Push/Voice to clients, providers, and ops.",
    users: ["Service", "MET", "Ops"],
    does: ["Templates, localization, retries", "Quiet hours", "Escalations"],
    doesNot: ["Doesn't author business logic"],
    kpis: ["Delivery success", "Time‑to‑ack", "SLA breach pre‑alerts"],
  },
];

// Use Cases from MET_orchestration.md
const useCases = [
  {
    code: "Use Case 1",
    title: "Sales trade‑in lot → Pickup → Depot refurb → Resale",
    actors: ["Sales Rep", "CSR", "Ops Coordinator", "Driver (External)", "Depot/Biomed", "Client"],
    steps: [
      "Close/Won trade‑in in Sales → auto Service Case",
      "MET job: Pickup device lot → bid → award",
      "Driver scans serials → IMS intake; chain‑of‑custody",
      "Jira refurb (Diagnostic→Repair→QA→Pack)",
      "Parts via Warehouse/SAP; milestones to Service",
      "Inventory ready → listed on mrp.io; IMS updated",
      "Close Case; survey; SAP reconciles costs",
    ],
    notifications: [
      "CSR/Ops alerted on Case creation",
      "Client pickup window",
      "Completion summary + survey"
    ],
    kpis: ["Lot intake time", "Depot cycle time", "CSAT"],
  },
  {
    code: "Use Case 2",
    title: "Web purchase → Depot prep → Delivery → Training",
    actors: ["Buyer", "CSR", "Ops", "Driver (Ext)", "Trainer (Ext)", "Depot"],
    steps: [
      "Sales Order from mrp.io → Service Case",
      "Jira prep/QA; Parts via Warehouse/SAP",
      "MET jobs: Delivery + Training → bid → award",
      "Delivery scan → IMS owner set; Training executed",
      "Artifacts synced to Case; survey; SAP billing",
    ],
    notifications: ["Schedule confirmations", "Training completion"],
    kpis: ["Fulfillment time", "Training completion rate", "CSAT"],
  },
  {
    code: "Use Case 3",
    title: "Device broken → On‑site service tech dispatched",
    actors: ["Clinic", "CSR", "Ops", "Tech (Ext)", "Warehouse/SAP", "IMS"],
    steps: [
      "CSR opens Service Case; entitlement check; SLA start",
      "Case Router → MET job; bid → award",
      "Pre‑visit Parts Prediction + Orchestrator reserve",
      "On‑site repair checklist; parts consume/return",
      "Sync to Case; closeout; SAP reconcile; survey",
    ],
    notifications: ["Appointment, en‑route SMS", "Parts ETA if needed", "Completion email"],
    kpis: ["Response time", "First‑visit fix", "Parts return compliance"],
  },
  {
    code: "Use Case 4",
    title: "New device sale → Electrical prep → Delivery → Training",
    actors: ["Sales", "CSR", "Ops", "Electrician (Ext)", "Driver (Ext)", "Trainer (Ext)", "Depot"],
    steps: [
      "Close/Won → Service Case",
      "Jira prep/QA; IMS updated",
      "MET jobs: Electrical + Delivery + Training",
      "Sequence: outlet → deliver (scan) → train",
      "Close Case; SAP billing; survey",
    ],
    notifications: ["All schedule confirmations", "Completion summaries"],
    kpis: ["On‑time sequence", "Install quality", "CSAT"],
  },
  {
    code: "Use Case 5",
    title: "Device broken → Depot refurb with loaner",
    actors: ["Clinic", "CSR", "Ops", "Driver (Ext)", "Field Tech (Ext)", "Depot"],
    steps: [
      "Service Case; entitlement confirms loaner",
      "MET Jobs A: pickup broken; B: deliver loaner",
      "IMS: broken → In Depot; loaner → Assigned",
      "Depot refurb in Jira; milestones to Case",
      "Return & swap back (Jobs C & D); statuses flip",
      "Close; SAP reconcile; survey",
    ],
    notifications: ["Pickup & loaner scheduling", "Repair ETA", "Swap‑back notice"],
    kpis: ["Time to loaner", "Depot cycle time", "% loaner coverage"],
  },
  {
    code: "Use Case 6",
    title: "Handpiece broken → Ship to depot → Rebuild",
    actors: ["Clinic", "CSR", "Carrier", "Depot", "Warehouse/SAP"],
    steps: [
      "Service Case + RMA & label; tracking on Case",
      "Jira: diagnostic→rebuild→QA; IMS sub‑component history",
      "Outbound ship; tracking posted",
      "Close; warranty billing rules in SAP; survey",
    ],
    notifications: ["We received it", "Rebuild in progress", "Shipped back"],
    kpis: ["Door‑to‑door cycle", "QA first‑pass", "CSAT"],
  },
  {
    code: "Use Case 7a",
    title: "Field repair (full on‑site service)",
    actors: ["Clinic", "CSR", "Ops", "Tech (Ext)", "Finance"],
    steps: [
      "Case intake; SLA & entitlement",
      "MET bid→award; assignment reflected in Case",
      "Pre‑visit Parts Prediction + reserve",
      "On‑site: checklist; parts consume/return; signature",
      "Job.Completed → sync → close; SAP payout & billing; survey",
    ],
    notifications: ["Case created", "Tech assigned", "Parts prepared", "Completion"],
    kpis: ["First‑visit fix", "MTTR", "Prediction accuracy", "Return rate"],
  },
  {
    code: "Use Case 7b",
    title: "Depot refurb with loaner out",
    actors: ["Clinic", "CSR", "Ops", "Driver (Ext)", "Field Tech (Ext)", "Depot"],
    steps: [
      "Two MET jobs (pickup + loaner) → awards",
      "IMS status flips; artifacts captured",
      "Jira refurb + milestones",
      "Swap‑back jobs; IMS statuses reversed",
      "Close; SAP reconcile; survey",
    ],
    notifications: ["Loaner active", "Refurb ETA", "Swap scheduling"],
    kpis: ["Loaner SLA", "Depot cycle", "Repeat failure rate"],
  },
  {
    code: "Use Case 7c",
    title: "Handpiece rebuild (ship‑in accessory)",
    actors: ["Clinic", "CSR", "Carrier", "Depot", "Ops"],
    steps: [
      "RMA & instructions; inbound tracking",
      "Jira rebuild; IMS sub‑component lineage",
      "Outbound tracking; close", 
    ],
    notifications: ["Received", "Rebuild in progress", "Shipped back"],
    kpis: ["Cycle time", "Warranty vs billable mix", "CSAT"],
  },
  {
    code: "Use Case 7d",
    title: "Virtual FaceTime support",
    actors: ["Clinic", "CSR", "Remote Tech (Ext)", "Ops"],
    steps: [
      "Service Case: Virtual Assist",
      "MET job: Remote Assist → award",
      "Embedded WebRTC session; transcript/artifacts",
      "Sync to Case; IMS updates if config changed; close; survey",
    ],
    notifications: ["Appt confirmation", "Completion summary"],
    kpis: ["Deflection rate", "Time to resolve", "CSAT"],
  },
  {
    code: "Use Case 8",
    title: "Service provider onboarding",
    actors: ["Applicant", "Ops Admin", "Coordinator", "SAP"],
    steps: [
      "Apply in MET; KYC & banking",
      "Ops review & approve; SAP vendor record",
      "Training modules; activation",
      "Provider live in marketplace",
    ],
    notifications: ["Welcome & next steps", "Onboarding complete"],
    kpis: ["Time to activate", "% passing compliance", "Early CSAT"],
  },
];

export default function ConceptPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [autoPlayInterval, setAutoPlayInterval] = useState<NodeJS.Timeout | null>(null);

  // Calculate total slides: 1 cover + 1 TOC + 3 per platform + 4 per use case + 1 notes
  const totalSlides = 1 + 1 + 3 * platforms.length + 4 * useCases.length + 1;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (slideIndex: number) => {
    setCurrentSlide(slideIndex);
  };

  const toggleAutoPlay = () => {
    if (isAutoPlaying) {
      if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        setAutoPlayInterval(null);
      }
      setIsAutoPlaying(false);
    } else {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
      }, 5000); // 5 seconds per slide
      setAutoPlayInterval(interval);
      setIsAutoPlaying(true);
    }
  };

  const resetToStart = () => {
    setCurrentSlide(0);
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
      setAutoPlayInterval(null);
    }
    setIsAutoPlaying(false);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowRight':
        case ' ':
          event.preventDefault();
          nextSlide();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          prevSlide();
          break;
        case 'Home':
          event.preventDefault();
          goToSlide(0);
          break;
        case 'Escape':
          event.preventDefault();
          resetToStart();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Auto-clear interval on unmount
  useEffect(() => {
    return () => {
      if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
      }
    };
  }, [autoPlayInterval]);

  const renderSlide = () => {
    if (currentSlide === 0) {
      // Cover slide
      return (
        <div className="slide cover-slide">
          <h1 className="main-title">MedEquipTech – Platforms & Use Cases</h1>
          <p className="subtitle">Presentation Deck (Platforms + 10 Use Cases)</p>
          <div className="cover-details">
            <div className="detail-item">
              <span className="label">Date:</span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
            <div className="detail-item">
              <span className="label">Scope:</span>
              <span>Platforms deep dive + 10 use cases with notifications, parts, and KPIs</span>
            </div>
          </div>
          <div className="cover-footer">
            <p>Use arrow keys or click navigation to explore</p>
            <p>Press ESC to return to start</p>
          </div>
        </div>
      );
    }

    if (currentSlide === 1) {
      // Table of Contents
      return (
        <div className="slide toc-slide">
          <h1>Table of Contents</h1>
          <div className="toc-content">
            <div className="toc-section">
              <h3>Platforms</h3>
              <ul>
                {platforms.map((platform, index) => (
                  <li key={index}>{platform.name}</li>
                ))}
              </ul>
            </div>
            <div className="toc-section">
              <h3>Use Cases</h3>
              <ul>
                {useCases.map((useCase, index) => (
                  <li key={index}>{useCase.code} — {useCase.title}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      );
    }

    let slideIndex = currentSlide - 2; // Account for cover and TOC
    let platformIndex = Math.floor(slideIndex / 3);
    let platformSlideType = slideIndex % 3;

    if (platformIndex < platforms.length) {
      // Platform slides
      const platform = platforms[platformIndex];
      if (platformSlideType === 0) {
        return (
          <div className="slide platform-slide">
            <h1>{platform.name}</h1>
            <h3 className="slide-subtitle">Overview</h3>
            <div className="slide-content">
              <p className="purpose">{platform.purpose}</p>
              <div className="users-section">
                <h4>Primary Users:</h4>
                <p>{platform.users.join(', ')}</p>
              </div>
            </div>
          </div>
        );
      } else if (platformSlideType === 1) {
        return (
          <div className="slide platform-slide">
            <h1>{platform.name} — Capabilities</h1>
            <h3 className="slide-subtitle">What it does</h3>
            <div className="slide-content">
              <ul>
                {platform.does.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        );
      } else {
        return (
          <div className="slide platform-slide">
            <h1>{platform.name} — Boundaries & KPIs</h1>
            <h3 className="slide-subtitle">Keep focus where it belongs</h3>
            <div className="slide-content">
              <div className="boundaries-section">
                <h4>Does NOT:</h4>
                <ul>
                  {platform.doesNot.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="kpis-section">
                <h4>KPIs:</h4>
                <ul>
                  {platform.kpis.map((kpi, index) => (
                    <li key={index}>{kpi}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );
      }
    }

    // Use case slides
    slideIndex = slideIndex - (platforms.length * 3);
    let useCaseIndex = Math.floor(slideIndex / 4);
    let useCaseSlideType = slideIndex % 4;

    if (useCaseIndex < useCases.length) {
      const useCase = useCases[useCaseIndex];
      if (useCaseSlideType === 0) {
        return (
          <div className="slide usecase-slide">
            <h1>{useCase.code} — {useCase.title}</h1>
            <h3 className="slide-subtitle">Case Setup</h3>
            <div className="slide-content">
              <div className="actors-section">
                <h4>Actors:</h4>
                <p>{useCase.actors.join(', ')}</p>
              </div>
            </div>
          </div>
        );
      } else if (useCaseSlideType === 1) {
        return (
          <div className="slide usecase-slide">
            <h1>{useCase.code} — Process Flow</h1>
            <h3 className="slide-subtitle">Intake → Routing → Execution → Closeout</h3>
            <div className="slide-content">
              <ol>
                {useCase.steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>
          </div>
        );
      } else if (useCaseSlideType === 2) {
        return (
          <div className="slide usecase-slide">
            <h1>{useCase.code} — Notifications</h1>
            <h3 className="slide-subtitle">Customer • Provider • Internal</h3>
            <div className="slide-content">
              <ul>
                {useCase.notifications.map((notification, index) => (
                  <li key={index}>{notification}</li>
                ))}
              </ul>
            </div>
          </div>
        );
      } else {
        return (
          <div className="slide usecase-slide">
            <h1>{useCase.code} — Outcomes & KPIs</h1>
            <h3 className="slide-subtitle">Measure what matters</h3>
            <div className="slide-content">
              <p className="outcome">Case closed; systems synced (Service, MET, Jira, IMS, SAP)</p>
              <div className="kpis-section">
                <h4>KPIs:</h4>
                <ul>
                  {useCase.kpis.map((kpi, index) => (
                    <li key={index}>{kpi}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );
      }
    }

    // Notes slide (last slide)
    return (
      <div className="slide notes-slide">
        <h1>Notes</h1>
        <div className="slide-content">
          <p>This presentation covers the complete MedEquipTech platform architecture and operational workflows.</p>
          <p>Key takeaways:</p>
          <ul>
            <li>Clear system boundaries prevent scope creep</li>
            <li>Unified notification strategy across all stakeholders</li>
            <li>Parts prediction and orchestration improve first-visit success</li>
            <li>Comprehensive KPIs measure operational excellence</li>
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="concept-container">
      {/* Navigation Bar */}
      <div className="nav-bar">
        <div className="nav-left">
          <button onClick={resetToStart} className="nav-button" title="Go to start (Home)">
            <Home size={20} />
          </button>
          <button onClick={toggleAutoPlay} className="nav-button" title="Toggle auto-play (Space)">
            {isAutoPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <button onClick={resetToStart} className="nav-button" title="Reset (ESC)">
            <RotateCcw size={20} />
          </button>
        </div>
        
        <div className="nav-center">
          <span className="slide-counter">
            {currentSlide + 1} / {totalSlides}
          </span>
        </div>
        
        <div className="nav-right">
          <button onClick={prevSlide} className="nav-button" title="Previous slide (←)">
            <ChevronLeft size={20} />
          </button>
          <button onClick={nextSlide} className="nav-button" title="Next slide (→)">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Slide Content */}
      <div className="slide-container">
        {renderSlide()}
      </div>

      {/* Progress Bar */}
      <div className="progress-container">
        <div 
          className="progress-bar" 
          style={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}
        />
      </div>

      {/* Slide Navigation Dots */}
      <div className="slide-dots">
        {Array.from({ length: totalSlides }, (_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`dot ${index === currentSlide ? 'active' : ''}`}
            title={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Keyboard Shortcuts Help */}
      <div className="keyboard-help">
        <p>Keyboard shortcuts: ← → (navigate), Space (next), Home (start), ESC (reset)</p>
      </div>
    </div>
  );
}
