# Phase 2.6 — Users, Roles & Permissions

## Delivered
- Added a standalone Users & Access Management feature at `/users`.
- Added mock user directory with search, role/status filters, user creation, editing, activation/deactivation and CSV export.
- Added role catalog cards for six sample roles.
- Added permission matrix grouped by Tickets, Organization and Reporting/Settings.
- Added local-only permission toggles with explicit demo messaging.
- Added responsive layouts, accessible dialog labels, RTL styling and dark-theme-friendly base surfaces.
- Connected the sidebar, page title and command palette to the new route.

## Important boundaries
- All records and permission changes are in-memory demo data. They are not persisted and do not enforce security.
- Actual authentication, authorization, tenant isolation and audit logging must be implemented and enforced by the ASP.NET Core backend in the backend phase.

## Verification
- ZIP archive structure and JSON configuration are checked during packaging.
- Run `npm install`, `npm run build` and `ng serve` locally to verify against the installed Angular toolchain.
