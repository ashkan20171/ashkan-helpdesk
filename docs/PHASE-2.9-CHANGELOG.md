# Phase 2.9 — Service Request Management

## Delivered
- Added a dedicated `/requests` route and Service Requests navigation entry.
- Added a service catalog with four sample service categories.
- Added request KPIs, status tabs, search, priority and department filters.
- Added a validated request creation modal.
- Added request details drawer with approval workflow preview.
- Added approve, reject and complete actions for local demo data.
- Added CSV export for the currently filtered request list.
- Added responsive layouts and RTL styling consistent with Ashkan Design System.

## Demo-only behavior
All data is in-memory mock data. Refreshing the browser resets changes. Approval and fulfillment actions are local UI demonstrations and are not authorization or workflow enforcement. These will be implemented and secured by the ASP.NET Core backend in the backend phase.

## Route
- `/requests`

## Validation
Archive integrity and source-level checks should be performed before release. A successful Angular production build must be confirmed in the user's local environment with `npm ci` and `npm run build`.
