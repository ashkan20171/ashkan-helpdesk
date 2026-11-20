# Ashkan HelpDesk — Frontend

Angular 22 standalone frontend for the Ashkan HelpDesk enterprise support platform.

## Requirements
- Node.js 22.12 or newer
- npm compatible with the installed Node.js version

## Install and run
```bash
npm install
npm start
```

## Production build
```bash
npm run build
```

## Current frontend modules
- Dashboard
- Authentication screens (demo-only)
- Design System
- Users and access management (demo-only)
- Organization, teams and departments (demo-only)
- Ticket Management (demo-only): searchable/filterable list, Kanban view, create ticket, details/conversation panel, status and priority updates, bulk actions, CSV export

## Important
The current application uses local in-memory demo data. It does not provide production authentication, persistent storage, or server-side authorization. These will be implemented in the ASP.NET Core/PostgreSQL backend phase. Never rely on frontend role selection or hidden UI elements for security.

## TypeScript 6 compatibility
The TypeScript configuration intentionally does not use the deprecated `baseUrl` compiler option. Path aliases are configured directly in `compilerOptions.paths`.


## Phase 2.9 — Service Requests

The service request module is available at `/requests`. It includes a service catalog, mock request creation, request list filters, request details, local approval/rejection/completion actions, and CSV export. All data remains in-memory demo data until the ASP.NET Core API is implemented.


## Phase 2.12 — Knowledge Base
The `/knowledge` screen provides a searchable article library, category and status filters, article authoring, preview, feedback, version-history preview and CSV export. Data remains in-memory demo state until backend integration.

## Phase 2.10 — SLA Management
The `/sla` screen provides a local demo directory of SLA policies, priority/status filters, policy editing, activation controls, response/resolution targets and CSV export.

## Phase 2.11 — Workflow Management
The `/workflows` screen provides a local demo workflow catalog, configurable stages, role/approval settings, activation controls and CSV export. Rule execution and approval orchestration are deferred to the backend phase.

## Phase 2.13 — IT Asset Management
The `/assets` screen provides searchable asset inventory, category/status/department filters, asset registration and editing, assignment and return actions, repair lifecycle actions, maintenance history, warranty attention items, inventory KPIs and CSV export. Data is local demo state until ASP.NET Core/PostgreSQL integration.

## فاز ۲.۱۸ — مدیریت مالی و هزینه‌ها

ماژول مالی در مسیر `/finance` شامل دفتر هزینه‌های سازمان، فاکتورها و پرداخت‌ها، بودجه واحدها و مراکز هزینه و تحلیل هزینه‌های عملیاتی است. این نسخه از داده‌های نمونه در حافظه نشست استفاده می‌کند و برای استفاده عملیاتی باید به API و پایگاه داده متصل شود.

## Phase 2.19
Human Resources module added at `/hr` with employee profiles, attendance, leave, shifts, and missions. Data is currently mock/in-memory; backend integration is deferred.


## Phase 2.33 — Rules & Automation Engine

The `/automation` module provides a demo rule library, conditional rule builder (AND/OR), event triggers, configurable actions, activation/version controls, duplicate and test-run actions, execution history with detail inspection and CSV export, scheduled-job controls, and reusable rule templates. All execution and scheduling behavior is simulated in the frontend; a real event bus, durable persistence, secure server-side action execution, and background scheduler require the ASP.NET Core backend.


## Phase 2.34 — Advanced SLA & Escalation
The `/sla` module was upgraded with SLA monitoring, breach-risk states, business calendars, pause-on-customer-pending behavior, customer/contract scope, multi-level escalation configuration, escalation simulation, detailed SLA monitoring, and CSV exports. Time calculation and server-side escalation remain demo-only until ASP.NET Core/PostgreSQL integration.


