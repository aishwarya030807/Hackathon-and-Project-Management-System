import { Bookmark, MapPin, Users, Clock, Trophy, Eye, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import type { Hackathon } from '@/types';
import { Link } from '@/lib/router';
import { Badge, ModeBadge, DifficultyBadge } from '@/components/ui/Badge';
import { useToast } from '@/lib/toast';

function daysRemaining(deadline: string): number {
  const diff = new Date(deadline).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function formatPrize(amount: number): string {
  if (amount >= 100000) return `\u20b9${(amount / 100000).toFixed(1)}L`;
  return `\u20b9${amount.toLocaleString('en-IN')}`;
}

export function HackathonCard({ hackathon }: { hackathon: Hackathon }) {
  const [bookmarked, setBookmarked] = useState(false);
  const { toast } = useToast();
  const days = daysRemaining(hackathon.deadline);

  return (
    <div className="group bg-elev border border-base rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-float hover:border-strong">
      {/* Banner */}
      <div className={`h-28 bg-gradient-to-br ${hackathon.banner} relative`}>
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute top-3 right-3 flex gap-2">
          {hackathon.featured && <Badge color="accent">Featured</Badge>}
        </div>
        <div className="absolute bottom-3 left-4 flex items-center gap-2">
          <ModeBadge mode={hackathon.mode} />
          <DifficultyBadge difficulty={hackathon.difficulty} />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <Link to={`/hackathons/${hackathon.id}`} className="hover:text-accent-500 transition-colors">
            <h3 className="font-semibold text-base leading-tight">{hackathon.name}</h3>
          </Link>
          <button
            onClick={(e) => {
              e.preventDefault();
              setBookmarked((b) => !b);
              toast(bookmarked ? 'Removed from saved' : 'Hackathon bookmarked');
            }}
            className={`p-1.5 rounded-lg transition-colors shrink-0 ${
              bookmarked ? 'text-accent-500 bg-accent-500/10' : 'text-faint hover:text-base hover:bg-soft'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>
        <p className="text-xs text-soft mb-3">{hackathon.organizer}</p>

        {/* Domain tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {hackathon.domains.map((d) => (
            <Badge key={d} color="neutral">{d}</Badge>
          ))}
        </div>

        {/* Meta */}
        <div className="space-y-1.5 text-xs text-soft">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-faint" />
            {hackathon.location}
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="w-3.5 h-3.5 text-faint" />
            {formatPrize(hackathon.prizePool)} prize pool
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-faint" />
            {hackathon.teamSize}
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-faint" />
            <span className={days <= 7 ? 'text-warning-500 font-medium' : ''}>
              {days} days left
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-base">
          <span className="text-xs text-faint flex items-center gap-1">
            <Eye className="w-3 h-3" /> {hackathon.participants.toLocaleString()} applied
          </span>
          <Link
            to={`/hackathons/${hackathon.id}`}
            className="text-xs font-medium text-accent-500 hover:text-accent-400 flex items-center gap-1 transition-colors"
          >
            View details <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
