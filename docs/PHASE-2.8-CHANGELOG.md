# Phase 2.8 — Ticket Management

## Delivered
- Reworked the ticket workspace with KPI cards and role-friendly ticket tabs.
- Added searchable and combinable filters for status, priority, team, and text.
- Added table and Kanban views.
- Added ticket creation with client-side validation.
- Added ticket detail drawer with conversation history and reply composer.
- Added internal-note mode, status/priority updates, and bulk status actions.
- Added CSV export for the currently filtered ticket list.
- Added responsive layouts and dark-theme adaptations.

## Scope and limitations
- This phase uses in-memory sample data. Refreshing the browser resets changes.
- Authentication, authorization enforcement, file upload persistence, notifications, SLA calculations, and API integration remain for later phases/backend.
- The UI is not a security boundary; server-side authorization must be implemented before production use.

## Run
```bash
npm install
npm run build
ng serve
```
