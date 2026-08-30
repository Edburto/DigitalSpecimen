'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Header — site-wide navigation bar, now with a mobile hamburger menu.
 *
 * Desktop (md+): unchanged — wordmark left, links center, glowing CTA right.
 * Mobile (below md): links + CTA collapse behind a hamburger icon; tapping
 * it opens a full-width dropdown panel with large tap targets.
 *
 * Not wired into layout.js automatically — see the instructions given
 * alongside this file.
 */

const LINKS = ['Services', 'About', 'Insights'];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-5 md:py-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
        <span className="font-garamond text-lg md:text-xl tracking-tight text-[#f6f5f2]">
          DIGITAL SPECIMEN
        </span>

        <nav className="hidden md:flex items-center gap-8">
          {LINKS.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#f6f5f2]/70 hover:text-[#f6f5f2] transition-colors"
            >
              {link}
            </a>
          ))}
        </nav>

        <a
          href="#audit"
          className="hidden md:flex group items-center gap-3 pl-4 pr-2 py-2 rounded-full border border-[#f6f5f2]/25 hover:border-[#5eead4]/60 transition-colors"
        >
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#f6f5f2]">
            [ INITIALIZE AUDIT ]
          </span>
          <span className="relative flex w-2.5 h-2.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[#5eead4] opacity-75 animate-ping" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#5eead4]" />
          </span>
        </a>

        {/* Hamburger — mobile only */}
        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="md:hidden relative w-10 h-10 flex flex-col items-center justify-center gap-[5px]"
        >
          <motion.span
            animate={open ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.25 }}
            className="block w-6 h-[1.5px] bg-[#f6f5f2]"
          />
          <motion.span
            animate={open ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.15 }}
            className="block w-6 h-[1.5px] bg-[#f6f5f2]"
          />
          <motion.span
            animate={open ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.25 }}
            className="block w-6 h-[1.5px] bg-[#f6f5f2]"
          />
        </button>
      </div>

      {/* Mobile dropdown panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden mt-4"
          >
            <div className="max-w-7xl mx-auto bg-[#030302]/95 backdrop-blur border border-[#f6f5f2]/10 rounded-2xl p-6 flex flex-col gap-1">
              {LINKS.map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  onClick={() => setOpen(false)}
                  className="font-mono text-sm uppercase tracking-[0.18em] text-[#f6f5f2]/80 hover:text-[#f6f5f2] py-3 border-b border-[#f6f5f2]/10 last:border-b-0 transition-colors"
                >
                  {link}
                </a>
              ))}
              <a
                href="#audit"
                onClick={() => setOpen(false)}
                className="mt-4 flex items-center justify-center gap-3 px-4 py-3 rounded-full border border-[#f6f5f2]/25"
              >
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#f6f5f2]">
                  [ INITIALIZE AUDIT ]
                </span>
                <span className="relative flex w-2.5 h-2.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-[#5eead4] opacity-75 animate-ping" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#5eead4]" />
                </span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
