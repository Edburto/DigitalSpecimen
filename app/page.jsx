'use client';
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function SoilCutaway() {
  const containerRef = useRef(null);
  
  // Track scroll progress through the 300vh container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Scroll transformations for parallax and organic root growth
  const soilShift = useTransform(scrollYProgress, [0, 1], ["12%", "88%"]);
  const rootMorph = useTransform(scrollYProgress, [0.10, 0.40], [0, 1]);
  const introOpacity = useTransform(scrollYProgress, [0, 0.22], [1, 0]);

  return (
    <main style={{ backgroundColor: '#010101', color: '#f6f5f2', minHeight: '100vh', width: '100%', overflowX: 'hidden' }}>
      <section ref={containerRef} style={{ position: 'relative', width: '100%', height: '300vh' }}>
        <div style={{ position: 'sticky', top: 0, height: '100vh', width: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'between' }}>
          
          {/* Fixed Chrome Header Labels */}
          <div style={{ position: 'absolute', top: '32px', left: '32px', right: '32px', zIndex: 30, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', textTransform: 'uppercase', fontFamily: 'monospace', letterSpacing: '0.28em', color: 'rgba(255,255,255,0.7)' }}>
            <span>DEPTH // SUBSTRATUM</span>
            <span>PLATE VII · MANIFESTO</span>
          </div>

          {/* Layer 1: Soil Cross-Cut Background with Parallax Pan */}
          <motion.div 
            style={{ 
              position: 'absolute', 
              inset: 0, 
              zIndex: 0, 
              opacity: 0.45, 
              pointerEvents: 'none',
              backgroundImage: 'url("/assets/soil-strata-bleed.png")',
              backgroundSize: 'cover',
              backgroundPosition: `center ${soilShift}`
            }} 
          />

          {/* Vignette Overlay for Depth */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(1,1,1,0.6) 0%, transparent 40%, rgba(1,1,1,0.95) 100%)', pointerEvents: 'none', zIndex: 2 }} />

          {/* Layer 2: Intro Typography Panel */}
          <motion.div 
            style={{ position: 'absolute', top: '100px', left: '48px', zIndex: 20, maxWidth: '420px', opacity: introOpacity }}
          >
            <span style={{ fontFamily: 'monospace', fontSize: '11px', letterSpacing: '0.3em', color: '#c9a878', textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>
              FIG. 01 — SUBSTRATUM CROSS-SECTION
            </span>
            <p style={{ fontFamily: 'serif', fontSize: '28px', color: '#f6f5f2', fontStyle: 'italic', lineHeight: '1.4' }}>
              "Everything begins below the surface."
            </p>
          </motion.div>

          {/* Layer 3: Dynamic Neural Root Network SVG Layer */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <svg style={{ width: '100%', height: '100%', maxWidth: '900px' }} viewBox="0 0 1000 1000">
              {/* Organic root paths growing via scroll */}
              <motion.path
                d="M 500 0 Q 420 300 500 600 Q 580 800 500 1000"
                fill="none"
                stroke="rgb(214,190,150)"
                strokeWidth="2.5"
                style={{ pathLength: rootMorph }}
              />
              <motion.path
                d="M 500 250 Q 320 450 280 700"
                fill="none"
                stroke="rgb(214,190,150)"
                strokeWidth="1.8"
                style={{ pathLength: rootMorph }}
              />
              <motion.path
                d="M 500 350 Q 680 500 720 750"
                fill="none"
                stroke="rgb(214,190,150)"
                strokeWidth="1.8"
                style={{ pathLength: rootMorph }}
              />

              {/* Glowing Synapse Nodes */}
              <circle cx="500" cy="600" r="7" fill="#00ffff" style={{ filter: 'drop-shadow(0 0 12px #00ffff)', opacity: rootMorph }} />
              <circle cx="280" cy="700" r="6" fill="#ffb703" style={{ filter: 'drop-shadow(0 0 12px #ffb703)', opacity: rootMorph }} />
              <circle cx="720" cy="750" r="6" fill="#00ffff" style={{ filter: 'drop-shadow(0 0 12px #00ffff)', opacity: rootMorph }} />
            </svg>
          </div>

          {/* Fixed Bottom Footer Indicator */}
          <div style={{ position: 'absolute', bottom: '32px', left: '32px', right: '32px', zIndex: 30, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', textTransform: 'uppercase', fontFamily: 'monospace', letterSpacing: '0.28em', color: 'rgba(255,255,255,0.5)' }}>
            <span>SCROLL ↓ TO ISOLATE</span>
            <span>SYSTEM_01 // ACTIVE</span>
          </div>

        </div>
      </section>
    </main>
  );
}