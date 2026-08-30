---
name: skill-builder
description: Scaffold a new scrollytelling page section for the DigitalSpecimen site (a Next.js/Tailwind/Framer Motion landing page). Use when asked to add a new section, panel, or diagnostic panel to the page — generates a SectionN<Name>.jsx component that matches the existing Hero/pipeline/Services/Decision-Engine schematic visual system and wires it into app/page.jsx.
---

# Skill Builder — DigitalSpecimen Section Scaffolder

Generates a new full-bleed page section for this repo and wires it into
`app/page.jsx`, matching the "decision infrastructure" schematic visual
language used by `Hero.jsx`, `Section2SoilCutaway.jsx`,
`Section3Manifesto.jsx`, `Section4Taxonomy.jsx`, and `Footer.jsx`.

**Positioning note:** the site markets Digital Specimen as decision
infrastructure — the system a buying decision runs through — not as a
creative/branding agency. Copy should read like engineering documentation
(traced, measured, engineered) rather than biological/dissection language.
The company name and "specimen" word survive (reframed as engineering
QA — testing something under controlled conditions — not biology), but
insects, organic texture, and neuroscience language do not.

## When to use this

The user asks to add a new section/panel to the DigitalSpecimen landing
page — e.g. "add a section about X after the Decision Engine", "add a
pricing panel", "insert a section between Services and the Decision
Engine".

## Before generating anything

Ask (or infer from the request) whatever isn't already clear:

1. **Position** — which existing section does it follow? This decides its
   number (`SectionN`) and its import order in `app/page.jsx`.
2. **Background tone** — light plate (`#f6f5f2` bg, `#1a1a18` text, like
   Services) or dark plate (`#030302`/`#171310` bg, `#f6f5f2` text, like
   the pipeline section, Decision Engine, Footer)? Check the neighbors and
   pick what makes sense next to them — the hard-break transition (see
   below) means adjacent sections no longer need to share a color family.
