'use client';

/**
 * SectionBreak — hard technical transition between sections.
 *
 * Replaces the soft color-melt gradient bridges used in the old organic
 * design with a hairline rule + mono readout label sitting on the seam,
 * like a page break in a spec sheet. Render as the FIRST child of the
 * section it belongs to — its top edge then lands exactly on the boundary
 * with the previous section.
 *
 * `bg` must match the current section's own background color (not the
 * previous section's) so the label reads as "cutting" the line rather
 * than floating in a mismatched box.
 */
export default function SectionBreak({ label, bg, tone = 'dark' }) {
  const lineColor = tone === 'dark' ? 'rgba(246,245,242,0.15)' : 'rgba(26,26,24,0.15)';
  const textColor = tone === 'dark' ? 'rgba(246,245,242,0.45)' : 'rgba(26,26,24,0.45)';

  return (
    <div className="relative w-full z-20">
      <div className="w-full h-px" style={{ background: lineColor }} />
      <span
        className="absolute top-1/2 left-6 md:left-12 -translate-y-1/2 px-3 font-mono text-[9px] uppercase tracking-[0.25em] whitespace-nowrap"
        style={{ backgroundColor: bg, color: textColor }}
      >
        {label}
      </span>
    </div>
  );
}
