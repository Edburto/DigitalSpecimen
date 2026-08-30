'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

/**
 * Hero — Decision Graph
 *
 * Replaces the previous insect-canopy photo hero (masked crops of a single
 * calibrated background photo — fragile, asset-dependent) with a schematic
 * background: a loose node/connector graph rendered in pure SVG + CSS,
 * matching the node-square motif already established in Section4's
 * Taxonomy diagram. No photography, so no crop-calibration risk.
 *
 * Cursor proximity lights up nearby nodes and pulls them slightly toward
 * the pointer (same interaction idea as the old insect zones' translate +
 * glow, reimplemented against node coordinates instead of photo crop
 * offsets), plus a soft spotlight that tracks the cursor directly so the
 * "light" reads even before it reaches a node. A handful of connectors
 * also carry a traveling "packet" dot, standing in for a decision moving
 * through the system.
 */

const NODES = [
  { id: 'n1', x: 0.14, y: 0.3 },
  { id: 'n2', x: 0.32, y: 0.62 },
  { id: 'n3', x: 0.52, y: 0.22 },
  { id: 'n4', x: 0.68, y: 0.48 },
  { id: 'n5', x: 0.82, y: 0.2 },
  { id: 'n6', x: 0.86, y: 0.68 },
];
const NODE_BY_ID = Object.fromEntries(NODES.map((n) => [n.id, n]));

const CONNECTORS = [
  ['n1', 'n2'],
  ['n2', 'n4'],
  ['n3', 'n4'],
  ['n4', 'n5'],
  ['n4', 'n6'],
  ['n3', 'n5'],
];

const PACKETS = [
  { path: ['n1', 'n2'], duration: 5.5, delay: 0 },
  { path: ['n3', 'n4'], duration: 4.2, delay: 1.4 },
  { path: ['n4', 'n5'], duration: 6, delay: 0.6 },
  { path: ['n4', 'n6'], duration: 4.8, delay: 2.6 },
];

const PROXIMITY_RADIUS = 0.3;

function useNodeInteraction(stageRef) {
  const [state, setState] = useState({ px: 0.5, py: 0.5, active: false, tick: 0 });
  const rafRef = useRef(null);

  useEffect(() => {
    function onMove(e) {
      const el = stageRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        setState((s) => ({ ...s, px, py, active: true }));
      });
    }
    function onLeave() {
      setState((s) => ({ ...s, active: false }));
    }
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerleave', onLeave);
    const timer = setInterval(() => {
      setState((s) => ({ ...s, tick: s.tick + 1 }));
    }, 2600);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
      clearInterval(timer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [stageRef]);

  const proximity = useCallback(
    (nodeId) => {
      const n = NODE_BY_ID[nodeId];
      if (!state.active) return 0;
      const d = Math.hypot(state.px - n.x, (state.py - n.y) * 0.72);
      const k = Math.max(0, 1 - d / PROXIMITY_RADIUS);
      return k * k * (3 - 2 * k);
    },
    [state]
  );

  const pull = useCallback(
    (nodeId) => {
      const n = NODE_BY_ID[nodeId];
      const k = proximity(nodeId);
      return { dx: (state.px - n.x) * k * 22, dy: (state.py - n.y) * k * 22 };
    },
    [state, proximity]
  );

  return { proximity, pull, tick: state.tick, px: state.px, py: state.py, active: state.active };
}

