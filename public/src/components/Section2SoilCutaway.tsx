'use client';

/**
 * Section 2 — Soil Cutaway & Root-to-Wing Transition
 * Built against: DigitalSpecimen_DesignTokens.md (locked 23 Aug 2026)
 *   obsidian #030302 / bone #f6f5f2 background pair
 *   bronze #d6be96 (organic) -> cyan #5eead4 (engineered) accent shift
 *   Instrument Serif (display) / JetBrains Mono (labels) / Archivo (body)
 *
 * CHANGE LOG (this revision):
 *   - Layer 3 root/grid SVG replaced with 6 hand-authored branching root
 *     paths. Each root's pathLength is scroll-driven (staggered start/end
 *     per root so growth reads organic, not mechanical). Color is NOT
 *     animated — it's baked into a fixed linearGradient (bronze -> cyan)
 *     so the root visually "deepens" as it draws downward.
 *   - Old taxonomic-grid crossfade removed. The organic->engineered idea
 *     now lives entirely in the root gradient, so a separate grid layer
 *     was redundant.
 *   - Layer 4 wing icon (small centered SVG) replaced with a full-bleed
 *     photo (/assets/butterfly-wing.jpg), colour-locked to the same
 *     terminal cyan as the roots so the retraction->fade-in reads as one
 *     continuous transformation rather than a cut. A scrim was added
 *     behind the FIG. 02 text since it now sits over a dense photo
 *     instead of sparse line art.
 *   - Roots fade out (opacity) over the same scroll window the wing
 *     fades in, so the handoff is a true crossfade.
 *
 * NOTE ON APPROACH: Framer Motion's useTransform cannot interpolate the
 * `d` attribute of an SVG path between two different point structures —
 * that requires equal-topology paths or a morphing library (e.g.
 * flubber), which isn't in the stack. This is why the root does not
 * literally "become" the wing — it retracts while the wing crossfades
 * in underneath, both at matched cyan, so the transformation reads as
 * continuous without requiring a true shape morph.
 *
 * ASSET NOTES:
 *   - /assets/soil-strata-bleed.png — replace with the upscaled version
 *     (2204x1740) before shipping. Filename kept as .png to match the
 *     actual file type; earlier revision had a .jpg/.png mismatch bug
 *     (background never loaded) — confirm this is fixed in the repo.
 *   - /assets/butterfly-wing.jpg — new asset, 5504x3072, colour-locked
 *     to #5eead4-range cyan. Add to public/assets/ before deploying.
 *
 * Requires Instrument Serif + JetBrains Mono + Archivo loaded locally
 * (see /public/fonts — font binaries already supplied, no CDN needed).
 */

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

// --- Root path data -------------------------------------------------
// viewBox 0 0 1000 1000. Six roots across the width, each with two
// small branch offshoots in the lower third for a naturalistic look.
const ROOTS = [
  {
    main: 'M120 0 C110 150 135 300 120 450 C100 600 130 750 115 980',
    branches: [
      'M120 500 C90 620 70 720 60 850',
      'M120 650 C150 760 170 860 185 980',
    ],
  },
  {
    main: 'M280 0 C270 160 300 310 280 460 C260 610 295 760 275 980',
    branches: [
      'M280 520 C250 640 225 740 210 870',
      'M280 680 C310 780 330 880 340 980',
    ],
  },
  {
    main: 'M450 0 C440 140 470 300 450 440 C430 590 465 740 445 980',
    branches: [
      'M450 480 C420 600 395 700 380 830',
      'M450 640 C480 750 500 850 510 980',
    ],
  },
  {
    main: 'M580 0 C570 150 605 310 580 460 C555 610 590 760 570 980',
    branches: [
      'M580 510 C550 630 525 730 505 860',
      'M580 670 C610 770 635 870 650 980',
    ],
  },
  {
    main: 'M730 0 C720 160 755 300 730 450 C705 600 740 750 720 980',
    branches: [
      'M730 490 C700 610 675 710 655 840',
      'M730 650 C765 760 785 860 800 980',
    ],
  },
  {
    main: 'M880 0 C870 140 900 300 880 440 C860 590 895 740 875 980',
    branches: [
      'M880 530 C850 650 825 750 810 880',
      'M880 690 C915 790 935 890 950 980',
    ],
  },
];

