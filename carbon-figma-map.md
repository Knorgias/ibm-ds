# carbon-figma-map.md

Cache of slot mappings between Figma design output (via Figma MCP) and
`@carbon/web-components` tags, plus per-component notes (events, attrs,
gotchas) that don't reduce to a general rule-of-thumb in `CLAUDE.md`.

## Format

```
### <Figma component name>
- Tag: `<cds-... element>`
- Slots: <mapping notes>
- Notes: <events/attrs/gotchas specific to this component>
```

## Confirmed entries

Source: `travel-insurance-carbon` node (fileKey `Vnzztyo2jJgzLefU8ioqJ2`,
node `11156:45588`), fetched 2026-08-27. Tag names verified against
`@carbon/web-components@2.61.0` in `node_modules`, not guessed.

### Link
- Tag: `cds-link`
- Notes: used here as a standalone back-link with a leading chevron
  icon (no underline per Carbon docs — standalone links pair with an
  icon instead). Docs: https://www.carbondesignsystem.com/components/link/usage/

### Button
- Tag: `cds-button`
- Notes: two instances in this screen — an icon-only ghost/close button
  (top-right "Close") and a primary button with trailing icon
  ("Continue"). Docs: https://www.carbondesignsystem.com/components/button/usage

### Radio button group / Radio button
- Tag: `cds-radio-button-group` wrapping `cds-radio-button`
- Slots: group carries the question label ("Where will you travel?");
  each option is one `cds-radio-button` with a `value`/label
  ("Europe"/"World", "90 days"/"180 days" in this design).
- Notes: horizontal layout in both instances on this screen (direction
  is a variant switcher per Carbon docs). Docs: https://www.carbondesignsystem.com/components/radio-button/usage/

### Accordion item
- Tag: `cds-accordion-item`, needs a `cds-accordion` parent wrapper
  (wrapper wasn't its own Figma node in this fetch — infer it when two+
  `Accordion item` instances sit together, as they do here).
- Notes: collapsed by default in this design, chevron-down icon, single
  line of header text ("More information about travel destination/
  duration"). **Gotcha confirmed 2026-08-27 by rendering in-browser:**
  the Figma design has the chevron *before* the title (left side), but
  `cds-accordion-item`'s default `alignment` is `"END"` (chevron on the
  right, `flex-direction: row-reverse`). Setting `alignment="start"` on
  the *item* alone doesn't work — `cds-accordion` (the parent wrapper)
  force-propagates its own `alignment` down to every child item on
  connect, clobbering a per-item override. You must set
  `alignment="start"` on the `<cds-accordion>` wrapper itself.

### Text input - Default
- Tag: `cds-text-input`
- Attrs: `label` (not `label-text` like radio-button/date-picker-input —
  confirmed 2026-08-27 by grepping the compiled component source, this
  one's inconsistent), `placeholder`, `name`, `type`, `size` (`"lg"` for
  the Figma "Size=Large" variant, no default set in the component so it
  must be passed explicitly to match).
- Notes: source is the personal-details screen (fileKey
  `Vnzztyo2jJgzLefU8ioqJ2`, node `182845:337`) — First name, Last name,
  Email address, Phone number fields. No default width — set `width:
  100%` in CSS or it won't span the row like the design shows.

### Date picker - Single calendar - Default
- Tag: `cds-date-picker` (attribute for single-calendar mode) wrapping
  `cds-date-picker-input`
- Notes: the `" - Single calendar - Default"` part of the Figma name is
  variant info, not part of the tag — see CLAUDE.md's tag-ID rule. Input
  placeholder text ("DD-MM-YYYY") uses the Code utility font (IBM Plex
  Mono), not body font — see CLAUDE.md's font-sourcing rule. Docs:
  https://www.carbondesignsystem.com/components/date-picker/usage/
- **Validation gotcha confirmed 2026-08-27:** unlike `cds-text-input`,
  `cds-date-picker-input` does NOT extend `ValidityMixin` — there's no
  `checkValidity()`, and `.invalid`/`.invalidText` must be set manually.
  Its `.value` only updates through flatpickr's own change handling
  (picking a date from the calendar popup, or typing with `allow-input`
  enabled). Typing free text into the field without `allow-input` does
  NOT update `.value` — reading it afterward silently returns `undefined`
  (not `""`), which threw `Cannot read properties of undefined (reading
  'trim')` in a validator that assumed a string. Always guard with
  `field.value ?? ''` before calling string methods on any cds- field
  value, and pick dates from the popup (or add `allow-input`) rather
  than assuming typed text is captured.
