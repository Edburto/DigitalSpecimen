'use client';

/**
 * Section 2 — Soil Cutaway & Root-to-Wing Transition (v2, rebuilt)
 *
 * WHY THIS WAS REBUILT: the original version used a 300vh scroll-hijacked
 * outer container with a `position: sticky` inner panel, driving all
 * content via Framer Motion's scroll-linked `useTransform`. This produced
 * a persistent, unresolved black-gap bug — content correctly rendered for
 * part of the scroll range, then a large stretch of the container's bare
 * background showed with nothing on it. Multiple root causes were
 * investigated and fixed in isolation (a Safari filter/mask rendering
 * bug, an `overflow-hidden` ancestor potentially breaking `sticky`, a
 * confirmed `100svh` miscalculation on at least one real device measured
 * at 440px against a much taller actual viewport) — none resolved it, and
 * an isolation test (temporarily removing this section from the page)
 * confirmed the bug was still present in whatever mechanism this file
 * used, even after several fixes.
 *
 * Rather than continue debugging a scroll-hijacking technique that is
 * unique to this one section — every other section on this site
 * (Manifesto, Taxonomy, Footer) uses simple normal-flow content with
 * `whileInView` fade-ins, and NONE of them have ever shown this bug —
 * this rebuild adopts that same simple, proven pattern. Same visual
 * content (roots, wing photo, Plate VII text), same color system, same
 * copy. The only thing that changed is the delivery mechanism: three
 * ordinary stacked blocks instead of one scroll-hijacked pinned panel.
 */

import { motion } from 'framer-motion';

const ROOTS = [
  {
    main: 'M150 0 C190 120 90 240 150 380 C210 520 80 650 130 880',
    branches: [
      'M150 350 C60 480 20 600 -10 760',
      'M150 500 C220 620 260 720 300 860',
    ],
  },
  {
    main: 'M420 0 C380 130 480 260 420 400 C360 540 470 670 400 880',
    branches: [
      'M420 380 C320 500 280 610 240 760',
      'M420 550 C500 660 540 760 580 880',
    ],
  },
  {
    main: 'M690 0 C740 130 630 260 690 400 C750 540 640 670 700 880',
    branches: [
      'M690 360 C600 480 560 590 520 740',
      'M690 540 C770 650 810 750 850 880',
    ],
  },
  {
    main: 'M910 0 C870 120 960 250 910 390 C860 530 950 660 900 880',
    branches: [
      'M910 400 C820 510 780 620 740 770',
      'M910 560 C990 660 1030 760 1070 880',
    ],
  },
  {
    main: 'M1180 0 C1230 130 1120 260 1180 400 C1240 540 1130 670 1190 880',
    branches: [
      'M1180 380 C1090 490 1050 600 1010 750',
      'M1180 550 C1260 650 1300 750 1340 880',
    ],
  },
  {
    main: 'M1450 0 C1410 120 1490 250 1450 390 C1410 530 1490 660 1450 880',
    branches: [
      'M1450 400 C1370 510 1330 610 1290 760',
      'M1450 560 C1520 660 1550 760 1580 870',
    ],
  },
];

