# Demo: Figma MCP round-trip (design → code → design)

What this demo shows: Figma MCP driving both directions of the
design/code loop on the same file, against a real (not mocked) Carbon
Design System library.

## 1. Design → code (`get_design_context` + friends)

Source: an Insurance Wizard screen ("Customize your coverage", step 2
of 4) built in Figma via First Draft against the IBM Carbon v11 Figma
library.

- `get_metadata` — cheap structural pass (node tree, x/y/w/h) to see
  what's on the frame before pulling the expensive stuff.
- `get_design_context` — the main pull: reference React/Tailwind code,
  a screenshot, component usage docs, and font/token hints for the
  target node. Treated as reference only, not pasted verbatim.
- `get_screenshot` / `get_variable_defs` — visual ground truth and the
  file's actual color/type tokens, used to cross-check the above rather
  than trust it blindly (e.g. caught that the date field uses a
  different font family than the rest of the screen).
- Cross-referenced Figma's component names against the real
  `@carbon/web-components` package in `node_modules` (grepped compiled
  JS for `cds-*` custom element tags) instead of guessing tag names
  from memory.

Output: `src/main.js` — a plain Lit/`@carbon/web-components` page
(`cds-link`, `cds-button`, `cds-radio-button-group`, `cds-accordion`,
`cds-date-picker`), with icons pulled from `@carbon/icons` +
`@carbon/icon-helpers` (real vector data, not hand-drawn SVGs) rather
than the short-lived Figma asset URLs. Verified by running the Vite dev
server and screenshotting it in an actual browser
(`claude-in-chrome`) — not just reading the code back.

## 2. Code → design (`use_figma`)

Task: design a "Personal details" step (step 3 of 4) directly in
Figma, onto an empty target frame, matching the step-2 screen's style.

- Inspected the *existing* step-2 screen via `use_figma` (walking its
  instances' `mainComponent.parent`) to get exact component keys for
  Link, Button, Date picker already in use — more reliable than
  `search_design_system` when a matching screen already exists in the
  file.
- `search_design_system` filled the one gap: a Text input component
  the step-2 screen didn't use.
- Built the new frame with `use_figma`: cloned the known-good Link /
  Button / Date picker instances from step 2 (inherits correct icon
  nesting for free), and created fresh Text input instances for the
  new fields (First/Last name, Email, Phone).
- Validated incrementally with `node.screenshot()` after each section
  instead of writing the whole screen blind, which caught two real
  bugs in the same session: `createAutoLayout()`'s default opaque
  white fill hiding white text, and a cloned instance silently
  ignoring its new parent's `SPACE_BETWEEN` alignment.

Output: a new "Personal details" frame in the same Figma file, built
from real design-system component instances (not drawn boxes),
ready to be pulled back through step 1's design-to-code path.

## Supporting pieces

- **Plugin setup**: `claude plugin install figma@claude-plugins-official`
  + `/mcp` to authorize (interactive-only, OAuth can't complete
  headless).
- **`.cache/`**: raw fetch dumps (screenshots, metadata, tokens) kept
  locally, gitignored — disposable, re-fetched on demand.
- **`CLAUDE.md` / `carbon-figma-map.md`**: rules and component-tag
  mappings, but only ever written after being confirmed against real
  MCP output in a live session — nothing backfilled from assumption.
