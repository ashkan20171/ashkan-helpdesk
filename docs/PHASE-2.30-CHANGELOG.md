# Phase 2.30 — Customer & Employee Self-Service Portal

## Delivered
- Personal service portal dashboard with open, waiting and resolved request metrics.
- Ticket creation with category, priority and description.
- Searchable request list and status filtering.
- Ticket detail view with support conversation and user replies.
- Attachment picker UX that records the selected filename only.
- Organization service catalog and service request submission flow.
- Featured knowledge-base article list.
- Editable user profile.
- Satisfaction rating for resolved tickets.
- `/portal` route, sidebar navigation, page title and command-palette entry.
- Responsive RTL layout.

## Implementation notes
- All records and actions are demo-only, in-memory state.
- File selection is a UI preview only; no file bytes are uploaded or persisted.
- Article reading currently shows a demo notice; full article routing will be connected to the knowledge-base service later.
- Real identity, user data isolation, API persistence, secure file storage, notifications and authorization are deferred to backend integration.
- Angular build was not run in this environment; dependency installation/build verification is still required.
