'use client';

/**
 * Section 2 — Where Decisions Fail
 *
 * Replaces the old roots/wing/plate organic panels with a schematic
 * pipeline diagram, reusing the exact SVG path-draw technique from the
 * previous version (motion.path with pathLength 0 → 1 on scroll-into-view)
 * — the mechanic maps directly onto "a decision path tracing through a
 * pipeline" without needing new animation code, just new path data.
 *
 * Panel 1 draws a straight pipeline with a visible gap (the leak point).
 * Panel 2 and 3 keep the original's three-beat pacing (claim → reframe →
 * proof) but in infrastructure register instead of biological.
 */

import { motion } from 'framer-motion';
import SectionBreak from './SectionBreak';

const PIPELINE_Y = 450;
const NODE_XS = [120, 420, 720, 1020, 1320, 1480];

export default function Section2SoilCutaway() {
  return (
    <section className="relative w-full bg-[#030302] text-[#f6f5f2] font-sans overflow-hidden">
      <SectionBreak label="SECTION_02 // DECISION_GRAPH" bg="#030302" tone="dark" />

      {/* Panel 1 — The pipeline, with a visible leak */}
      <div className="relative min-h-screen w-full overflow-hidden flex flex-col justify-center px-6 md:px-12 py-24">
        <div className="absolute top-8 left-8 right-8 z-30 flex justify-between items-center text-[10px] uppercase font-mono tracking-[0.28em] text-white/50">
          <span>TRACE // DECISION PATH</span>
          <span>SYSTEM_01 // PIPELINE</span>
        </div>

        <div
          className="absolute inset-0 z-0 opacity-70 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, #030302 0%, #0c0f0e 28%, #10120f 52%, #0a0b09 78%, #030302 100%)',
          }}
        />
        <div
          className="absolute inset-0 z-0 opacity-[0.1] pointer-events-none"
          style={{
            backgroundImage: `
              repeating-linear-gradient(to right, rgba(246,245,242,0.6) 0px, rgba(246,245,242,0.6) 1px, transparent 1px, transparent 64px),
              repeating-linear-gradient(to bottom, rgba(246,245,242,0.6) 0px, rgba(246,245,242,0.6) 1px, transparent 1px, transparent 64px)
            `,
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
            FIG. 01 — PIPELINE TRACE
          </p>
          <h2
            className="text-3xl md:text-5xl font-normal tracking-tight"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            Every funnel has failure points most teams can't see.
          </h2>
        </motion.div>

        <div className="absolute inset-x-0 bottom-0 z-10 h-[56%] md:h-[62%] flex items-center justify-center pointer-events-none">
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 1600 900"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <filter id="pipeGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <g filter="url(#pipeGlow)">
              {/* Healthy segments */}
              <motion.path
                d={`M${NODE_XS[0]} ${PIPELINE_Y} L${NODE_XS[1]} ${PIPELINE_Y}`}
                fill="none"
                stroke="#5eead4"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
              />
              <motion.path
                d={`M${NODE_XS[1]} ${PIPELINE_Y} L${NODE_XS[2]} ${PIPELINE_Y}`}
                fill="none"
                stroke="#5eead4"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.9, delay: 0.2, ease: 'easeOut' }}
              />

              {/* The leak — broken segment, drops down and stops short */}
              <motion.path
                d={`M${NODE_XS[2]} ${PIPELINE_Y} C${NODE_XS[2] + 120} ${PIPELINE_Y + 40}, ${NODE_XS[2] + 180} ${PIPELINE_Y + 140}, ${NODE_XS[2] + 160} ${PIPELINE_Y + 220}`}
                fill="none"
                stroke="#b3491f"
                strokeWidth="2"
                strokeDasharray="6 8"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 0.8 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.7, delay: 0.5, ease: 'easeOut' }}
              />

              {/* Pipeline resumes past the gap */}
              <motion.path
                d={`M${NODE_XS[3]} ${PIPELINE_Y} L${NODE_XS[4]} ${PIPELINE_Y}`}
                fill="none"
                stroke="#5eead4"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.9, delay: 0.8, ease: 'easeOut' }}
              />
              <motion.path
                d={`M${NODE_XS[4]} ${PIPELINE_Y} L${NODE_XS[5]} ${PIPELINE_Y}`}
                fill="none"
                stroke="#5eead4"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.9, delay: 1, ease: 'easeOut' }}
              />

              {NODE_XS.map((x, i) => (
                <motion.rect
                  key={i}
                  x={x - 7}
                  y={PIPELINE_Y - 7}
                  width="14"
                  height="14"
                  fill="none"
                  stroke={i === 2 ? '#b3491f' : '#5eead4'}
                  strokeWidth="1.5"
                  initial={{ opacity: 0, scale: 0.6 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.15 }}
                />
              ))}

              <motion.text
                x={NODE_XS[2] + 60}
                y={PIPELINE_Y + 260}
                fill="#b3491f"
                fontFamily="'JetBrains Mono', monospace"
                fontSize="13"
                letterSpacing="2"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 0.85 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: 1.1 }}
              >
                LEAK DETECTED
              </motion.text>
            </g>
          </svg>
        </div>
      </div>

      {/* Panel 2 — Reframe */}
      <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center px-6">
        <div
          className="absolute inset-0 opacity-70 pointer-events-none"
          style={{ background: 'linear-gradient(160deg, #0a0f0c 0%, #030302 60%)' }}
        />
        <div
          className="absolute inset-0 z-0 opacity-[0.08] pointer-events-none"
          style={{
            backgroundImage: `
              repeating-linear-gradient(to right, rgba(246,245,242,0.6) 0px, rgba(246,245,242,0.6) 1px, transparent 1px, transparent 64px),
              repeating-linear-gradient(to bottom, rgba(246,245,242,0.6) 0px, rgba(246,245,242,0.6) 1px, transparent 1px, transparent 64px)
            `,
          }}
        />

        <div className="absolute top-8 left-8 right-8 z-30 flex justify-between items-center text-[10px] uppercase font-mono tracking-[0.28em] text-white/70">
          <span>SCROLL ↓ TO CONTINUE TRACE</span>
          <span>SYSTEM_02 // DIAGNOSIS</span>
        </div>

        <motion.div
          className="relative z-20 max-w-md text-center border border-[#5eead4]/30 bg-[#030302]/70 backdrop-blur-sm px-8 py-8"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-xs font-mono tracking-[0.3em] text-[#5eead4] mb-2">
            FIG. 02 — ROOT CAUSE
          </p>
          <h3
            className="text-2xl md:text-4xl font-normal tracking-tight"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            What looks like a design problem is usually a systems problem.
          </h3>
        </motion.div>
      </div>

      {/* Panel 3 — Proof of method */}
      <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center px-6 py-24">
        <div
          className="absolute inset-0 opacity-70 pointer-events-none"
          style={{ background: 'linear-gradient(180deg, #030302 0%, #0a0b09 50%, #030302 100%)' }}
        />

        <div className="absolute top-8 left-8 right-8 z-30 flex justify-between items-center text-[10px] uppercase font-mono tracking-[0.28em] text-white/50">
          <span>METHOD · TRACE, DON'T GUESS</span>
          <span>SYSTEM_03 // PROOF</span>
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
            PLATE VII — METHOD
          </p>
          <h3
            className="text-2xl md:text-3xl font-normal tracking-tight text-center mb-4"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            We don't guess where decisions leak. We trace them.
          </h3>
          <p className="text-sm md:text-base leading-relaxed text-white/70 text-center font-sans">
            Every touchpoint gets mapped as a node in the graph, every drop-off gets logged as a
            break in the trace. Nothing ships as "probably fine" — it ships measured, or it
            doesn't ship.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
