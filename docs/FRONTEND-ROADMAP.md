# Ashkan HelpDesk — Frontend Roadmap

## Phase 2.1 — Foundation (this delivery)
- Angular standalone application scaffold
- Strict TypeScript configuration
- RTL base and visual tokens
- Responsive application shell and navigation
- Dashboard prototype with sample KPIs and charts
- Ticket list prototype with client-side search and filters
- Dark theme toggle

## Decisions
- Build the complete frontend before implementing ASP.NET Core APIs.
- Keep mock repositories/data isolated and replaceable by API services later.
- Enforce all real authorization on the server; frontend route guards and visibility rules are UX controls only.
- Use feature-oriented folders and standalone components.
- Use Persian RTL as the default locale; preserve the ability to add English LTR.

## Next frontend increments
- Shared form controls, buttons, badges, tables, dialogs, toasts and empty states
- Route metadata and role-aware navigation model
- Authentication screens and session UX
- Ticket create/detail/message/attachment flows
- User, role, permission, team and department screens
- SLA, workflow, knowledge base, assets, reports and settings screens
- Accessibility, responsive QA and automated tests


## Completed: Phase 2.3 — Application Layout
- Sidebar and header extracted into standalone Angular components.
- Responsive mobile drawer, workspace switcher, notification center and profile menu.
- Global command palette with keyboard shortcut.
- Dark theme and accessibility improvements for shell-level interactions.

## Completed: Phase 2.4 — Role-Aware Dashboard Experience
- Added role preview modes for System Administrator, Support Manager, Team Lead, Support Agent and Customer.
- Added role-aware KPI cards, descriptions, SLA summaries, ticket views and customer help shortcuts.
- Added 7/30/90-day period selection and period-aware trend chart rendering.
- Added urgent-attention panel, team performance, quick actions and CSV export for the visible ticket list.
- Added responsive and dark-theme dashboard styling.
- Kept all dashboard data explicitly marked as mock/demo data; actual authorization remains a backend responsibility.

## Next: Phase 2.5 — Authentication & Account Screens
- Sign-in, forgot-password, reset-password and invitation acceptance UI.
- Session states, form validation, password visibility and accessible feedback.
- Frontend-only demo auth state, designed to be replaced by ASP.NET Core Identity/API integration.

## Completed: Phase 2.5 — Authentication & Account Screens
- Sign-in, registration, forgot/reset password and invitation acceptance screens.
- Demo-only authentication UX and form validation.

## Completed: Phase 2.6 — Users, Roles & Permissions
- User directory with search and filters, add/edit dialog, status changes and CSV export.
- Role catalog and role-specific permission matrix.
- Added `/users` route and sidebar/command-palette navigation.
- All data remains local demo state until backend integration.

## Next: Phase 2.7 — Teams & Departments
- Team directory and department hierarchy.
- Team details, membership assignment and team lead selection.
- Organization chart-style navigation and team capacity summaries.

## Phase 2.8 — Ticket Management
Completed frontend scope: ticket workspace, filters, table/Kanban views, ticket creation, detail drawer, conversation mock, internal notes, bulk status updates, and CSV export. All data is in-memory demo data pending backend integration.


## Completed: Phase 2.9 — Service Request Management
- Service catalog and request registration UI
- Request list, search, status tabs, priority and department filters
- Request detail drawer and approval workflow preview
- Demo approve/reject/complete actions and CSV export
- Responsive RTL layout

All service request data is mock/in-memory pending backend integration.


## Completed: Phase 2.10 — SLA Management
- SLA policy directory with search, priority/status filters, create/edit and activation controls.
- Response and resolution targets with working-calendar selection.
- Summary metrics and CSV export.
- Added SLA navigation and route.
- Fixed the organization form `membersText` TypeScript typing issue.

All SLA records remain mock/in-memory data; real SLA timers and business-calendar calculations are deferred to backend integration.

## Completed: Phase 2.11 — Workflow Management
- Added workflow directory with search and status filters.
- Added workflow overview with trigger, owner department, execution condition and auto-assignment settings.
- Added editable sequential stages with responsible roles, approval requirements and per-stage time limits.
- Added create/edit, activate/deactivate and CSV export interactions.
- Added `/workflows` route, sidebar navigation and command-palette entry.
- Added responsive RTL layout and workflow preview panel.

All workflow definitions and execution counts are mock/in-memory data. Actual rule evaluation, approval queues, audit history, SLA timers and ticket/service-request event integration require the planned backend workflow engine.