export default function Hero({
  overline = 'DECISION INFRASTRUCTURE',
  headline = 'The infrastructure your buying decisions run on.',
  ctaLabel = 'Audit Your Decision Graph',
}) {
  const stageRef = useRef(null);
  const { proximity, pull, tick, px, py, active } = useNodeInteraction(stageRef);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
  }, []);

  return (
    <section
      ref={stageRef}
      className="ds-hero relative w-full overflow-hidden isolate flex flex-col"
      style={{
        height: '100svh',
        background: 'radial-gradient(120% 90% at 50% 40%, #0b0d0c 0%, #030302 55%, #000000 100%)',
        fontFamily: "'Archivo', 'Helvetica Neue', Helvetica, sans-serif",
        color: '#f2f6ee',
      }}
    >
      {/* Blueprint grid */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.14]"
        style={{
          backgroundImage: `
            repeating-linear-gradient(to right, rgba(246,245,242,0.5) 0px, rgba(246,245,242,0.5) 1px, transparent 1px, transparent 64px),
            repeating-linear-gradient(to bottom, rgba(246,245,242,0.5) 0px, rgba(246,245,242,0.5) 1px, transparent 1px, transparent 64px)
          `,
        }}
      />

      {/* Decision graph: connectors + nodes + traveling packets */}
      <div className="absolute inset-0 z-[1] pointer-events-none">
        <svg className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
          {CONNECTORS.map(([a, b], i) => {
            const na = NODE_BY_ID[a];
            const nb = NODE_BY_ID[b];
            return (
              <motion.line
                key={i}
                x1={`${na.x * 100}%`}
                y1={`${na.y * 100}%`}
                x2={`${nb.x * 100}%`}
                y2={`${nb.y * 100}%`}
                stroke={i % 2 === 0 ? '#c9a878' : '#5eead4'}
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.28 }}
                transition={{ duration: 1.2, delay: 0.3 + i * 0.1 }}
              />
            );
          })}
        </svg>

        {NODES.map((n, i) => {
          const k = proximity(n.id);
          const { dx, dy } = pull(n.id);
          const idle = 0.5 + 0.5 * Math.sin((tick + i) * 0.9);
          const glow = Math.min(1, 0.12 + 0.55 * k + 0.08 * idle);
          return (
            <div
              key={n.id}
              className="absolute w-[10px] h-[10px] md:w-[13px] md:h-[13px] border"
              style={{
                left: `${n.x * 100}%`,
                top: `${n.y * 100}%`,
                transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(${1 + k * 1.4})`,
                borderColor: `rgba(94,234,212,${0.5 + glow * 0.5})`,
                backgroundColor: `rgba(94,234,212,${k * 0.4})`,
                boxShadow: `0 0 ${8 + glow * 48}px ${1 + glow * 7}px rgba(94,234,212,${glow * 0.85})`,
                transition: 'transform 0.35s cubic-bezier(.22,.61,.36,1), background-color 0.35s ease',
              }}
            />
          );
        })}

        {!reducedMotion &&
          PACKETS.map((p, i) => {
            const na = NODE_BY_ID[p.path[0]];
            const nb = NODE_BY_ID[p.path[1]];
            return (
              <motion.span
                key={i}
                className="absolute w-[5px] h-[5px] rounded-full"
                style={{
                  background: '#f0dcb8',
                  boxShadow: '0 0 6px 2px rgba(240,220,184,0.65)',
                  translateX: '-50%',
                  translateY: '-50%',
                }}
                animate={{
                  left: [`${na.x * 100}%`, `${nb.x * 100}%`],
                  top: [`${na.y * 100}%`, `${nb.y * 100}%`],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  duration: p.duration,
                  delay: p.delay,
                  repeat: Infinity,
                  repeatDelay: 1.2,
                  ease: 'easeInOut',
                }}
              />
            );
          })}
      </div>

      {/* Legibility scrim */}
      <div className="absolute inset-0 z-[2] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(52% 44% at 50% 48%, rgba(0,0,0,.55) 0%, rgba(0,0,0,.3) 55%, rgba(0,0,0,0) 84%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(0,0,0,.6) 0%, rgba(0,0,0,.05) 20%, rgba(0,0,0,0) 55%, rgba(2,10,6,.55) 100%)',
          }}
        />
        {/* Cursor spotlight — the light itself, independent of any single node */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(420px circle at ${px * 100}% ${py * 100}%, rgba(94,234,212,0.22), transparent 62%)`,
            opacity: active ? 1 : 0,
            mixBlendMode: 'screen',
            transition: 'opacity 0.4s ease',
          }}
        />
      </div>

      {/* Foreground content */}
      <div
        className="relative z-[3] flex-1 flex flex-col items-center justify-center text-center"
        style={{ padding: 'clamp(40px, 8vh, 110px) clamp(20px, 6vw, 60px) clamp(60px, 12vh, 140px)' }}
      >
        <p
          className="ds-rise-anim"
          style={{
            margin: '0 0 clamp(18px, 2.4vh, 30px)',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 'clamp(10px, .95vw, 14px)',
            letterSpacing: '.34em',
            color: '#8fd9bd',
            textTransform: 'uppercase',
          }}
        >
          {overline}
        </p>
        <h1
          className="ds-rise-delayed-anim"
          style={{
            margin: 0,
            maxWidth: '16ch',
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontWeight: 400,
            fontSize: 'clamp(40px, 6.6vw, 100px)',
            lineHeight: 1.02,
            letterSpacing: '-.015em',
            color: '#f6f7e8',
            textWrap: 'pretty',
            textShadow: '0 0 46px rgba(0,0,0,.75), 0 0 120px rgba(6,28,18,.9)',
          }}
        >
          {headline}
        </h1>

        <div style={{ position: 'relative', marginTop: 'clamp(36px, 6.5vh, 72px)' }}>
          <a href="#audit" className="ds-cta ds-cta-in-anim">
            {ctaLabel}
          </a>
        </div>
      </div>

      <div
        className="relative z-[3] flex items-center justify-between"
        style={{
          gap: 12,
          padding: '0 clamp(18px, 3.2vw, 46px) clamp(18px, 2.6vw, 32px)',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 'clamp(9px, .8vw, 11px)',
          letterSpacing: '.22em',
          color: 'rgba(170,206,188,.5)',
        }}
      >
        <span>DECISION_INDEX / 04</span>
        <span>SCROLL ↓</span>
      </div>

      <style jsx>{`
        @keyframes ds-rise {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes ds-cta-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .ds-rise-anim {
          opacity: 0;
          animation: ds-rise 0.9s ease both;
        }
        .ds-rise-delayed-anim {
          opacity: 0;
          animation: ds-rise 1.1s 0.08s ease both;
        }
        .ds-cta-in-anim {
          opacity: 0;
          animation: ds-cta-in 0.8s 1.4s ease both;
        }

        .ds-cta {
          position: relative;
          overflow: hidden;
          display: block;
          padding: clamp(14px, 1.4vw, 16px) clamp(28px, 3vw, 40px);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.05);
          box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.12);
          color: rgba(255, 255, 255, 0.9);
          text-transform: uppercase;
          letter-spacing: 0.19em;
          font-size: clamp(11px, 1vw, 14px);
          font-weight: 500;
          text-decoration: none;
          transition: background 0.3s, box-shadow 0.3s;
        }
        .ds-cta:hover {
          background: rgba(255, 255, 255, 0.04);
          box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.15);
        }
        .ds-cta::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 1.4px;
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.45) 0%,
            rgba(255, 255, 255, 0.15) 20%,
            rgba(255, 255, 255, 0) 40%,
            rgba(255, 255, 255, 0) 60%,
            rgba(255, 255, 255, 0.15) 80%,
            rgba(255, 255, 255, 0.45) 100%
          );
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }

        @media (prefers-reduced-motion: reduce) {
          .ds-hero * {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}
