import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from '@/lib/router';

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

const variants: Record<Variant, string> = {
  primary:
    'gradient-accent text-white hover:opacity-90 shadow-soft hover:shadow-float',
  secondary:
    'bg-elev text-base border border-base hover:border-strong hover:bg-soft',
  ghost: 'text-soft hover:text-base hover:bg-soft',
  outline: 'border border-strong text-base hover:border-accent-500 hover:text-accent-500',
};

const sizes: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-4 py-2.5 text-sm rounded-xl',
  lg: 'px-6 py-3 text-base rounded-xl',
};

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none cursor-pointer ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

interface LinkButtonProps {
  to: string;
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
}

export function LinkButton({ to, variant = 'primary', size = 'md', children, className = '' }: LinkButtonProps) {
  return (
    <Link
      to={to}
      className={`inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 active:scale-[0.97] ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </Link>
  );
}
