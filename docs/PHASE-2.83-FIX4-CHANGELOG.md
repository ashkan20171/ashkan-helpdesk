# Phase 2.83 Fix 4 — Sidebar/Lucide & App Shell

## Fixed
- Corrected sidebar selector to `ah-app-sidebar` so AppComponent can resolve the standalone component.
- Replaced direct Lucide component tags with the supported `lucide-icon [img]` pattern.
- Added the sidebar inputs/outputs expected by `AppComponent`: `collapsed`, `mobileOpen`, `toggleCollapsed`, `closeMobile`, and `toast`.
- Typed the toast output as `EventEmitter<string>` to resolve the `$event` type mismatch.
- Bound the app shell collapsed state into the sidebar.

## Verification
- ZIP integrity checked with Python `zipfile.testzip()`.
- Angular CLI build was not claimed or assumed.
