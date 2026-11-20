# Phase 2.13 — IT Asset Management

- Added an asset inventory with search and category, status, and department filters.
- Added asset create/edit form with duplicate asset-tag validation.
- Added asset profile panel with assignment, physical condition, purchase, warranty, and location details.
- Added demo assignment, return-to-stock, repair referral, repair completion, and maintenance-history interactions.
- Added warranty/repair attention panel, inventory KPIs, and CSV export.
- Added `/assets` route, sidebar navigation, and command-palette entry.
- Added responsive RTL styling for desktop, tablet, and mobile layouts.

All records and actions use local in-memory demo state. Durable asset records, employee directory integration, warranty notifications, approval flows, audit logs, and role-based authorization are deferred to ASP.NET Core API and PostgreSQL integration.
