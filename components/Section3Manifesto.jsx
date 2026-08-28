'use client';

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Section 3 — Manifesto Plate (Roulette Coverflow, v3)
 *
 * Cards are full-color rounded panels (like the reference's colorful
 * portfolio thumbnails) with a compact white "specimen label" plate
 * floating near the bottom of each card carrying the actual copy — museum
 * specimen-tag styling, not a flat white card with a thin accent bar.
 *
 * Vertical rhythm: header copy sits tight to the top of the section (pulled
 * up), the carousel gets a wide clean band with no competing text, and the
 * footer metadata is pushed well below the carousel (pushed down) so
 * nothing crowds the motion.
 *
 * Motion mechanic is unchanged from the previous build: mouse X position
 * scrubs the strip (roulette), idle drift when the cursor isn't over it,
 * imperative ref + rAF updates (not React state per frame).
 */

const UNIQUE_PODS = [
  {
    num: '01',
    fig: 'FIG. A — DORSAL VIEW',
    title: 'The Macro View',
    body: 'Markets move one nervous system at a time. We look through a microscope to isolate actual behavior.',
    meta1: 'MAGNIFICATION 40×',
    meta2: 'SUBJECT: SINGLE NERVOUS SYSTEM',
    accent: '#c9a878',
    accentDark: '#8a6a3d',
  },
  {
    num: '02',
    fig: 'FIG. B — SECTIONAL DETAIL',
    title: 'Structural Rigor',
    body: 'Stripping noise and friction to optimize performance within the critical 3-second decision window.',
    meta1: 'DECISION WINDOW 3.00 S',
    meta2: 'METHOD: ISOLATE / EXAMINE',
    accent: '#0f766e',
    accentDark: '#0b4f4a',
  },
  {
    num: '03',
    fig: 'FIG. C — LOAD STUDY',
    title: 'Form Meets Function',
    body: 'Deeply textured systems engineered for maximum throughput velocity and complete zero drift.',
    meta1: 'TOLERANCE: ZERO DRIFT',
    meta2: 'OUTPUT: MAXIMUM THROUGHPUT',
    accent: '#b3491f',
    accentDark: '#7a3015',
  },
  {
    num: '04',
    fig: 'FIG. D — FINAL MOUNT',
    title: 'The Specimen Standard',
    body: 'Nothing is left to chance. Polished to peak execution standards for absolute market dominance.',
    meta1: 'STATUS: PEAK POLISH',
    meta2: 'CHANCE: 0.00%',
    accent: '#0891b2',
    accentDark: '#055a6e',
  },
];

const REPEAT = 3;
const VIRTUAL = UNIQUE_PODS.length * REPEAT; // 12 slots on the loop
const HALF = VIRTUAL / 2; // 6

const SLOTS = Array.from({ length: VIRTUAL }, (_, i) => UNIQUE_PODS[i % UNIQUE_PODS.length]);

// Retuned to sit closer to the reference: bigger, less extreme falloff,
// noticeably less blur — the reference reads as crisp cards receding in
// space, not a heavy depth-of-field photograph.
const SPACING_PX = 230;
const VISIBLE_RANGE = 4.4;
const SENSITIVITY = 4.2;
const AUTOPLAY_STEP = 0.003;
const EASE = 0.07;

function wrapDelta(delta) {
  return (((delta + HALF) % VIRTUAL) + VIRTUAL) % VIRTUAL - HALF;
}

function applyCardStyle(el, diff) {
  const norm = diff / VISIBLE_RANGE;
  const clampedNorm = Math.max(-1.7, Math.min(1.7, norm));
  const x = diff * SPACING_PX;
  const rotateY = Math.max(-58, Math.min(58, clampedNorm * -46));
  const scale = Math.max(0.5, 1 - Math.min(1, Math.abs(clampedNorm)) * 0.42);
  const opacity = Math.max(0.15, 1 - Math.min(1, Math.abs(clampedNorm) * 0.72));
  const blur = Math.min(2.5, Math.abs(clampedNorm) * 2.2);
  const brightness = Math.max(0.55, 1 - Math.abs(clampedNorm) * 0.4);
  const z = Math.round(1000 - Math.abs(diff) * 40);

  el.style.transform = `translate(-50%, -50%) translateX(${x}px) rotateY(${rotateY}deg) scale(${scale})`;
  el.style.opacity = String(opacity);
  el.style.filter = `blur(${blur}px) brightness(${brightness})`;
  el.style.zIndex = String(z);
}

