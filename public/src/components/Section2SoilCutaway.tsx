'use client';

/**
 * Section 2 — Soil Cutaway & Neuronal Root Network
 * Built against: DigitalSpecimen_DesignTokens.md (locked 23 Aug 2026)
 *   obsidian #030302 / bone #f6f5f2 background pair
 *   off-white #d6be96 (organic) -> cyan #5eead4 (engineered) accent shift
 *   bronze #c9a878 mono labels
 *   Instrument Serif (display) / JetBrains Mono (labels) / Archivo (body)
 *
 * Requires Instrument Serif + JetBrains Mono + Archivo loaded at the app
 * level (see token doc, section 2, for the Google Fonts <link>).
 * Ready to hand to Claude Design as-is — no placeholder tokens remain.
 */

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

export default function Section2SoilCutaway() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Track scroll progress through the 300svh container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // --- Background parallax ---
  // Reduced-motion: freeze the pan instead of removing the layer entirely.
  const soilShift = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? ['50%', '50%'] : ['12%', '88%']
  );

  // --- Fig. 01: intro caption ---
  const introOpacity = useTransform(scrollYProgress, [0, 0.22], [1, 0]);

  // --- Root → grid transition ---
  // NOTE ON APPROACH: Framer Motion's useTransform cannot interpolate the `d`
  // attribute of an SVG path between two different point structures — that
  // requires equal-topology paths or a morphing library (e.g. flubber), which
  // isn't in the stack. Instead of a literal shape morph, this uses an
  // undraw + crossfade: the organic root retracts via pathLength while a
  // taxonomic grid resolves in on the same window. Same territory, register
  // shifts from organic (amber) to engineered (cyan).
  const rootDraw = useTransform(scrollYProgress, [0.1, 0.4], [1, 0]);
  const gridReveal = useTransform(scrollYProgress, [0.14, 0.4], [0, 1]);

  // --- Fig. 02: wing (vein structure) ---
  const wingFade = useTransform(scrollYProgress, [0.3, 0.46], [0, 1]);
  const wingRise = useTransform(scrollYProgress, [0.3, 0.46], [24, 0]);

  // --- Fig. 03 / Plate VII: manifesto plate ---
  const plateFade = useTransform(scrollYProgress, [0.68, 0.84], [0, 1]);
  const plateRise = useTransform(scrollYProgress, [0.68, 0.84], [16, 0]);

  // Phase label reflects actual scroll state (root / vein / plate) rather
  // than a decorative counter — the section genuinely has three states.
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
      {/* Sticky 100svh Viewport Frame */}
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden flex flex-col justify-between p-6 md:p-12">
        {/* Fixed Chrome Header Labels */}
        <div className="absolute top-8 left-8 right-8 z-30 flex justify-between items-center text-[10px] uppercase font-mono tracking-[0.28em] text-white/70">
          <span>DEPTH // SUBSTRATUM</span>
          <span>PLATE VII · MANIFESTO</span>
        </div>

        {/* Layer 0: gradient strata fallback — covers slow-load / missing-asset states
            so the section never shows raw black while the JPEG resolves */}
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
            backgroundImage: 'url("/assets/soil-strata-bleed.jpg")',
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

        {/* Layer 3: Root Network → Taxonomic Grid */}
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <svg className="w-full h-full max-w-5xl" viewBox="0 0 1000 1000">
            {/* organic root — retracts as depth increases */}
            <motion.path
              d="M 500 0 Q 480 300 500 1000"
              fill="none"
              stroke="#d6be96"
              strokeWidth="1.6"
              style={{ pathLength: rootDraw }}
            />
            {/* taxonomic grid — resolves in on the same axis, engineered register */}
            <motion.g style={{ opacity: gridReveal }} stroke="#5eead4" strokeWidth="1">
              <line x1="500" y1="0" x2="500" y2="1000" />
              <line x1="380" y1="0" x2="380" y2="1000" opacity="0.4" />
              <line x1="620" y1="0" x2="620" y2="1000" opacity="0.4" />
              <line x1="200" y1="500" x2="800" y2="500" opacity="0.35" />
              <line x1="200" y1="300" x2="800" y2="300" opacity="0.2" />
              <line x1="200" y1="700" x2="800" y2="700" opacity="0.2" />
            </motion.g>
          </svg>
        </div>

        {/* Layer 4: Fig. 02 — wing / vein structure (was declared, never mounted) */}
        <motion.div
          className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none px-6"
          style={{ opacity: wingFade, y: prefersReducedMotion ? 0 : wingRise }}
        >
          <div className="max-w-md text-center">
            <svg viewBox="0 0 300 200" className="w-64 h-auto mx-auto mb-6 opacity-90">
              <path
                d="M150 190 C 90 140, 40 120, 20 40 C 70 40, 120 70, 150 130 C 180 70, 230 40, 280 40 C 260 120, 210 140, 150 190 Z"
                fill="none"
                stroke="#5eead4"
                strokeWidth="1"
              />
              <path
                d="M150 130 L60 55 M150 130 L100 90 M150 130 L150 40 M150 130 L200 90 M150 130 L240 55"
                stroke="#c9a878"
                strokeWidth="0.6"
                opacity="0.7"
              />
            </svg>
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
        </motion.div>

        {/* Layer 5: Fig. 03 / Plate VII — manifesto plate (was declared, never mounted) */}
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