## Phase 2.35 — Advanced Ticket Management & Omnichannel
- Unified multi-channel ticket inbox: Portal, Email, Live Chat, WhatsApp, Phone, API
- Smart queues, Round Robin assignment and SLA-aware routing preview
- Merge / Split / Parent-Child ticket relationship UX
- Ticket templates and canned responses / macros
- Unified conversation timeline with inbound, outbound and system events
- Channel connection status and CSV export
- Beautiful authentication UX enhancement with demo role selector and permission preview for Admin, Manager, Agent and Customer
- Login feedback reflects the selected access role; final authentication, authorization, token/session security and backend RBAC remain deferred to the Backend phase.
- Route: `/omnichannel`


## Phase 2.36 — Authentication & Authorization Foundation
- Role-Based Access Control foundation for Admin, Manager, Agent and Customer
- Permission Matrix grouped by capability
- Active session management UX
- MFA enable/disable foundation
- Auth and permission route-guard foundation
- JWT/token validation and authoritative authorization remain backend responsibilities


## Phase 2.37 — User, Role & Permission Management
- Central user directory with search and advanced filters
- User create/edit/detail workflows
- Role assignment for Admin, Manager, Agent and Customer
- Per-user permission overrides
- Permission Matrix comparing all roles
- Account status controls: active, inactive, locked, pending approval
- MFA status and security indicators
- Tenant / department assignment
- CSV export
- Responsive RTL UI
- Real persistence, authoritative authorization and backend identity provider remain deferred to Backend phase.

## Phase 2.38 — Advanced Dashboard & Executive Analytics
داشبورد مدیریتی با KPIهای SLA/CSAT/Backlog، تحلیل روند، Omnichannel mix، عملکرد کارشناسان، موارد بحرانی و خروجی CSV تکمیل شد.

## Phase 2.39 — Advanced Search & Global Command Center
- Added global search workspace at `/search`.
- Search/filter/sort across tickets, users, organizations, assets, contracts and knowledge records.
- Added saved-search foundation, recent searches and CSV export.
- Added Global Search to the sidebar and Command Palette (⌘K).
- Added responsive RTL and dark-theme support.
- Fixed malformed maintenance navigation command and extended page-title handling.


## Phase 2.40 — Advanced Notification & Communication Center
- Expanded notification center with Inbox, Templates, Preferences, Communication Channels, and Notification Rules.
- Added outbound message composer for in-app, Email, SMS, and WhatsApp channel simulation.
- Added channel health/status cards and communication readiness indicators.
- Added notification rules with audience, channel, event, and enable/disable controls.
- Added richer responsive RTL communication-center UX.
- Frontend/demo data only; real providers, queues, webhooks, delivery receipts, retries, and backend persistence are deferred to the ASP.NET Core + PostgreSQL backend phase.


## Phase 2.41 — Advanced Workflow & Approval Center
- Approval Inbox با جستجو، فیلتر وضعیت، SLA و اولویت
- تصمیم‌گیری تأیید/رد و Timeline مراحل
- Workflow catalog با وضعیت، مراحل، تعداد approval و SLA
- Governance indicators برای Audit Trail، Delegation و Escalation
- مسیر `/approvals` با authGuard و طراحی RTL/Responsive
- این لایه Frontend/Mock است؛ موتور واقعی Workflow، Persistence، Queue و PostgreSQL در Backend تکمیل می‌شود.


## Phase 2.56.1 — Project Structure Cleanup & Run-Ready Foundation
- Consolidated the latest accumulated Angular source into the canonical Angular project root.
- Removed the duplicated top-level `src/` extraction folder and obsolete nested work-directory packaging.
- Canonical project files remain at the root: `angular.json`, `package.json`, TypeScript configs, and `src/`.
- Excluded generated dependency/build folders such as `node_modules`, `.angular`, and `dist`.
- The deliverable is structured for `npm install` followed by `npm start` or `npx ng serve`.
- No successful Angular build is claimed in this phase because dependencies were not installed during packaging.


## Phase 2.56.2 — Angular Build Error Cleanup
- Fixed missing `LockKeyhole` import in API Management.
- Fixed standalone components that referenced `lucide-icon` without importing `LucideAngularModule`.
- Fixed Angular template parser errors caused by typed inline arrow functions in Documents and Knowledge Base forms.
- Added component methods for CSV-style tag/module parsing.
- Removed duplicate icon class members in User Management.
- This phase addresses the compile errors reported by `ng serve`; build success is not claimed here because the ZIP does not include `node_modules`.


