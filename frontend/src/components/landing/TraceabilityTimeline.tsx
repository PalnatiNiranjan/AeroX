import React, { useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent, useReducedMotion, useSpring } from 'framer-motion';
import { useRef } from 'react';

// Order matches spec: Manufactured -> Registered -> Installed -> Inspected
// -> Maintained -> Verified. (Installed and Inspected were previously
// swapped relative to this.)
const STAGES = [
  { label: 'Manufactured', body: 'The component is produced and given a base identity record.' },
  { label: 'Registered', body: 'Its digital identity is registered on the platform.' },
  { label: 'Installed', body: 'The component is fitted and linked to its aircraft.' },
  { label: 'Inspected', body: 'Quality and conformity are checked against its record.' },
  { label: 'Maintained', body: 'Maintenance actions are logged against its history.' },
  { label: 'Verified', body: 'Authorized organizations can verify its full history.' },
];

// Supplied airplane SVG, inlined as-is: same viewBox, same path data,
// fill swapped from the source's hardcoded #000000 to currentColor so it
// inherits color from its parent (text-clay below). The source's literal
// width="800px" height="800px" attributes are dropped — kept as attributes
// they'd force an 800px icon regardless of any className, which can't
// coexist with "small/medium airplane icon". Sizing now comes entirely
// from the className on each usage below.
const AirplaneIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="-6 0 32 32" fill="currentColor" className={className} aria-hidden="true">
    <path d="M6.72 26.2c-0.040 0-0.080 0-0.12 0-0.28-0.040-0.48-0.2-0.64-0.44l-1.96-3.56-3.56-1.96c-0.24-0.12-0.4-0.36-0.44-0.64s0.040-0.52 0.24-0.72l1.8-1.8c0.2-0.2 0.48-0.28 0.76-0.24l2.040 0.36 2.68-2.68-6.48-3.2c-0.24-0.12-0.4-0.36-0.48-0.64s0.040-0.56 0.24-0.76l2-2c0.2-0.2 0.52-0.28 0.8-0.24l8.48 2.2 2.96-2.96c1.040-1.040 3.48-1.8 4.72-0.56 0.56 0.56 0.76 1.48 0.56 2.52-0.16 0.84-0.6 1.64-1.12 2.16l-2.96 2.96 2.2 8.48c0.080 0.28 0 0.6-0.24 0.8l-2 2c-0.2 0.2-0.48 0.28-0.76 0.24s-0.52-0.2-0.64-0.48l-3.2-6.48-2.68 2.68 0.36 2.040c0.040 0.28-0.040 0.56-0.24 0.76l-1.8 1.8c-0.080 0.28-0.28 0.36-0.52 0.36zM2.24 19.28l2.8 1.52c0.16 0.080 0.24 0.2 0.32 0.32l1.52 2.8 0.68-0.68-0.32-2.040c-0.040-0.28 0.040-0.56 0.24-0.76l3.84-3.84c0.2-0.2 0.48-0.28 0.76-0.24s0.52 0.2 0.64 0.48l3.2 6.48 0.8-0.8-2.2-8.48c-0.080-0.28 0-0.6 0.24-0.8l3.28-3.28c0.6-0.6 0.92-1.96 0.56-2.32s-1.72 0-2.32 0.56l-3.28 3.28c-0.2 0.2-0.52 0.28-0.8 0.24l-8.52-2.2-0.8 0.8 6.48 3.2c0.24 0.12 0.4 0.36 0.48 0.64s-0.040 0.56-0.24 0.76l-3.84 3.84c-0.2 0.2-0.48 0.28-0.76 0.24l-2.040-0.36-0.72 0.64z"></path>
  </svg>
);