export default function Section3Manifesto() {
  const stageRef = useRef(null);
  const cardRefs = useRef([]);
  const posRef = useRef(0);
  const targetRef = useRef(0);
  const hoveringRef = useRef(false);
  const rafRef = useRef(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        applyCardStyle(el, wrapDelta(i));
      });
      return;
    }

    function frame() {
      if (!hoveringRef.current) {
        targetRef.current += AUTOPLAY_STEP;
      }
      const delta = wrapDelta(targetRef.current - posRef.current);
      posRef.current += delta * EASE;
      posRef.current = ((posRef.current % VIRTUAL) + VIRTUAL) % VIRTUAL;

      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        applyCardStyle(el, wrapDelta(i - posRef.current));
      });

      rafRef.current = requestAnimationFrame(frame);
    }

    rafRef.current = requestAnimationFrame(frame);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [reducedMotion]);

  function handleMouseMove(e) {
    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const normalized = (e.clientX - rect.left) / rect.width - 0.5;
    hoveringRef.current = true;
    targetRef.current = normalized * SENSITIVITY * 2;
  }

  function handleMouseLeave() {
    hoveringRef.current = false;
    targetRef.current = posRef.current;
  }

  return (
    <section className="relative w-full bg-[#f6f5f2] text-[#1a1a18] font-sans overflow-hidden px-6 md:px-12 pt-16 md:pt-20 pb-32 md:pb-40">
      {/* Printed hairline grid underlay: 12.5% columns x 96px rows */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            repeating-linear-gradient(to right, rgba(26,26,24,0.16) 0px, rgba(26,26,24,0.16) 1px, transparent 1px, transparent 12.5%),
            repeating-linear-gradient(to bottom, rgba(26,26,24,0.16) 0px, rgba(26,26,24,0.16) 1px, transparent 1px, transparent 96px)
          `,
        }}
      />

      {/* Header block — pulled up tight, minimal bottom margin, leaves the
          rest of the section clean for the carousel */}
      <div className="relative z-10 max-w-6xl mx-auto mb-6 md:mb-8">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#1a1a18]/60 mb-4"
        >
          THE DIGITAL SPECIMEN MANIFESTO / SPECIMENS 01–04
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="font-garamond text-[clamp(36px,6.4vw,88px)] leading-[1.05] mb-4"
        >
          A Study in Form and Function.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="max-w-[62ch] text-sm md:text-base leading-relaxed text-[#1a1a18]/80"
        >
          Every system we ship is treated the way a specimen is treated: dissected, diagrammed,
          rebuilt from first principles — then mounted, labelled, and verified before it goes live.
        </motion.p>
      </div>

      {/* The Roulette Stage — full-bleed, clean open band, no competing copy */}
      <div
        ref={stageRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full h-[480px] md:h-[580px] my-8 md:my-12"
        style={{ perspective: '1400px', cursor: 'crosshair' }}
      >
        <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
          {SLOTS.map((pod, i) => (
            <div
              key={`${pod.num}-${i}`}
              ref={(el) => (cardRefs.current[i] = el)}
              className="absolute top-1/2 left-1/2 will-change-transform"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div
                className="relative w-[250px] md:w-[310px] h-[380px] md:h-[440px] rounded-[32px] overflow-hidden pointer-events-none"
                style={{
                  background: `linear-gradient(160deg, ${pod.accent} 0%, ${pod.accentDark} 100%)`,
                  boxShadow: '0 34px 64px -18px rgba(26,26,24,0.4)',
                }}
              >
                {/* Watermark numeral — large, translucent, top-left */}
                <span
                  className="absolute -top-3 -left-2 font-garamond select-none"
                  style={{
                    fontSize: '150px',
                    lineHeight: 1,
                    color: 'rgba(255,255,255,0.16)',
                  }}
                >
                  {pod.num}
                </span>

                <p
                  className="absolute top-6 left-6 font-mono text-[9px] uppercase tracking-[0.22em]"
                  style={{ color: 'rgba(255,255,255,0.75)' }}
                >
                  {pod.fig}
                </p>

                {/* White specimen-label plate */}
                <div className="absolute left-4 right-4 bottom-4 bg-[#fbfaf7] rounded-2xl p-4 md:p-5 shadow-lg">
                  <h3 className="font-garamond text-lg md:text-xl text-[#1a1a18]">{pod.title}</h3>
                  <p className="text-[11px] md:text-xs leading-relaxed mt-2 text-[#1a1a18]/70">
                    {pod.body}
                  </p>
                  <div className="pt-2 mt-2 flex flex-col gap-0.5 border-t border-[#1a1a18]/15">
                    <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-[#1a1a18]/50">
                      {pod.meta1}
                    </p>
                    <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-[#1a1a18]/50">
                      {pod.meta2}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer meta — pushed well down, clear of the carousel */}
      <div className="relative z-10 max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mt-16 md:mt-24 pt-6 border-t border-[#1a1a18]/20">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#1a1a18]/50">
          // DESIGNED FOR THE HUMAN NERVOUS SYSTEM.
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#1a1a18]/50">
          SPECIMEN STANDARD · REV. 04.
        </p>
      </div>
    </section>
  );
}