## Phase 2.57 — Advanced Team Seating & Neighborhood Planning
- Added Team Seating Plan and Neighborhood Planning workspace.
- Added team-to-neighborhood allocation, assigned/shared seats and density analytics.
- Added Hybrid / On-site / Remote work modes.
- Added conceptual floor/neighborhood visualization and relocation-risk states.
- Added team allocation drawer with capacity and physical-access validation foundation.
- Added search and work-mode filtering with responsive RTL UI.
- Also fixed the latest `ng serve` compilation errors in User Management and App Sidebar before continuing the phase.
- Real persistence, employee/desk conflict validation, calendar integration and backend APIs remain deferred.


## Phase 2.58 — Advanced Workplace Policy & Desk Reservation Engine
- Added Desk Reservation Engine workspace.
- Added reservation lifecycle states: Confirmed, Pending, Checked-in, No-show, Cancelled.
- Added check-in/no-show policy foundation and recurring reservations.
- Added Hybrid / On-site / Remote work modes.
- Added policy cards for double booking, check-in window, hybrid policy and team rules.
- Added reservation search and status/work-mode filtering.
- Added desk reservation drawer with pre-booking validation foundation.
- Connected the UX conceptually to Employee, Team Seating, Neighborhood, Physical Access and Calendar.
- Real conflict detection, persistence, notifications and backend enforcement remain deferred.


## Phase 2.59 — Advanced Workplace Attendance & Check-in Management
- Added Workplace Attendance & Check-in Center.
- Added attendance states: Present, Late, No-show, Checked-out, Remote.
- Added Desk Check-in, QR, Physical Access and Manual event sources.
- Added late detection and No-show monitoring foundation.
- Added check-in/check-out timeline UX.
- Added QR/Desk Check-in drawer with validation foundation.
- Connected the UX conceptually to Desk Reservation, Physical Access, Employee and Hybrid Work Policy.
- Real attendance calculation, persistence, event synchronization and backend enforcement remain deferred.


## Phase 2.60 — Advanced Workplace Attendance Analytics & Workforce Insights
- Added Workforce Intelligence dashboard.
- Added Attendance Rate, Punctuality Rate, Average Working Hours and No-show KPIs.
- Added Daily/Weekly/Monthly analysis filters.
- Added department and team filters.
- Added attendance trend visualization.
- Added team attendance comparison with punctuality, no-show, average hours and hybrid ratios.
- Added management insight cards and backend-ready analytics foundation.
- Analytics are currently mock/in-memory; real aggregation and export remain deferred to backend/data integration.


## Phase 2.61 — Workforce Planning + Authentication, Registration & RBAC Foundation
- Added Workforce Capacity Planning and Scenario Intelligence.
- Added Conservative / Balanced / Peak On-site scenarios.
- Added peak attendance, desk demand, utilization and capacity-gap KPIs.
- Added weekly demand forecast and team capacity comparison.
- Added capacity-risk recommendations and planning horizon.
- Added first-page login flow: root now redirects to `/auth/login`.
- Completed demo login session persistence and role-aware navigation.
- Completed registration flow with customer access by default.
- Added RBAC-aware auth guard with role permissions.
- Protected application routes and added permission checks to key modules.
- Added role-aware sidebar visibility and logout action.
- Authentication and authorization are still frontend/demo-only; real credential validation, JWT/refresh tokens, password hashing, email verification and server-side RBAC remain Backend responsibilities.

## Phase 2.62 — Advanced Identity, Profile & Organization Access Center
- مرکز پروفایل، امنیت، نشست‌ها و دسترسی سازمانی در `/profile-access`
- مدیریت اطلاعات پروفایل و تغییر رمز عبور
- MFA/Authenticator و کنترل نقش‌محور
- مدیریت نشست‌ها و خاتمه نشست‌های غیرجاری
- نمایش اعضای سازمان، نقش‌ها و وضعیت عضویت
- مدل Organization → Membership → Role → Permission
- مجوزهای `profile.manage`، `security.manage` و `organization.members.manage`
- رفع بلوک‌های کنترلی ناقص Sidebar و اتصال Router
- اقدامات امنیتی و دعوت اعضا فعلاً frontend/demo هستند و در Backend واقعی تکمیل می‌شوند.


