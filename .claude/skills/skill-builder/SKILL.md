---
name: skill-builder
description: Scaffold a new scrollytelling page section for the DigitalSpecimen site (a Next.js/Tailwind/Framer Motion landing page). Use when asked to add a new section, panel, or "specimen plate" to the page — generates a SectionN<Name>.jsx component that matches the existing Hero/SoilCutaway/Manifesto/Taxonomy visual system and wires it into app/page.jsx.
---

# Skill Builder — DigitalSpecimen Section Scaffolder

Generates a new full-bleed page section for this repo and wires it into
`app/page.jsx`, matching the established "specimen plate" visual language
used by `Section2SoilCutaway.jsx`, `Section3Manifesto.jsx`, and
`Section4Taxonomy.jsx`.

## When to use this

The user asks to add a new section/panel to the DigitalSpecimen landing
page — e.g. "add a section about X after Taxonomy", "make a new specimen
plate for our pricing", "insert a section between Manifesto and Taxonomy".

## Before generating anything

Ask (or infer from the request) whatever isn't already clear:

1. **Position** — which existing section does it follow? This decides its
   number (`SectionN`) and its import order in `app/page.jsx`.
2. **Background tone** — light plate (`#f6f5f2` bg, `#1a1a18` text, like
   Manifesto) or dark plate (`#030302`/`#171310` bg, `#f6f5f2` text, like
   SoilCutaway/Taxonomy)? Sections alternate or stay dark depending on the
   surrounding rhythm — check the neighbors and pick what bridges cleanly.
3. **Content shape** — a short list of "specimen" items (cards/nodes/pods,
   like Manifesto's carousel or Taxonomy's node diagram), or a single
   statement panel (like SoilCutaway's plates)?

Don't guess wildly on copy — use the user's actual words for headline/body
text; only invent placeholder copy if they explicitly want a stub.

## The design system (extracted from existing sections — reuse, don't reinvent)

**Color tokens** (used as raw hex, not Tailwind theme colors — this repo
doesn't define brand colors in `tailwind.config.js`):
- Dark backgrounds: `#030302` (deepest), `#171310` (Taxonomy's variant)
- Light background: `#f6f5f2`, card-on-light: `#fbfaf7`
- Dark-plate text: `#f6f5f2`; light-plate text: `#1a1a18`
- Bronze/gold accent (eyebrows, borders, primary accent): `#c9a878`
- Teal accent (glow, secondary accent): `#5eead4`
- Per-item accent colors are fine to invent per section (Manifesto uses a
  distinct accent/accentDark pair per card) — keep them muted/desaturated,
  not saturated web-safe colors.

**Type system** (`tailwind.config.js` defines these font families):
- `font-garamond` (Instrument Serif) — headlines only, e.g.
  `className="font-garamond text-[clamp(32px,5.6vw,72px)] leading-[1.05]"`
- `font-sans` (Archivo) — body copy, default
- `font-mono` (JetBrains Mono) — ALL eyebrows, labels, meta text, footers;
  always `uppercase tracking-[0.2em]` to `tracking-[0.3em]`, always small
  (`text-[9px]` to `text-[11px]`)

**Section anatomy** (every section follows this shape):
```jsx
'use client';

import { motion } from 'framer-motion';

export default function SectionN<Name>() {
  return (
    <section className="relative w-full bg-[#f6f5f2] text-[#1a1a18] font-sans overflow-hidden px-6 md:px-12 pt-0 pb-28 md:pb-36">
      {/* Bridge gradient from the previous section's background color to this one */}
      <div
        className="absolute top-0 left-0 right-0 h-[160px] md:h-[220px] pointer-events-none z-20"
        style={{ background: 'linear-gradient(180deg, <prevBg> 0%, <thisBg> 100%)' }}
      />

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

**Mobile fallback rule**: if desktop content relies on absolute positioning
for a diagram/carousel/spatial layout (`hidden md:block`), always provide a
`md:hidden` stacked-list fallback with the same copy — never hide real
content on mobile, only decorative absolute geometry. See
`Section4Taxonomy.jsx`'s node diagram vs. its mobile card list.

**"Specimen" copy voice**: eyebrows and fig labels use the site's running
conceit — figures/plates/specimens, dissection and measurement language
("FIG. C — LOAD STUDY", "TOLERANCE: ZERO DRIFT", "REV. 04"). Match this
register in generated placeholder copy unless the user gives real copy.

## Steps

1. Confirm position, tone, and content shape (see above).
2. Read the two sections adjacent to the insertion point to get their exact
   background colors, for the bridge gradient and footer border tokens.
3. Create `components/SectionN<Name>.jsx` (PascalCase name, numbered to
   match its position, e.g. `Section5Pricing.jsx` if it goes after
   `Section4Taxonomy`). Follow the anatomy template above.
4. If a later section already exists at that number or higher, don't
   renumber existing files — ask whether to renumber or use a suffix; this
   is a rare edge case since sections are normally appended at the end.
5. Wire it into `app/page.jsx`: add the import and place the
   `<SectionN<Name> />` element in the correct position in the JSX list.
6. Run `npm run lint` and, if the dev server is available, start it
   (`npm run dev`) and visually check the section renders and the bridge
   gradient lines up with its neighbors — no visible seam or color jump.

## What not to do

- Don't introduce a new font, weight, or color system — reuse the tokens
  above exactly.
- Don't use `animate` for scroll-triggered reveals — always `whileInView`.
- Don't add scroll-hijacking (`position: sticky` + transform-driven
  scroll, `useTransform`) — `Section2SoilCutaway.jsx`'s doc comment
  explains this was tried and rebuilt away from because of a persistent
  rendering bug; stick to normal-flow content with `whileInView` fades.
- Don't skip the mobile fallback for any absolutely-positioned diagram.
