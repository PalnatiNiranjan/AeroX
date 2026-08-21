import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const LIFECYCLE = ['Manufactured', 'Registered', 'Inspected', 'Maintained'] as const;
const EASE = [0.16, 1, 0.3, 1] as const;

// Card-level entrance — same fade-up-on-scroll treatment the card already
// had, now also acting as the stagger parent for the fields inside it.
// A slight scale added on top of the existing opacity/translateY so the
// identity genuinely feels like it's being "constructed" field by field —
// kept subtle per spec ("do not use dramatic effects").
const cardReveal = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: EASE,
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

// Per-field reveal — no new fields beyond the two added below, no new
// data beyond existing-style concept/demo values, just a staged fade-up
// + gentle scale for each field group as the card comes into view.
const fieldReveal = {
  hidden: { opacity: 0, y: 14, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: EASE },
  },
};

export const ComponentPassport: React.FC = () => {
  // Verify Identity demo — a simulated tap/scan, not a real NFC read.
  // idle -> verifying -> verified, all client-side and time-based.
  const [verifyState, setVerifyState] = useState<'idle' | 'verifying' | 'verified'>('idle');
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleVerify = () => {
    if (verifyState !== 'idle') return;
    setVerifyState('verifying');
    timeoutRef.current = window.setTimeout(() => setVerifyState('verified'), 1100);
  };

  return (
    // NOTE: id is "component-passport", not "passport". HowItWorks.tsx
    // (the "Identify. Verify. Trace." section) owns id="passport" because
    // the nav's "How It Works" link (#passport) targets it — both
    // sections previously used id="passport", which is invalid HTML and
    // meant the anchor link always landed here instead.
    <section id="component-passport" className="bg-white px-6 py-28 md:px-10">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-16 md:grid-cols-2">
        <div>
          <h2 className="heading-section text-ink">
            Every component
            <br />
            has a story.
          </h2>
          <p className="mt-6 max-w-md body-lead text-ash">
            A digital component passport brings a part's identity, verification status, and
            lifecycle together in one trusted record — a concept view of how AERO-SENSE
            presents a component, not a live data feed.
          </p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={cardReveal}
          className="border border-pebble bg-slate-elevated p-8 text-white md:p-10"
        >
          <motion.div
            variants={fieldReveal}
            className="flex items-center justify-between border-b border-white/10 pb-6"
          >
            <div>
              <div className="font-display text-sm font-semibold tracking-tight">AERO-SENSE</div>
              <div className="mt-1 font-body text-[11px] uppercase tracking-[0.15em] text-white/50">
                Digital Component Passport
              </div>
            </div>
            <span className="font-body text-[11px] uppercase tracking-widest text-white/40">
              Concept
            </span>
          </motion.div>

          {/* 1. COMPONENT */}
          <motion.div variants={fieldReveal} className="mt-6">
            <div className="font-body text-[11px] uppercase tracking-[0.15em] text-white/50">
              Component
            </div>
            <div className="mt-1 font-display text-xl font-semibold">Turbine Blade Assembly</div>
          </motion.div>

          {/* 2. COMPONENT ID */}
          <motion.div variants={fieldReveal} className="mt-6">
            <div className="font-body text-[11px] uppercase tracking-[0.15em] text-white/50">
              Component ID
            </div>
            <div className="mt-1 font-mono text-sm text-white/80">AS-TRB-20491</div>
          </motion.div>

          {/* 3. AIRCRAFT ASSOCIATION — concept/demo value, same style as
              Component ID, not a real fleet record. */}
          <motion.div variants={fieldReveal} className="mt-6">
            <div className="font-body text-[11px] uppercase tracking-[0.15em] text-white/50">
              Aircraft Association
            </div>
            <div className="mt-1 font-mono text-sm text-white/80">AS-AC-77042</div>
          </motion.div>

          {/* 4. NFC IDENTITY — concept/demo tag UID, not a live scan. */}
          <motion.div variants={fieldReveal} className="mt-6">
            <div className="font-body text-[11px] uppercase tracking-[0.15em] text-white/50">
              NFC Identity
            </div>
            <div className="mt-1 font-mono text-sm text-white/80">NFC-4F9B-2C10</div>
          </motion.div>

          {/* 5. LIFECYCLE — dot marker uses --color-verify (not clay):
              this is a status/progress indicator, the exact role the
              design brief reserves for the cyan accent, distinct from
              clay's job as the SolutionFeature section background. */}
          <motion.div variants={fieldReveal} className="mt-8 border-t border-white/10 pt-6">
            <div className="font-body text-[11px] uppercase tracking-[0.15em] text-white/50">
              Lifecycle
            </div>
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
              {LIFECYCLE.map((stage) => (
                <div key={stage} className="flex items-center gap-2 font-body text-sm text-white/75">
                  <span className="h-1.5 w-1.5 rounded-full bg-verify" />
                  {stage}
                </div>
              ))}
            </div>
          </motion.div>

          {/* 6. VERIFICATION STATUS — last of the six reveal fields, per
              spec. Static "Verified" badge (unchanged behavior); now uses
              the cyan verify accent instead of clay, same reasoning as
              the lifecycle dot above. */}
          <motion.div variants={fieldReveal} className="mt-8 border-t border-white/10 pt-6">
            <div className="font-body text-[11px] uppercase tracking-[0.15em] text-white/50">
              Verification Status
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-sm text-verify">
              <CheckCircle2 className="h-4 w-4" />
              Verified
            </div>
          </motion.div>

          {/* Final reveal — the "digital identity complete" beat. Appears
              last in the stagger sequence, once Verification Status has
              already resolved above. */}
          <motion.div
            variants={fieldReveal}
            className="mt-6 flex items-center gap-2 font-body text-[11px] uppercase tracking-[0.2em] text-white/40"
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-verify" />
            Digital Identity — Complete
          </motion.div>

          {/* Verify Identity demo — explicitly labeled as a simulation.
              No hardware access, no real NFC read; the copy says so at
              every state so it can't be mistaken for a live scan.
              Unchanged from before, just now positioned after the
              reordered reveal fields above rather than before Lifecycle. */}
          <motion.div variants={fieldReveal} className="mt-8 border-t border-white/10 pt-6">
            <div className="font-body text-[11px] uppercase tracking-[0.15em] text-white/50">
              Verify Identity
            </div>
            <div className="mt-3 flex items-center gap-3">
              <button
                type="button"
                onClick={handleVerify}
                disabled={verifyState !== 'idle'}
                className="inline-flex items-center gap-2 border border-white/20 px-4 py-2 font-body text-sm text-white/90 transition-colors duration-300 hover:border-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-elevated disabled:cursor-default"
              >
                {verifyState === 'idle' && 'Simulate Verification'}
                {verifyState === 'verifying' && 'Verifying…'}
                {verifyState === 'verified' && (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-verify" />
                    Verified
                  </>
                )}
              </button>
              {verifyState === 'verified' && (
                <span className="font-body text-xs text-white/40">
                  Simulated result — demo only, no physical NFC scan performed.
                </span>
              )}
            </div>
            {verifyState === 'idle' && (
              <p className="mt-2 font-body text-xs text-white/40">
                Tap to simulate how identity verification would appear. This is a concept
                demo, not a live NFC scan.
              </p>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ComponentPassport;