## Phase 2.63 — Advanced Organization & Membership Management
- Organization Access Center at `/organization-access`.
- Multi-workspace switcher and workspace-scoped membership.
- Member search, role assignment and invitation foundation.
- Department structure and Role/Scope visualization.
- Responsive RTL organization-control UX.
- Persistence, invitation delivery, tenant isolation and server-side authorization remain backend responsibilities.


## Phase 2.64 — Advanced Tenant & Multi-Organization Management
- Added Tenant Management Center, tenant switcher and tenant directory.
- Added tenant creation with unique slug validation and demo status/plan/domain/region data.
- Added tenant branding editor with live preview and brand color.
- Added tenant-level security policies and onboarding wizard.
- Added tenant isolation architecture visualization and responsive RTL UI.
- True tenant isolation, provisioning, domain verification, subscription enforcement and persisted policy enforcement remain ASP.NET Core/PostgreSQL backend responsibilities.


## Phase 2.65 — Advanced Subscription, Billing & Plan Management
- Subscription and billing control center
- Starter / Business / Enterprise / Custom plan catalog
- Tenant subscription and renewal tracking
- Usage metering for seats, storage and tickets
- Capacity risk detection above 80%
- MRR overview, renewal radar and invoice ledger
- Custom plan builder and demo upgrade flow
- Real payment, proration, invoices, webhooks and entitlement enforcement remain backend responsibilities


## Phase 2.66 — Advanced Usage, Entitlement & Feature Flag Management

- Feature Flag Center
- Entitlement Engine و Plan-aware feature access
- Usage Quota برای users / tickets / storage / API / AI
- Soft Limit / Hard Limit و Grace Period
- Tenant-scoped Feature Override
- Rollout تدریجی و Experimentation
- Locked Feature UX foundation
- اتصال مفهومی به Subscription Billing و RBAC
- Backend enforcement, persistence, metering و runtime authorization در فاز Backend پیاده‌سازی می‌شوند.


## Phase 2.67 — Advanced Customer Success, Health Score & Tenant Lifecycle

- Customer Health Score و Portfolio Health
- Adoption Score و Feature Adoption signals
- Churn / At-Risk / Renewal Risk
- Tenant Lifecycle: Trial → Onboarding → Active → At Risk → Renewal → Churned
- Customer Journey و Onboarding Progress
- Success Playbooks و Next Best Actions
- Expansion / Upsell / Cross-sell signals
- Customer Success Tasks foundation
- ارتباط مفهومی با Subscription, Usage, Entitlement, Ticket, SLA و Billing
- Backend persistence, scoring engine, event-driven health calculation و automation در فاز Backend پیاده‌سازی می‌شوند.


## Phase 2.68 — Advanced Customer Success Automation & AI Decision Engine

- Next Best Action signals
- Churn / Renewal / Expansion forecast foundation
- Customer Success automation rules
- Health, Adoption, Usage and SLA triggers
- Playbook execution foundation
- Rule enable/disable and run counters
- Experimentation / AI-ready decision layer
- Event-driven integration foundation for Billing, Usage, Ticket, SLA and Entitlement
- Backend scoring, event bus, persistence, ML/AI inference and audit trail remain backend responsibilities.


## Phase 2.69
Advanced AI Copilot & Intelligent HelpDesk Assistant — Copilot modes for Agent/Manager/Customer, cross-domain insights, AI-ready chat, confidence scoring and human-in-the-loop action review.


## Phase 2.70
AI Knowledge & RAG Intelligence — Knowledge Registry, RAG pipeline foundation, Retrieval Preview and Prompt Governance.
"# ashkan-helpdesk" 
