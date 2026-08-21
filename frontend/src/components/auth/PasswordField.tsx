import React, { useState } from 'react';
import { Eye, EyeOff, type LucideIcon } from 'lucide-react';

interface PasswordFieldProps {
  label: string;
  icon: LucideIcon;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
}

// Same contract as AuthField (read off LoginPage.tsx's existing call),
// plus the show/hide toggle the brief specifies for this one field.
export const PasswordField: React.FC<PasswordFieldProps> = ({
  label,
  icon: Icon,
  value,
  onChange,
  placeholder,
  required,
  autoComplete,
}) => {
  const id = React.useId();
  const [visible, setVisible] = useState(false);

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
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          className="w-full bg-transparent font-body text-[15px] text-ink placeholder:text-ash/70 focus:outline-none"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
          className="shrink-0 text-ash transition-colors hover:text-ink focus:outline-none focus-visible:text-ink"
        >
          {visible ? <EyeOff className="h-[18px] w-[18px]" aria-hidden="true" /> : <Eye className="h-[18px] w-[18px]" aria-hidden="true" />}
        </button>
      </div>
    </div>
  );
};

export default PasswordField;