export default function Section2SoilCutaway() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // --- Background parallax ---
  const soilShift = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? ['50%', '50%'] : ['12%', '88%']
  );

  // --- Fig. 01: intro caption ---
  const introOpacity = useTransform(scrollYProgress, [0, 0.22], [1, 0]);

  // --- Root growth (staggered per root; each pair of numbers is
  //     [scroll-start, scroll-end] for that root's pathLength draw-in).
  //     Hooks are unrolled explicitly (not looped) to respect the
  //     rules of hooks — six roots, six fixed calls. ---
  const root0Draw = useTransform(scrollYProgress, [0.02, 0.24], [0, 1]);
  const root1Draw = useTransform(scrollYProgress, [0.04, 0.26], [0, 1]);
  const root2Draw = useTransform(scrollYProgress, [0.01, 0.22], [0, 1]);
  const root3Draw = useTransform(scrollYProgress, [0.05, 0.27], [0, 1]);
  const root4Draw = useTransform(scrollYProgress, [0.03, 0.25], [0, 1]);
  const root5Draw = useTransform(scrollYProgress, [0.06, 0.28], [0, 1]);
  const rootDraws = [root0Draw, root1Draw, root2Draw, root3Draw, root4Draw, root5Draw];

  // Roots fade out as the wing crossfades in — same window as wingFade
  // below, so the handoff reads as one continuous transformation.
  const rootsGroupOpacity = useTransform(scrollYProgress, [0.28, 0.46], [1, 0]);

  // --- Fig. 02: wing (full-bleed photo, crossfades in over the roots) ---
  const wingFade = useTransform(scrollYProgress, [0.3, 0.46], [0, 1]);
  const wingRise = useTransform(scrollYProgress, [0.3, 0.46], [24, 0]);

  // --- Fig. 03 / Plate VII: manifesto plate ---
  const plateFade = useTransform(scrollYProgress, [0.68, 0.84], [0, 1]);
  const plateRise = useTransform(scrollYProgress, [0.68, 0.84], [16, 0]);

  const phaseLabel = useTransform(
    scrollYProgress,
    [0, 0.29, 0.3, 0.67, 0.68, 1],
    [
      'SYSTEM_01 // ROOT',
      'SYSTEM_01 // ROOT',
      'SYSTEM_02 // VEIN',
      'SYSTEM_02 // VEIN',
      'SYSTEM_03 // PLATE',
      'SYSTEM_03 // PLATE',
    ]
  );

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[300svh] bg-[#030302] text-[#f6f5f2] overflow-hidden font-sans"
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden flex flex-col justify-between p-6 md:p-12">
        {/* Fixed Chrome Header Labels */}
        <div className="absolute top-8 left-8 right-8 z-30 flex justify-between items-center text-[10px] uppercase font-mono tracking-[0.28em] text-white/70">
          <span>DEPTH // SUBSTRATUM</span>
          <span>PLATE VII · MANIFESTO</span>
        </div>

        {/* Layer 0: gradient strata fallback */}
        <div
          className="absolute inset-0 z-0 opacity-70 pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, #030302 0%, #1c130c 28%, #241a10 52%, #120d08 78%, #030302 100%)',
          }}
        />

        {/* Layer 1: Soil Cross-Cut Background with Parallax Pan */}
        <motion.div
          className="absolute inset-0 z-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage: 'url("/assets/soil-strata-bleed.png")',
            backgroundSize: 'cover',
            backgroundPosition: `center ${soilShift}`,
          }}
        />

        {/* Layer 2: Intro Captions (Fig 01 fading out by p = 0.22) */}
        <motion.div className="relative z-20 mt-20 max-w-xl" style={{ opacity: introOpacity }}>
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

        {/* Layer 3: Six-root growth diagram — bronze at surface, cyan at depth */}
        <motion.div
          className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
          style={{ opacity: rootsGroupOpacity }}
        >
          <svg className="w-full h-full max-w-5xl" viewBox="0 0 1000 1000">
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
                    style={{ pathLength: rootDraws[i] }}
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
                      style={{ pathLength: rootDraws[i] }}
                    />
                  ))}
                </g>
              ))}
            </g>
          </svg>
        </motion.div>

        {/* Layer 4: Fig. 02 — full-bleed wing crossfade, colour-matched to root's terminal cyan */}
        <motion.div
          className="absolute inset-0 z-20 pointer-events-none"
          style={{ opacity: wingFade, y: prefersReducedMotion ? 0 : wingRise }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'url("/assets/butterfly-wing.jpg")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          {/* Scrim: dense photo needs this for text legibility, unlike the old sparse line art */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(3,3,2,0.35) 0%, rgba(3,3,2,0.75) 65%, rgba(3,3,2,0.9) 100%)',
            }}
          />
          <div className="relative h-full flex items-center justify-center px-6">
            <div className="max-w-md text-center">
              <p className="text-xs font-mono tracking-[0.3em] text-[#5eead4] mb-2">
                FIG. 02 — VEIN STRUCTURE, MAGNIFIED
              </p>
              <h3
                className="text-2xl md:text-4xl font-normal tracking-tight"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                What looks alive was engineered.
              </h3>
            </div>
          </div>
        </motion.div>

        {/* Layer 5: Fig. 03 / Plate VII — manifesto plate (unchanged) */}
        <motion.div
          className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none px-6"
          style={{ opacity: plateFade, y: prefersReducedMotion ? 0 : plateRise }}
        >
          <div className="relative max-w-lg border border-[#5eead4]/30 bg-[#030302]/80 backdrop-blur-sm px-8 py-10">
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
          </div>
        </motion.div>

        {/* Fixed Bottom Footer Indicator */}
        <div className="absolute bottom-8 left-8 right-8 z-30 flex justify-between items-center text-[10px] uppercase font-mono tracking-[0.28em] text-white/50">
          <span>SCROLL ↓ TO ISOLATE</span>
          <motion.span>{phaseLabel}</motion.span>
        </div>
      </div>
    </section>
  );
}
