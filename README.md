# Ashkan HelpDesk

> **Enterprise IT Service Management & Help Desk Platform built with Angular**

Ashkan HelpDesk is a frontend-first enterprise ITSM platform designed to demonstrate how a modern service-management product can be structured for **scalability, maintainability, operational workflows, security-aware UX, analytics, and AI-assisted support**.

The project is intentionally built as a realistic product rather than a small demo: it brings together ticketing, SLA management, knowledge management, assets, workflows, automation, workforce operations, multi-tenancy, subscription management, RBAC foundations, AI/RAG capabilities, and AI observability in one cohesive workspace.

---

## Executive Summary

**Ashkan HelpDesk** is designed around a simple engineering principle:

> Build a clear, modular product experience first; keep the architecture ready for secure, durable backend integration.

The current repository focuses on the Angular application and its product architecture. Business-critical persistence, authoritative authorization, integrations, background processing, AI provider calls, and server-side policy enforcement are deliberately reserved for the planned **ASP.NET Core Web API + PostgreSQL** backend layer.

This separation keeps the frontend demonstrable while making the future backend contract explicit.

---

## Why This Project Matters

This repository is intended to showcase practical **enterprise software engineering** skills, including:

- Modular Angular application architecture
- Clean and maintainable TypeScript
- Role-aware navigation and permission foundations
- Enterprise workflow and approval concepts
- SLA and escalation management
- Omnichannel service operations
- Knowledge management and AI-ready retrieval
- AI prompt/model governance
- AI observability and evaluation
- Multi-tenant product foundations
- Subscription, entitlement and usage management
- Asset, workplace and workforce operations
- Responsive and accessible product UX
- Design-system thinking and reusable UI primitives
- Backend-ready domain boundaries

The goal is not to claim that a frontend mock is a production backend. The goal is to demonstrate **product thinking, engineering structure, UI architecture and an explicit path toward production implementation**.

---

## Core Capabilities

### Service Management
- Ticket management
- Service requests
- Omnichannel support
- SLA monitoring and escalation
- Customer portal
- Knowledge base
- Workflow and approval management
- Rules and automation

### Enterprise Operations
- Organizations and tenants
- Users, roles and permissions
- Contracts and vendors
- Procurement
- Inventory
- Asset lifecycle
- Maintenance
- Finance
- HR and payroll
- Workplace and desk management
- Workforce planning

### Platform & Governance
- Authentication and authorization foundation
- RBAC and permission-aware UX
- Audit log
- API management
- Subscription and billing
- Feature entitlements
- Usage and capacity concepts
- Global search and command-center UX
- Reporting and executive analytics

### AI Platform
- **Ashkan Copilot**
- AI Knowledge & RAG
- Source/chunk/indexing workflow
- Prompt template and version management
- Model/provider registry
- Model routing and fallback concepts
- AI policy controls
- Token/cost/latency monitoring
- **AI Observability & Evaluation Center**
- Golden-dataset evaluation concepts
- Groundedness and citation quality
- Safety evaluation
- Human-review routing

---

## Technology Stack

| Area | Technology |
|---|---|
| Frontend | Angular |
| Language | TypeScript |
| UI | Standalone Angular Components |
| Icons | Lucide Angular |
| Styling | SCSS |
| Forms | Angular Forms |
| Routing | Angular Router |
| Architecture | Feature-oriented modular frontend |
| Planned Backend | ASP.NET Core Web API |
| Planned Database | PostgreSQL |
| Planned Auth | JWT / Refresh Token / Server-side RBAC |
| AI Integration | Provider-neutral AI gateway architecture |

---

## Architecture Direction

The frontend is organized around feature boundaries rather than one large monolithic component tree.

```text
Ashkan HelpDesk
│
├── Authentication & Authorization
├── Dashboard & Analytics
├── Ticketing & Omnichannel
├── SLA & Escalation
├── Workflow & Automation
├── Knowledge Management
├── Asset & Workplace Operations
├── HR / Finance / Procurement
├── Multi-Tenancy & Subscriptions
├── API & Audit
│
└── AI Platform
    ├── Copilot
    ├── Knowledge & RAG
    ├── Model & Prompt Management
    └── Observability & Evaluation
```

The architecture is deliberately prepared for a future separation such as:

```text
Angular Frontend
        │
        ▼
ASP.NET Core API
        │
 ┌──────┼────────┐
 ▼      ▼        ▼
PostgreSQL   Background Workers   Integration Layer
                                  │
                                  ├── Identity
                                  ├── Email / Messaging
                                  ├── Payments
                                  └── AI Providers
```

