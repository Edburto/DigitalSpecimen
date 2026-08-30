'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import SectionBreak from './SectionBreak';

/**
 * Section 3 — Services Plate (Curved Carousel v5)
 *
 * Card content updated to the three actual services (Decision Graph
 * Audit / Signal Engineering / Pipeline Monitoring) — carousel mechanics
 * below are unchanged from the original Manifesto build.
 *
 * THE ARC: cards curve along a real cosine arc (y = ARC_HEIGHT * (1 -
 * cos(norm * PI/2))) instead of a linear ramp — this is what actually reads
 * as "sitting on a curved track" rather than "cards tilted on a flat row".
 * ARC_HEIGHT is large enough (72px) that the curve is unmistakable even at
 * a glance.
 *
 * THE LABEL PLATE: taller (covers ~58% of card height, not a thin strip)
 * and every type size bumped up a full step so body copy is comfortably
 * readable at rest, not just at full zoom.
 *
 * CLICK-TO-ZOOM: clicking any card (a real click, not a drag) centers it
 * via the shortest path AND marks it "selected" — while selected, that
 * card gets an extra scale boost when centered and autoplay stays paused
 * indefinitely (not just the normal 1.4s idle window). Clicking empty
 * space, or clicking the same card again, releases the zoom and autoplay
 * resumes normally. Category pills use the same selection path, so picking
 * a pill also zooms and locks.
 */

const UNIQUE_PODS = [
  {
    num: '01',
    fig: 'FIG. A — DIAGNOSTIC',
    title: 'Decision Graph Audit',
    body: 'We map every touchpoint a buyer passes through and flag exactly where the decision stalls or leaks.',
    meta1: 'OUTPUT: FULL DECISION MAP',
    meta2: 'METHOD: TRACE / MEASURE',
    accent: '#c9a878',
    accentDark: '#8a6a3d',
    category: 'Decision Graph Audit',
  },
  {
    num: '02',
    fig: 'FIG. B — EXECUTION',
    title: 'Signal Engineering',
    body: 'We build the messaging, creative, and structure that move a buyer through each layer of the decision — fast, trusted, proven.',
    meta1: 'LAYERS: FILTER / TRUST / LOGIC',
    meta2: 'METHOD: BUILD / DEPLOY',
    accent: '#0f766e',
    accentDark: '#0b4f4a',
    category: 'Signal Engineering',
  },
  {
    num: '03',
    fig: 'FIG. C — MAINTENANCE',
    title: 'Pipeline Monitoring',
    body: 'Ongoing measurement of the decision graph, so performance is tracked like uptime, not guessed at quarterly.',
    meta1: 'CADENCE: CONTINUOUS',
    meta2: 'METHOD: MONITOR / REPORT',
    accent: '#b3491f',
    accentDark: '#7a3015',
    category: 'Pipeline Monitoring',
  },
];

const N_UNIQUE = UNIQUE_PODS.length;
const REPEAT = 3;
const VIRTUAL = N_UNIQUE * REPEAT;
const HALF = VIRTUAL / 2;

const SLOTS = Array.from({ length: VIRTUAL }, (_, i) => UNIQUE_PODS[i % N_UNIQUE]);

const SPACING_PX = 240;
const VISIBLE_RANGE = 4.2;
const ARC_HEIGHT = 72; // px — how pronounced the curve is at the extremes
const AUTOPLAY_STEP = 0.003;
const IDLE_MS = 1400;
const EASE = 0.09;
const DRAG_SENSITIVITY = 1 / SPACING_PX;
const WHEEL_SENSITIVITY = 1 / 320;
const CLICK_MOVE_THRESHOLD = 6; // px — below this, a pointerdown+up is a click, not a drag

function wrapDelta(delta) {
  return (((delta + HALF) % VIRTUAL) + VIRTUAL) % VIRTUAL - HALF;
}