## Completed: Phase 2.12 — Knowledge Base
- Added searchable knowledge article library with category and publication-status filters.
- Added article create/edit dialog with required-field validation and tags.
- Added article detail preview, author metadata, article feedback and version-history preview.
- Added knowledge metrics and CSV export.
- Activated `/knowledge` route, sidebar navigation and command-palette entry.
- Added responsive RTL layout and demo content for common IT support topics.

All article data, feedback and version history are local demo state. Persistent storage, full-text indexing, approval enforcement, access control and audit history are deferred to ASP.NET Core/PostgreSQL integration.

## Completed: Phase 2.13 — IT Asset Management
- Added searchable asset inventory with category, status, and department filters.
- Added asset registration/editing with asset-tag uniqueness validation.
- Added asset detail profile with assignment, condition, purchase, warranty, and location data.
- Added demo assignment, return, repair referral/completion, and maintenance history actions.
- Added warranty/repair attention list, inventory metrics, and CSV export.
- Activated `/assets` route, sidebar navigation, and command-palette entry.
- Added responsive RTL styling.

All asset records and actions remain local demo state until backend integration. Scheduled warranty notifications, audit trails, durable maintenance records, and real employee/department validation require ASP.NET Core and PostgreSQL.


## Completed: Phase 2.13 — IT Asset Management
- Added asset inventory for laptops, desktops, monitors, printers, network devices and mobile devices.
- Added asset identifiers, serial numbers, ownership, department, purchase value, warranty and location fields.
- Added create/edit, search, category/status/department filters and CSV export.
- Added assignment to an employee, return to stock, repair intake/completion and maintenance history.
- Added warranty attention panel, asset details and responsive RTL presentation.
- All asset data is mock/in-memory and requires backend persistence and authorization.

## Completed: Phase 2.14 — Contracts & Suppliers
- Added contract directory with search, status/type filters and CSV export.
- Added contract details including supplier, amount, dates, payment terms, owner, renewal notice, linked asset tags and attachment name.
- Added create/edit, renewal draft and cancel/reactivate interactions.
- Added supplier directory with create/edit, contact details, category, status and rating.
- Added renewal attention panel, top supplier summary, responsive RTL styling.
- Added `/contracts` route, sidebar navigation, quick command and page title.
- Contract and supplier data remain mock/in-memory; real document uploads, reminders, approval workflows, audit trail and persistence require backend integration.


## فاز ۲.۱۵ — مدیریت خرید و سفارشات (Procurement Management)
- ثبت و جستجوی درخواست‌های خرید با دسته‌بندی، تعداد، اولویت، موعد، برآورد هزینه و توجیه نیاز
- شبیه‌سازی تأیید و رد درخواست‌ها و تبدیل درخواست تأییدشده به سفارش خرید
- مقایسه پیشنهاد تأمین‌کنندگان بر اساس قیمت، زمان تحویل، ضمانت و امتیاز
- صدور سفارش خرید و پیوند با درخواست و قرارداد مرتبط
- ثبت رسیدهای تحویل، تحویل جزئی/کامل و کنترل مقدار دریافتی
- داشبورد هزینه خرید و نمایش مصرف بودجه
- خروجی CSV درخواست‌های خرید و طراحی واکنش‌گرا با پشتیبانی RTL
- داده‌ها در این فاز نمونه و در حافظه نشست هستند؛ اتصال پایدار، کنترل دسترسی، گردش‌کار واقعی، پیوست‌ها و حسابرسی به فاز بک‌اند موکول است.


## فاز ۲.۱۶ — مدیریت انبار و موجودی (Inventory & Warehouse Management)
- افزودن فهرست کالاها با SKU یکتا، دسته‌بندی، واحد، بهای واحد، تأمین‌کننده و حداقل موجودی
- تعریف چند انبار و نمایش موجودی تفکیکی هر کالا در هر انبار
- ثبت عملیات ورود، خروج و انتقال بین انبارها با اعتبارسنجی موجودی مبدأ
- دفتر گردش موجودی با شماره سند، نوع عملیات، تاریخ، مرجع و ثبت‌کننده
- هشدار اقلام ناموجود یا زیر حداقل موجودی و نمایش شاخص‌های موجودی
- مشاهده کارت انبارها و تعداد اقلام و موجودی هر انبار
- جستجو، فیلتر، خروجی CSV و رابط کاربری واکنش‌گرا و RTL
- داده‌ها در این فاز نمونه و در حافظه نشست هستند؛ انبارگردانی، رزرو، بارکد، مجوزها، حسابرسی و یکپارچگی پایدار با خرید و دارایی‌ها به فاز بک‌اند موکول است.


