# Demo: Figma AI → Production Code, Design-System-Faithful

## The pitch in one line
An AI-generated Figma design, built from the **real IBM Carbon
component library**, was pulled via **Figma MCP** and hand-coded into a
working, pixel-close UI with **`@carbon/web-components`** — no Code
Connect, no enterprise tier required.

## What we built
Step 2 of a travel-insurance wizard ("Customize your coverage"):
radio-button coverage options, expandable info accordions, a date
picker, nav/footer actions — running live via Vite, using genuine
Carbon web components (`cds-button`, `cds-radio-button-group`,
`cds-accordion-item`, `cds-date-picker`, `cds-link`).

## Why this is more than a mockup
- **Real components, not lookalikes.** The design lives inside the
  actual Carbon Design System v11 Figma Community file — every element
  is a true Figma *instance* of Carbon's own component definitions, not
  a redrawn approximation. Figma's own tooling confirms this: fetching
  the design returns official carbondesignsystem.com usage docs
  per-component, something that only happens for real library instances.
- **Verified, not assumed.** Every conversion rule (spacing, which
  Figma name maps to which `cds-` tag, font handling) was derived by
  inspecting actual fetched data and checked against the installed
  `@carbon/web-components` package — then confirmed again by rendering
  in a real browser and comparing to the Figma screenshot pixel-for-pixel.
- **No Code Connect needed.** This whole pipeline works on a design
  library that publishes real component metadata via MCP — proving the
  design-to-code gap can close without the enterprise-gated tooling.

## The pipeline
```
Figma First Draft (AI)  →  real Carbon v11 components in Figma
        ↓ Figma MCP (metadata, screenshots, variable defs)
Verified conversion rules (documented, re-checked live each time)
        ↓
Hand-coded @carbon/web-components, Vite dev build
        ↓
Pixel-compared against the Figma screenshot in a real browser
```

## What's next
Steps 1, 3, and 4 of the same wizard ("Select Insurance", "Personal
details", "Review & pay") are unbuilt — same pipeline, same rules,
ready to repeat.
