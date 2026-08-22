'use client';
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function SoilCutaway() {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const rootScale = useTransform(scrollYProgress, [0.1, 0.5], [0.8, 1.2]);
  const rootOpacity = useTransform(scrollYProgress, [0.05, 0.2], [0, 1]);

  return (
    <section ref={containerRef} style={{ position: 'relative', width: '100%', height: '300vh', backgroundColor: '#010101' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', width: '100%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        
        {/* Background Base Glow */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, #0a2e23 0%, #010101 70%)', opacity: 0.8 }} />

        {/* Neural Root Growth Network */}
        <motion.div 
          style={{ position: 'absolute', inset: 0, zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', scale: rootScale, opacity: rootOpacity }}
        >
          <div style={{ position: 'relative', width: '70%', height: '70%', maxWidth: '800px', border: '1px solid rgba(0, 255, 255, 0.2)', borderRadius: '12px', background: 'rgba(0,0,0,0.4)' }}>
            <div style={{ position: 'absolute', top: '30%', left: '30%', width: '12px', height: '12px', backgroundColor: '#00ffff', borderRadius: '50%', boxShadow: '0 0 20px #00ffff' }} />
            <div style={{ position: 'absolute', bottom: '30%', right: '30%', width: '12px', height: '12px', backgroundColor: '#ffb703', borderRadius: '50%', boxShadow: '0 0 20px #ffb703' }} />
          </div>
        </motion.div>

        {/* Subterranean Typography */}
        <div style={{ position: 'absolute', bottom: '48px', left: '48px', zIndex: 20, maxWidth: '400px' }}>
          <span style={{ fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.3em', color: '#8fd9bd', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
            FIG. 01 — SUBSTRATUM CROSS-SECTION
          </span>
          <p style={{ fontFamily: 'serif', fontSize: '24px', color: '#f6f5f2', fontStyle: 'italic' }}>
            "Everything begins below the surface."
          </p>
        </div>

      </div>
    </section>
  );
}