## فاز ۲.۱۷ — مدیریت تعمیرات و نگهداری (Maintenance Management)
- ثبت و ویرایش دستورکار تعمیرات با نوع، اولویت، دارایی، شرح خرابی، موعد و وضعیت
- تخصیص تکنسین و تیم تعمیرات و ثبت نتیجه، قطعات مصرفی و هزینه نیروی کار/قطعات
- تعریف برنامه نگهداری پیشگیرانه با تناوب، آخرین/موعد بعدی سرویس و چک‌لیست
- فعال‌سازی/توقف برنامه و ثبت انجام سرویس و محاسبه موعد دوره بعد
- هشدار برنامه‌های سررسیدشده، شاخص‌های دستورکار و هزینه تعمیرات
- تاریخچه فنی عملیات و خروجی CSV دستورکارها
- رابط کاربری واکنش‌گرا و RTL و مسیر `/maintenance`
- داده‌ها در این فاز نمونه و در حافظه نشست هستند؛ اتصال پایدار به دارایی و انبار، اعلان‌ها، تقویم شمسی کامل، مجوزها و حسابرسی در فاز بک‌اند تکمیل می‌شود.


## فاز ۲.۱۸ — مدیریت مالی و هزینه‌ها (Finance & Expense Management)
- دفتر هزینه‌های سازمان با ثبت/ویرایش سند، دسته‌بندی، واحد، مرکز هزینه، تأمین‌کننده، مرجع و وضعیت پرداخت
- ثبت پرداخت هزینه و همگام‌سازی نمایشی وضعیت فاکتور مرتبط
- فهرست فاکتورها، سررسیدها و ثبت تسویه
- تعریف بودجه دوره‌ای برای واحدها و مراکز هزینه و محاسبه مصرف/مانده
- داشبورد شاخص‌های مالی، ترکیب هزینه بر اساس دسته و تحلیل انحراف بودجه
- جستجو، فیلتر، خروجی CSV و رابط کاربری واکنش‌گرا و RTL
- مسیر `/finance`، منوی کناری و فرمان سریع
- داده‌ها در این فاز نمونه و در حافظه نشست هستند؛ اتصال واقعی به خرید، قرارداد، تعمیرات، تأیید مالی، اسناد، مالیات، چندارزی و دفتر کل در فاز بک‌اند ASP.NET Core و PostgreSQL تکمیل می‌شود.


## Phase 2.19 — Human Resources Management
- Employee profiles and personnel records
- Attendance and working-hours dashboard
- Leave request workflow
- Shift management
- Mission/travel management
- CSV export and responsive RTL UI
- Frontend mock/in-memory data; backend persistence and payroll integration deferred


## Phase 2.20 — Payroll Management
- Monthly payroll calculation and employee payroll records
- Base salary, housing, food, overtime, bonuses and deductions
- Tax and insurance tracking
- Payroll status workflow: draft, calculated, paid
- Payslip preparation and CSV export
- Responsive RTL UI with mock/in-memory data
- Real payroll rules, tax/billing integrations and ASP.NET/PostgreSQL persistence deferred to backend


## Phase 2.21 — Contract & Vendor Management
- Contract lifecycle and renewal alerts
- Vendor directory and performance score
- Purchase orders and delivery tracking
- Tender / RFQ management
- Contract and procurement CSV export
- Responsive RTL UI with mock/in-memory data
- Backend persistence, approval workflows, document storage and notifications deferred to ASP.NET Core/PostgreSQL

## Phase 2.22 — Document Management & Organizational Archive
- Document dashboard and archive metrics
- Category/folder navigation
- Search, status, owner and category filters
- Document metadata CRUD
- Mock upload/versioning workflow
- Approval states and lifecycle actions
- Tags and linked business entities
- Expiration alerts
- Version history
- CSV export
- Responsive RTL UI
- Backend persistence, real file storage, granular permissions and audit trail remain deferred to backend phases

## Phase 2.23 — Knowledge Base & Self-Service
- Knowledge articles and FAQ management
- Category navigation and advanced search
- Draft / pending / published / archived lifecycle
- Article approval and publishing
- Tags and linked modules
- Version history
- Article views and helpfulness feedback
- Featured content and top-article insights
- CSV export
- Responsive RTL UI
- Backend search/recommendation, permissions, persistence and ticket-time article suggestions remain deferred to backend phases

