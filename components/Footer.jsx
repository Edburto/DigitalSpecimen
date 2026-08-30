'use client';

import { useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import SectionBreak from './SectionBreak';

/**
 * Footer — System Online
 *
 * Structure/timing kept from the original build (bottom-anchored centered
 * content, staggered fade-up entrance on scroll-into-view). Background
 * swapped from the forest-floor firefly/fern scene to the same
 * grid + signal-node motif used in the Hero and the pipeline break in
 * Section 2, so the site closes on the same visual system it opened with.
 */

const NODES = [
  { left: '10%', top: '30%', size: 9, delay: 0 },
  { left: '24%', top: '68%', size: 7, delay: 0.6 },
  { left: '46%', top: '22%', size: 8, delay: 1.2 },
  { left: '68%', top: '58%', size: 10, delay: 0.3 },
  { left: '82%', top: '28%', size: 7, delay: 1.6 },
  { left: '90%', top: '70%', size: 8, delay: 0.9 },
];

export default function Footer() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-15% 0px' });

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden flex items-end justify-center bg-[#030302]"
    >
      <SectionBreak label="SECTION_05 // FOOTER" bg="#030302" tone="dark" />

      {/* Background: grid + signal nodes, same system as the Hero */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at 50% 100%, #0c0f0e 0%, #050605 55%, #030302 100%)' }}
        />
        <div
          className="absolute inset-0 opacity-[0.1] pointer-events-none"
          style={{
            backgroundImage: `
              repeating-linear-gradient(to right, rgba(246,245,242,0.6) 0px, rgba(246,245,242,0.6) 1px, transparent 1px, transparent 64px),
              repeating-linear-gradient(to bottom, rgba(246,245,242,0.6) 0px, rgba(246,245,242,0.6) 1px, transparent 1px, transparent 64px)
            `,
          }}
        />

        {NODES.map((n, i) => (
          <span
            key={i}
            className="absolute rounded-full"
            style={{
              left: n.left,
              top: n.top,
              width: n.size,
              height: n.size,
              background: i % 2 === 0 ? '#5eead4' : '#c9a878',
              boxShadow: `0 0 ${n.size * 2.4}px ${n.size * 0.6}px ${i % 2 === 0 ? 'rgba(94,234,212,0.5)' : 'rgba(201,168,120,0.5)'}`,
              animation: `ds-signal-pulse 5s ease-in-out ${n.delay}s infinite`,
            }}
          />
        ))}

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
          SYSTEM STATUS: OPERATIONAL
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="text-white text-[2.5rem] leading-[0.95] sm:text-5xl md:text-6xl lg:text-7xl mb-5 md:mb-6"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          Your decision graph
          <br className="hidden sm:block" />
          is waiting to be traced.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-white/70 text-base md:text-lg mb-8 md:mb-10 max-w-md mx-auto font-sans"
        >
          Every signal, every layer, every leak — engineered to keep working long after the
          audit's done.
        </motion.p>

        <motion.a
          href="#audit"
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="inline-block px-8 py-3.5 bg-[#5eead4] text-[#030302] text-sm md:text-base font-medium rounded-full hover:bg-[#8ff2e0] transition-colors font-mono uppercase tracking-[0.1em]"
        >
          [ Request a Decision Graph Audit ]
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
        @keyframes ds-signal-pulse {
          0%,
          100% {
            opacity: 0.25;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.25);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*='ds-signal-pulse'] {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}
