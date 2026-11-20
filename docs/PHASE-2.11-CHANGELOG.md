# Phase 2.11 — Workflow Management

## Delivered
- Workflow directory with keyword search and status filtering.
- Summary metrics for total, active, executed and approval-enabled workflows.
- Workflow detail preview with ordered stages and execution metadata.
- Create/edit workflow dialog with trigger, owner department, execution condition, description, auto-assignment and status.
- Dynamic stage editor: add/remove stages, set responsible role, approval requirement and stage time limit.
- Duplicate-code and required-field validation.
- Activate/deactivate controls and CSV export.
- Route, sidebar navigation, command-palette entry and page-title integration.
- Responsive Persian RTL styling.

## Demo-data boundary
This phase is frontend-only. Workflow definitions and run counts are local in-memory demo data. Runtime rule evaluation, approval inboxes, immutable audit history, retries, escalation, and event integration with tickets and service requests are deferred to the ASP.NET Core backend phase.