export default function Section2SoilCutaway() {
  return (
    <section className="relative w-full bg-[#030302] text-[#f6f5f2] font-sans">
      {/* Panel 1 — Roots / Soil */}
      <div className="relative min-h-screen w-full overflow-hidden flex flex-col justify-center px-6 md:px-12 py-24">
        <div className="absolute top-8 left-8 right-8 z-30 flex justify-between items-center text-[10px] uppercase font-mono tracking-[0.28em] text-white/50">
          <span>DEPTH // SUBSTRATUM</span>
          <span>SYSTEM_01 // ROOT</span>
        </div>

        <div
          className="absolute inset-0 z-0 opacity-70 pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, #030302 0%, #1c130c 28%, #241a10 52%, #120d08 78%, #030302 100%)',
          }}
        />
        <div
          className="absolute inset-0 z-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage: 'url("/assets/soil-strata-bleed.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        <motion.div
          className="relative z-20 max-w-xl mb-16"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-xs font-mono tracking-[0.3em] text-[#c9a878] mb-2">
            FIG. 01 — SUBSTRATUM CROSS-SECTION
          </p>
          <h2
            className="text-3xl md:text-5xl font-normal tracking-tight"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            Everything begins below the surface.
          </h2>
        </motion.div>

        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 1600 900"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <linearGradient id="rootGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#d6be96" />
                <stop offset="55%" stopColor="#9fd0c0" />
                <stop offset="100%" stopColor="#5eead4" />
              </linearGradient>
              <filter id="rootGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <g filter="url(#rootGlow)">
              {ROOTS.map((root, i) => (
                <g key={i}>
                  <motion.path
                    d={root.main}
                    fill="none"
                    stroke="url(#rootGradient)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 1.6, delay: i * 0.12, ease: 'easeOut' }}
                  />
                  {root.branches.map((b, j) => (
                    <motion.path
                      key={j}
                      d={b}
                      fill="none"
                      stroke="url(#rootGradient)"
                      strokeWidth="1"
                      strokeLinecap="round"
                      opacity="0.75"
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      viewport={{ once: true, margin: '-50px' }}
                      transition={{ duration: 1.6, delay: i * 0.12 + 0.2, ease: 'easeOut' }}
                    />
                  ))}
                </g>
              ))}
            </g>
          </svg>
        </div>
      </div>

      {/* Panel 2 — Wing */}
      <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center px-6">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url("/assets/butterfly-wing.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0" style={{ background: 'rgba(3,3,2,0.15)' }} />

        <div className="absolute top-8 left-8 right-8 z-30 flex justify-between items-center text-[10px] uppercase font-mono tracking-[0.28em] text-white/70">
          <span>SCROLL ↓ TO ISOLATE</span>
          <span>SYSTEM_02 // VEIN</span>
        </div>

        <motion.div
          className="relative z-20 max-w-md text-center border border-[#5eead4]/30 bg-[#030302]/70 backdrop-blur-sm px-8 py-8"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-xs font-mono tracking-[0.3em] text-[#5eead4] mb-2">
            FIG. 02 — VEIN STRUCTURE, MAGNIFIED
          </p>
          <h3
            className="text-2xl md:text-4xl font-normal tracking-tight"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            What looks alive was engineered.
          </h3>
        </motion.div>
      </div>

      {/* Panel 3 — Plate VII */}
      <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center px-6 py-24">
        <div
          className="absolute inset-0 opacity-70 pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, #030302 0%, #120d08 50%, #030302 100%)',
          }}
        />

        <div className="absolute top-8 left-8 right-8 z-30 flex justify-between items-center text-[10px] uppercase font-mono tracking-[0.28em] text-white/50">
          <span>PLATE VII · MANIFESTO</span>
          <span>SYSTEM_03 // PLATE</span>
        </div>

        <motion.div
          className="relative z-20 max-w-lg border border-[#5eead4]/30 bg-[#030302]/80 backdrop-blur-sm px-8 py-10"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          <span className="absolute -top-px -left-px w-3 h-3 border-t border-l border-[#5eead4]" />
          <span className="absolute -top-px -right-px w-3 h-3 border-t border-r border-[#5eead4]" />
          <span className="absolute -bottom-px -left-px w-3 h-3 border-b border-l border-[#5eead4]" />
          <span className="absolute -bottom-px -right-px w-3 h-3 border-b border-r border-[#5eead4]" />
          <p className="text-xs font-mono tracking-[0.3em] text-[#c9a878] mb-3 text-center">
            PLATE VII — MANIFESTO
          </p>
          <h3
            className="text-2xl md:text-3xl font-normal tracking-tight text-center mb-4"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            Every system, examined.
          </h3>
          <p className="text-sm md:text-base leading-relaxed text-white/70 text-center font-sans">
            We treat a brand the way a specimen is treated: dissected, diagrammed, rebuilt from
            first principles. Primal signal, emotional resonance, logical structure — nothing
            ships until all three hold under load.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