---

## AI Engineering Direction

The AI layer is designed as an operational subsystem rather than a single chatbot screen.

### Retrieval

```text
Source
  ↓
Chunking
  ↓
Embedding
  ↓
Vector Store
  ↓
ACL-aware Retrieval
  ↓
Prompt Context
  ↓
Model
  ↓
Citation + Policy Checks
  ↓
Human Review / Response
```

### Observability

```text
AI Request
   ↓
Telemetry
   ├── latency
   ├── tokens
   ├── cost
   └── model
        ↓
Evaluation
   ├── groundedness
   ├── citation accuracy
   ├── safety
   └── response quality
        ↓
Governance
   ├── policy
   ├── human review
   └── audit
```

This makes the AI architecture suitable for future integration with production telemetry, evaluation workers, model gateways and audit pipelines.

---

## Security & Governance

Security is treated as an architectural concern rather than a UI-only feature.

Current frontend foundations include:

- Authentication flow foundation
- Role-aware navigation
- Permission-aware UI
- Protected routes
- MFA UX foundation
- Audit-log workspace
- Sensitive-action review concepts
- Prompt-injection guard concepts
- Citation requirements
- Human-in-the-loop controls

### Backend security is intentionally deferred

The production implementation will require:

- Authoritative server-side authorization
- Secure JWT/refresh-token handling
- Password hashing
- Session and token revocation
- Tenant isolation
- API rate limiting
- Server-side audit trails
- Secrets management
- Secure AI provider credentials
- Policy enforcement outside the browser

---

## UX & Design Philosophy

Ashkan HelpDesk follows an enterprise product design approach with emphasis on:

- Clear information hierarchy
- High-density but readable operational screens
- Responsive layouts
- RTL support
- Consistent spacing and typography
- Reusable UI patterns
- Status-driven visual language
- Color psychology for operational urgency
- Accessible interaction patterns
- Executive dashboards alongside detailed operational views

The objective is to create an interface that feels like a **real enterprise SaaS product**, not a collection of disconnected demo pages.

---

## Current Development Status

The repository is being developed incrementally through structured phases.

Recent AI-focused milestones include:

- **Phase 2.69** — Ashkan Copilot
- **Phase 2.70** — AI Knowledge & RAG Intelligence
- **Phase 2.71** — AI Prompt Engineering & Model Management
- **Phase 2.72** — AI Observability & Evaluation Center
- **Phase 2.73** — AI Safety & Red-Team Center
- **Phase 2.74** — AI Incident Command Center
- **Phase 2.75** — AI Governance & Compliance Center

The current phase adds a dedicated workspace for:

- AI execution telemetry
- Model latency
- Token usage
- Estimated AI cost
- Confidence monitoring
- Golden-dataset evaluations
- Groundedness
- Safety
- Citation quality
- Human-review routing

---

## Running Locally

Requirements:

