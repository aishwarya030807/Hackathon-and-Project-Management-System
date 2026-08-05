import {
  Sparkles, Compass, Hammer, Archive, RefreshCw, TrendingUp, Trophy,
  ArrowRight, Star, GitFork, Users, Heart, Brain, Leaf, Shield, Cpu,
  Activity, Zap, Target, Eye,
} from 'lucide-react';
import { Link, useNavigate } from '@/lib/router';
import { Button, LinkButton } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, Avatar, SectionHeader } from '@/components/ui';
import { HackathonCard } from '@/components/HackathonCard';
import { ProjectCard } from '@/components/ProjectCard';
import { stats, testimonials, lifecycle, hackathons, projects } from '@/data/mock';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Compass, Hammer, Archive, RefreshCw, TrendingUp, Trophy,
};

export function LandingPage() {
  const navigate = useNavigate();
  const featuredHackathons = hackathons.filter((h) => h.featured).slice(0, 3);
  const featuredProjects = projects.filter((p) => p.featured);
  const archivedProject = projects.find((p) => p.status === 'Archived' || p.status === 'Abandoned');

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative pt-12 pb-20 sm:pt-20">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-accent-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-20 right-0 w-[400px] h-[300px] bg-accent2-500/10 rounded-full blur-[100px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-up">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-500/10 border border-accent-500/20 text-xs font-medium text-accent-500 mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                Where student ideas keep evolving
              </div>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] mb-5">
                Don't let great student projects{' '}
                <span className="gradient-text">disappear.</span>
              </h1>
              <p className="text-lg text-soft max-w-xl mb-8 leading-relaxed">
                Discover hackathons, build ambitious projects, preserve what you've created, and give
                the next generation a starting point.
              </p>
              <div className="flex flex-wrap gap-3">
                <LinkButton to="/hackathons" size="lg">
                  Explore Hackathons <ArrowRight className="w-4 h-4" />
                </LinkButton>
                <LinkButton to="/projects" variant="secondary" size="lg">
                  Explore Projects
                </LinkButton>
              </div>

              <div className="flex items-center gap-6 mt-8 text-sm text-soft">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {['SR', 'AM', 'AG', 'IC'].map((a) => (
                      <Avatar key={a} initials={a} size="sm" className="ring-2 ring-[var(--bg)]" />
                    ))}
                  </div>
                  <span>8,900+ students</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-warning-500 fill-warning-500" />
                  <span>4.9/5 community rating</span>
                </div>
              </div>
            </div>

            {/* Hero visual */}
            <div className="relative animate-fade-up delay-200">
              <HeroVisual />
            </div>
          </div>
        </div>
      </section>

      {/* Platform stats */}
      <section className="py-16 border-y border-base bg-elev/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <StatCard icon={Archive} value={`${stats.projectsArchived.toLocaleString()}+`} label="Projects Archived" />
            <StatCard icon={Trophy} value={`${stats.hackathons.toLocaleString()}+`} label="Hackathons" />
            <StatCard icon={Users} value={`${stats.students.toLocaleString()}+`} label="Students" />
            <StatCard icon={RefreshCw} value={`${stats.projectsRevived.toLocaleString()}+`} label="Projects Revived" />
          </div>
        </div>
      </section>

      {/* Lifecycle */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <Badge color="accent" className="mb-3">The Innovara Lifecycle</Badge>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-3">
              From one-time hackathon to long-term innovation
            </h2>
            <p className="text-soft max-w-2xl mx-auto">
              Innovara transforms hackathons from single events into the start of a project lifecycle
              that spans batches, years, and teams.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {lifecycle.map((step, i) => {
              const Icon = iconMap[step.icon] ?? Sparkles;
              return (
                <div
                  key={step.step}
                  className="relative animate-fade-up"
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <Card className="p-5 h-full hover:border-strong transition-all group">
                    <div className="w-10 h-10 rounded-xl bg-accent-500/10 flex items-center justify-center text-accent-500 mb-3 group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="text-xs text-faint mb-1">Step {i + 1}</div>
                    <h3 className="font-semibold text-sm mb-1">{step.step}</h3>
                    <p className="text-xs text-soft leading-relaxed">{step.desc}</p>
                  </Card>
                  {i < lifecycle.length - 1 && (
                    <div className="hidden lg:flex absolute top-1/2 -right-2 -translate-y-1/2 text-faint z-10">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Hackathon discovery preview */}
      <section className="py-20 bg-elev/50 border-y border-base">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeader
            title="Find your next challenge"
            subtitle="Discover hackathons that match your skills, interests, and ambition."
            action={<LinkButton to="/hackathons" variant="secondary" size="md">View all <ArrowRight className="w-4 h-4" /></LinkButton>}
            className="mb-8"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredHackathons.map((h) => (
              <HackathonCard key={h.id} hackathon={h} />
            ))}
          </div>
        </div>
      </section>

      {/* Project repository preview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeader
            title="Built by students before you"
            subtitle="Explore what students built before you. Continue it. Improve it. Make it yours."
            action={<LinkButton to="/projects" variant="secondary" size="md">Explore repository <ArrowRight className="w-4 h-4" /></LinkButton>}
            className="mb-8"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredProjects.slice(0, 1).map((p) => (
              <ProjectCard key={p.id} project={p} featured />
            ))}
            {projects.slice(1, 5).map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Project revival section */}
      <section className="py-20 bg-elev/50 border-y border-base">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge color="success" className="mb-3">Project Revival</Badge>
              <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
                Give abandoned projects a second life
              </h2>
              <p className="text-soft mb-6 leading-relaxed">
                When a hackathon ends, many projects are abandoned. But the ideas, code, and learnings
                are still valuable. Innovara lets you adopt archived projects, become a new maintainer,
                and continue where the original team left off.
              </p>
              <ul className="space-y-3 mb-6">
                {[
                  'Browse archived and abandoned projects by domain',
                  'See suggested improvements from the original team',
                  'Become a maintainer with one click',
                  'Track project evolution across batches',
                ].map((point) => (
                  <li key={point} className="flex items-start gap-2.5 text-sm text-soft">
                    <div className="w-5 h-5 rounded-full bg-success-500/10 flex items-center justify-center shrink-0 mt-0.5">
                      <RefreshCw className="w-3 h-3 text-success-500" />
                    </div>
                    {point}
                  </li>
                ))}
              </ul>
              <LinkButton to="/projects" size="md">
                Browse Revivable Projects <ArrowRight className="w-4 h-4" />
              </LinkButton>
            </div>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600" />
                  <div>
                    <h3 className="font-semibold">{archivedProject?.name}</h3>
                    <p className="text-xs text-soft">{archivedProject?.tagline}</p>
                  </div>
                </div>
                <Badge color="error">Abandoned</Badge>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-medium text-soft mb-1.5">Original team</p>
                  <div className="flex items-center gap-2">
                    {archivedProject?.originalTeam.members.map((m) => (
                      <div key={m.name} className="flex items-center gap-1.5">
                        <Avatar initials={m.avatar} size="xs" />
                        <span className="text-xs text-soft">{m.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pt-3 border-t border-base">
                  <p className="text-xs font-medium text-soft mb-2">Suggested improvements:</p>
                  <div className="space-y-1.5">
                    {archivedProject?.suggestedImprovements?.map((imp, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-soft">
                        <Zap className="w-3 h-3 text-warning-500 mt-0.5 shrink-0" />
                        {imp}
                      </div>
                    ))}
                  </div>
                </div>
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => navigate(`/projects/${archivedProject?.id}`)}
                >
                  <RefreshCw className="w-4 h-4" /> Adopt This Project
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Opportunity matching */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <Badge color="accent" className="mb-3">Opportunity Matching</Badge>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-3">
              Find where your project belongs next
            </h2>
            <p className="text-soft max-w-2xl mx-auto">
              Innovara matches your project with relevant competitions, grants, and opportunities
              based on domain, technology, and maturity.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Sample project */}
            <Card className="p-5 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold">MedVision</h3>
                  <p className="text-xs text-soft">Healthcare + AI &middot; Maturity: MVP</p>
                </div>
                <Badge color="info">Prototype</Badge>
              </div>
            </Card>

            {/* Matches */}
            <div className="space-y-3">
              {[
                { name: 'Medical Innovation Challenge', match: 92, icon: Heart, color: 'text-rose-500' },
                { name: 'AI for Good Hackathon', match: 87, icon: Brain, color: 'text-accent-500' },
                { name: 'HealthTech Future Challenge', match: 81, icon: Activity, color: 'text-accent2-500' },
              ].map((m) => {
                const Icon = m.icon;
                return (
                  <Card key={m.name} className="p-4 flex items-center gap-4 hover:border-strong transition-all">
                    <div className="w-10 h-10 rounded-lg bg-soft flex items-center justify-center shrink-0">
                      <Icon className={`w-5 h-5 ${m.color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{m.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1.5 bg-soft rounded-full overflow-hidden max-w-[200px]">
                          <div
                            className="h-full gradient-accent rounded-full transition-all duration-700"
                            style={{ width: `${m.match}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-accent-500">{m.match}% match</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-faint" />
                  </Card>
                );
              })}
            </div>
            <div className="text-center mt-6">
              <LinkButton to="/opportunities" variant="secondary" size="md">
                See all opportunities <ArrowRight className="w-4 h-4" />
              </LinkButton>
            </div>
          </div>
        </div>
      </section>

      {/* Project evolution timeline preview */}
      <section className="py-20 bg-elev/50 border-y border-base">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <Badge color="accent" className="mb-3">Evolution Timeline</Badge>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-3">
              One project. Multiple batches. Continuous evolution.
            </h2>
            <p className="text-soft max-w-2xl mx-auto">
              See how MedVision evolved from a 48-hour hackathon project to a deployed healthcare tool
              across three student batches.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {[
              { year: '2024', title: 'Created', desc: 'Built at HealthHack India by Team Alpha', icon: Hammer, color: 'from-rose-500 to-pink-600' },
              { year: '2025', title: 'Revived', desc: 'Adopted by Team Beta. Added AI diagnosis module.', icon: RefreshCw, color: 'from-emerald-500 to-teal-600' },
              { year: '2026', title: 'Evolved', desc: 'Mobile app, cloud infra, real-time analytics.', icon: TrendingUp, color: 'from-accent-500 to-accent-600' },
              { year: '2027', title: 'Competes Again', desc: 'Submitted to Medical Innovation Challenge.', icon: Trophy, color: 'from-amber-500 to-orange-600' },
            ].map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className="relative animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                  <Card className="p-5 h-full">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-3`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-xs text-faint mb-1">{step.year}</div>
                    <h3 className="font-semibold text-sm mb-1">{step.title}</h3>
                    <p className="text-xs text-soft leading-relaxed">{step.desc}</p>
                  </Card>
                  {i < 3 && (
                    <div className="hidden md:flex absolute top-1/2 -right-2 -translate-y-1/2 text-faint z-10">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <Badge color="accent" className="mb-3">Student Stories</Badge>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-3">Built by students, for students</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {testimonials.map((t) => (
              <Card key={t.name} className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar initials={t.avatar} size="md" />
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-soft">{t.role}</p>
                  </div>
                </div>
                <p className="text-sm text-soft leading-relaxed italic">"{t.quote}"</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="relative rounded-3xl overflow-hidden border border-base bg-elev p-10 sm:p-16 text-center">
            <div className="absolute inset-0 grid-bg opacity-30" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[300px] bg-accent-500/10 rounded-full blur-[100px]" />
            <div className="relative">
              <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
                Your next project could start with{' '}
                <span className="gradient-text">someone else's idea.</span>
              </h2>
              <p className="text-soft max-w-xl mx-auto mb-8">
                Explore the innovation repository and discover projects waiting to be revived, improved,
                and taken to new heights.
              </p>
              <LinkButton to="/projects" size="lg">
                Explore the Innovation Repository <ArrowRight className="w-4 h-4" />
              </LinkButton>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({ icon: Icon, value, label }: { icon: React.ComponentType<{ className?: string }>; value: string; label: string }) {
  return (
    <div className="text-center sm:text-left">
      <div className="inline-flex w-10 h-10 rounded-xl bg-accent-500/10 items-center justify-center text-accent-500 mb-3">
        <Icon className="w-5 h-5" />
      </div>
      <div className="font-display text-2xl sm:text-3xl font-bold tracking-tight">{value}</div>
      <div className="text-xs text-soft mt-1">{label}</div>
    </div>
  );
}

function HeroVisual() {
  return (
    <div className="relative">
      {/* Main dashboard mockup */}
      <div className="relative bg-elev border border-base rounded-2xl shadow-float p-5 animate-float">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-error-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-warning-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-success-500/60" />
          </div>
          <div className="text-xs text-faint">innovara.io/workspace</div>
        </div>

        {/* Mini stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { label: 'Active', value: '4', icon: Activity, color: 'text-success-500' },
            { label: 'Revived', value: '3', icon: RefreshCw, color: 'text-accent-500' },
            { label: 'Stars', value: '2.1k', icon: Star, color: 'text-warning-500' },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-soft rounded-lg p-2.5">
                <Icon className={`w-3.5 h-3.5 ${s.color} mb-1`} />
                <div className="text-sm font-bold">{s.value}</div>
                <div className="text-[10px] text-faint">{s.label}</div>
              </div>
            );
          })}
        </div>

        {/* Project cards */}
        <div className="space-y-2">
          {[
            { name: 'MedVision', status: 'Revived', color: 'from-rose-500 to-pink-600', progress: 78 },
            { name: 'EcoTrack', status: 'Active', color: 'from-emerald-500 to-teal-600', progress: 45 },
            { name: 'NeuroLearn', status: 'Active', color: 'from-violet-500 to-purple-600', progress: 62 },
          ].map((p) => (
            <div key={p.name} className="flex items-center gap-3 p-2.5 rounded-lg bg-soft">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${p.color} shrink-0`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium">{p.name}</span>
                  <span className="text-[10px] text-faint">{p.status}</span>
                </div>
                <div className="h-1 bg-base rounded-full mt-1.5 overflow-hidden">
                  <div className="h-full gradient-accent rounded-full" style={{ width: `${p.progress}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating cards */}
      <div className="absolute -top-4 -right-4 bg-elev border border-base rounded-xl shadow-float p-3 animate-float" style={{ animationDelay: '1s' }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-success-500/10 flex items-center justify-center">
            <RefreshCw className="w-4 h-4 text-success-500" />
          </div>
          <div>
            <div className="text-xs font-semibold">Project Revived!</div>
            <div className="text-[10px] text-faint">SafeRoute adopted by Team Beta</div>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-4 -left-4 bg-elev border border-base rounded-xl shadow-float p-3 animate-float" style={{ animationDelay: '2s' }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent-500/10 flex items-center justify-center">
            <Trophy className="w-4 h-4 text-accent-500" />
          </div>
          <div>
            <div className="text-xs font-semibold">92% Match</div>
            <div className="text-[10px] text-faint">Medical Innovation Challenge</div>
          </div>
        </div>
      </div>
    </div>
  );
}
