import type { TimelineEntry } from '@/types';
import { Rocket, RefreshCw, TrendingUp, Trophy, GitBranch } from 'lucide-react';

const typeConfig = {
  created: { icon: Rocket, color: 'text-accent-500', bg: 'bg-accent-500/10', border: 'border-accent-500/30' },
  revived: { icon: RefreshCw, color: 'text-success-500', bg: 'bg-success-500/10', border: 'border-success-500/30' },
  evolved: { icon: TrendingUp, color: 'text-accent2-500', bg: 'bg-accent2-500/10', border: 'border-accent2-500/30' },
  submitted: { icon: Trophy, color: 'text-warning-500', bg: 'bg-warning-500/10', border: 'border-warning-500/30' },
};

export function EvolutionTimeline({ entries }: { entries: TimelineEntry[] }) {
  if (!entries || entries.length === 0) {
    return (
      <div className="text-center py-12 text-soft">
        <GitBranch className="w-10 h-10 mx-auto mb-3 text-faint" />
        <p className="text-sm">This project doesn't have an evolution timeline yet.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-5 sm:left-6 top-0 bottom-0 w-px bg-gradient-to-b from-accent-500/40 via-accent-500/20 to-transparent" />

      <div className="space-y-8">
        {entries.map((entry, i) => {
          const config = typeConfig[entry.type];
          const Icon = config.icon;

          return (
            <div key={i} className="relative pl-14 sm:pl-16 animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
              {/* Node */}
              <div className={`absolute left-0 top-0 w-11 sm:w-12 h-11 sm:h-12 rounded-xl ${config.bg} border ${config.border} flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${config.color}`} />
              </div>

              {/* Card */}
              <div className="bg-elev border border-base rounded-2xl p-5 hover:shadow-soft transition-shadow">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-2xl font-display font-bold gradient-text">{entry.year}</span>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${config.bg} ${config.color}`}>
                    {entry.title}
                  </span>
                </div>
                <h3 className="font-semibold text-base mb-1">{entry.subtitle}</h3>
                <p className="text-sm text-soft mb-3">{entry.description}</p>

                <div className="flex items-center gap-2 text-xs text-faint">
                  <span className="flex items-center gap-1">
                    <GitBranch className="w-3 h-3" /> {entry.team}
                  </span>
                </div>

                {entry.additions && entry.additions.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-base">
                    <p className="text-xs font-medium text-soft mb-2">Added in this version:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {entry.additions.map((addition, j) => (
                        <span key={j} className="text-xs px-2 py-1 rounded-lg bg-soft text-soft border border-base">
                          {addition}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
