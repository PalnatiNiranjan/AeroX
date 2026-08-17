import React, { useLayoutEffect } from 'react';
import { useLenis } from '../lib/useLenis';
import { LandingNav } from '../components/landing/LandingNav';
import { Hero } from '../components/landing/Hero';
import { ProblemSection } from '../components/landing/ProblemSection';
import { SolutionFeature } from '../components/landing/SolutionFeature';
import { ComponentPassport } from '../components/landing/ComponentPassport';
import { HowItWorks } from '../components/landing/HowItWorks';
import { TraceabilityTimeline } from '../components/landing/TraceabilityTimeline';
import { CompanyAccessSection } from '../components/landing/CompanyAccessSection';
import { SecuritySection } from '../components/landing/SecuritySection';
import { Footer } from '../components/landing/Footer';
import { SectionProgress } from '../components/landing/SectionProgress';
import { AircraftCursor } from '../components/ui/aircraft-cursor';

export const LandingPage: React.FC = () => {
  // On a hard refresh, browsers try to restore the previous scroll
  // position by default (scrollRestoration: 'auto') — combined with
  // Lenis smooth-scroll and the pinned cinematic Hero, that means a
  // reload can land you mid-animation instead of at the top. This
  // disables that restoration and forces the page back to 0,0 on every
  // mount. useLayoutEffect (not useEffect) so it runs before paint and
  // before Lenis's own effect below initializes — Lenis reads whatever
  // window.scrollTop already is when it starts up, so ordering matters.
  useLayoutEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  useLenis();

  return (
    <div className="min-h-screen bg-white font-body">
      {/* Page-wide overlay, not tied to any one section — fixed-position
          + pointer-events:none + its own max z-index, so mount order here
          doesn't affect stacking or layout of anything below it. Mounts
          once for the whole landing page rather than per-section. */}
      <AircraftCursor />

      {/* Background pinned to the exact sampled top-edge color of
          aircraft/frame 001 (#e6edf1), not the generic --color-sky token —
          LandingNav isn't sticky, so it only ever sits adjacent to that one
          specific frame (it scrolls away the instant the user moves), and
          the generic token's value didn't precisely match that frame's
          actual photographed color, leaving a faint seam at rest. */}
      <div className="bg-[#e6edf1]">
        <LandingNav />
        <Hero />
      </div>
      <SectionProgress />

      <div className="px-3 pb-3 pt-3 md:px-5 md:pb-5 md:pt-5">
        <div className="mx-auto max-w-[1600px] overflow-hidden rounded-[28px] shadow-[0_24px_70px_-20px_rgba(0,13,16,0.18)] md:rounded-[32px]">
          <main>
            <ProblemSection />
            <SolutionFeature />
            <ComponentPassport />
            <HowItWorks />
            <TraceabilityTimeline />
            <CompanyAccessSection />
            <SecuritySection />
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;