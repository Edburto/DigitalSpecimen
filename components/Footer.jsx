'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';

/**
 * Footer — The Forest Floor (Grand Finale)
 *
 * Structure and timing rhythm adapted from a full-viewport luxury hero
 * reference: bottom-anchored centered content, staggered fade-up entrance,
 * the same two easing curves reused throughout the site
 * (entrance: cubic-bezier(0.16,1,0.3,1), morph: cubic-bezier(0.76,0,0.24,1)).
 *
 * Key adaptation: the reference triggers its entrance on page mount, which
 * only makes sense for above-the-fold hero content. This is a footer — the
 * entrance triggers on scroll-into-view instead (framer-motion's
 * useInView), same stagger delays, different trigger.
 *
 * Background is a living forest-floor scene built from the same abstracted
 * SVG/CSS motion techniques already used in Section 2 (roots) and Section 4
 * (nodes) — fireflies (pulsing glow dots), crawling trail-lights (standing
 * in for ground insects), and swaying fern silhouettes (standing in for
 * real foliage). These are placeholders for real illustrated insect/plant
 * assets, not a finished illustration — same asset-pipeline gap as the
 * butterfly wing photo. Drop real PNGs into these same animated slots
 * later; the motion system underneath doesn't need to change.
 */

const FIREFLY_COUNT = 14;
const FIREFLIES = Array.from({ length: FIREFLY_COUNT }, (_, i) => ({
  id: i,
  left: `${(i * 37) % 100}%`,
  top: `${20 + ((i * 53) % 60)}%`,
  size: 3 + (i % 3),
  duration: 4 + (i % 5),
  delay: (i % 7) * 0.6,
  color: i % 3 === 0 ? '#5eead4' : i % 3 === 1 ? '#c9a878' : '#f0dcb8',
}));

const CRAWLERS = [
  { top: '82%', duration: 22, delay: 0, reverse: false },
  { top: '88%', duration: 28, delay: 4, reverse: true },
  { top: '76%', duration: 25, delay: 9, reverse: false },
];

const FERNS = [
  { left: '6%', height: 90, delay: 0 },
  { left: '18%', height: 60, delay: 0.4 },
  { left: '80%', height: 100, delay: 0.8 },
  { left: '92%', height: 70, delay: 0.2 },
];

export default function Footer() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-15% 0px' });

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden flex items-end justify-center bg-[#030302]"
    >
      {/* Background: living forest floor */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 50% 100%, #1c130c 0%, #0a0704 55%, #030302 100%)',
          }}
        />

        {/* Fern silhouettes, swaying */}
        {FERNS.map((fern, i) => (
          <svg
            key={i}
            className="absolute bottom-0"
            style={{
              left: fern.left,
              width: fern.height * 0.6,
              height: fern.height,
              transformOrigin: 'bottom center',
              animation: `ds-sway 6s ease-in-out ${fern.delay}s infinite`,
            }}
            viewBox="0 0 60 100"
          >
            <path
              d="M30 100 C30 70 10 60 5 20 M30 100 C30 65 50 55 55 15 M30 100 C30 50 30 40 30 0"
              fill="none"
              stroke="#2a3620"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        ))}

        {/* Crawling trail-lights — placeholder for ground insects */}
        {CRAWLERS.map((c, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              top: c.top,
              left: c.reverse ? undefined : '-2%',
              right: c.reverse ? '-2%' : undefined,
              background: '#c9a878',
              boxShadow: '0 0 8px 2px rgba(201,168,120,0.6)',
              animation: `${c.reverse ? 'ds-crawl-rev' : 'ds-crawl'} ${c.duration}s linear ${c.delay}s infinite`,
            }}
          />
        ))}

        {/* Fireflies */}
        {FIREFLIES.map((f) => (
          <div
            key={f.id}
            className="absolute rounded-full"
            style={{
              left: f.left,
              top: f.top,
              width: f.size,
              height: f.size,
              background: f.color,
              boxShadow: `0 0 ${f.size * 3}px ${f.size}px ${f.color}`,
              animation: `ds-firefly ${f.duration}s ease-in-out ${f.delay}s infinite`,
            }}
          />
        ))}

        {/* Soft vignette so the bottom text plate has somewhere to sit */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, transparent 0%, transparent 55%, rgba(3,3,2,0.65) 100%)',
          }}
        />
      </div>

      {/* Foreground — bottom-anchored, staggered entrance on scroll-into-view */}
      <div className="relative z-10 text-center px-6 pb-16 md:pb-24 max-w-4xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#5eead4] mb-5 md:mb-6"
        >
          SYSTEM_04 // FOREST FLOOR
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="text-white text-[2.5rem] leading-[0.95] sm:text-5xl md:text-6xl lg:text-7xl mb-5 md:mb-6"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          The forest floor
          <br className="hidden sm:block" />
          never stops working.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-white/70 text-base md:text-lg mb-8 md:mb-10 max-w-md mx-auto font-sans"
        >
          Every signal, every system, every specimen — engineered to keep moving
          long after the site goes quiet.
        </motion.p>

        <motion.a
          href="#audit"
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="inline-block px-8 py-3.5 bg-[#5eead4] text-[#030302] text-sm md:text-base font-medium rounded-full hover:bg-[#8ff2e0] transition-colors font-mono uppercase tracking-[0.1em]"
        >
          [ Initialize Your System Audit ]
        </motion.a>
      </div>

      {/* Closing metadata row */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.9, delay: 0.9 }}
        className="absolute bottom-6 left-6 right-6 md:left-10 md:right-10 z-10 flex flex-col sm:flex-row justify-between items-center gap-2 text-[10px] uppercase font-mono tracking-[0.25em] text-white/40"
      >
        <span>DIGITAL SPECIMEN © 2026. MELBOURNE / GLOBAL.</span>
        <span>SYSTEM VERIFIED // SECURE PIPELINE</span>
      </motion.div>

      <style jsx>{`
        @keyframes ds-firefly {
          0%,
          100% {
            opacity: 0.15;
            transform: translate(0, 0);
          }
          50% {
            opacity: 1;
            transform: translate(12px, -18px);
          }
        }
        @keyframes ds-sway {
          0%,
          100% {
            transform: rotate(-2deg);
          }
          50% {
            transform: rotate(2deg);
          }
        }
        @keyframes ds-crawl {
          from {
            left: -2%;
          }
          to {
            left: 102%;
          }
        }
        @keyframes ds-crawl-rev {
          from {
            right: -2%;
          }
          to {
            right: 102%;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*='ds-firefly'],
          [style*='ds-sway'],
          [style*='ds-crawl'] {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}
