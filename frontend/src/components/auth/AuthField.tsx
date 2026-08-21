import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface AuthFieldProps {
  label: string;
  icon: LucideIcon;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
}

// Prop shape matches exactly how LoginPage.tsx already calls this
// component — that file is unchanged, so this contract isn't a guess,
// it's read directly off its existing usage.
export const AuthField: React.FC<AuthFieldProps> = ({
  label,
  icon: Icon,
  type = 'text',
  value,
  onChange,
  placeholder,
  required,
  autoComplete,
}) => {
  const id = React.useId();

  return (
    <div>
      <label
        htmlFor={id}
        className="font-body uppercase text-ash"
        style={{ fontSize: '12px', fontWeight: 500, letterSpacing: '0.06em' }}
      >
        {label}
      </label>
      <div className="mt-2 flex items-center gap-3 border-b border-pebble pb-2.5 transition-colors duration-200 focus-within:border-[var(--color-verify)]">
        <Icon className="h-[18px] w-[18px] shrink-0 text-ash" aria-hidden="true" />
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          className="w-full bg-transparent font-body text-[15px] text-ink placeholder:text-ash/70 focus:outline-none"
        />
      </div>
    </div>
  );
};

export default AuthField;