## Phase 2.24 — Survey & Customer Satisfaction
- CSAT, NPS and CES survey concepts
- Survey management with draft / active / closed lifecycle
- Configurable survey questions and triggers
- Response overview and sample feedback records
- Satisfaction and NPS analytics
- Team-level satisfaction comparison
- Response CSV export
- Responsive RTL UI
- Automated ticket-close triggers, real response collection, time-series analytics and backend persistence remain deferred to backend phases

## Phase 2.25 — Notification Center
- Unified in-app notification inbox
- Read / unread states and bulk mark-as-read
- Notification categories and priority levels
- Search and filtering
- Archive, restore and delete actions
- Notification detail panel
- Message template management
- Per-category in-app and email preferences
- Responsive RTL UI
- Real-time delivery, email/SMS providers, persistence, user-level policy enforcement and audit history remain deferred to backend phases


## Phase 2.26 — Advanced Reporting & Analytics
- Management KPI dashboard for ticket volume, resolution, SLA and satisfaction
- Report builder filters for period, team, priority and ticket status
- Ticket volume trend visualization (opened vs. resolved)
- Dedicated SLA, customer satisfaction and category analysis views
- Team and agent performance comparison tables
- CSV export for report data
- Scheduled report configuration UI with daily, weekly and monthly cadence
- Responsive RTL interface and quick navigation integration
- Current datasets and scheduled delivery are demonstrative/in-memory; live analytics queries, real email delivery, XLSX/PDF generation and persistent schedules are deferred to backend/integration phases


## Phase 2.27 — Advanced System Settings
- Organization profile, support contact and portal access settings
- Brand identity controls with primary/accent colors and live preview
- Locale configuration for language, timezone, calendar, date/time and currency
- Security policy interface for passwords, sessions, lockout, MFA, SSO and IP restrictions
- Notification channels and event-level preferences, including quiet hours
- SMTP, SMS and outbound webhook configuration interface
- Workflow defaults for assignment, reopening, auto-close and escalation
- Responsive RTL settings center with categorized navigation
- Settings are currently in-memory demonstration state; server-side persistence, secrets vault, effective policy enforcement and provider connectivity are deferred to backend integration


## Phase 2.28 — Audit Log & Activity Tracking
- Centralized activity timeline for ticket, user, security, settings, document and workflow events
- Event severity levels and event-source classification
- Search by event, user, target, identifier and IP address
- Filters for event category, severity and actor
- Detailed event inspector with actor, role, target, timestamp, IP and before/after changes
- CSV export of filtered audit events
- Security guidance for server-side immutable audit trails
- Responsive RTL interface and navigation integration
- Current entries are sample in-memory frontend data; durable server-side logging, tamper resistance, UTC timestamps, correlation IDs, retention and access policies are deferred to backend


## Phase 2.29 — API Management & Integrations
- API key inventory with scopes, activation and revocation controls
- Webhook registry with event subscriptions, test action and delivery health indicators
- Integration catalog for identity, collaboration, ERP, development and storage services
- API request log table with HTTP methods, status codes, latency and source IP
- Developer quick-start sample and API endpoint reference
- Responsive RTL interface and navigation/command-palette integration
- All credentials, requests, integrations and webhook operations are frontend demonstration data; production token issuance, secret hashing/vaulting, request proxying, webhook signing/retries, rate limiting and live provider connections require backend services


## فاز ۲.۳۰ — پورتال خدمات کاربران و خودخدمتی (Customer & Employee Self-Service Portal)
- داشبورد شخصی کاربر با خلاصه درخواست‌های باز، منتظر پاسخ و حل‌شده
- ثبت تیکت جدید با دسته‌بندی، اولویت و شرح درخواست
- مشاهده فهرست درخواست‌ها، جستجو و فیلتر وضعیت
- نمایش جزئیات تیکت و گفت‌وگوی رفت‌وبرگشتی با کارشناسان
- ثبت پاسخ کاربر و انتخاب فایل پیوست در رابط کاربری (نمایش نام فایل؛ بارگذاری واقعی در بک‌اند)
- کاتالوگ خدمات سازمان و ثبت درخواست خدمت
- نمایش راهنماهای منتخب پایگاه دانش
- مشاهده و ویرایش اطلاعات پروفایل کاربر
- ثبت امتیاز رضایت برای درخواست‌های حل‌شده
- مسیر `/portal`، منوی کناری، فرمان سریع و طراحی واکنش‌گرا با پشتیبانی RTL
- تمام داده‌ها در این فاز نمونه و در حافظه نشست هستند؛ احراز هویت واقعی، جداسازی داده بر اساس کاربر، ذخیره‌سازی، بارگذاری امن فایل، اعلان‌ها و اتصال API در فاز بک‌اند پیاده‌سازی می‌شوند.


