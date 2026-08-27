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

Confirmed 2026-08-27 against a live fetch of the `travel-insurance-carbon`
node (fileKey `Vnzztyo2jJgzLefU8ioqJ2`, node `11156:45588` — see note in
"Next steps" about this being the wrong feature name; the *rules* below
are still valid, they're just derived from insurance-wizard output, not
Mortgage Calculator output).

> **Spacing** — confirmed 2026-08-27: `get_variable_defs` on this node
> returned zero spacing/space-scale tokens (only color and typography
> variables came back). Coordinate math on `get_metadata` (x/y/width/
> height deltas between siblings) was the *only* source of spacing info
> available, and it matched the rendered screenshot layout exactly (e.g.
> sidebar `sidebar-header` at x=24,y=40 inside a 300×800 sidebar frame →
> 24px/40px padding; `step-2` starts at y=60 right after `step-1`'s
> y=0+height=36 → 24px gap). Always use coordinate math for spacing;
> don't expect `get_variable_defs` to carry spacing tokens at all.

> **Component tag identification** — confirmed 2026-08-27 against
> `@carbon/web-components@2.61.0` installed in `node_modules` (grepped
> compiled `es/components/*/**.js` for `cds-*` custom element tags, not
> guessed from memory). Rule: **take the Figma instance/component name,
> split off anything after the first `" - "` (variant descriptors live
> there, not in the base name), lowercase, kebab-case, prefix `cds-`.**
> Verified mappings:
> - `Link` → `cds-link`
> - `Button` → `cds-button`
> - `Radio button group` → `cds-radio-button-group`
> - `Radio button` → `cds-radio-button`
> - `Accordion item` → `cds-accordion-item` (needs a `cds-accordion`
>   wrapper — the wrapper itself wasn't a separate node in this fetch,
>   infer it when assembling multiple `Accordion item`s)
> - `Date picker - Single calendar - Default` → `cds-date-picker`
>   (wrapping a `cds-date-picker-input`) — the `" - Single calendar -
>   Default"` suffix is variant info, dropped per the split rule above.
>   This is the "composite name" case: don't kebab-case the *whole*
>   string.
> Known exception groups not yet re-checked live: Data table, Tag
> sub-types (carried over from HANDOVER.md's prior framing — unverified
> this session, don't trust until checked).

> **Font family sourcing** — confirmed 2026-08-27: `get_design_context`'s
> inline Tailwind font classes (`IBM_Plex_Sans:Regular`,
> `IBM_Plex_Sans:SemiBold`) cross-checked cleanly against
> `get_variable_defs` (`Fixed/Body/Font family` → "IBM Plex Sans"). One
> real divergence caught: the date-picker placeholder text
> (`DD-MM-YYYY`) is styled with the *code* utility style, not body —
> `get_variable_defs`'s `Fixed/Utility/Code 01 + 02/Font family` is "IBM
> Plex Mono", distinct from the rest of the UI. Rule: don't assume one
> font family for the whole screen — cross-check `get_design_context`'s
> per-element font claim against `get_variable_defs`, because utility/
> code text can silently differ from body text.

> **Caching** — confirmed 2026-08-27: `.cache/` existed but was empty
> before this session (no prior fetch had been cached despite the
> strategy being documented). Populated it this session with the
> screenshot PNG, a metadata XML dump, and a variable-defs JSON dump,
> each prefixed with the Figma node name + id so multiple fetches don't
> collide. Rule confirmed workable: fetch, then immediately write raw
> output to `.cache/<node-name>_<node-id>_<kind>.<ext>` before doing
> anything else with it.

## Figma write (`use_figma`) gotchas

Confirmed 2026-08-27 building the "Personal details" (step 3) screen at
node `182845:337` from scratch via `use_figma`, reusing component
instances cloned from the step-2 `travel-insurance-carbon` screen:

> **`figma.createAutoLayout()` defaults to an opaque white fill.**
> Any auto-layout frame you create that isn't meant to have its own
> background (label groups, text columns, row wrappers) must have
> `fills = []` set explicitly — otherwise it silently paints white over
> whatever sits behind it. This is easy to miss because white text on a
> white default fill just renders as a blank block, not an error.

> **A cloned instance can silently ignore `SPACE_BETWEEN`/alignment
> from its new auto-layout parent** if its source position came from a
> non-auto-layout (manually-positioned) wrapper in the original file —
> even though `layoutPositioning` reads back as `"AUTO"` and every
> layout property looks correct. Don't trust the property getters here;
> screenshot and check actual rendered positions. Fix: set
> `layoutPositioning = "ABSOLUTE"` on the clone and compute `x`/`y`
> explicitly (`parentWidth - childWidth`, etc.) rather than fighting the
> auto-layout engine.

> **Prefer cloning a known-good on-canvas instance over
> `importComponentSetByKeyAsync` + `createInstance()`** when an
> equivalent instance already exists in the file. One component's set
> key (`Button`, `c18d5e044ac8009d54acde127439032acdc73428`) failed to
> import by key with "Component set ... not found" for no clear reason,
> while resolving the same set via an existing instance's
> `mainComponent.parent` and cloning that instance worked immediately.
> Cloning also carries over correct icon/text nesting for free.

> **Text input component text-override keys** (set = `Style=Default,
> Size=Large, State=Enabled, Text filled=False`, key
> `601d9b8b345f853644185e6df00d270da4ca697a`): `"Label text#107318:0"`,
> `"Placeholder text#15785:0"`, `"Input text#15785:31"` (only visible
> when the `Text filled` variant prop is `True`), `"Show helper#11008:1264"` (boolean, defaults `true` — set `false` to hide the helper row).

## `.cache/` strategy

`.cache/` is gitignored. It holds raw, disposable/regenerable fetch
output from Figma MCP sessions — screenshots, metadata dumps, design
token exports. If it's missing or stale, re-fetch; nothing here is
authoritative on its own. (`CLAUDE.md` and `carbon-figma-map.md` are the
authoritative, committed artifacts — this is just working material.)

## Next steps / prompts remaining

Running list of concrete next actions. Clear items as they're done;
add new ones as they come up.

1. ~~Run first Figma MCP session against the Mortgage Calculator
   design~~ — **done 2026-08-27, but flagging a naming mismatch:** the
   Figma URL provided (`node-id=11156-45588`) resolves to a node named
   `travel-insurance-carbon` — an "Insurance Wizard" flow ("Customize
   your coverage" / travel insurance, step 2 of 4), not a Mortgage
   Calculator. No Mortgage Calculator node was located or fetched this
   session. The Rules section above was filled in from this real fetch
   and is sound regardless (tag ID, spacing, fonts, caching are feature-
   agnostic), but item 2 below needs a decision: build out this
   insurance wizard, or track down the actual Mortgage Calculator node
   and re-fetch.
2. ~~Build it in the Vite project using `@carbon/web-components`~~ —
   **done 2026-08-27.** User chose to build the insurance wizard step
   (not chase down a Mortgage Calculator node). `src/main.js` renders
   the "Customize your coverage" screen with `cds-link`, `cds-button`,
   `cds-radio-button-group`/`cds-radio-button`,
   `cds-accordion`/`cds-accordion-item`,
   `cds-date-picker`/`cds-date-picker-input`. Icons come from
   `@carbon/icons` + `@carbon/icon-helpers` (added as explicit deps —
   they were already transitive, but now imported directly), converted
   to slotted SVG via `toString()`. Fonts via Google Fonts link in
   `index.html` (IBM Plex Sans + IBM Plex Mono). Verified pixel-close
   against the Figma screenshot by running the dev server and
   screenshotting in a real browser — not just eyeballing code.
   Remaining gap: only step 2 of the 4-step wizard is built; steps
   1/3/4 ("Select Insurance", "Personal details", "Review & pay") were
   never fetched from Figma and don't exist as nodes we've seen.

## Explicitly out of scope

Setting up real Code Connect (Org/Enterprise-gated). Any connection to
other design-system work outside this project — this is standalone.
