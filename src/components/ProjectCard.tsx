import { Star, GitFork, Eye, ArrowRight, Bookmark, Users } from 'lucide-react';
import { useState } from 'react';
import type { Project } from '@/types';
import { Link } from '@/lib/router';
import { Badge, StatusBadge, DifficultyBadge, MaturityBadge } from '@/components/ui/Badge';
import { useToast } from '@/lib/toast';

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
}

export function ProjectCard({ project, featured = false }: { project: Project; featured?: boolean }) {
  const [bookmarked, setBookmarked] = useState(false);
  const { toast } = useToast();

  if (featured) {
    return (
      <div className="group relative bg-elev border border-base rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-float hover:border-strong md:col-span-2">
        <div className="grid sm:grid-cols-2">
          {/* Visual */}
          <div className={`relative min-h-[180px] bg-gradient-to-br ${project.color} p-6 flex flex-col justify-between`}>
            <div className="absolute inset-0 grid-bg opacity-20" />
            <div className="relative">
              <StatusBadge status={project.status} />
            </div>
            <div className="relative">
              <h3 className="font-display text-2xl font-bold text-white mb-1">{project.name}</h3>
              <p className="text-sm text-white/80">{project.tagline}</p>
            </div>
          </div>

          {/* Details */}
          <div className="p-6 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {project.domain.map((d) => (
                  <Badge key={d} color="accent">{d}</Badge>
                ))}
                <MaturityBadge maturity={project.maturity} />
              </div>
              <p className="text-sm text-soft mb-4 line-clamp-3">{project.description}</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {project.techStack.slice(0, 4).map((t) => (
                  <span key={t} className="text-xs px-2 py-0.5 rounded-md bg-soft text-soft border border-base">
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-base">
              <div className="flex items-center gap-3 text-xs text-faint">
                <span className="flex items-center gap-1"><Star className="w-3 h-3" /> {formatCount(project.stars)}</span>
                <span className="flex items-center gap-1"><GitFork className="w-3 h-3" /> {project.forks}</span>
                <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {project.originalTeam.name}</span>
              </div>
              <Link
                to={`/projects/${project.id}`}
                className="text-xs font-medium text-accent-500 hover:text-accent-400 flex items-center gap-1 transition-colors"
              >
                View <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-elev border border-base rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-float hover:border-strong">
      {/* Thumbnail */}
      <div className={`relative h-32 bg-gradient-to-br ${project.color} p-4 flex flex-col justify-between`}>
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="relative flex items-start justify-between">
          <StatusBadge status={project.status} />
          <button
            onClick={(e) => {
              e.preventDefault();
              setBookmarked((b) => !b);
              toast(bookmarked ? 'Removed from saved' : 'Project bookmarked');
            }}
            className={`p-1.5 rounded-lg transition-colors ${
              bookmarked ? 'text-white bg-white/20' : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>
        <div className="relative">
          <h3 className="font-display text-xl font-bold text-white">{project.name}</h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-xs text-soft mb-3 line-clamp-2">{project.tagline}</p>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {project.domain.map((d) => (
            <Badge key={d} color="neutral">{d}</Badge>
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {project.techStack.slice(0, 3).map((t) => (
            <span key={t} className="text-xs px-2 py-0.5 rounded-md bg-soft text-soft border border-base">
              {t}
            </span>
          ))}
          {project.techStack.length > 3 && (
            <span className="text-xs px-2 py-0.5 text-faint">+{project.techStack.length - 3}</span>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-faint pt-3 border-t border-base">
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" /> {project.originalTeam.name}
          </span>
          <span>{project.year}</span>
        </div>

        <div className="flex items-center justify-between mt-3 gap-2">
          <Link
            to={`/projects/${project.id}`}
            className="flex-1 text-center text-xs font-medium px-3 py-2 rounded-lg border border-base text-soft hover:text-base hover:border-strong hover:bg-soft transition-all"
          >
            View Project
          </Link>
          <Link
            to={`/projects/${project.id}`}
            className="flex-1 text-center text-xs font-medium px-3 py-2 rounded-lg gradient-accent text-white hover:opacity-90 transition-all"
          >
            Adopt
          </Link>
        </div>
      </div>
    </div>
  );
}
