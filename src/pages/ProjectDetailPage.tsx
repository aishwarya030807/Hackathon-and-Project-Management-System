import { useState } from 'react';
import {
  ArrowLeft, Bookmark, Star, GitFork, Eye, Users, Calendar,
  GitBranch as GithubIcon, FileText, Presentation, ChevronDown, Lightbulb,
  CheckCircle2, GitBranch, Code2, Layers,
} from 'lucide-react';
import { useParams, useNavigate } from '@/lib/router';
import { Button, LinkButton } from '@/components/ui/Button';
import { Badge, StatusBadge, DifficultyBadge, MaturityBadge } from '@/components/ui/Badge';
import { Card, Avatar, EmptyState } from '@/components/ui';
import { EvolutionTimeline } from '@/components/EvolutionTimeline';
import { AdoptModal } from '@/components/AdoptModal';
import { useToast } from '@/lib/toast';
import { projects, timelineEntries } from '@/data/mock';

const tabs = [
  'Overview', 'Problem', 'Solution', 'Features', 'Tech Stack',
  'Demo', 'Documentation', 'Repository', 'Presentations', 'Team',
  'Contributors', 'Challenges', 'Future Improvements', 'Evolution',
];

export function ProjectDetailPage() {
  const { id } = useParams('/projects/:id');
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bookmarked, setBookmarked] = useState(false);
  const [activeTab, setActiveTab] = useState('Overview');
  const [adoptOpen, setAdoptOpen] = useState(false);

  const project = projects.find((p) => p.id === id);

  if (!project) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <EmptyState
          icon={<GitBranch className="w-8 h-8" />}
          title="Project not found"
          description="This project may have been removed."
          action={<LinkButton to="/projects" variant="secondary" size="md">Back to projects</LinkButton>}
        />
      </div>
    );
  }

  const timeline = timelineEntries[project.id] ?? [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <button
        onClick={() => navigate('/projects')}
        className="flex items-center gap-1.5 text-sm text-soft hover:text-base transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to projects
      </button>

      {/* Hero */}
      <div className={`relative h-48 sm:h-56 rounded-2xl bg-gradient-to-br ${project.color} overflow-hidden mb-6`}>
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 bg-gradient-to-t from-black/50 to-transparent">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <StatusBadge status={project.status} />
            <MaturityBadge maturity={project.maturity} />
            <DifficultyBadge difficulty={project.difficulty} />
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">{project.name}</h1>
          <p className="text-sm text-white/80 mt-1">{project.tagline}</p>
        </div>
      </div>

      {/* Meta row */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-4 text-sm text-soft">
          <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-faint" /> {project.year}</span>
          <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-faint" /> {project.originalTeam.name}</span>
          <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-faint" /> {project.stars}</span>
          <span className="flex items-center gap-1.5"><GitFork className="w-4 h-4 text-faint" /> {project.forks}</span>
          <span className="flex items-center gap-1.5"><Eye className="w-4 h-4 text-faint" /> {project.views.toLocaleString()}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="sm" onClick={() => toast('Opening GitHub...', 'info')}>
            <GithubIcon className="w-4 h-4" /> View GitHub
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setBookmarked((b) => !b);
              toast(bookmarked ? 'Removed from saved' : 'Project bookmarked');
            }}
          >
            <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} /> Save
          </Button>
          <Button variant="secondary" size="sm" onClick={() => toast('Collaboration request sent!', 'success')}>
            Request Collaboration
          </Button>
          <Button variant="primary" size="sm" onClick={() => setAdoptOpen(true)}>
            <GitBranch className="w-4 h-4" /> Adopt Project
          </Button>
        </div>
      </div>

      {/* Domain tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        {project.domain.map((d) => (
          <Badge key={d} color="accent">{d}</Badge>
        ))}
        <span className="text-xs text-faint flex items-center gap-1 ml-2">
          Originally built at {project.hackathonName}
        </span>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <div className="flex flex-wrap gap-1.5 border-b border-base pb-2 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
                  activeTab === tab
                    ? 'text-accent-500 bg-accent-500/10'
                    : 'text-soft hover:text-base hover:bg-soft'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <Card className="p-6">
            {activeTab === 'Overview' && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Overview</h2>
                <p className="text-sm text-soft leading-relaxed">{project.description}</p>
                <div className="grid sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-soft border border-base">
                    <div className="text-xs text-faint mb-1">Original Team</div>
                    <div className="text-sm font-semibold">{project.originalTeam.name}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-soft border border-base">
                    <div className="text-xs text-faint mb-1">Current Maintainers</div>
                    <div className="text-sm font-semibold">
                      {project.currentMaintainers.length > 0
                        ? project.currentMaintainers.map((m) => m.name).join(', ')
                        : 'None — this project needs a maintainer!'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Problem' && (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold">The Problem</h2>
                <p className="text-sm text-soft leading-relaxed">{project.problem}</p>
              </div>
            )}

            {activeTab === 'Solution' && (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold">The Solution</h2>
                <p className="text-sm text-soft leading-relaxed">{project.solution}</p>
              </div>
            )}

            {activeTab === 'Features' && (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold mb-4">Key Features</h2>
                <div className="grid sm:grid-cols-2 gap-2">
                  {project.features.map((f, i) => (
                    <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-soft border border-base">
                      <CheckCircle2 className="w-4 h-4 text-success-500 shrink-0 mt-0.5" />
                      <span className="text-sm text-soft">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'Tech Stack' && (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold mb-4">Technology Stack</h2>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((t) => (
                    <span key={t} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-soft border border-base text-sm">
                      <Code2 className="w-3.5 h-3.5 text-accent-500" /> {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'Demo' && (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold mb-4">Demo</h2>
                <div className={`relative aspect-video rounded-xl bg-gradient-to-br ${project.color} flex items-center justify-center overflow-hidden`}>
                  <div className="absolute inset-0 grid-bg opacity-20" />
                  <div className="relative text-center">
                    <Layers className="w-12 h-12 text-white/80 mx-auto mb-2" />
                    <p className="text-white/80 text-sm">Interactive demo preview</p>
                    <Button variant="secondary" size="sm" className="mt-3" onClick={() => toast('Launching demo...', 'info')}>
                      Launch Demo
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Documentation' && (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold mb-4">Documentation</h2>
                {project.documentation.map((doc, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-soft border border-base hover:border-strong transition-all cursor-pointer">
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-accent-500" />
                      <div>
                        <div className="text-sm font-medium">{doc.title}</div>
                        <div className="text-xs text-faint">{doc.type} &middot; {doc.date}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'Repository' && (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold mb-4">GitHub Repository</h2>
                <div className="p-4 rounded-xl bg-soft border border-base">
                  <div className="flex items-center gap-3 mb-3">
                    <GithubIcon className="w-5 h-5 text-soft" />
                    <code className="text-sm">github.com/innovara/{project.name.toLowerCase()}</code>
                  </div>
                  <div className="flex flex-wrap gap-3 text-sm text-soft">
                    <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5" /> {project.stars} stars</span>
                    <span className="flex items-center gap-1"><GitFork className="w-3.5 h-3.5" /> {project.forks} forks</span>
                    <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {project.views.toLocaleString()} views</span>
                  </div>
                  <Button variant="secondary" size="sm" className="mt-4" onClick={() => toast('Opening GitHub...', 'info')}>
                    <GithubIcon className="w-4 h-4" /> Open Repository
                  </Button>
                </div>
              </div>
            )}

            {activeTab === 'Presentations' && (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold mb-4">Presentations</h2>
                {project.presentations.map((pres, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-soft border border-base hover:border-strong transition-all cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Presentation className="w-4 h-4 text-accent-500" />
                      <div>
                        <div className="text-sm font-medium">{pres.title}</div>
                        <div className="text-xs text-faint">{pres.event} &middot; {pres.date}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'Team' && (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold mb-4">Original Team</h2>
                <div className="space-y-2">
                  {project.originalTeam.members.map((m) => (
                    <div key={m.name} className="flex items-center gap-3 p-3 rounded-xl bg-soft border border-base">
                      <Avatar initials={m.avatar} size="md" />
                      <div>
                        <div className="text-sm font-semibold">{m.name}</div>
                        <div className="text-xs text-soft">{m.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'Contributors' && (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold mb-4">Contributors</h2>
                <div className="space-y-2">
                  {project.contributors.map((c) => (
                    <div key={c.name} className="flex items-center gap-3 p-3 rounded-xl bg-soft border border-base">
                      <Avatar initials={c.avatar} size="md" />
                      <div>
                        <div className="text-sm font-semibold">{c.name}</div>
                        <div className="text-xs text-soft">{c.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'Challenges' && (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold mb-4">Challenges Faced</h2>
                {project.challenges.map((c, i) => (
                  <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-soft border border-base">
                    <Lightbulb className="w-4 h-4 text-warning-500 shrink-0 mt-0.5" />
                    <span className="text-sm text-soft">{c}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'Future Improvements' && (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold mb-4">Future Improvements</h2>
                {project.futureImprovements.map((f, i) => (
                  <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-soft border border-base">
                    <TrendingUpIcon /> 
                    <span className="text-sm text-soft">{f}</span>
                  </div>
                ))}
                {project.suggestedImprovements && project.suggestedImprovements.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-base">
                    <p className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-warning-500" /> Suggested by original team for revival:
                    </p>
                    {project.suggestedImprovements.map((s, i) => (
                      <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-accent-500/5 border border-accent-500/20 mb-2">
                        <CheckCircle2 className="w-4 h-4 text-accent-500 shrink-0 mt-0.5" />
                        <span className="text-sm text-soft">{s}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'Evolution' && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold mb-4">Project Evolution Timeline</h2>
                <EvolutionTimeline entries={timeline} />
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card className="p-5 sticky top-20">
            <h3 className="font-semibold text-sm mb-3">Project Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-soft">Status</span>
                <StatusBadge status={project.status} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-soft">Maturity</span>
                <MaturityBadge maturity={project.maturity} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-soft">Year</span>
                <span className="font-medium">{project.year}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-soft">Hackathon</span>
                <span className="font-medium text-xs">{project.hackathonName}</span>
              </div>
            </div>

            <div className="h-px bg-base my-4" />

            <div className="space-y-2">
              <Button variant="primary" className="w-full" onClick={() => setAdoptOpen(true)}>
                <GitBranch className="w-4 h-4" /> Adopt Project
              </Button>
              <Button variant="secondary" className="w-full" onClick={() => toast('Collaboration request sent!', 'success')}>
                Request Collaboration
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <AdoptModal open={adoptOpen} onClose={() => setAdoptOpen(false)} project={project} />
    </div>
  );
}

function TrendingUpIcon() {
  return (
    <svg className="w-4 h-4 text-accent-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 17l6-6 4 4 8-8M14 7h7v7" />
    </svg>
  );
}
