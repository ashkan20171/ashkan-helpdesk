# Ashkan HelpDesk — Phase 2.4

## Dashboard & Role-Based Workspaces

- Rebuilt the dashboard as an operational overview with KPI cards, ticket trends, SLA visualization, recent tickets, team performance, urgent attention items, and quick actions.
- Added interactive demo role switching for System Administrator, Support Manager, Team Lead, Support Agent, and Customer.
- Added 7/30/90-day reporting period selection and period-aware chart paths and metrics.
- Added role-aware dashboard copy, KPIs, SLA summaries, ticket presentation, and customer quick-help links.
- Added responsive layouts and dark-theme styling for the dashboard.
- Added explicit notice that the dashboard uses mock data and that real authorization/data integration belongs to the backend phase.

## Notes

All dashboard data is demonstration data. Role switching is a frontend preview only and is not a security boundary. Actual role claims, filtering, authorization, and reporting must be enforced by ASP.NET Core APIs in the backend phase.