function applyCardStyle(cardEl, glowEl, diff, isSelectedSlot) {
  const norm = diff / VISIBLE_RANGE;
  const clampedNorm = Math.max(-1.7, Math.min(1.7, norm));
  const absNorm = Math.min(1, Math.abs(clampedNorm));

  const x = diff * SPACING_PX;
  // True cosine arc — accelerating curve, not a linear ramp
  const y = ARC_HEIGHT * (1 - Math.cos(absNorm * (Math.PI / 2)));
  const rotateY = Math.max(-52, Math.min(52, clampedNorm * -42));

  const isCentered = Math.abs(diff) < 0.5;
  const zoomBoost = isSelectedSlot && isCentered ? 1 + (1 - Math.abs(diff) / 0.5) * 0.16 : 1;

  const scale = Math.max(0.5, 1 - absNorm * 0.42) * zoomBoost;
  const opacity = Math.max(0.15, 1 - Math.abs(clampedNorm) * 0.72);
  const blur = Math.min(2.5, Math.abs(clampedNorm) * 2.2);
  const brightness = Math.max(0.55, 1 - Math.abs(clampedNorm) * 0.4);
  const z = Math.round(1000 - Math.abs(diff) * 40 + (isSelectedSlot ? 500 : 0));

  cardEl.style.transform = `translate(-50%, -50%) translateX(${x}px) translateY(${y}px) rotateY(${rotateY}deg) scale(${scale})`;
  cardEl.style.opacity = String(opacity);
  cardEl.style.filter = `blur(${blur}px) brightness(${brightness})`;
  cardEl.style.zIndex = String(z);

  const glowStrength = Math.max(0, 1 - Math.abs(diff) / 0.9);
  if (glowEl) {
    if (glowStrength > 0.01) {
      const extra = isSelectedSlot ? 0.25 : 0;
      glowEl.style.boxShadow = `0 34px 64px -18px rgba(26,26,24,0.4), 0 0 0 ${
        1.5 + glowStrength * 1.5
      }px rgba(94,234,212,${0.25 + glowStrength * (0.55 + extra)}), 0 0 ${
        20 + glowStrength * 46
      }px rgba(94,234,212,${glowStrength * (0.55 + extra)})`;
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
  const dragStartYRef = useRef(0);
  const dragStartPosRef = useRef(0);
  const dragMovedRef = useRef(0);
  const lastInteractionRef = useRef(0);
  const rafRef = useRef(null);
  const activeUniqueRef = useRef(-1);
  const selectedUniqueRef = useRef(-1);

  const [reducedMotion, setReducedMotion] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(-1);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        applyCardStyle(el, glowRefs.current[i], wrapDelta(i), false);
      });
      return;
    }

    function frame() {
      const idle =
        !isDraggingRef.current &&
        selectedUniqueRef.current === -1 &&
        Date.now() - lastInteractionRef.current > IDLE_MS;
      if (idle) targetRef.current += AUTOPLAY_STEP;

      const delta = wrapDelta(targetRef.current - posRef.current);
      posRef.current += delta * EASE;
      posRef.current = ((posRef.current % VIRTUAL) + VIRTUAL) % VIRTUAL;

      let nearestUnique = -1;
      let nearestAbs = Infinity;

      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        const diff = wrapDelta(i - posRef.current);
        const uniqueIdx = i % N_UNIQUE;
        applyCardStyle(el, glowRefs.current[i], diff, uniqueIdx === selectedUniqueRef.current);
        if (Math.abs(diff) < nearestAbs) {
          nearestAbs = Math.abs(diff);
          nearestUnique = uniqueIdx;
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

  function selectPod(uniqueIndex) {
    if (selectedUniqueRef.current === uniqueIndex) {
      // clicking the already-selected (centered) pod again releases the zoom
      selectedUniqueRef.current = -1;
      setSelectedCategory(-1);
    } else {
      selectedUniqueRef.current = uniqueIndex;
      setSelectedCategory(uniqueIndex);
      let best = null;
      for (let rep = 0; rep < REPEAT; rep++) {
        const slot = uniqueIndex + rep * N_UNIQUE;
        const d = wrapDelta(slot - posRef.current);
        if (best === null || Math.abs(d) < Math.abs(best)) best = d;
      }
      targetRef.current = posRef.current + best;
    }
    markInteraction();
  }

  function deselect() {
    selectedUniqueRef.current = -1;
    setSelectedCategory(-1);
    markInteraction();
  }

  function handlePointerDown(e) {
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    dragStartYRef.current = e.clientY;
    dragStartPosRef.current = posRef.current;
    dragMovedRef.current = 0;
    markInteraction();
    stageRef.current?.setPointerCapture?.(e.pointerId);
  }

  function handlePointerMove(e) {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - dragStartXRef.current;
    const deltaY = e.clientY - dragStartYRef.current;
    dragMovedRef.current = Math.max(dragMovedRef.current, Math.hypot(deltaX, deltaY));
    const newPos = dragStartPosRef.current - deltaX * DRAG_SENSITIVITY;
    posRef.current = ((newPos % VIRTUAL) + VIRTUAL) % VIRTUAL;
    targetRef.current = posRef.current;
    markInteraction();
  }

  function handlePointerUp(e) {
    isDraggingRef.current = false;
    if (dragMovedRef.current < CLICK_MOVE_THRESHOLD) {
      const target = e.target.closest('[data-slot-index]');
      if (target) {
        const slotIndex = Number(target.dataset.slotIndex);
        selectPod(slotIndex % N_UNIQUE);
      } else {
        deselect();
      }
    }
    markInteraction();
  }

  function handleWheel(e) {
    e.preventDefault();
    const delta = (Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY) * WHEEL_SENSITIVITY;
    targetRef.current += delta;
    if (selectedUniqueRef.current !== -1) deselect();
    markInteraction();
  }

  function step(dir) {
    targetRef.current += dir;
    if (selectedUniqueRef.current !== -1) deselect();
    markInteraction();
  }

  return (
    <section className="relative w-full bg-[#f6f5f2] text-[#1a1a18] font-sans overflow-hidden px-6 md:px-12 pt-0 pb-32 md:pb-40">
      <SectionBreak label="SECTION_03 // SERVICES" bg="#f6f5f2" tone="light" />

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
          WHAT WE DELIVER / SERVICES 01–03
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="font-garamond text-[clamp(36px,6.4vw,88px)] leading-[1.05] mb-4"
        >
          Three services. One system.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="max-w-[62ch] text-sm md:text-base leading-relaxed text-[#1a1a18]/80"
        >
          Each engagement starts with the audit, builds the fix, then keeps it measured.
          You can start at step one and stop there, or run all three as a single pipeline.
        </motion.p>
      </div>

      <div className="relative">
        <div
          ref={stageRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onWheel={handleWheel}
          className="relative w-full h-[520px] md:h-[640px] my-8 md:my-12 touch-none select-none"
          style={{ perspective: '1400px', cursor: 'grab' }}
        >
          <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
            {SLOTS.map((pod, i) => (
              <div
                key={`${pod.num}-${i}`}
                ref={(el) => (cardRefs.current[i] = el)}
                data-slot-index={i}
                className="absolute top-1/2 left-1/2 will-change-transform"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div
                  ref={(el) => (glowRefs.current[i] = el)}
                  data-slot-index={i}
                  className="relative w-[270px] md:w-[340px] h-[430px] md:h-[500px] rounded-[32px] overflow-hidden will-change-transform"
                  style={{
                    background: `linear-gradient(160deg, ${pod.accent} 0%, ${pod.accentDark} 100%)`,
                    boxShadow: '0 34px 64px -18px rgba(26,26,24,0.4)',
                  }}
                >
                  <span
                    className="absolute -top-3 -left-2 font-garamond select-none pointer-events-none"
                    style={{ fontSize: '150px', lineHeight: 1, color: 'rgba(255,255,255,0.16)' }}
                  >
                    {pod.num}
                  </span>

                  <p
                    className="absolute top-6 left-6 font-mono text-[10px] uppercase tracking-[0.22em] pointer-events-none"
                    style={{ color: 'rgba(255,255,255,0.75)' }}
                  >
                    {pod.fig}
                  </p>

                  {/* Taller label plate — ~58% of card height, bigger type throughout */}
                  <div
                    className="absolute left-4 right-4 bottom-4 bg-[#fbfaf7] rounded-2xl p-5 md:p-6 shadow-lg flex flex-col pointer-events-none"
                    style={{ top: '40%' }}
                  >
                    <h3 className="font-garamond text-2xl md:text-3xl text-[#1a1a18]">{pod.title}</h3>
                    <p className="text-sm md:text-base leading-relaxed mt-3 text-[#1a1a18]/70 flex-1">
                      {pod.body}
                    </p>
                    <div className="pt-3 mt-3 flex flex-col gap-1 border-t border-[#1a1a18]/15">
                      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#1a1a18]/50">
                        {pod.meta1}
                      </p>
                      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#1a1a18]/50">
                        {pod.meta2}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

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

      <div className="relative z-10 max-w-6xl mx-auto flex flex-wrap justify-center gap-3 mt-4 md:mt-6">
        {UNIQUE_PODS.map((pod, i) => (
          <button
            key={pod.category}
            type="button"
            onClick={() => selectPod(i)}
            className="font-mono text-[10px] uppercase tracking-[0.18em] px-4 py-2 rounded-full border transition-colors"
            style={{
              borderColor: i === activeCategory ? pod.accent : 'rgba(26,26,24,0.2)',
              backgroundColor: i === activeCategory ? pod.accent : 'transparent',
              color: i === activeCategory ? '#fbfaf7' : 'rgba(26,26,24,0.6)',
              boxShadow: i === selectedCategory ? `0 0 0 2px ${pod.accent}` : 'none',
            }}
          >
            {pod.category}
          </button>
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mt-16 md:mt-24 pt-6 border-t border-[#1a1a18]/20">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#1a1a18]/50">
          // AUDIT FIRST. BUILD SECOND. MEASURE ALWAYS.
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#1a1a18]/50">
          SERVICE LADDER · REV. 01.
        </p>
      </div>
    </section>
  );
}
