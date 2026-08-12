import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Building2, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const user = await login(companyName, email, password);
      // Role is determined solely by the backend; the Super Admin has no
      // company and no access to operational dashboards, so it lands on
      // company management instead.
      navigate(user.role === 'SUPER_ADMIN' ? '/companies' : '/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen font-body md:flex">
      {/* Left — brand / visual panel */}
      <div className="relative hidden min-h-screen w-1/2 flex-col justify-between overflow-hidden bg-ink px-12 py-10 text-white md:flex">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />

        <Link to="/" className="relative font-display text-lg font-semibold tracking-tight">
          AERO-SENSE
        </Link>

        <div className="relative mx-auto w-full max-w-sm">
          <img
            src="/aero-sense/aircraft-hero.svg"
            alt="AERO-SENSE aircraft"
            className="w-full object-contain"
          />
        </div>

        <p className="relative max-w-sm font-body text-sm leading-relaxed text-white/50">
          A secure digital identity and traceability layer for aviation components.
        </p>
      </div>

      {/* Right — auth form */}
      <div className="flex min-h-screen w-full flex-col justify-center bg-white px-6 py-16 md:w-1/2 md:px-16 lg:px-24">
        <div className="mx-auto w-full max-w-sm">
          <Link to="/" className="font-display text-lg font-semibold tracking-tight text-ink md:hidden">
            AERO-SENSE
          </Link>

          <h1 className="mt-8 font-display text-[2.25rem] font-semibold leading-[1.05] tracking-tight text-ink md:mt-0">
            Secure company
            <br />
            authentication.
          </h1>
          <p className="mt-4 font-body text-[15px] leading-relaxed text-ash">
            Sign in with your company credentials. Your role and permissions are
            determined automatically.
          </p>

          <form onSubmit={handleSubmit} className="mt-10 space-y-6">
            {error && (
              <div className="flex items-center gap-3 border border-red-200 bg-red-50 p-4 font-body text-sm text-red-700">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="font-body text-xs font-medium uppercase tracking-wider text-ash">
                Company Name
              </label>
              <div className="relative">
                <Building2 className="absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-ash" />
                <input
                  type="text"
                  required
                  autoComplete="organization"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Your Company Name"
                  className="w-full border-b border-pebble bg-transparent py-2.5 pl-7 font-body text-[15px] text-ink placeholder-ash/60 focus:border-ink focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-body text-xs font-medium uppercase tracking-wider text-ash">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-ash" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full border-b border-pebble bg-transparent py-2.5 pl-7 font-body text-[15px] text-ink placeholder-ash/60 focus:border-ink focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-body text-xs font-medium uppercase tracking-wider text-ash">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-ash" />
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full border-b border-pebble bg-transparent py-2.5 pl-7 font-body text-[15px] text-ink placeholder-ash/60 focus:border-ink focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="pill-btn pill-btn-primary mt-4 w-full disabled:opacity-50"
            >
              <span>{submitting ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};