import {
  ArrowLeft, Star, GitFork, Trophy, Award, Calendar, GitBranch,
  Activity, TrendingUp, Heart, Brain, Leaf, Cpu, GraduationCap, Sparkles,
} from 'lucide-react';
import { useParams, useNavigate, Link } from '@/lib/router';
import { Card, Avatar, Badge, SectionHeader, EmptyState } from '@/components/ui';
import { StatusBadge } from '@/components/ui/Badge';
import { ProjectCard } from '@/components/ProjectCard';
import { students, projects, hackathons } from '@/data/mock';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Trophy, Award, Star, Sparkles, Heart, Brain, Leaf, Cpu, GraduationCap, TrendingUp,
};

export function ProfilePage() {
  const { id } = useParams('/profile/:id');
  const navigate = useNavigate();

  const student = students.find((s) => s.id === id) ?? students[0];
  const featured = projects.filter((p) => student.featuredProjects.includes(p.id));
  const otherProjects = projects.filter((p) => p.originalTeam.members.some((m) => m.name === student.name)).slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <button
        onClick={() => navigate('/leaderboard')}
        className="flex items-center gap-1.5 text-sm text-soft hover:text-base transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to leaderboard
      </button>

      {/* Profile header */}
      <Card className="p-6 sm:p-8 mb-6">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <Avatar initials={student.avatar} size="lg" className="w-20 h-20 text-2xl" />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h1 className="font-display text-2xl font-bold">{student.name}</h1>
              {student.rank && student.rank <= 3 && (
                <Badge color="accent">Rank #{student.rank}</Badge>
              )}
            </div>
            <p className="text-sm text-soft">{student.college} &middot; {student.year}</p>
            <p className="text-sm text-soft mt-3 max-w-2xl">{student.bio}</p>
            <div className="flex flex-wrap gap-1.5 mt-4">
              {student.skills.map((s) => (
                <span key={s} className="text-xs px-2.5 py-1 rounded-lg bg-soft text-soft border border-base">
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div className="text-center sm:text-right">
            <div className="font-display text-3xl font-bold gradient-text">{student.innovationScore?.toLocaleString()}</div>
            <div className="text-xs text-soft">innovation score</div>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {[
          { label: 'Projects', value: student.stats.projects, icon: GitBranch, color: 'text-accent-500' },
          { label: 'Hackathons', value: student.stats.hackathons, icon: Trophy, color: 'text-warning-500' },
          { label: 'Contributions', value: student.stats.contributions, icon: GitFork, color: 'text-accent2-500' },
          { label: 'Projects Revived', value: student.stats.revived, icon: Activity, color: 'text-success-500' },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="p-4 text-center sm:text-left">
              <Icon className={`w-5 h-5 ${s.color} mb-2`} />
              <div className="font-display text-2xl font-bold">{s.value}</div>
              <div className="text-xs text-soft">{s.label}</div>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Featured projects */}
          {featured.length > 0 && (
            <div>
              <SectionHeader title="Featured Projects" className="mb-4" />
              <div className="grid sm:grid-cols-2 gap-4">
                {featured.map((p) => (
                  <ProjectCard key={p.id} project={p} />
                ))}
              </div>
            </div>
          )}

          {/* Other projects */}
          {otherProjects.length > 0 && (
            <div>
              <SectionHeader title="More Projects" className="mb-4" />
              <div className="grid sm:grid-cols-2 gap-4">
                {otherProjects.map((p) => (
                  <ProjectCard key={p.id} project={p} />
                ))}
              </div>
            </div>
          )}

          {/* Hackathon history */}
          <div>
            <SectionHeader title="Hackathon History" className="mb-4" />
            <Card className="divide-y divide-[var(--border)]">
              {hackathons.slice(0, 4).map((h, i) => (
                <Link key={h.id} to={`/hackathons/${h.id}`} className="flex items-center justify-between p-4 hover:bg-soft transition-colors first:rounded-t-2xl last:rounded-b-2xl">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${h.banner} flex items-center justify-center`}>
                      <Trophy className="w-4 h-4 text-soft" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{h.name}</div>
                      <div className="text-xs text-soft">{h.organizer}</div>
                    </div>
                  </div>
                  <Badge color={i === 0 ? 'success' : 'neutral'}>{i === 0 ? 'Won 1st' : 'Participated'}</Badge>
                </Link>
              ))}
            </Card>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Achievements */}
          <div>
            <SectionHeader title="Achievements" className="mb-4" />
            <div className="space-y-3">
              {student.achievements.map((a, i) => {
                const Icon = iconMap[a.icon] ?? Trophy;
                return (
                  <Card key={i} className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent-500/10 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-accent-500" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{a.title}</div>
                      <div className="text-xs text-soft">{a.date}</div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Contribution timeline */}
          <div>
            <SectionHeader title="Contribution Timeline" className="mb-4" />
            <Card className="p-4">
              <div className="relative pl-5">
                <div className="absolute left-1.5 top-1 bottom-1 w-px bg-base" />
                {[
                  { text: 'Revived SafeRoute', time: '2h ago', color: 'bg-success-500' },
                  { text: 'Contributed to NeuroLearn', time: '1d ago', color: 'bg-accent-500' },
                  { text: 'Won HealthHack India', time: '5d ago', color: 'bg-warning-500' },
                  { text: 'Created MedVision v2', time: '2w ago', color: 'bg-accent2-500' },
                ].map((item, i) => (
                  <div key={i} className="relative mb-4 last:mb-0">
                    <div className={`absolute -left-3.5 top-1 w-2.5 h-2.5 rounded-full ${item.color}`} />
                    <div className="text-sm">{item.text}</div>
                    <div className="text-xs text-faint">{item.time}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
