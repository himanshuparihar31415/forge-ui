# Forge UI

React + TypeScript implementation of the **Forge** pilot — an AI-powered product development lifecycle platform UI (24 screens + application shell), built with Vite.

## What's inside

- **Shell** ([src/App.tsx](src/App.tsx)) — top bar (global search, workflow run counters, approval bell, persona switcher), collapsible left nav (verticals, platform, entry flows), persona-based access control with read-only banner, and the global Session Inspector slide-over.
- **Entry flows** — S01 Sign-in (LPL SSO + unmapped-role error state), S02 three-step onboarding.
- **Command Center** (S03) — needs-my-action cards, exit-criteria KPIs with sparklines, workflow operations, persona-entry coverage grid, live sessions table with filters, spend/health/capacity rails.
- **SpecAI** — S04 New Session wizard, S05 Brief Intake with blocking/soft ambiguity flags, S06 Review Workspace (highlight-synced brief, diff toggle, review timer, chat-rewrite drawer), S07 Approval & Publish (HITL gate).
- **ProtoAI / DesignAI** — S08 Research Q&A with hover-linked citations, S09 Research Packs.
- **Architect Hub** — S10 Conformance Run (animated run phases), S11 Findings Review (accept / adjust severity / dismiss → publish gate).
- **CodeIQ** — S12 Task Board (kanban + IDE command palette), S13 Scaffolding Review (file tree, code viewer with FORGE-STUB highlighting, draft-PR flow).
- **IntelliQA** — S14 Test Generation (coverage gaps, scripts, regression suggestions), S15 Traceability Matrix.
- **ReleasePulse** — S16 Release Readiness (checklist, release-notes generation, blocked sign-off gate).
- **Platform** — S17 Workflow Lanes, S18 Handoff (compose → sent → accepted), S19 Agent Registry, S20 Observability (traces / health / cost / capacity), S21 Governance & Audit (audit timeline, gate policy, analytics, OPA bundles), S22 Evaluation (datasets, eval runs, promotion pipeline), S23 Settings, S24 Approval Queue.

All data is mock data ported from the original design prototype. Persona switching (top-right menu) drives the access envelope: e.g., switching to *Maya Chen (UX)* makes the SpecAI screens read-only with an audit banner.

## Run it

```sh
npm install
npm run dev       # dev server
npm run build     # type-check (strict) + production build
npm run preview   # serve the production build
```

> Note: on this machine Node.js was installed user-scope via winget at
> `%LOCALAPPDATA%\Microsoft\WinGet\Packages\OpenJS.NodeJS.LTS_…\node-v24.16.0-win-x64`.
> Open a **new** terminal (so PATH refreshes) or add that folder to PATH before running npm.

## Conventions

- Inline styles ported 1:1 from the design components; shared font stacks live in [src/ui.ts](src/ui.ts).
- Hover states use utility classes in [src/styles.css](src/styles.css) (`.hvr-*`), since inline styles can't express `:hover`.
- Screen-to-screen navigation is plain state in the shell (`screen: 's1'…'s24'`) — no router dependency, matching the prototype's behavior.