3. **Content shape** — a short list of items (cards/nodes, like Services'
   carousel or the Decision Engine's node diagram), or a single statement
   panel (like the pipeline section's stacked plates)?

Don't guess wildly on copy — use the user's actual words for headline/body
text; only invent placeholder copy if they explicitly want a stub.

## The design system (extracted from existing sections — reuse, don't reinvent)

**Color tokens** (raw hex, not Tailwind theme colors — this repo doesn't
define brand colors in `tailwind.config.js`). Colors carry meaning here,
they aren't just decoration:
- Dark backgrounds: `#030302` (deepest), `#171310` (Decision Engine's variant)
- Light background: `#f6f5f2`, card-on-light: `#fbfaf7`
- Dark-plate text: `#f6f5f2`; light-plate text: `#1a1a18`
- Teal `#5eead4` = healthy/passed/signal — the "this layer is working" color
- Bronze/gold `#c9a878` = neutral system accent (eyebrows, node borders,
  default connector color)
- Amber/rust `#b3491f` = friction point / leak / attention — reserve this
  for something that's actually broken or worth flagging, not decoration
- Per-service accent colors are fine to invent (Services' cards each carry
  a distinct accent/accentDark pair) — keep them muted/desaturated

**Type system** (`tailwind.config.js` defines these font families):
- `font-garamond` (Instrument Serif) — headlines only, e.g.
  `className="font-garamond text-[clamp(32px,5.6vw,72px)] leading-[1.05]"`
- `font-sans` (Archivo) — body copy, default
- `font-mono` (JetBrains Mono) — ALL eyebrows, labels, meta text, footers,
  status readouts; always `uppercase tracking-[0.2em]` to
  `tracking-[0.3em]`, always small (`text-[9px]` to `text-[11px]`)

**No photography.** The old design depended on hand-calibrated crop
percentages against a single background photo (fragile, asset-pipeline
risk). The current system is pure SVG/CSS: grid backgrounds, node/connector
diagrams, drawn paths. Don't reintroduce photography without discussing it
first — it reopens that fragility.

**Section anatomy** (every section follows this shape):
```jsx
'use client';

import { motion } from 'framer-motion';
import SectionBreak from './SectionBreak';

export default function SectionN<Name>() {
  return (
    <section className="relative w-full bg-[#f6f5f2] text-[#1a1a18] font-sans overflow-hidden px-6 md:px-12 pt-0 pb-28 md:pb-36">
      <SectionBreak label="SECTION_0N // <NAME>" bg="#f6f5f2" tone="light" />

      <div className="relative z-10 max-w-6xl mx-auto pt-20 md:pt-28 mb-10 md:mb-16">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#c9a878] mb-4"
        >
          // <EYEBROW LABEL>
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="font-garamond text-[clamp(32px,5.6vw,72px)] leading-[1.05]"
        >
          <Headline sentence.>
        </motion.h2>
      </div>

      {/* ...body content... */}

      <div className="relative z-10 max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-6 border-t border-current/15">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] opacity-40">
          // <TAGLINE.>
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] opacity-40">
          <SECTION NAME> · REV. 01.
        </p>
      </div>
    </section>
  );
}
```

**Transitions between sections use `SectionBreak` (`components/SectionBreak.jsx`),
not a soft gradient.** Render it as the very first child of the section —
its top edge then sits exactly on the boundary with the previous section:
a hairline rule with a mono readout label cutting across it, like a page
break in a spec sheet. `bg` must match the *current* section's own
background (not the previous section's) or the label won't read as
cutting the line. `tone="dark"` on a dark-bg section, `tone="light"` on a
light one. This replaced the old soft color-melt gradient bridges — do not
reintroduce those.

**Motion conventions**:
- Every scroll-triggered element uses `whileInView`, never `animate` —
  `viewport={{ once: true, margin: '-80px' }}` (or `-100px` for larger
  elements) so it fires once, slightly before entering the viewport.
- Stagger related elements with `transition={{ delay: i * 0.1 }}` or
  similar, not simultaneous entry.
- Any custom CSS `@keyframes` (looping ambient motion, not scroll-triggered)
  goes in a trailing `<style jsx>{...}</style>` block and MUST be paired
  with a `@media (prefers-reduced-motion: reduce)` override that disables
  it — see `Section4Taxonomy.jsx`'s `ds-node-pulse` for the pattern.
- Ambient background motion (grid, nodes, signal blips) should read as
  mechanical/status-light behavior — steady pulses, traveling dots along a
  line, path-draw-ins — not organic drift, sway, or flutter.

**Mobile fallback rule**: if desktop content relies on absolute positioning
for a diagram/carousel/spatial layout (`hidden md:block`), always provide a
`md:hidden` stacked-list fallback with the same copy — never hide real
content on mobile, only decorative absolute geometry. See
`Section4Taxonomy.jsx`'s node diagram vs. its mobile card list.

**Copy voice**: eyebrows and fig labels read like engineering
documentation — traced, measured, verified language ("FIG. 01 — PIPELINE
TRACE", "OUTPUT: FULL DECISION MAP", "REV. 01"). Match this register in
generated placeholder copy unless the user gives real copy. Avoid biology/
dissection words (specimen-as-organism, magnification, nervous system) and
neuroscience words (reptilian/limbic/cortex) — those belonged to the
retired positioning.

## Steps

1. Confirm position, tone, and content shape (see above).
2. Read the two sections adjacent to the insertion point to get their exact
   background colors, for the `SectionBreak` `bg` prop and footer border
   tokens.
3. Create `components/SectionN<Name>.jsx` (PascalCase name, numbered to
   match its position, e.g. `Section5Pricing.jsx` if it goes after
   `Section4Taxonomy`). Follow the anatomy template above.
4. If a later section already exists at that number or higher, don't
   renumber existing files — ask whether to renumber or use a suffix; this
   is a rare edge case since sections are normally appended at the end.
5. Wire it into `app/page.jsx`: add the import and place the
   `<SectionN<Name> />` element in the correct position in the JSX list.
6. Run `npm run build` (or `npm run lint`) and, if the dev server is
   available, start it (`npm run dev`) and visually check the section
   renders and the `SectionBreak` seam reads cleanly against both
   neighbors.

## What not to do

- Don't introduce a new font, weight, or color system — reuse the tokens
  above exactly, and keep color meaning consistent (teal = healthy, amber
  = friction).
- Don't use `animate` for scroll-triggered reveals — always `whileInView`.
- Don't add scroll-hijacking (`position: sticky` + transform-driven
  scroll, `useTransform`) — `Section2SoilCutaway.jsx`'s doc comment
  explains this was tried and rebuilt away from because of a persistent
  rendering bug; stick to normal-flow content with `whileInView` fades.
- Don't skip the mobile fallback for any absolutely-positioned diagram.
- Don't add photography or reintroduce the old soft gradient bridges.
- Don't slip back into biology/neuroscience copy — see Copy voice above.
