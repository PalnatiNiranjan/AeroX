import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { AuthBrandPanel } from './AuthBrandPanel';

/**
 * Shell for /login. Used to also host /register and animate a panel
 * swap between the two (mode, order, transition lock, AuthCurveDivider,
 * AuthSwitch) — all of that's removed now that registration doesn't
 * exist in this app. What's left is a static two-column layout: the
 * aviation brand panel plus a form panel rendering whatever the nested
 * route (just /login now) puts in the Outlet.
 *
 * Floating-card treatment: the reference shows this as an inset, rounded,
 * shadowed card centered on a light page background — not full-bleed to
 * the viewport. Reuses the same rounded-corner + shadow language already
 * established on the landing page's own card wrapper (see LandingPage.tsx)
 * for visual consistency rather than inventing new values.
 *
 * Page background color (bg-slate-100 below) is a plain Tailwind gray —
 * not pulled from an existing project token, since none of the tokens
 * seen so far (--color-panel, --color-ink, etc.) were documented as a
 * page-level background. Worth checking against the real index.css and
 * swapping in the correct token if one exists for this purpose.
 */
export const AuthShell: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4 font-body md:p-8">
      <div className="mx-auto w-full max-w-[1100px] overflow-hidden rounded-[28px] bg-white shadow-[0_24px_70px_-20px_rgba(0,13,16,0.18)] md:flex md:rounded-[32px]">
        <AuthBrandPanel />

        <div className="flex w-full flex-col justify-center px-6 py-12 md:w-[52%] md:px-16 md:py-16 lg:px-20">
          <div className="mx-auto w-full max-w-[440px]">
            {/* Mobile-only wordmark repeat — the brand panel above no
                longer carries its own wordmark (removed to match the
                reference's plain photo), so this is now the only place
                AERO-SENSE appears on this page at any breakpoint below
                md. At md+ this stays hidden; worth reconsidering whether
                the wordmark should reappear somewhere on desktop now that
                AuthBrandPanel's own copy is gone. */}
            <Link
              to="/"
              className="font-display text-lg font-semibold tracking-tight text-ink md:hidden"
            >
              AERO-SENSE
            </Link>

            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthShell;