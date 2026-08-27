# CLAUDE.md — ibm-ds

Working ruleset for this project. See `HANDOVER.md` for the original
project framing. This file starts intentionally thin: rules get added
here only after being verified against real Figma MCP output in a live
session — nothing here is backfilled from memory or assumption.

## What this project is

Design → code exercise: a feature is designed in Figma using **First
Draft** (Figma's AI design generation) against the **IBM Carbon** v11
Figma library. We then pull that design via **Figma MCP** and hand-code
it with **`@carbon/web-components`** (Lit-based), deliberately without
Code Connect (requires an Org/Enterprise + Dev/Full seat we don't have).

## Figma MCP setup & detection

This project depends on the official Figma MCP plugin. It is **not**
guaranteed to be available in any given session — check before assuming
it's there.

**How to check:** search for Figma MCP tools (e.g.
`ToolSearch("figma", ...)` or equivalent). If nothing comes back, the
plugin either isn't installed or isn't authorized in this session — do
not proceed with Figma fetches until it's resolved.

**Setup (must be done in an interactive session — OAuth cannot complete
headless/non-interactively):**
```bash
claude plugin install figma@claude-plugins-official
```
Then run `/mcp` and complete authorization.

If a session reports MCP auth failing but the plugin is installed, it's
likely running non-interactively (headless/`-p` mode can't complete
OAuth) — switch to an interactive session and run `/mcp` again.

## Rules

*(empty — nothing has been verified against live Figma MCP output yet)*

Rules get added here only once confirmed against actual MCP output in a
session, with a short note on what was checked and when. Example of the
target format once populated:

> **Spacing** — confirmed 2026-08-27: coordinate math on `get_metadata`
> matched the rendered layout; `get_variable_defs` spacing values did
> not. Use coordinate math, not variable defs, for spacing.

Categories we expect to eventually fill in here (do not pre-fill with
guesses):
- Spacing (coordinate math vs. `get_variable_defs`)
- Component tag identification (which MCP output maps to which
  `@carbon/web-components` tag)
- Font family sourcing
- Caching behavior in practice

## `.cache/` strategy

`.cache/` is gitignored. It holds raw, disposable/regenerable fetch
output from Figma MCP sessions — screenshots, metadata dumps, design
token exports. If it's missing or stale, re-fetch; nothing here is
authoritative on its own. (`CLAUDE.md` and `carbon-figma-map.md` are the
authoritative, committed artifacts — this is just working material.)

## Next steps / prompts remaining

Running list of concrete next actions. Clear items as they're done;
add new ones as they come up.

1. **Run first Figma MCP session against the Mortgage Calculator
   design** (already built in Figma via First Draft). Goals for that
   session:
   - Confirm Figma MCP tools are available (see Setup & detection above)
   - Fetch metadata / screenshots / variable defs for the design
   - Start filling in the Rules section above and
     `carbon-figma-map.md`, based only on what's actually observed
   - Do **not** start coding the feature in this pass — fetch and rule
     discovery only
2. Once rules exist, plan and build the Mortgage Calculator feature in
   the Vite project using `@carbon/web-components`.

## Explicitly out of scope

Setting up real Code Connect (Org/Enterprise-gated). Any connection to
other design-system work outside this project — this is standalone.