- Node.js
- npm
- Angular CLI

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
ng serve
```

Then open the local development URL shown by Angular CLI.

> This repository does not include `node_modules`, generated build output, or production secrets.

---

## Backend Roadmap

The frontend is intentionally being completed before the backend implementation.

Planned backend direction:

1. ASP.NET Core Web API
2. PostgreSQL persistence
3. Identity and JWT authentication
4. Server-side RBAC
5. Multi-tenant isolation
6. Repository/service boundaries
7. Background jobs
8. Notification and integration providers
9. AI gateway and provider abstraction
10. RAG/vector infrastructure
11. AI telemetry and evaluation pipeline
12. Production-grade audit and observability

---

## Recruiter Snapshot

**Role fit demonstrated by this project:**

- Frontend Engineer
- Angular Developer
- TypeScript Engineer
- Enterprise Software Engineer
- Full-Stack Engineer (frontend architecture + planned ASP.NET Core backend)
- SaaS / ITSM Product Engineer
- AI-enabled Enterprise Application Engineer

**Engineering themes:**

`Angular` · `TypeScript` · `Enterprise SaaS` · `ITSM` · `Clean Architecture` · `RBAC` · `SLA` · `Workflow` · `Automation` · `Multi-Tenancy` · `AI/RAG` · `Observability` · `Responsive UX`

---

## Project Philosophy

Ashkan HelpDesk is built around three principles:

**1. Product thinking**  
Features should form a coherent operational platform rather than isolated technical demos.

**2. Engineering discipline**  
Frontend behavior, permissions, domain boundaries and future backend responsibilities should be explicit.

**3. Production awareness**  
Mock data is clearly identified, and production-only responsibilities are intentionally designed for later server-side implementation.

---

## License

License and contribution policy can be added when the repository is prepared for public collaboration.

---

### Built as an enterprise-focused engineering portfolio project

**Ashkan HelpDesk — ITSM, Automation, Enterprise Operations & AI**


## Phase 2.76 — AI Trust & Transparency Center

Added the enterprise trust layer for AI-assisted experiences:
- AI decision transparency and user disclosure patterns
- Explainability / “Why this answer?” foundation
- Model card and capability/limitation disclosure
- Data and source provenance visibility
- Fairness and bias monitoring foundation
- Trust control registry with scores, evidence, owners, and limitations
- Search, status filtering, and control detail review
- Route: `/ai-trust`
- Frontend-only architecture; live telemetry, policy enforcement, model metadata synchronization, and governed fairness datasets remain backend integration work.


## Phase 2.77 — AI Audit & Evidence Center

Added an audit-ready evidence layer for AI decisions, model snapshots, security findings, compliance controls and human approvals, including evidence readiness, integrity/retention metadata, audit events, package workflow, search/filtering and detail review. Route: `/ai-audit`. Backend persistence, cryptographic sealing, exports, retention enforcement and audit APIs remain integration work.


## Phase 2.78 — AI Observability & Operations Center

Added an AI operations foundation for runtime telemetry, model health, latency, reliability, token/cost signals, operational alerts, routing health, quality, guardrail health and drift indicators. Route: `/ai-observability`. Server telemetry ingestion, tracing, SLO enforcement, provider health checks, metering and alert delivery remain backend integration work.


## Phase 2.79 — AI Cost & FinOps Center
Enterprise AI spend governance with token economics, budgets, forecasting, cost allocation and optimization opportunities. Backend billing and metering integrations remain deferred.


## Phase 2.80 — AI Chargeback & Billing Center
Finance-ready AI billing with invoice lifecycle, showback/chargeback allocation, billing controls and settlement-ready foundations. Backend accounting integrations remain deferred.


## Phase 2.81 — AI Finance & Revenue Intelligence Center
- Executive finance dashboard
- Revenue attribution and profitability intelligence
- AI cost-to-revenue and margin KPIs
- Revenue ledger with filtering and detail inspection
- Route: `/ai-finance`
- Backend-ready finance integration foundation


## Phase 2.82 — AI Revenue Forecasting & Financial Planning Center
- Revenue forecasting and financial planning cockpit
- Base / Upside / Downside scenario analysis
- Forecast confidence, margin and budget signals
- Business-scope forecast register and detail inspection
- Route: `/ai-forecasting`


## Phase 2.83 — AI Financial Scenario & What-If Simulation Center
- Live financial what-if controls
- Revenue, AI cost, profit and margin impact modeling
- Growth / Efficiency / Conservative presets
- Simulation register and confidence indicators
- Route: `/ai-simulation`


### Phase 2.83 Compile Fix
The Phase 2.83 frontend was repaired for malformed route/sidebar declarations, standalone Lucide imports, and invalid Sass imports. See `docs/PHASE-2.83-FIX-CHANGELOG.md`.

## Phase 2.83 Compile Fix 2

Resolved the latest Angular compiler issues reported from `ng serve`, including standalone Lucide imports, corrupted routing/sidebar code, Sass imports, signal invocation and template `Math` access. See `docs/PHASE-2.83-FIX2-CHANGELOG.md`.


## Latest Fix
Phase 2.83 Fix 3 resolves Angular standalone `*ngIf` imports and standardizes affected Lucide icon templates on `lucide-icon [img]` usage. See `docs/PHASE-2.83-FIX3-CHANGELOG.md`.


## Phase 2.83 Fix 4
Sidebar selector, Lucide rendering, AppComponent bindings, and toast event typing were repaired. See `docs/PHASE-2.83-FIX4-CHANGELOG.md`.
> Phase 2.83 Fix 5: remaining sidebar Lucide bindings were normalized to `lucide-icon [img]` and all icon references were exposed on `AppSidebarComponent`.

### Phase 2.84
AI Executive Intelligence & Decision Center is now available at `/ai-executive`, with executive KPI synthesis, strategic decision signals, decision register and governance-aware recommendation flows. The frontend route catalog was also restored from the existing feature modules.
