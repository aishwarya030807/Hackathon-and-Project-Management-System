import type { ReactNode } from 'react';
export { Badge } from '@/components/ui/Badge';

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      {icon && (
        <div className="w-16 h-16 rounded-2xl bg-soft flex items-center justify-center text-faint mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-base mb-1">{title}</h3>
      {description && <p className="text-sm text-soft max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function SectionHeader({
  title,
  subtitle,
  action,
  className = '',
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 ${className}`}>
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        {subtitle && <p className="text-soft mt-1 text-sm">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Card({
  children,
  className = '',
  hover = false,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`bg-elev border border-base rounded-2xl ${hover ? 'transition-all duration-200 hover:shadow-float hover:border-strong cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

export function Avatar({
  initials,
  size = 'md',
  className = '',
}: {
  initials: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const sizes = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
  };
  return (
    <div
      className={`${sizes[size]} rounded-full gradient-accent-soft border border-base flex items-center justify-center font-semibold text-accent-500 shrink-0 ${className}`}
    >
      {initials}
    </div>
  );
}
