import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Building2, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { AuthField } from '../components/auth/AuthField';
import { PasswordField } from '../components/auth/PasswordField';

export const LoginPage: React.FC = () => {
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Unchanged: same login() call, same role-based redirect, same error
  // extraction from the API response. Only the presentation layer below
  // this function changed.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!companyName.trim() || !email.trim() || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setSubmitting(true);
    try {
      const user = await login(companyName, email, password);
      navigate(user.role === 'SUPER_ADMIN' ? '/companies' : '/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <h1
        className="mt-8 font-display font-semibold text-ink md:mt-0"
        style={{ fontSize: 'clamp(2.25rem, 4vw, 3rem)', lineHeight: 1.05, letterSpacing: '-0.02em' }}
      >
        Secure company
        <br />
        authentication.
      </h1>
      <p className="mt-4 font-body text-[15px] leading-relaxed text-ash">
        Sign in with your company credentials. Your role and permissions are
        determined automatically.
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-10 space-y-6">
        {error && (
          <div className="flex items-center gap-3 border border-red-200 bg-red-50 p-4 font-body text-sm text-red-700">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <AuthField
          label="Company Name"
          icon={Building2}
          value={companyName}
          onChange={setCompanyName}
          placeholder="Your Company Name"
          required
          autoComplete="organization"
        />

        <AuthField
          label="Email Address"
          icon={Mail}
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="you@company.com"
          required
          autoComplete="email"
        />

        <PasswordField
          label="Password"
          icon={Lock}
          value={password}
          onChange={setPassword}
          placeholder="••••••••••••"
          required
          autoComplete="current-password"
        />

        <button
          type="submit"
          disabled={submitting}
          className="pill-btn pill-btn-primary group mt-4 w-full disabled:opacity-50"
          style={{ height: '56px' }}
        >
          <span>{submitting ? 'Authenticating...' : 'Sign In'}</span>
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
        </button>
      </form>
    </>
  );
};

export default LoginPage;