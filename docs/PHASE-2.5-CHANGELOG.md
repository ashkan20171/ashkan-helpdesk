# Phase 2.5 — Authentication UI

## Delivered
- Added a standalone Angular authentication feature with route-driven modes.
- Added login, registration, forgot-password, reset-password, and invitation acceptance screens.
- Added responsive split-screen visual design and mobile layout.
- Added password visibility toggle, password strength indicator, basic client-side validation, and inline feedback.
- Added dedicated authentication routes and an application-shell switch so auth pages render without the admin sidebar/header.
- Kept all authentication actions explicitly in demo mode; no credentials are sent, no session is established, and no email is sent until the ASP.NET Core backend is implemented.

## Routes
- `/auth/login`
- `/auth/register`
- `/auth/forgot-password`
- `/auth/reset-password`
- `/auth/invite/:token`

## Validation
- `baseUrl` remains removed from TypeScript configuration.
- Package version updated to `0.6.0`.
- ZIP structure and JSON configuration are checked during packaging.
- Angular production build is not confirmed in this environment because `npm install` did not complete before timeout. Run `npm install`, `npm run build`, then `ng serve` locally.

## Backend integration still required
- ASP.NET Core Identity / custom authentication API
- Password hashing and credential verification on the server
- Refresh-token rotation, revocation, secure cookie/session policy
- Email delivery and one-time password reset tokens
- Invitation token verification and expiry
- Server-side authorization and rate limiting
