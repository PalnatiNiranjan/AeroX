import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Standard cn() helper. Both clsx and tailwind-merge were already
// dependencies (package.json) — nothing new installed, just wired
// together. No shadcn CLI scaffolding added since the project doesn't
// use that pattern anywhere else (no components.json, no ui/button.tsx
// etc.) — this file alone is enough for the new auth components below.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}