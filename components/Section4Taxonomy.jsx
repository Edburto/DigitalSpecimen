'use client';

import { motion } from 'framer-motion';

/**
 * Section 4 — System Taxonomy (The Triune Brain)
 *
 * Node/connector mechanic adapted from a reference spec (LŪMEN // ÍNDEX):
 * three absolutely-positioned square nodes, each with a label group
 * connected back to it by an elbowed SVG line (one horizontal run, one
 * diagonal into the square's corner). Restyled entirely into our system —
 * bronze/gold circuit-trace color instead of white, dark #171310 base per
 * the original Taxonomy spec, EB Garamond + JetBrains Mono type.
 *
 * Geometry (percentages) is carried over directly from the reference —
 * it's proven layout math for how the elbows land exactly on each square's
 * corner — only the content, palette, and animation trigger changed
 * (viewport-triggered on scroll here, not a fixed hero timeline).
 *
 * Below md, the absolute diagram is replaced by a stacked list so the
 * content itself isn't lost on mobile — the reference hides its nodes
 * entirely below md because they're decorative; ours carry real copy, so
 * they get a fallback instead of disappearing.
 */

const NODES = [
  {
    tag: '[ REPTILIAN ]',
    fig: 'FIG. E — FOSSIL',
    body: 'Speed & Survival. Bypasses cognitive drag within the 3-second biological window.',
    square: { top: '27%', left: '60%' },
    label: { top: '11%', left: '26%' },
    labelAnim: { x: -20 },
    connectors: [
      { x1: '38%', y1: '14%', x2: '52%', y2: '14%' },
      { x1: '52%', y1: '14%', x2: '60%', y2: '27%' },
    ],
  },
  {
    tag: '[ LIMBIC ]',
    fig: 'FIG. F — CHRYSALIS',
    body: 'Somatic Markers. Engineers visceral trust and gut-level alignment before logic gets a vote.',
    square: { top: '58%', left: '32%' },
    label: { top: '76%', left: '3%' },
    labelAnim: { x: -20 },
    connectors: [
      { x1: '32%', y1: '58%', x2: '20%', y2: '74%' },
      { x1: '20%', y1: '74%', x2: '6%', y2: '74%' },
    ],
  },
  {
    tag: '[ CORTEX ]',
    fig: 'FIG. G — LATTICE',
    body: 'Post-Decision Logic. Supplies structural proof points and transparent data validation.',
    square: { top: '63%', left: '50%' },
    label: { top: '50%', left: '78%' },
    labelAnim: { x: 20 },
    connectors: [
      { x1: '78%', y1: '53%', x2: '63%', y2: '53%' },
      { x1: '63%', y1: '53%', x2: '50%', y2: '63%' },
    ],
  },
];

export default function Section4Taxonomy() {
  return (
    <section className="relative w-full bg-[#171310] text-[#f6f5f2] font-sans overflow-hidden px-6 md:px-12 pt-0 pb-28 md:pb-36">
      {/* Light-to-dark bridge from Section 3's #f6f5f2 */}
      <div
        className="absolute top-0 left-0 right-0 h-[160px] md:h-[220px] pointer-events-none z-20"
        style={{
          background:
            'linear-gradient(180deg, #f6f5f2 0%, #cfc9bd 30%, #3a2f24 62%, #171310 100%)',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto pt-20 md:pt-28 mb-10 md:mb-16">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#c9a878] mb-4"
        >
          // SYSTEM TAXONOMY: THE DECISION PIPELINE
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="font-garamond text-[clamp(32px,5.6vw,72px)] leading-[1.05]"
        >
          The Triune Brain Framework.
        </motion.h2>
      </div>

      {/* Desktop/tablet: the connected-node diagram */}
      <div className="hidden md:block relative z-10 max-w-6xl mx-auto h-[560px] mb-16">
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: 'visible' }}>
          {NODES.map((node, ni) =>
            node.connectors.map((c, ci) => (
              <motion.line
                key={`${ni}-${ci}`}
                x1={c.x1}
                y1={c.y1}
                x2={c.x2}
                y2={c.y2}
                stroke="#c9a878"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 0.45 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: 0.3 + ni * 0.25 + ci * 0.15 }}
              />
            ))
          )}
        </svg>

        {NODES.map((node, i) => (
          <div key={node.tag}>
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, delay: 0.6 + i * 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="absolute w-[90px] h-[90px] md:w-[110px] md:h-[110px] border border-[#c9a878]/80"
              style={{
                top: node.square.top,
                left: node.square.left,
                animation: 'ds-node-pulse 4s ease-in-out infinite',
                animationDelay: `${i * 0.6}s`,
              }}
            />

            <motion.div
              initial={{ opacity: 0, x: node.labelAnim.x }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="absolute max-w-[190px]"
              style={{ top: node.label.top, left: node.label.left }}
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#c9a878]">
                {node.tag}
              </p>
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#5eead4]/70 mt-1">
                {node.fig}
              </p>
              <p className="text-[13px] leading-relaxed text-[#f6f5f2]/60 mt-2">{node.body}</p>
            </motion.div>
          </div>
        ))}
      </div>

      {/* Mobile fallback: stacked list, same content */}
      <div className="md:hidden relative z-10 max-w-6xl mx-auto flex flex-col gap-6 mb-16">
        {NODES.map((node, i) => (
          <motion.div
            key={node.tag}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="border border-[#c9a878]/30 p-5"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#c9a878]">
              {node.tag}
            </p>
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#5eead4]/70 mt-1">
              {node.fig}
            </p>
            <p className="text-[13px] leading-relaxed text-[#f6f5f2]/60 mt-2">{node.body}</p>
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-6 border-t border-[#f6f5f2]/15">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#f6f5f2]/40">
          // THE TRIUNE BRAIN, MAPPED.
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#f6f5f2]/40">
          SYSTEM TAXONOMY · REV. 01.
        </p>
      </div>

      <style jsx>{`
        @keyframes ds-node-pulse {
          0%,
          100% {
            box-shadow: 0 0 0 0 rgba(94, 234, 212, 0.25);
          }
          50% {
            box-shadow: 0 0 24px 4px rgba(94, 234, 212, 0.35);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*='ds-node-pulse'] {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}
