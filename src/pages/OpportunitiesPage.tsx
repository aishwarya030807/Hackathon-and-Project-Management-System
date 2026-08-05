import { Target, CheckCircle2, ArrowRight, Trophy, Clock, MapPin } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/lib/toast';
import { opportunities } from '@/data/mock';

export function OpportunitiesPage() {
  const { toast } = useToast();
  const opp = opportunities[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-500/10 border border-accent-500/20 text-xs font-medium text-accent-500 mb-4">
          <Target className="w-3.5 h-3.5" /> Opportunity Matching
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">
          Find where your project belongs next.
        </h1>
        <p className="text-soft max-w-2xl">
          Innovara analyzes your project's domain, technology, and maturity to recommend the most
          relevant competitions and opportunities.
        </p>
      </div>

      {/* Sample project */}
      <Card className="p-6 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 shrink-0" />
            <div>
              <h2 className="font-semibold text-lg">{opp.projectName}</h2>
              <p className="text-sm text-soft">{opp.projectDomain} &middot; Maturity: {opp.projectMaturity}</p>
            </div>
          </div>
          <Badge color="info">{opp.projectMaturity}</Badge>
        </div>
      </Card>

      {/* Recommendations */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-1">Recommended Competitions</h2>
        <p className="text-sm text-soft">Sorted by match score</p>
      </div>

      <div className="space-y-4">
        {opp.matches.map((match, i) => (
          <Card key={match.id} className="p-6 hover:border-strong transition-all animate-fade-up" >
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent-500/10 flex items-center justify-center shrink-0">
                  <Trophy className="w-6 h-6 text-accent-500" />
                </div>
                <div>
                  <h3 className="font-semibold">{match.name}</h3>
                  <p className="text-xs text-soft">{match.organizer}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-display text-2xl font-bold gradient-text">{match.matchPercent}%</div>
                <div className="text-xs text-faint">match</div>
              </div>
            </div>

            {/* Match progress bar */}
            <div className="mb-4">
              <div className="h-2 bg-soft rounded-full overflow-hidden">
                <div
                  className="h-full gradient-accent rounded-full transition-all duration-700"
                  style={{ width: `${match.matchPercent}%` }}
                />
              </div>
            </div>

            {/* Reasons */}
            <div className="grid sm:grid-cols-2 gap-2 mb-4">
              {match.reasons.map((reason, j) => (
                <div key={j} className="flex items-start gap-2 text-sm text-soft">
                  <CheckCircle2 className="w-4 h-4 text-success-500 shrink-0 mt-0.5" />
                  {reason}
                </div>
              ))}
            </div>

            {/* Meta */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-base">
              <div className="flex flex-wrap gap-4 text-xs text-soft">
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-faint" /> Deadline: {match.deadline}</span>
                <span className="flex items-center gap-1"><Trophy className="w-3.5 h-3.5 text-faint" /> Prize: \u20b9{(match.prize / 100000).toFixed(1)}L</span>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => toast(`Applied to ${match.name}!`, 'success')}
              >
                Apply <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