## فاز ۲.۳۱ — مدیریت چندسازمانی و چندمستاجری (Multi-Tenant Management)
- فهرست سازمان‌ها با جستجو، فیلتر وضعیت و خروجی CSV
- ایجاد، ویرایش و مشاهده جزئیات سازمان با شناسه یکتا، دامنه، طرح اشتراک، مدیر و منطقه استقرار
- فعال‌سازی و تعلیق نمایشی سازمان‌ها و انتخاب فضای کاری فعال
- مدیریت نگاشت دامنه‌ها و زیردامنه‌ها با وضعیت تأیید مالکیت و SSL
- نمایش طرح‌های Starter، Professional و Enterprise و تعداد سازمان‌های هر طرح
- تنظیمات نمایشی سیاست‌های پلتفرم شامل مدل جداسازی داده، طرح پیش‌فرض، دوره آزمایشی، MFA و تأیید ثبت‌نام
- ثبت اصول معماری Tenant Context، Data Isolation و Tenant-aware Audit برای فاز بک‌اند
- مسیر `/tenants`، منوی کناری، فرمان سریع و رابط واکنش‌گرا و RTL
- داده‌ها در این فاز نمونه و در حافظه نشست هستند؛ جداسازی واقعی داده‌ها، تعیین Tenant از هویت معتبر، محدودسازی دسترسی، provisioning، DNS/TLS، پرداخت و اعمال سهمیه‌ها در بک‌اند ASP.NET Core و PostgreSQL پیاده‌سازی خواهند شد.


## فاز ۲.۳۲ — مدیریت اشتراک‌ها و صورتحساب SaaS (Subscription & Billing Management)
- داشبورد درآمد وصول‌شده، MRR تخمینی، مطالبات باز و تعداد اشتراک‌های فعال
- فهرست اشتراک‌های سازمان‌ها با جستجو، فیلتر وضعیت و مشاهده جزئیات
- عملیات نمایشی ارتقا/تغییر پلن، فعال‌سازی، تمدید آزمایشی و لغو اشتراک
- مدیریت تعرفه‌های Starter، Professional و Enterprise و نمایش سهمیه‌های هر پلن
- صدور فاکتور، ثبت پرداخت دستی و مشاهده تاریخچه فاکتورها
- فهرست تراکنش‌ها و خروجی CSV فاکتورها
- پایش مصرف کاربران، فضای ذخیره‌سازی و تعداد تیکت‌ها در برابر سهمیه
- مسیر `/billing`، منوی کناری، فرمان سریع و طراحی واکنش‌گرا و RTL
- تمام داده‌ها و عملیات در این فاز نمونه و در حافظه فرانت‌اند هستند؛ درگاه پرداخت، تمدید خودکار، محاسبه مالیات، تخفیف، ارز، صدور سند رسمی، سهمیه‌بندی واقعی و اتصال به Tenant در بک‌اند ASP.NET Core و PostgreSQL انجام خواهد شد.


## Phase 2.72 — AI Observability & Evaluation Center
- AI execution telemetry
- Golden-dataset evaluation
- Groundedness and safety quality gates
- AI cost/latency/confidence monitoring
- Human-review routing foundation


## Phase 2.74 — AI Incident Command Center
- AI incident register and lifecycle
- Evidence chain and human review
- Containment and post-incident learning foundation


## Phase 2.75 — AI Governance & Compliance Center
- Regulatory readiness mapping
- AI control library and evidence coverage
- Governance accountability and auditability foundation

- **Phase 2.76 — AI Trust & Transparency Center**: explainability, provenance, model cards, fairness signals, and user-facing AI disclosure.

- **Phase 2.77 — AI Audit & Evidence Center**: evidence registry, audit trail, integrity, retention and audit-ready evidence packages.

- **Phase 2.78 — AI Observability & Operations Center**: runtime telemetry, model health, latency, reliability, cost, alerts, routing and drift signals.
