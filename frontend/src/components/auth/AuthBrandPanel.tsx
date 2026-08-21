import React from 'react';

// Curved-divider geometry, both in objectBoundingBox space (0..1) so each
// clipPath scales fluidly with whatever box it's applied to — no JS
// resize listeners, no breakpoint-specific pixel math. Two shapes, not
// one, because mobile stacks the panel on top (curve bulges on the
// BOTTOM edge) while desktop sits it on the left (curve bulges on the
// RIGHT edge) — genuinely different geometry, not a resized copy.
const DESKTOP_CURVE = 'M0,0 L0.82,0 C0.97,0.22 0.97,0.78 0.82,1 L0,1 Z';
const MOBILE_CURVE = 'M0,0 L1,0 L1,0.82 C0.78,0.97 0.22,0.97 0,0.82 Z';

// Accent ring technique: an outer box painted with the accent gradient,
// clipped to the curve. An inner box (the actual photo) is clipped to the
// SAME curve but inset by RING px on only the curved side. Because
// clip-path:url(#...) with objectBoundingBox re-normalizes 0..1 across
// each element's OWN box, the inner curve tracks the outer one closely at
// every point along the curve — a clean ring without a separately-scaled
// SVG stroke that would drift out of alignment as the panel's aspect
// ratio changes across breakpoints. It's an approximation rather than a
// mathematically exact constant-width offset: only the curved side is
// inset (right on desktop, bottom on mobile), and the curve's own
// boundingbox fraction along that axis varies (~0.82-0.97, not a flat 1),
// so the true gap works out to roughly 4.9-5.8px rather than a literal
// 6px everywhere — imperceptible in practice. RING = 6px, expressed below
// as Tailwind's 1.5 (0.375rem = 6px at the default root size).
//
// Root background: the curve's corners recede to 0.82 rather than
// reaching the box's full edge (see DESKTOP_CURVE/MOBILE_CURVE above),
// which leaves a small uncovered sliver at each corner. Left without an
// explicit color, that sliver falls through to whatever's behind this
// component in the page — which turned out to be the app's dark default
// background, rendering as a visible black wedge in the corners. Setting
// bg-white here means that sliver instead blends into the card it sits
// inside (see AuthShell.tsx), which is the fix — not a curve-geometry
// change.
export const AuthBrandPanel: React.FC = () => {
  return (
    <div className="relative h-64 w-full overflow-hidden bg-white sm:h-80 md:h-auto md:min-h-[560px] md:w-[48%]">
      {/* Hidden SVG housing both clipPath defs — rendered once, referenced
          by both boxes below via url(#id), not duplicated per breakpoint. */}
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <clipPath id="auth-curve-mobile" clipPathUnits="objectBoundingBox">
            <path d={MOBILE_CURVE} />
          </clipPath>
          <clipPath id="auth-curve-desktop" clipPathUnits="objectBoundingBox">
            <path d={DESKTOP_CURVE} />
          </clipPath>
        </defs>
      </svg>

      {/* Outer box: the gradient accent, clipped to the full curve.
          #3157FF -> #7DD3D8 is the brief's original literal spec — an
          earlier pass substituted this project's --color-ink/--color-verify
          tokens instead, reasoning they were a closer semantic fit, but
          the actual reference render uses this exact blue, so reverting
          to the literal brief values here. */}
      <div
        className="absolute inset-0 [clip-path:url(#auth-curve-mobile)] md:[clip-path:url(#auth-curve-desktop)]"
        style={{ background: 'linear-gradient(135deg, #3157FF 0%, #7DD3D8 100%)' }}
      >
        {/* Inner box: photo, inset by 6px on only the curved side (bottom
            on mobile, right on desktop) — the uncovered sliver of the
            outer gradient is the accent ring itself. Explicit longhand
            sides at each breakpoint (not inset-x/inset-y shorthand mixed
            with an override) since that mixing is source-order-fragile in
            Tailwind's generated CSS. */}
        <div
          className="absolute left-0 right-0 top-0 bottom-1.5 overflow-hidden [clip-path:url(#auth-curve-mobile)] md:bottom-0 md:right-1.5 md:[clip-path:url(#auth-curve-desktop)]"
        >
          <img
            src="/auth/aircraft.jpg"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default AuthBrandPanel;