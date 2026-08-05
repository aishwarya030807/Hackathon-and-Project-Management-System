import { useState } from 'react';
import {
  LayoutDashboard, FolderGit2, Bookmark, FileText, GitFork,
  Trophy, User, ArrowRight, Clock, RefreshCw, Activity, Star, Target,
} from 'lucide-react';
import { Card, Avatar, Badge, SectionHeader, EmptyState } from '@/components/ui';
import { Button, LinkButton } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/Badge';
import { ProjectCard } from '@/components/ProjectCard';
import { HackathonCard } from '@/components/HackathonCard';
import { useToast } from '@/lib/toast';
import { projects, hackathons, students } from '@/data/mock';

const sidebarItems = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'projects', label: 'My Projects', icon: FolderGit2 },
  { key: 'saved', label: 'Saved Hackathons', icon: Bookmark },
  { key: 'applications', label: 'Applications', icon: FileText },
  { key: 'contributions', label: 'Contributions', icon: GitFork },
  { key: 'achievements', label: 'Achievements', icon: Trophy },
  { key: 'profile', label: 'Profile', icon: User },
];

const student = students[0];
const myProjects = projects.slice(0, 4);
const savedHackathons = hackathons.slice(0, 2);
const contributorProjects = projects.filter((p) => p.status === 'Looking for Contributors').slice(0, 2);