export const TraceabilityTimeline: React.FC = () => {
  const listRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Primary driver: scroll progress through the list itself. 'start
  // center' -> 'end center' means the mapped index tracks whichever
  // stage is nearest the viewport's vertical center as the user scrolls,
  // independent of any pointer/keyboard interaction. This drives both
  // the active-stage index below and the connecting-line fill, and
  // updates on scroll in either direction — no extra code needed for
  // "scrolling upward reverses the animation".
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ['start center', 'end center'],
  });
  const scrollStageMV = useTransform(scrollYProgress, [0, 1], [0, STAGES.length - 1]);

  // Connecting line fill — same scrollYProgress, mapped straight to a
  // 0%->100% height so it draws in lockstep with scroll position across
  // the full list (clamped so it doesn't overshoot before 'start center'
  // or after 'end center').
  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%'], { clamp: true });

  // Airplane vertical position: derived from the SAME scrollYProgress as
  // the line fill above, but eased through a spring rather than bound
  // 1:1 — the plane lags slightly and settles into position instead of
  // snapping exactly with the scrollbar, the same "chase, don't teleport"
  // idea as the reference's x += (target - x) / 10 following, just done
  // via Framer's spring primitive instead of a hand-rolled RAF loop, so
  // it's still riding on the existing scroll architecture, not a second
  // animation engine. Only the plane gets this treatment — the connecting
  // line's own fill (lineHeight, above) stays exactly 1:1 with scroll, so
  // the precise progress indicator and the "editorial" plane marker can
  // read differently on purpose. Numeric 0-100 in and out of the spring
  // (springs operate on numbers), converted to a '%' string afterward for
  // use as a top style value.
  const planePercent = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const planePercentSpring = useSpring(planePercent, { stiffness: 120, damping: 20, mass: 0.5 });
  const planeTop = useTransform(planePercentSpring, (v) => `${v}%`);

  // Fades in/out only at the very start/end of the section so it doesn't
  // appear "docked" at the edges before/after the list is actually in
  // view. Left on the unsprung scrollYProgress (not planePercentSpring) —
  // opacity should still track real scroll position exactly, only the
  // vertical chase itself is springy.
  const planeOpacity = useTransform(scrollYProgress, [0, 0.04, 0.96, 1], [0, 1, 1, 0]);

  const [scrollIndex, setScrollIndex] = useState(0);
  useMotionValueEvent(scrollStageMV, 'change', (v) => {
    const clamped = Math.min(STAGES.length - 1, Math.max(0, Math.round(v)));
    setScrollIndex((cur) => (cur === clamped ? cur : clamped));
  });

  // Secondary override: hover/focus, exactly as before. When present it
  // wins over the scroll-driven value; clearing it (mouse leave / blur)
  // falls back to whatever the scroll position currently indicates. Note
  // this only affects the TEXT active-state below — the airplane's own
  // position stays purely scroll-driven per spec ("scroll position is
  // the source of truth" for the airplane specifically), so hovering an
  // earlier/later row highlights its text without yanking the plane.
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const activeIndex = hoverIndex ?? scrollIndex;

  // Reduced motion: the plane stops tracking scroll pixel-by-pixel and
  // instead sits statically at whichever stage is currently active,
  // jumping between fixed stage positions only when activeIndex itself
  // changes (e.g. via keyboard focus) rather than animating continuously.
  const reducedMotionTop = `${(activeIndex / (STAGES.length - 1)) * 100}%`;

  return (
    <section id="traceability" className="bg-slate px-6 py-28 text-white md:px-10">
      <div className="mx-auto max-w-[1400px]">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl font-display text-[2.75rem] font-semibold leading-[1.05] tracking-tight sm:text-[3.5rem]"
        >
          From component to complete lifecycle.
        </motion.h2>

        <div ref={listRef} className="relative mt-20 flex flex-col">
          {/* Connecting line — sits behind the row of dots. Track is a
              faint static line spanning the full list; fill draws over it
              from 0 to 100% height as scrollYProgress advances.
              Dot center = index column width (w-6 = 24px) + the row's
              existing gap-6 (24px) + half the dot's own width (4px) =
              52px from the row's left edge — fixed and deterministic
              since the index column below has a set width, not one that
              varies with "01" vs "02" glyph widths. */}
          <div
            className="pointer-events-none absolute left-[52px] top-0 bottom-0 w-px -translate-x-1/2 bg-white/10"
            aria-hidden="true"
          />
          <motion.div
            className="pointer-events-none absolute left-[52px] top-0 w-px -translate-x-1/2 origin-top bg-clay"
            style={{ height: lineHeight }}
            aria-hidden="true"
          />

          {/* Airplane — travels the same left-[52px] column as the line
              it's riding, eased toward its scroll-driven target via
              planePercentSpring above rather than snapping to it exactly
              (see that comment for why). Fixed rotation (not scroll- or
              spring-driven) so the nose points down the line, matching
              direction of travel, without animating the rotation itself —
              "a small editorial interaction," not an airplane doing
              anything. Sized well below the dot/label/text scale (w-5,
              vs. the text at 2xl-3xl) so it stays a subtle marker, not a
              focal point. z-20 keeps it above the dots/line/text so it's
              never partially hidden behind them at the moments it passes
              one. */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute left-[52px] z-20 -translate-x-1/2 -translate-y-1/2 text-clay"
            style={{
              top: prefersReducedMotion ? reducedMotionTop : planeTop,
              opacity: prefersReducedMotion ? 1 : planeOpacity,
              transform: 'translate(-50%, -50%) rotate(150deg)',
            }}
          >
            {/* Eyeball this rotation value against the actual rendered
                icon and adjust — svgrepo's "airplane" glyph at this
                viewBox typically points up-and-right by default, and
                150deg is a best estimate to point it down-the-line
                without having a live render to check against. */}
            <AirplaneIcon className="h-5 w-5" />
          </motion.div>

          {STAGES.map((stage, i) => {
            const isActive = activeIndex === i;
            const isCompleted = i < activeIndex;
            return (
              <motion.button
                key={stage.label}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.55, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                onMouseEnter={() => setHoverIndex(i)}
                onMouseLeave={() => setHoverIndex(null)}
                onFocus={() => setHoverIndex(i)}
                onBlur={() => setHoverIndex(null)}
                className="group relative flex items-center gap-6 border-t border-white/10 py-6 text-left last:border-b"
              >
                {/* Fixed width (w-6) so this column's width — and
                    therefore the dot's horizontal position — is identical
                    on every row regardless of tabular-nums glyph width,
                    keeping the connecting line dead straight. */}
                <span
                  className={`w-6 shrink-0 text-right font-body text-xs tabular-nums transition-colors duration-300 ${
                    isActive ? 'text-white/70' : isCompleted ? 'text-white/40' : 'text-white/25'
                  }`}
                >
                  0{i + 1}
                </span>
                <span
                  className={`relative z-10 h-2 w-2 shrink-0 rounded-full border transition-colors duration-300 ${
                    isActive
                      ? 'border-clay bg-clay'
                      : isCompleted
                        ? 'border-clay/50 bg-clay/50'
                        : 'border-white/30 bg-slate'
                  }`}
                />
                <span
                  className={`font-display text-2xl font-semibold tracking-tight transition-all duration-300 sm:text-3xl ${
                    isActive
                      ? 'scale-[1.03] text-white'
                      : isCompleted
                        ? 'text-white/70'
                        : 'text-white/30'
                  }`}
                  style={{ transformOrigin: 'left center' }}
                >
                  {stage.label}
                </span>
                <span
                  className={`ml-auto hidden max-w-sm font-body text-sm text-white/55 transition-opacity duration-300 md:block ${
                    isActive ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  {stage.body}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TraceabilityTimeline;