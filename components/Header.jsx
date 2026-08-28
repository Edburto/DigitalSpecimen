'use client';

/**
 * Header — site-wide navigation bar.
 *
 * Fixed to the top, transparent-over-dark by default (designed to sit atop
 * the dark hero/soil sections). Not wired into layout.js automatically —
 * that's a site-wide architectural change and belongs to a deliberate edit,
 * not something bundled silently into a section component.
 *
 * To use: import into app/layout.js and render inside <body>, above
 * {children}.
 */

const LINKS = ['Work', 'Services', 'About', 'Insights'];

export default function Header() {
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
          className="group flex items-center gap-3 pl-4 pr-2 py-2 rounded-full border border-[#f6f5f2]/25 hover:border-[#5eead4]/60 transition-colors"
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
    </header>
  );
}
