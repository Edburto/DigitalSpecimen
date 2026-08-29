'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * Hero — Field Station Canopy
 *
 * Ported directly from Digital_Specimen_Hero_dc.html (Claude Design export).
 * The Claude Design runtime (<x-dc>, {{ }} bindings, DCLogic class state)
 * doesn't run in Next.js, so every dynamic piece is reimplemented as real
 * React: the DCLogic class becomes the useSpecimenInteraction hook below,
 * {{ }} template bindings become JSX interpolation, style-hover/style-before
 * become real CSS via styled-jsx (:hover, ::before).
 *
 * KEY TECHNIQUE (the actual improvement over an earlier placeholder version
 * of this component): each specimen (mantis, beetle, butterfly, 2 ground
 * insects) is NOT an illustrated cutout PNG or an abstract shape — it's a
 * small masked window into the SAME hero-scene.jpg photo, scaled up and
 * offset so only that creature's region shows through. No separate insect
 * assets needed; the photo already contains them.
 *
 * INTENTIONAL DEVIATION FROM THE SOURCE FILE: the source's own <header>
 * (DIGITAL SPECIMEN wordmark + MANIFESTO/SYSTEMS/AUDIT REQUEST nav) is
 * omitted here. The site already has a persistent global Header.jsx wired
 * into layout.js with different nav copy (Work/Services/About/Insights) —
 * rendering both would duplicate the navbar.
 *
 * ASSET CAVEAT — read before wiring in an image: the crop offsets below
 * (e.g. mantis: left:-14.29%, top:-28.57%, width:357.14%) are calibrated
 * to whatever hero-scene.jpg was used when this was built in Claude
 * Design. If the asset currently in public/assets/hero-scene.jpg is a
 * flattened screenshot of the composed page (background + header text
 * baked in) rather than the raw standalone background photo, these exact
 * crop percentages will very likely NOT isolate the same creatures
 * correctly — the aspect ratio and framing won't match what these numbers
 * were tuned against. Get the genuine background-only asset from the
 * Claude Design project if possible, rather than reusing a page
 * screenshot for this technique specifically.
 */

const ZONES = {
  mantis: { x: 0.17, y: 0.42, reach: 0.3, tx: 2.4, ty: -1.4, rot: -0.18, idlePhase: 0 },
  beetle: { x: 0.83, y: 0.72, reach: 0.28, tx: -2.8, ty: 1.1, rot: 0.14, idlePhase: 2 },
  butterfly: { x: 0.79, y: 0.2, reach: 0.34, tx: -2.6, ty: -2, rot: 0.3, idlePhase: 4 },
};

function useSpecimenInteraction(stageRef) {
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
    }, 3200);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
      clearInterval(timer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [stageRef]);

  const proximity = useCallback(
    (key) => {
      const z = ZONES[key];
      if (!state.active) return 0;
      const d = Math.hypot(state.px - z.x, (state.py - z.y) * 0.72);
      const k = Math.max(0, 1 - d / z.reach);
      return k * k * (3 - 2 * k);
    },
    [state]
  );

  const zoneTransform = useCallback(
    (key) => {
      const z = ZONES[key];
      const idle = Math.sin((state.tick + z.idlePhase) * 0.85);
      const k = proximity(key);
      const tx = z.tx * k + idle * 0.5;
      const ty = z.ty * k + idle * 0.35;
      const rot = z.rot * k + idle * 0.04;
      return `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px) rotate(${rot.toFixed(2)}deg)`;
    },
    [state, proximity]
  );

  return { proximity, zoneTransform };
}

export default function Hero({
  overline = 'ORGANIC PRECISION',
  headline = 'Designed for the human nervous system.',
  ctaLabel = 'Begin the Experience',
  imageOpacity = 0.82,
  cutoutSlots = false,
}) {
  const stageRef = useRef(null);
  const { proximity, zoneTransform } = useSpecimenInteraction(stageRef);

  const dimAlpha = 1 - imageOpacity;
  const mantisTransform = zoneTransform('mantis');
  const beetleTransform = zoneTransform('beetle');
  const butterflyTransform = zoneTransform('butterfly');
  const mantisGlow = (0.06 + 0.7 * proximity('mantis')).toFixed(3);
  const beetleGlow = (0.05 + 0.65 * proximity('beetle')).toFixed(3);
  const butterflyGlow = (0.06 + 0.72 * proximity('butterfly')).toFixed(3);

  return (
    <section
      ref={stageRef}
      className="ds-hero"
      style={{
        position: 'relative',
        width: '100%',
        height: '100svh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        background: 'radial-gradient(120% 90% at 50% 40%, #06180f 0%, #030b07 55%, #000000 100%)',
        fontFamily: "'Archivo', 'Helvetica Neue', Helvetica, sans-serif",
        color: '#f2f6ee',
        isolation: 'isolate',
      }}
    >
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <div
          style={{
            position: 'absolute',
            top: '-7%',
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url("/assets/hero-scene.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: '50% 55%',
          }}
        />
      </div>

      <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', mixBlendMode: 'screen' }}>
        <div
          className="ds-wash-a-anim"
          style={{
            position: 'absolute',
            inset: '-12%',
            background:
              'radial-gradient(26% 30% at 30% 10%, rgba(206,236,255,.2), rgba(0,0,0,0) 70%), radial-gradient(30% 34% at 68% 4%, rgba(186,226,255,.16), rgba(0,0,0,0) 72%)',
          }}
        />
        <div
          className="ds-wash-b-anim"
          style={{
            position: 'absolute',
            inset: '-12%',
            background:
              'radial-gradient(24% 28% at 52% 28%, rgba(226,255,240,.14), rgba(0,0,0,0) 72%), radial-gradient(22% 26% at 18% 34%, rgba(200,240,255,.12), rgba(0,0,0,0) 74%)',
          }}
        />
        <div
          className="ds-wash-a-rev-anim"
          style={{
            position: 'absolute',
            top: '-18%',
            left: '-10%',
            right: '-10%',
            height: '62%',
            background:
              'radial-gradient(38% 60% at 24% 8%, rgba(216,240,255,.26), rgba(0,0,0,0) 72%), radial-gradient(34% 52% at 62% 0%, rgba(200,232,255,.22), rgba(0,0,0,0) 74%), radial-gradient(28% 44% at 86% 14%, rgba(190,226,255,.16), rgba(0,0,0,0) 76%)',
            WebkitMaskImage:
              'linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,.6) 52%, rgba(0,0,0,0) 100%)',
            maskImage: 'linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,.6) 52%, rgba(0,0,0,0) 100%)',
          }}
        />
        <div
          className="ds-dapple-anim"
          style={{
            position: 'absolute',
            inset: '-6%',
            backgroundImage:
              'radial-gradient(circle at 12% 18%, rgba(214,244,255,.16) 0 6px, rgba(0,0,0,0) 14px), radial-gradient(circle at 34% 9%, rgba(214,244,255,.14) 0 8px, rgba(0,0,0,0) 18px), radial-gradient(circle at 58% 22%, rgba(214,244,255,.12) 0 5px, rgba(0,0,0,0) 13px), radial-gradient(circle at 76% 12%, rgba(214,244,255,.15) 0 7px, rgba(0,0,0,0) 16px), radial-gradient(circle at 88% 30%, rgba(214,244,255,.1) 0 6px, rgba(0,0,0,0) 15px)',
          }}
        />

        <div
          className="ds-shaft-a-anim"
          style={{
            position: 'absolute',
            top: '-14%',
            left: '8%',
            width: '20%',
            height: '96%',
            transformOrigin: '50% 0',
            background:
              'linear-gradient(180deg, rgba(214,238,255,.5) 0%, rgba(196,232,255,.2) 34%, rgba(180,225,255,0) 76%)',
            WebkitMaskImage: 'linear-gradient(180deg, rgba(0,0,0,1), rgba(0,0,0,0) 82%)',
            maskImage: 'linear-gradient(180deg, rgba(0,0,0,1), rgba(0,0,0,0) 82%)',
          }}
        />
        <div
          className="ds-shaft-b-anim"
          style={{
            position: 'absolute',
            top: '-14%',
            left: '42%',
            width: '14%',
            height: '92%',
            transformOrigin: '50% 0',
            background:
              'linear-gradient(180deg, rgba(226,244,255,.44) 0%, rgba(200,234,255,.16) 40%, rgba(190,228,255,0) 78%)',
            WebkitMaskImage: 'linear-gradient(180deg, rgba(0,0,0,1), rgba(0,0,0,0) 80%)',
            maskImage: 'linear-gradient(180deg, rgba(0,0,0,1), rgba(0,0,0,0) 80%)',
          }}
        />
        <div
          className="ds-shaft-c-anim"
          style={{
            position: 'absolute',
            top: '-14%',
            left: '66%',
            width: '26%',
            height: '96%',
            transformOrigin: '50% 0',
            background:
              'linear-gradient(180deg, rgba(206,236,255,.36) 0%, rgba(190,228,255,.14) 38%, rgba(180,222,255,0) 74%)',
            WebkitMaskImage: 'linear-gradient(180deg, rgba(0,0,0,1), rgba(0,0,0,0) 84%)',
            maskImage: 'linear-gradient(180deg, rgba(0,0,0,1), rgba(0,0,0,0) 84%)',
          }}
        />

        <div
          className="ds-biolum-anim"
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(20% 22% at 62% 62%, rgba(255,120,210,.2), rgba(0,0,0,0) 72%), radial-gradient(18% 20% at 44% 74%, rgba(80,255,205,.18), rgba(0,0,0,0) 72%), radial-gradient(16% 18% at 82% 34%, rgba(90,200,255,.16), rgba(0,0,0,0) 72%)',
          }}
        />
      </div>

      <div style={{ position: 'absolute', top: '-7%', left: 0, right: 0, bottom: 0, zIndex: 2, pointerEvents: 'none' }}>
        {!cutoutSlots ? (
          <>
            <div
              className="ds-sway-anim"
              style={{
                position: 'absolute',
                left: '4%',
                top: '16%',
                width: '28%',
                height: '56%',
                overflow: 'hidden',
                WebkitMaskImage:
                  'radial-gradient(58% 54% at 46% 50%, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 66%, rgba(0,0,0,0) 100%)',
                maskImage:
                  'radial-gradient(58% 54% at 46% 50%, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 66%, rgba(0,0,0,0) 100%)',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  transform: mantisTransform,
                  transformOrigin: '46% 46%',
                  transition: 'transform 1.5s cubic-bezier(.22,.61,.36,1)',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    left: '-14.29%',
                    top: '-28.57%',
                    width: '357.14%',
                    height: '178.57%',
                    backgroundImage: 'url("/assets/hero-scene.jpg")',
                    backgroundSize: 'cover',
                    backgroundPosition: '50% 55%',
                  }}
                />
              </div>
            </div>

            <div
              className="ds-shift-anim"
              style={{
                position: 'absolute',
                left: '68%',
                top: '58%',
                width: '30%',
                height: '36%',
                overflow: 'hidden',
                WebkitMaskImage:
                  'radial-gradient(56% 56% at 52% 46%, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 64%, rgba(0,0,0,0) 100%)',
                maskImage:
                  'radial-gradient(56% 56% at 52% 46%, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 64%, rgba(0,0,0,0) 100%)',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  transform: beetleTransform,
                  transformOrigin: '52% 46%',
                  transition: 'transform 2s cubic-bezier(.22,.61,.36,1)',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    left: '-226.67%',
                    top: '-161.11%',
                    width: '333.33%',
                    height: '277.78%',
                    backgroundImage: 'url("/assets/hero-scene.jpg")',
                    backgroundSize: 'cover',
                    backgroundPosition: '50% 55%',
                  }}
                />
              </div>
            </div>

            <div
              className="ds-flutter-anim"
              style={{
                position: 'absolute',
                left: '66%',
                top: '6%',
                width: '26%',
                height: '32%',
                overflow: 'hidden',
                WebkitMaskImage:
                  'radial-gradient(54% 54% at 50% 50%, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 62%, rgba(0,0,0,0) 100%)',
                maskImage:
                  'radial-gradient(54% 54% at 50% 50%, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 62%, rgba(0,0,0,0) 100%)',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  transform: butterflyTransform,
                  transformOrigin: '50% 50%',
                  transition: 'transform 1.1s cubic-bezier(.34,.72,.3,1)',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    left: '-253.85%',
                    top: '-18.75%',
                    width: '384.62%',
                    height: '312.5%',
                    backgroundImage: 'url("/assets/hero-scene.jpg")',
                    backgroundSize: 'cover',
                    backgroundPosition: '50% 55%',
                  }}
                />
              </div>
            </div>

            <div
              className="ds-scuttle-a-anim"
              style={{
                position: 'absolute',
                left: '32%',
                top: '82%',
                width: '10%',
                height: '12%',
                overflow: 'hidden',
                WebkitMaskImage:
                  'radial-gradient(52% 52% at 50% 50%, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)',
                maskImage:
                  'radial-gradient(52% 52% at 50% 50%, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: '-320%',
                  top: '-683.33%',
                  width: '1000%',
                  height: '833.33%',
                  backgroundImage: 'url("/assets/hero-scene.jpg")',
                  backgroundSize: 'cover',
                  backgroundPosition: '50% 55%',
                }}
              />
            </div>

            <div
              className="ds-scuttle-b-anim"
              style={{
                position: 'absolute',
                left: '52%',
                top: '86%',
                width: '9%',
                height: '11%',
                overflow: 'hidden',
                WebkitMaskImage:
                  'radial-gradient(52% 52% at 50% 50%, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)',
                maskImage:
                  'radial-gradient(52% 52% at 50% 50%, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: '-577.78%',
                  top: '-781.82%',
                  width: '1111.11%',
                  height: '909.09%',
                  backgroundImage: 'url("/assets/hero-scene.jpg")',
                  backgroundSize: 'cover',
                  backgroundPosition: '50% 55%',
                }}
              />
            </div>
          </>
        ) : (
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'auto' }}>
            <div
              style={{
                position: 'absolute',
                left: '4%',
                top: '16%',
                width: '28%',
                height: '56%',
                transform: mantisTransform,
                transition: 'transform 1.5s cubic-bezier(.22,.61,.36,1)',
                border: '1px dashed rgba(255,255,255,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'monospace',
                fontSize: 10,
                color: 'rgba(255,255,255,0.5)',
                textAlign: 'center',
              }}
            >
              Mantis cutout (transparent PNG)
            </div>
            <div
              style={{
                position: 'absolute',
                left: '68%',
                top: '58%',
                width: '30%',
                height: '36%',
                transform: beetleTransform,
                transition: 'transform 2s cubic-bezier(.22,.61,.36,1)',
                border: '1px dashed rgba(255,255,255,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'monospace',
                fontSize: 10,
                color: 'rgba(255,255,255,0.5)',
                textAlign: 'center',
              }}
            >
              Jewel beetle cutout (transparent PNG)
            </div>
            <div
              className="ds-flutter-anim"
              style={{ position: 'absolute', left: '66%', top: '6%', width: '26%', height: '32%' }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  transform: butterflyTransform,
                  transition: 'transform 1.1s cubic-bezier(.34,.72,.3,1)',
                  border: '1px dashed rgba(255,255,255,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'monospace',
                  fontSize: 10,
                  color: 'rgba(255,255,255,0.5)',
                  textAlign: 'center',
                }}
              >
                Blue butterfly cutout (transparent PNG)
              </div>
            </div>
          </div>
        )}
      </div>

      <div
        style={{
          position: 'absolute',
          top: '-7%',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 2,
          pointerEvents: 'none',
          mixBlendMode: 'screen',
        }}
      >
        <div
          className="ds-ripple-a-anim"
          style={{
            position: 'absolute',
            left: '4%',
            top: '16%',
            width: '28%',
            height: '56%',
            opacity: mantisGlow,
            background: 'radial-gradient(46% 42% at 46% 46%, rgba(126,240,205,.5), rgba(70,205,170,.16) 58%, rgba(0,0,0,0) 88%)',
            transition: 'opacity .9s ease',
          }}
        />
        <div
          className="ds-ripple-b-anim"
          style={{
            position: 'absolute',
            left: '68%',
            top: '58%',
            width: '30%',
            height: '36%',
            opacity: beetleGlow,
            background: 'radial-gradient(44% 44% at 52% 46%, rgba(236,178,86,.46), rgba(200,140,60,.14) 58%, rgba(0,0,0,0) 88%)',
            transition: 'opacity 1.1s ease',
          }}
        />
        <div
          className="ds-ripple-c-anim"
          style={{
            position: 'absolute',
            left: '66%',
            top: '6%',
            width: '26%',
            height: '32%',
            opacity: butterflyGlow,
            background: 'radial-gradient(44% 44% at 50% 50%, rgba(140,215,255,.5), rgba(80,180,240,.14) 58%, rgba(0,0,0,0) 88%)',
            transition: 'opacity .8s ease',
          }}
        />
      </div>

      <div style={{ position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', inset: 0, background: '#000', opacity: dimAlpha }} />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(52% 44% at 50% 48%, rgba(0,0,0,.72) 0%, rgba(0,0,0,.42) 55%, rgba(0,0,0,0) 84%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(0,0,0,.72) 0%, rgba(0,0,0,.06) 18%, rgba(0,0,0,0) 55%, rgba(2,10,6,.6) 100%)',
          }}
        />
      </div>

      <div style={{ position: 'absolute', inset: 0, zIndex: 4, pointerEvents: 'none', overflow: 'hidden' }}>
        <span className="ds-dew-anim" style={{ position: 'absolute', left: '22%', top: '30%', width: 2, height: 2, borderRadius: '50%', background: '#ecfbff', boxShadow: '0 0 5px 2px rgba(220,245,255,.7)' }} />
        <span className="ds-dew-anim" style={{ position: 'absolute', left: '58%', top: '20%', width: 2, height: 2, borderRadius: '50%', background: '#f2fbff', boxShadow: '0 0 5px 2px rgba(220,245,255,.6)', animationDelay: '2s' }} />
        <span className="ds-dew-anim" style={{ position: 'absolute', left: '74%', top: '52%', width: 3, height: 3, borderRadius: '50%', background: '#eefaff', boxShadow: '0 0 6px 2px rgba(215,242,255,.6)', animationDelay: '4s' }} />
        <span className="ds-dew-anim" style={{ position: 'absolute', left: '34%', top: '84%', width: 2, height: 2, borderRadius: '50%', background: '#f4feff', boxShadow: '0 0 5px 2px rgba(220,248,255,.55)', animationDelay: '1s' }} />

        <span className="ds-spore-anim" style={{ position: 'absolute', left: 0, top: '46%', width: 3, height: 3, borderRadius: '50%', background: 'rgba(226,255,236,.7)', boxShadow: '0 0 6px 2px rgba(190,240,205,.4)' }} />
        <span className="ds-spore-anim" style={{ position: 'absolute', left: 0, top: '66%', width: 2, height: 2, borderRadius: '50%', background: 'rgba(232,255,240,.6)', boxShadow: '0 0 5px 2px rgba(190,240,205,.32)', animationDelay: '8s' }} />
        <span className="ds-spore-anim" style={{ position: 'absolute', left: 0, top: '28%', width: 2, height: 2, borderRadius: '50%', background: 'rgba(240,255,246,.55)', boxShadow: '0 0 5px 2px rgba(200,245,215,.3)', animationDelay: '20s' }} />

        {[
          { left: '8%', top: '22%', drift: 'a', driftDur: 34, delay: 0, color: '#eaffd8', glow: 'rgba(198,255,150,.85), 0 0 20px 7px rgba(140,230,120,.35)', flickerDur: 6.5, flickerDelay: 0, size: 3 },
          { left: '17%', top: '62%', drift: 'b', driftDur: 41, delay: 0, color: '#fff3cf', glow: 'rgba(255,220,140,.8), 0 0 24px 9px rgba(230,170,70,.28)', flickerDur: 8, flickerDelay: 0.8, size: 4 },
          { left: '27%', top: '34%', drift: 'c', driftDur: 47, delay: 0, color: '#ddfff2', glow: 'rgba(160,255,225,.8), 0 0 18px 6px rgba(70,210,180,.3)', flickerDur: 5.5, flickerDelay: 1.6, size: 2 },
          { left: '36%', top: '78%', drift: 'a', driftDur: 52, delay: 3, color: '#f2ffe2', glow: 'rgba(205,255,170,.75), 0 0 22px 8px rgba(140,225,120,.26)', flickerDur: 7.2, flickerDelay: 0.4, size: 3 },
          { left: '45%', top: '14%', drift: 'b', driftDur: 38, delay: 2, color: '#e6fbff', glow: 'rgba(170,235,255,.75), 0 0 18px 6px rgba(80,190,235,.26)', flickerDur: 6.8, flickerDelay: 2.2, size: 2 },
          { left: '54%', top: '68%', drift: 'c', driftDur: 44, delay: 1, color: '#fff6d6', glow: 'rgba(255,225,150,.8), 0 0 26px 10px rgba(230,175,70,.24)', flickerDur: 9, flickerDelay: 1.2, size: 4 },
          { left: '63%', top: '40%', drift: 'a', driftDur: 49, delay: 5, color: '#ddfff4', glow: 'rgba(150,255,225,.8), 0 0 22px 8px rgba(60,205,175,.28)', flickerDur: 6.2, flickerDelay: 3.4, size: 3 },
          { left: '72%', top: '84%', drift: 'b', driftDur: 55, delay: 4, color: '#f4ffe8', glow: 'rgba(210,255,180,.7), 0 0 18px 6px rgba(145,225,125,.24)', flickerDur: 7.6, flickerDelay: 0.2, size: 2 },
          { left: '81%', top: '28%', drift: 'c', driftDur: 36, delay: 2.5, color: '#fff2cc', glow: 'rgba(255,218,135,.78), 0 0 24px 9px rgba(228,168,66,.24)', flickerDur: 8.4, flickerDelay: 2.8, size: 3 },
          { left: '89%', top: '56%', drift: 'a', driftDur: 43, delay: 6, color: '#e2fff6', glow: 'rgba(155,255,228,.75), 0 0 18px 6px rgba(65,205,178,.24)', flickerDur: 5.9, flickerDelay: 1.9, size: 2 },
          { left: '12%', top: '88%', drift: 'c', driftDur: 58, delay: 1.4, color: '#f6ffe4', glow: 'rgba(215,255,175,.7), 0 0 20px 7px rgba(150,230,130,.22)', flickerDur: 7, flickerDelay: 4.1, size: 3 },
          { left: '68%', top: '10%', drift: 'b', driftDur: 46, delay: 3.6, color: '#eaf9ff', glow: 'rgba(175,235,255,.7), 0 0 16px 5px rgba(85,190,235,.22)', flickerDur: 6.6, flickerDelay: 2.4, size: 2 },
        ].map((f, i) => (
          <span
            key={i}
            className={`ds-drift-${f.drift}-anim`}
            style={{ left: f.left, top: f.top, animationDuration: `${f.driftDur}s`, animationDelay: `${f.delay}s` }}
          >
            <span
              className="ds-flicker-anim"
              style={{
                display: 'block',
                width: f.size,
                height: f.size,
                borderRadius: '50%',
                background: f.color,
                boxShadow: `0 0 6px 2px ${f.glow}`,
                animationDuration: `${f.flickerDur}s`,
                animationDelay: `${f.flickerDelay}s`,
              }}
            />
          </span>
        ))}
      </div>

      <div
        style={{
          position: 'relative',
          zIndex: 5,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: 'clamp(40px, 8vh, 110px) clamp(20px, 6vw, 60px) clamp(60px, 12vh, 140px)',
        }}
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
            maxWidth: '15ch',
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontWeight: 400,
            fontSize: 'clamp(44px, 7.4vw, 116px)',
            lineHeight: 0.98,
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
        style={{
          position: 'relative',
          zIndex: 5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          padding: '0 clamp(18px, 3.2vw, 46px) clamp(18px, 2.6vw, 32px)',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 'clamp(9px, .8vw, 11px)',
          letterSpacing: '.22em',
          color: 'rgba(170,206,188,.5)',
        }}
      >
        <span>SPECIMEN_INDEX / 04</span>
        <span>SCROLL ↓</span>
      </div>

      <style jsx>{`
        @keyframes ds-rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes ds-cta-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes ds-wash-a { 0%, 100% { opacity: .3; transform: translate3d(-4%, -2%, 0); } 50% { opacity: .72; transform: translate3d(4%, 3%, 0); } }
        @keyframes ds-wash-b { 0%, 100% { opacity: .2; transform: translate3d(3%, 2%, 0); } 45% { opacity: .58; transform: translate3d(-3%, -2%, 0); } }
        @keyframes ds-dapple { 0%, 100% { opacity: .16; transform: translate3d(0, 0, 0) scale(1.02); } 40% { opacity: .46; transform: translate3d(-1.5%, 1.5%, 0) scale(1.05); } 70% { opacity: .26; transform: translate3d(1.5%, -1%, 0) scale(1.03); } }
        @keyframes ds-shaft-a { 0%, 100% { opacity: .24; transform: rotate(11deg) translateX(-1.5%); } 50% { opacity: .6; transform: rotate(13.5deg) translateX(1.5%); } }
        @keyframes ds-shaft-b { 0%, 100% { opacity: .16; transform: rotate(-9deg) translateX(1%); } 45% { opacity: .48; transform: rotate(-11.5deg) translateX(-1%); } }
        @keyframes ds-shaft-c { 0%, 100% { opacity: .12; transform: rotate(5deg) translateX(0); } 60% { opacity: .4; transform: rotate(7deg) translateX(-2%); } }
        @keyframes ds-biolum { 0%, 100% { opacity: .22; } 40% { opacity: .6; } 70% { opacity: .34; } }
        @keyframes ds-flutter { 0%, 100% { transform: translate(0, 0) rotate(0deg); } 25% { transform: translate(-3px, -2px) rotate(-.2deg); } 55% { transform: translate(-1px, 2.5px) rotate(.15deg); } 78% { transform: translate(2.5px, -1px) rotate(.22deg); } }
        @keyframes ds-sway { 0%, 100% { transform: rotate(-.12deg) translate(0, 0); } 50% { transform: rotate(.12deg) translate(.5px, -1.2px); } }
        @keyframes ds-shift { 0%, 100% { transform: translate(0, 0); } 45% { transform: translate(-1.6px, .6px); } 72% { transform: translate(.8px, -.4px); } }
        @keyframes ds-scuttle-a { 0%, 62%, 100% { transform: translate(0, 0); } 68% { transform: translate(1px, -.5px); } 74% { transform: translate(2px, 0); } 80% { transform: translate(1.2px, .4px); } }
        @keyframes ds-scuttle-b { 0%, 40%, 100% { transform: translate(0, 0); } 46% { transform: translate(-1px, .4px); } 54% { transform: translate(-1.8px, 0); } 60% { transform: translate(-.7px, -.4px); } }
        @keyframes ds-ripple { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.006); } }
        @keyframes ds-dew { 0%, 100% { opacity: .15; } 45% { opacity: .85; } }
        @keyframes ds-spore { 0% { transform: translate(-6vw, 8vh); opacity: 0; } 12% { opacity: .8; } 88% { opacity: .5; } 100% { transform: translate(106vw, -14vh); opacity: 0; } }
        @keyframes ds-flicker { 0%, 100% { opacity: 0; } 12% { opacity: .95; } 30% { opacity: .35; } 48% { opacity: 1; } 72% { opacity: .28; } 88% { opacity: .7; } }
        @keyframes ds-drift-a { 0% { transform: translate(0,0); } 25% { transform: translate(46px,-38px); } 50% { transform: translate(96px,14px); } 75% { transform: translate(38px,52px); } 100% { transform: translate(0,0); } }
        @keyframes ds-drift-b { 0% { transform: translate(0,0); } 30% { transform: translate(-54px,-26px); } 60% { transform: translate(-18px,42px); } 100% { transform: translate(0,0); } }
        @keyframes ds-drift-c { 0% { transform: translate(0,0); } 20% { transform: translate(28px,34px); } 55% { transform: translate(-42px,58px); } 80% { transform: translate(-14px,-30px); } 100% { transform: translate(0,0); } }

        .ds-rise-anim { opacity: 0; animation: ds-rise .9s ease both; }
        .ds-rise-delayed-anim { opacity: 0; animation: ds-rise 1.1s .08s ease both; }
        .ds-cta-in-anim { opacity: 0; animation: ds-cta-in .8s 2s ease both; }
        .ds-wash-a-anim { animation: ds-wash-a 34s ease-in-out infinite; }
        .ds-wash-b-anim { animation: ds-wash-b 43s ease-in-out infinite; }
        .ds-wash-a-rev-anim { animation: ds-wash-a 47s ease-in-out infinite reverse; }
        .ds-dapple-anim { animation: ds-dapple 21s ease-in-out infinite; }
        .ds-shaft-a-anim { animation: ds-shaft-a 24s ease-in-out infinite; }
        .ds-shaft-b-anim { animation: ds-shaft-b 31s ease-in-out infinite; }
        .ds-shaft-c-anim { animation: ds-shaft-c 27s ease-in-out infinite; }
        .ds-biolum-anim { animation: ds-biolum 17s ease-in-out infinite; }
        .ds-sway-anim { animation: ds-sway 15s ease-in-out infinite; }
        .ds-shift-anim { animation: ds-shift 18s ease-in-out infinite; }
        .ds-flutter-anim { animation: ds-flutter 19s ease-in-out infinite; }
        .ds-scuttle-a-anim { animation: ds-scuttle-a 23s ease-in-out infinite; }
        .ds-scuttle-b-anim { animation: ds-scuttle-b 31s ease-in-out infinite; }
        .ds-ripple-a-anim { animation: ds-ripple 5s ease-in-out infinite; }
        .ds-ripple-b-anim { animation: ds-ripple 6.5s ease-in-out infinite; }
        .ds-ripple-c-anim { animation: ds-ripple 4.4s ease-in-out infinite; }
        .ds-dew-anim { animation: ds-dew 9s ease-in-out infinite; }
        .ds-spore-anim { animation: ds-spore 46s linear infinite; }
        .ds-drift-a-anim { position: absolute; animation-name: ds-drift-a; animation-timing-function: ease-in-out; animation-iteration-count: infinite; }
        .ds-drift-b-anim { position: absolute; animation-name: ds-drift-b; animation-timing-function: ease-in-out; animation-iteration-count: infinite; }
        .ds-drift-c-anim { position: absolute; animation-name: ds-drift-c; animation-timing-function: ease-in-out; animation-iteration-count: infinite; }
        .ds-flicker-anim { animation-name: ds-flicker; animation-timing-function: ease-in-out; animation-iteration-count: infinite; }

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
