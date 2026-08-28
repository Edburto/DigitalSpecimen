'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

/**
 * Section 3 — Manifesto Plate (Curved Carousel v4)
 *
 * Navigation: click-drag, mouse-wheel, and arrow buttons all move the strip.
 * Idle autoplay resumes only after a short pause with no interaction.
 *
 * Focus state: the slot nearest center gets a glowing cyan border, computed
 * every frame from its actual distance-from-center (not a hard on/off toggle
 * — it's a continuous glow strength that peaks exactly at center).
 *
 * Curve: cards curve away in both rotation (rotateY) AND vertical position
 * (translateY) as they move from center — a true arc, not just a flat row
 * with rotated cards.
 *
 * Category pills below the carousel jump the strip to a given pod (shortest
 * path around the loop) and stay highlighted whenever that pod is centered.
 *
 * All motion is imperative (refs + rAF, not React state per frame) —
 * `will-change: transform` is set on every card for GPU acceleration.
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
    category: 'Structural Engineering',
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
    category: 'Neural Architecture',
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
    category: 'Demand Systems',
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
    category: 'Biomorphic UI',
  },
];

const N_UNIQUE = UNIQUE_PODS.length;
const REPEAT = 3;
const VIRTUAL = N_UNIQUE * REPEAT; // 12 slots on the loop
const HALF = VIRTUAL / 2;

const SLOTS = Array.from({ length: VIRTUAL }, (_, i) => UNIQUE_PODS[i % N_UNIQUE]);

const SPACING_PX = 230;
const VISIBLE_RANGE = 4.2;
const AUTOPLAY_STEP = 0.003;
const IDLE_MS = 1400; // how long after interaction before autoplay resumes
const EASE = 0.09;
const DRAG_SENSITIVITY = 1 / SPACING_PX;
const WHEEL_SENSITIVITY = 1 / 320;

function wrapDelta(delta) {
  return (((delta + HALF) % VIRTUAL) + VIRTUAL) % VIRTUAL - HALF;
}

function applyCardStyle(cardEl, glowEl, diff) {
  const norm = diff / VISIBLE_RANGE;
  const clampedNorm = Math.max(-1.7, Math.min(1.7, norm));
  const absNorm = Math.min(1, Math.abs(clampedNorm));

  const x = diff * SPACING_PX;
  const y = absNorm * 30; // vertical arc — sides sit lower, like a curved track
  const rotateY = Math.max(-58, Math.min(58, clampedNorm * -46));
  const scale = Math.max(0.5, 1 - absNorm * 0.42);
  const opacity = Math.max(0.15, 1 - Math.abs(clampedNorm) * 0.72);
  const blur = Math.min(2.5, Math.abs(clampedNorm) * 2.2);
  const brightness = Math.max(0.55, 1 - Math.abs(clampedNorm) * 0.4);
  const z = Math.round(1000 - Math.abs(diff) * 40);

  cardEl.style.transform = `translate(-50%, -50%) translateX(${x}px) translateY(${y}px) rotateY(${rotateY}deg) scale(${scale})`;
  cardEl.style.opacity = String(opacity);
  cardEl.style.filter = `blur(${blur}px) brightness(${brightness})`;
  cardEl.style.zIndex = String(z);

  // Continuous glow strength peaking exactly at center, gone by diff=0.9
  const glowStrength = Math.max(0, 1 - Math.abs(diff) / 0.9);
  if (glowEl) {
    if (glowStrength > 0.01) {
      glowEl.style.boxShadow = `0 34px 64px -18px rgba(26,26,24,0.4), 0 0 0 ${
        1.5 + glowStrength * 1.5
      }px rgba(94,234,212,${0.25 + glowStrength * 0.55}), 0 0 ${
        20 + glowStrength * 40
      }px rgba(94,234,212,${glowStrength * 0.55})`;
    } else {
      glowEl.style.boxShadow = '0 34px 64px -18px rgba(26,26,24,0.4)';
    }
  }
}

export default function Section3Manifesto() {
  const stageRef = useRef(null);
  const cardRefs = useRef([]);
  const glowRefs = useRef([]);
  const posRef = useRef(0);
  const targetRef = useRef(0);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartPosRef = useRef(0);
  const lastInteractionRef = useRef(0);
  const rafRef = useRef(null);
  const activeUniqueRef = useRef(-1);

  const [reducedMotion, setReducedMotion] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        applyCardStyle(el, glowRefs.current[i], wrapDelta(i));
      });
      return;
    }

    function frame() {
      const idle = !isDraggingRef.current && Date.now() - lastInteractionRef.current > IDLE_MS;
      if (idle) {
        targetRef.current += AUTOPLAY_STEP;
      }

      const delta = wrapDelta(targetRef.current - posRef.current);
      posRef.current += delta * EASE;
      posRef.current = ((posRef.current % VIRTUAL) + VIRTUAL) % VIRTUAL;

      let nearestUnique = -1;
      let nearestAbs = Infinity;

      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        const diff = wrapDelta(i - posRef.current);
        applyCardStyle(el, glowRefs.current[i], diff);
        if (Math.abs(diff) < nearestAbs) {
          nearestAbs = Math.abs(diff);
          nearestUnique = i % N_UNIQUE;
        }
      });

      if (nearestUnique !== activeUniqueRef.current) {
        activeUniqueRef.current = nearestUnique;
        setActiveCategory(nearestUnique);
      }

      rafRef.current = requestAnimationFrame(frame);
    }

    rafRef.current = requestAnimationFrame(frame);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [reducedMotion]);

  const markInteraction = useCallback(() => {
    lastInteractionRef.current = Date.now();
  }, []);

  function handlePointerDown(e) {
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    dragStartPosRef.current = posRef.current;
    markInteraction();
    stageRef.current?.setPointerCapture?.(e.pointerId);
  }

  function handlePointerMove(e) {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - dragStartXRef.current;
    const newPos = dragStartPosRef.current - deltaX * DRAG_SENSITIVITY;
    posRef.current = ((newPos % VIRTUAL) + VIRTUAL) % VIRTUAL;
    targetRef.current = posRef.current;
    markInteraction();
  }

  function handlePointerUp() {
    isDraggingRef.current = false;
    markInteraction();
  }

  function handleWheel(e) {
    e.preventDefault();
    const delta = (Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY) * WHEEL_SENSITIVITY;
    targetRef.current += delta;
    markInteraction();
  }

  function step(dir) {
    targetRef.current += dir;
    markInteraction();
  }

  function goToCategory(uniqueIndex) {
    // shortest-path jump to the nearest occurrence of this pod on the loop
    let best = null;
    for (let rep = 0; rep < REPEAT; rep++) {
      const slot = uniqueIndex + rep * N_UNIQUE;
      const d = wrapDelta(slot - posRef.current);
      if (best === null || Math.abs(d) < Math.abs(best)) best = d;
    }
    targetRef.current = posRef.current + best;
    markInteraction();
  }

  return (
    <section className="relative w-full bg-[#f6f5f2] text-[#1a1a18] font-sans overflow-hidden px-6 md:px-12 pt-0 pb-32 md:pb-40">
      {/* Dark-to-light transition bridge from Section 2's #030302 */}
      <div
        className="absolute top-0 left-0 right-0 h-[140px] md:h-[200px] pointer-events-none z-20"
        style={{ background: 'linear-gradient(180deg, #030302 0%, #f6f5f2 100%)' }}
      />

      {/* Printed hairline grid underlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            repeating-linear-gradient(to right, rgba(26,26,24,0.16) 0px, rgba(26,26,24,0.16) 1px, transparent 1px, transparent 12.5%),
            repeating-linear-gradient(to bottom, rgba(26,26,24,0.16) 0px, rgba(26,26,24,0.16) 1px, transparent 1px, transparent 96px)
          `,
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto pt-16 md:pt-20 mb-6 md:mb-8">
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

      {/* The Carousel Stage */}
      <div className="relative">
        <div
          ref={stageRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onWheel={handleWheel}
          className="relative w-full h-[480px] md:h-[580px] my-8 md:my-12 touch-none select-none"
          style={{ perspective: '1400px', cursor: isDraggingRef.current ? 'grabbing' : 'grab' }}
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
                  ref={(el) => (glowRefs.current[i] = el)}
                  className="relative w-[250px] md:w-[310px] h-[380px] md:h-[440px] rounded-[32px] overflow-hidden pointer-events-none will-change-transform"
                  style={{
                    background: `linear-gradient(160deg, ${pod.accent} 0%, ${pod.accentDark} 100%)`,
                    boxShadow: '0 34px 64px -18px rgba(26,26,24,0.4)',
                  }}
                >
                  <span
                    className="absolute -top-3 -left-2 font-garamond select-none"
                    style={{ fontSize: '150px', lineHeight: 1, color: 'rgba(255,255,255,0.16)' }}
                  >
                    {pod.num}
                  </span>

                  <p
                    className="absolute top-6 left-6 font-mono text-[9px] uppercase tracking-[0.22em]"
                    style={{ color: 'rgba(255,255,255,0.75)' }}
                  >
                    {pod.fig}
                  </p>

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

        {/* Arrow navigation */}
        <button
          type="button"
          aria-label="Previous specimen"
          onClick={() => step(-1)}
          className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full border border-[#1a1a18]/25 bg-[#f6f5f2]/90 backdrop-blur flex items-center justify-center hover:border-[#1a1a18] transition-colors"
        >
          <span className="font-mono text-sm">←</span>
        </button>
        <button
          type="button"
          aria-label="Next specimen"
          onClick={() => step(1)}
          className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full border border-[#1a1a18]/25 bg-[#f6f5f2]/90 backdrop-blur flex items-center justify-center hover:border-[#1a1a18] transition-colors"
        >
          <span className="font-mono text-sm">→</span>
        </button>
      </div>

      {/* Category filter pills */}
      <div className="relative z-10 max-w-6xl mx-auto flex flex-wrap justify-center gap-3 mt-4 md:mt-6">
        {UNIQUE_PODS.map((pod, i) => (
          <button
            key={pod.category}
            type="button"
            onClick={() => goToCategory(i)}
            className="font-mono text-[10px] uppercase tracking-[0.18em] px-4 py-2 rounded-full border transition-colors"
            style={{
              borderColor: i === activeCategory ? pod.accent : 'rgba(26,26,24,0.2)',
              backgroundColor: i === activeCategory ? pod.accent : 'transparent',
              color: i === activeCategory ? '#fbfaf7' : 'rgba(26,26,24,0.6)',
            }}
          >
            {pod.category}
          </button>
        ))}
      </div>

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