export function WorkspacePage() {
  const [active, setActive] = useState('overview');
  const { toast } = useToast();

  const stats = [
    { label: 'Active Projects', value: '4', icon: Activity, color: 'text-success-500' },
    { label: 'Projects Archived', value: '2', icon: FolderGit2, color: 'text-soft' },
    { label: 'Projects Revived', value: '3', icon: RefreshCw, color: 'text-accent-500' },
    { label: 'Hackathons Applied', value: '7', icon: Target, color: 'text-accent2-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="grid lg:grid-cols-[240px_1fr] gap-6">
        {/* Sidebar */}
        <aside className="lg:sticky lg:top-20 lg:h-fit">
          <Card className="p-4">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-base">
              <Avatar initials={student.avatar} size="md" />
              <div className="min-w-0">
                <p className="font-semibold text-sm truncate">{student.name}</p>
                <p className="text-xs text-soft truncate">{student.college}</p>
              </div>
            </div>
            <nav className="space-y-1">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.key}
                    onClick={() => setActive(item.key)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      active === item.key
                        ? 'text-accent-500 bg-accent-500/10'
                        : 'text-soft hover:text-base hover:bg-soft'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </Card>
        </aside>

        {/* Content */}
        <div className="space-y-6">
          {active === 'overview' && (
            <>
              <div>
                <h1 className="font-display text-2xl font-bold mb-1">Welcome back, {student.name.split(' ')[0]}</h1>
                <p className="text-sm text-soft">Here's what's happening with your projects.</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {stats.map((s) => {
                  const Icon = s.icon;
                  return (
                    <Card key={s.label} className="p-4">
                      <Icon className={`w-5 h-5 ${s.color} mb-2`} />
                      <div className="font-display text-2xl font-bold">{s.value}</div>
                      <div className="text-xs text-soft">{s.label}</div>
                    </Card>
                  );
                })}
              </div>

              {/* Continue Building */}
              <div>
                <SectionHeader
                  title="Continue Building"
                  subtitle="Pick up where you left off."
                  className="mb-4"
                />
                <div className="grid sm:grid-cols-2 gap-4">
                  {myProjects.slice(0, 2).map((p) => (
                    <Card key={p.id} className="p-4 hover:border-strong transition-all">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${p.color} shrink-0`} />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm">{p.name}</h3>
                          <p className="text-xs text-soft truncate">{p.tagline}</p>
                        </div>
                        <StatusBadge status={p.status} />
                      </div>
                      <div className="flex items-center justify-between text-xs text-faint">
                        <span className="flex items-center gap-1"><Star className="w-3 h-3" /> {p.stars} stars</span>
                        <LinkButton to={`/projects/${p.id}`} variant="ghost" size="sm">
                          Open <ArrowRight className="w-3 h-3" />
                        </LinkButton>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Upcoming deadlines */}
              <div>
                <SectionHeader title="Upcoming Deadlines" className="mb-4" />
                <div className="space-y-2">
                  {hackathons.slice(0, 3).map((h) => {
                    const days = Math.ceil((new Date(h.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                    return (
                      <Card key={h.id} className="p-4 flex items-center justify-between hover:border-strong transition-all">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${h.banner} flex items-center justify-center`}>
                            <Clock className="w-4 h-4 text-soft" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold">{h.name}</div>
                            <div className="text-xs text-soft">{h.organizer}</div>
                          </div>
                        </div>
                        <Badge color={days <= 7 ? 'warning' : 'neutral'}>{days} days left</Badge>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* Recommended */}
              <div>
                <SectionHeader
                  title="Recommended Hackathons"
                  subtitle="Based on your project domains."
                  className="mb-4"
                />
                <div className="grid sm:grid-cols-2 gap-4">
                  {hackathons.slice(2, 4).map((h) => (
                    <HackathonCard key={h.id} hackathon={h} />
                  ))}
                </div>
              </div>

              {/* Contributors needed */}
              <div>
                <SectionHeader
                  title="Projects Looking for Contributors"
                  className="mb-4"
                />
                <div className="grid sm:grid-cols-2 gap-4">
                  {contributorProjects.map((p) => (
                    <ProjectCard key={p.id} project={p} />
                  ))}
                </div>
              </div>

              {/* Recent activity */}
              <div>
                <SectionHeader title="Recent Activity" className="mb-4" />
                <Card className="p-4 divide-y divide-[var(--border)]">
                  {[
                    { icon: RefreshCw, text: 'You revived SafeRoute', time: '2h ago', color: 'text-success-500' },
                    { icon: GitFork, text: 'You contributed to NeuroLearn', time: '1d ago', color: 'text-accent-500' },
                    { icon: Star, text: 'MedVision reached 842 stars', time: '2d ago', color: 'text-warning-500' },
                    { icon: FileText, text: 'You applied to HealthHack India 2025', time: '3d ago', color: 'text-accent2-500' },
                  ].map((act, i) => {
                    const Icon = act.icon;
                    return (
                      <div key={i} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                        <Icon className={`w-4 h-4 ${act.color} shrink-0`} />
                        <span className="text-sm flex-1">{act.text}</span>
                        <span className="text-xs text-faint">{act.time}</span>
                      </div>
                    );
                  })}
                </Card>
              </div>
            </>
          )}

          {active === 'projects' && (
            <>
              <SectionHeader title="My Projects" subtitle="Projects you own or maintain." className="mb-4" />
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {myProjects.map((p) => (
                  <ProjectCard key={p.id} project={p} />
                ))}
              </div>
            </>
          )}

          {active === 'saved' && (
            <>
              <SectionHeader title="Saved Hackathons" className="mb-4" />
              <div className="grid sm:grid-cols-2 gap-4">
                {savedHackathons.map((h) => (
                  <HackathonCard key={h.id} hackathon={h} />
                ))}
              </div>
            </>
          )}

          {active === 'applications' && (
            <>
              <SectionHeader title="Applications" subtitle="Hackathons you've applied to." className="mb-4" />
              <Card className="divide-y divide-[var(--border)]">
                {hackathons.slice(0, 4).map((h, i) => (
                  <div key={h.id} className="p-4 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold">{h.name}</div>
                      <div className="text-xs text-soft">{h.organizer}</div>
                    </div>
                    <Badge color={i === 0 ? 'success' : 'neutral'}>{i === 0 ? 'Accepted' : 'Pending'}</Badge>
                  </div>
                ))}
              </Card>
            </>
          )}

          {active === 'contributions' && (
            <>
              <SectionHeader title="Contributions" subtitle="Projects you've contributed to." className="mb-4" />
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.slice(2, 6).map((p) => (
                  <ProjectCard key={p.id} project={p} />
                ))}
              </div>
            </>
          )}

          {active === 'achievements' && (
            <>
              <SectionHeader title="Achievements" className="mb-4" />
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {student.achievements.map((a, i) => (
                  <Card key={i} className="p-5 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-accent-500/10 flex items-center justify-center mx-auto mb-3">
                      <Trophy className="w-7 h-7 text-accent-500" />
                    </div>
                    <h3 className="font-semibold text-sm">{a.title}</h3>
                    <p className="text-xs text-soft mt-1">{a.date}</p>
                  </Card>
                ))}
              </div>
            </>
          )}

          {active === 'profile' && (
            <Card className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <Avatar initials={student.avatar} size="lg" />
                <div>
                  <h2 className="font-semibold text-lg">{student.name}</h2>
                  <p className="text-sm text-soft">{student.college} &middot; {student.year}</p>
                </div>
              </div>
              <p className="text-sm text-soft mb-6">{student.bio}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {Object.entries(student.stats).map(([key, val]) => (
                  <div key={key} className="p-3 rounded-xl bg-soft border border-base text-center">
                    <div className="font-bold text-lg">{val}</div>
                    <div className="text-xs text-soft capitalize">{key}</div>
                  </div>
                ))}
              </div>
              <Button variant="secondary" className="mt-6" onClick={() => toast('Profile edit is a demo feature', 'info')}>
                Edit Profile
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
