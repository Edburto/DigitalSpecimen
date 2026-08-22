'use client';
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function SoilCutaway() {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const rootScale = useTransform(scrollYProgress, [0.1, 0.5], [0.8, 1.1]);
  const rootOpacity = useTransform(scrollYProgress, [0.05, 0.2], [0, 1]);

  return (
    <section ref={containerRef} className="relative w-full h-[300svh] bg-[#010101]">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        
        {/* Background Base */}
        <div className="absolute inset-0 bg-cover bg-center opacity-80 bg-[#0a110e]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#010101]/60 via-transparent to-[#010101]/90 pointer-events-none" />

        {/* Neural Root Growth Network */}
        <motion.div 
          className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
          style={{ scale: rootScale, opacity: rootOpacity }}
        >
          <div className="relative w-[80%] h-[80%] max-w-5xl border border-cyan-500/20 rounded-lg backdrop-blur-[1px]">
            <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-[#00ffff] rounded-full shadow-[0_0_15px_#00ffff]" />
            <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-[#ffb703] rounded-full shadow-[0_0_15px_#ffb703]" />
          </div>
        </motion.div>

        {/* Subterranean Typography */}
        <div className="absolute bottom-12 left-12 z-20 max-w-md">
          <span className="font-mono text-[10px] tracking-[0.3em] text-[#8fd9bd] uppercase block mb-2">
            FIG. 01 — SUBSTRATUM CROSS-SECTION
          </span>
          <p className="font-serif text-2xl text-[#f6f5f2] italic">
            "Everything begins below the surface."
          </p>
        </div>

      </div>
    </section>
  );
}