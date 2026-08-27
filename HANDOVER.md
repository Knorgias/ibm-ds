# Handover — Figma → Code automation project

You're picking this up mid-project. This doc gets you oriented; CLAUDE.md
(repo root) has the actual working rules and auto-loads each session —
don't duplicate its content in your head, just follow it.

## What this is
Learning project: design → code, consuming a real design system via
Figma MCP, deliberately **without Code Connect** (requires Org/Enterprise
+ Dev/Full seat — out of scope, account is on a lower tier). Standalone
exercise, not tied to any other project in this workspace.

## Stack
- **Design system:** IBM Carbon (v11 Figma library, official IBM-
  maintained) + `@carbon/web-components` (Lit-based, actively maintained).
- **Figma MCP:** remote server, connected via the official Figma plugin
  for Claude Code (`claude plugin install figma@claude-plugins-official`).
  Already authorized in this environment — if a session reports MCP
  auth failing, it's likely running non-interactively (headless/`-p`
  mode can't complete OAuth); switch to an interactive session and run
  `/mcp` to re-authorize.

## Key files
- **`CLAUDE.md`** — the actual ruleset: which tool to trust for what
  (component ID, variant/kind, spacing, fonts, slot mapping), the local
  `.cache/` strategy, the build approach (HTML/CSS reference → swap in
  real components), and a self-clearing "Prompts remaining" task queue.
  Check that queue at the start of any session.
- **`carbon-figma-map.md`** — cache of slot mappings and per-component
  Notes (events/attrs/gotchas) that have no rule-of-thumb shortcut.
  Narrower in scope than it used to be — tag identification is now
  mostly covered by a naming rule directly in CLAUDE.md, validated
  against Carbon's full tag list (with two known exception groups: Data
  table, Tag sub-types).
- **`.cache/`** — gitignored raw fetch cache (screenshots, metadata,
  design tokens). Disposable/regenerable, unlike the two files above.

## Current state
No Mortgage Calculator node was ever located in Figma — the node ID
originally provided (`11156:45588` in file `Vnzztyo2jJgzLefU8ioqJ2`)
turned out to belong to a **travel insurance wizard**
(`travel-insurance-carbon`), not a mortgage feature. Rather than chase
down a nonexistent node, the project pivoted (2026-08-27) to building
what's actually in Figma: step 2 of 4 of that wizard, "Customize your
coverage" — `cds-link`, `cds-button`,
`cds-radio-button-group`/`cds-radio-button`,
`cds-accordion`/`cds-accordion-item`,
`cds-date-picker`/`cds-date-picker-input`, icons via `@carbon/icons`.
Verified pixel-close against the Figma screenshot in a real browser, not
just by reading code. Run it with `npm install && npm run dev` (Vite's
default port, 5173 — not the `localhost:3000` this doc used to
reference).

**Gap:** only step 2 is built. Steps 1/3/4 ("Select Insurance",
"Personal details", "Review & pay") haven't been fetched from Figma and
their node IDs aren't known yet.

**Immediate next step:** check `CLAUDE.md`'s "Next steps / prompts
remaining" queue — that's the live source of truth, don't duplicate it
here. As of this writing it has no open item; the natural next one is
deciding whether to track down steps 1/3/4 of the wizard or call step 2
a sufficient exercise.

## Open / unresolved
- Figma plan/seat tier on the account in use — never explicitly
  confirmed. Matters for MCP rate limits (Starter: 6 calls/month vs.
  Dev/Full on Pro+: ~200/day).
- Figma agent successfully redesigned one sketch using the Carbon
  library — validated once, not proven repeatable across feature types.
- Fidelity checking is still manual/visual (screenshot + eyeball) —
  CLAUDE.md's earlier-mentioned Playwright + pixel-diff script idea
  hasn't been built.
- IBM has official Code Connect set up for `@carbon/react` (CI-published
  from their design blog) — but that's React, not our Lit-based
  `@carbon/web-components`, and it's unconfirmed whether it's even
  visible outside IBM's internal Figma org. Not pursued further; noted
  here in case it becomes relevant later.
- CLAUDE.md's tag-naming rule still carries two unverified exception
  groups (Data table, Tag sub-types) — neither has been checked against
  a live fetch yet. The rule has only been exercised on Link, Button,
  Radio button (group), Accordion item, and Date picker so far.

## Explicitly out of scope
Setting up real Code Connect (Org/Enterprise-gated). Any connection to
other design-system work in this workspace — this project is standalone.
