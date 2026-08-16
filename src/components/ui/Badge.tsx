import type { ReactNode } from 'react';
import type { ProjectStatus, Difficulty, Maturity, HackathonMode } from '@/types';

type BadgeColor = 'accent' | 'success' | 'warning' | 'error' | 'neutral' | 'info';

const colors: Record<BadgeColor, string> = {
  accent: 'bg-accent-500/10 text-accent-500 border-accent-500/20',
  success: 'bg-success-500/10 text-success-500 border-success-500/20',
  warning: 'bg-warning-500/10 text-warning-500 border-warning-500/20',
  error: 'bg-error-500/10 text-error-500 border-error-500/20',
  neutral: 'bg-soft text-soft border-base',
  info: 'bg-accent2-500/10 text-accent2-500 border-accent2-500/20',
};

export function Badge({
  children,
  color = 'neutral',
  className = '',
}: {
  children: ReactNode;
  color?: BadgeColor;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full border ${colors[color]} ${className}`}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: ProjectStatus }) {
  const map: Record<ProjectStatus, BadgeColor> = {
    Active: 'success',
    Archived: 'neutral',
    'Looking for Contributors': 'warning',
    Abandoned: 'error',
    Revived: 'accent',
  };
  return <Badge color={map[status]}>{status}</Badge>;
}

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const map: Record<Difficulty, BadgeColor> = {
    Beginner: 'success',
    Intermediate: 'warning',
    Advanced: 'error',
  };
  return <Badge color={map[difficulty]}>{difficulty}</Badge>;
}

export function MaturityBadge({ maturity }: { maturity: Maturity }) {
  return <Badge color="info">{maturity}</Badge>;
}

export function ModeBadge({ mode }: { mode: HackathonMode }) {
  const map: Record<HackathonMode, BadgeColor> = {
    Online: 'info',
    Offline: 'neutral',
    Hybrid: 'accent',
  };
  return <Badge color={map[mode]}>{mode}</Badge>;
}
