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
A Mortgage Calculator feature is running on `localhost:3000`. It was
built partly **before** the latest CLAUDE.md corrections landed
(coordinate-math spacing, the tag naming rule, caching). It has not yet
been audited against the current rules.

**Immediate next step — run this first:**
```
Audit the current implementation against the latest CLAUDE.md — some of
it was built before recent corrections to the fetch protocol, tag
identification, and caching rules.

Specifically check:
1. Spacing: was any spacing value sourced from get_variable_defs instead
   of coordinate math on get_metadata? Flag and recompute if so.
2. Component tags: does carbon-figma-map.md exist yet? If any component
   was identified without checking the cds- + kebab-case rule (or its
   Data table / Tag sub-type exceptions), verify it against the rule now.
3. Caching: is there a .cache/ directory with cached screenshots,
   metadata, and design tokens? If prior fetches weren't cached, no need
   to re-fetch retroactively — just confirm caching is now in place for
   future fetches.
4. Fonts: was font family ever taken from get_design_context's output
   rather than cross-checked against get_variable_defs?

Report what you find per item before changing anything. For anything
that's wrong per the current rules, fix it and note what changed.
```

## Open / unresolved
- Figma plan/seat tier on the account in use — never explicitly
  confirmed. Matters for MCP rate limits (Starter: 6 calls/month vs.
  Dev/Full on Pro+: ~200/day).
- Figma agent successfully redesigned one sketch using the Carbon
  library — validated once, not proven repeatable across feature types.
- Fidelity checking is still manual/visual — CLAUDE.md's Prompts
  remaining item 2 (Playwright + pixel-diff script) hasn't been run yet.
- IBM has official Code Connect set up for `@carbon/react` (CI-published
  from their design blog) — but that's React, not our Lit-based
  `@carbon/web-components`, and it's unconfirmed whether it's even
  visible outside IBM's internal Figma org. Not pursued further; noted
  here in case it becomes relevant later.

## Explicitly out of scope
Setting up real Code Connect (Org/Enterprise-gated). Any connection to
other design-system work in this workspace — this project is standalone.
