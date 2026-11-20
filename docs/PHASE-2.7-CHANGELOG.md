# Phase 2.7 – Teams & Departments

## Added
- Organization workspace at `/organization`.
- Team directory with search, department/status filters, lead, member stack, and capacity meter.
- Department directory with manager, code, status, team/member metrics, and quick filtering into its teams.
- Organization hierarchy view that updates from the local department/team data.
- Create and edit dialogs for teams and departments with required fields and duplicate-code validation.
- CSV export for organization records.
- Responsive layouts for desktop, tablet, and mobile.
- Sidebar navigation, command palette entry, page title, and route integration.

## Notes
- Data is mock/local frontend state. Changes reset on reload.
- Authorization, persistence, audit history, and real member assignment will be implemented after frontend completion in the ASP.NET Core/PostgreSQL backend phase.
