import { useState } from 'react';
import { Trophy, Medal, Award, Star, GitFork, RefreshCw, TrendingUp } from 'lucide-react';
import { Card, Avatar, Badge, SectionHeader } from '@/components/ui';
import { students, projects } from '@/data/mock';

const tabs = [
  { key: 'projects', label: 'Top Projects', icon: Star },
  { key: 'revived', label: 'Most Revived', icon: RefreshCw },
  { key: 'contributors', label: 'Top Contributors', icon: GitFork },
  { key: 'innovators', label: 'Top Innovators', icon: TrendingUp },
];

export function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState('projects');

  const sortedStudents = [...students].sort((a, b) => (b.innovationScore ?? 0) - (a.innovationScore ?? 0));

  const topProjects = [...projects].sort((a, b) => b.stars - a.stars).slice(0, 6);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-500/10 border border-accent-500/20 text-xs font-medium text-accent-500 mb-4">
          <Trophy className="w-3.5 h-3.5" /> Community Leaderboard
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">Top Innovators</h1>
        <p className="text-soft max-w-2xl">
          Celebrating the students who build, revive, and contribute to the most impactful projects.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? 'gradient-accent text-white shadow-soft'
                  : 'bg-elev border border-base text-soft hover:text-base hover:border-strong'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {(activeTab === 'innovators' || activeTab === 'contributors' || activeTab === 'revived') && (
        <div className="space-y-3">
          {sortedStudents.map((student, i) => {
            const rank = i + 1;
            return (
              <Card
                key={student.id}
                className={`p-5 flex items-center gap-4 transition-all hover:border-strong ${
                  rank <= 3 ? 'border-accent-500/30 bg-accent-500/5' : ''
                }`}
              >
                {/* Rank */}
                <div className="shrink-0">
                  {rank === 1 && (
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center">
                      <Medal className="w-6 h-6 text-white" />
                    </div>
                  )}
                  {rank === 2 && (
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-300 to-slate-500 flex items-center justify-center">
                      <Medal className="w-6 h-6 text-white" />
                    </div>
                  )}
                  {rank === 3 && (
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-orange-700 flex items-center justify-center">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                  )}
                  {rank > 3 && (
                    <div className="w-12 h-12 rounded-xl bg-soft flex items-center justify-center text-lg font-bold text-soft">
                      {rank}
                    </div>
                  )}
                </div>

                {/* Avatar + name */}
                <Avatar initials={student.avatar} size="lg" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold">{student.name}</h3>
                  <p className="text-xs text-soft">{student.college}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {student.skills.slice(0, 3).map((s) => (
                      <span key={s} className="text-xs px-2 py-0.5 rounded-md bg-soft text-soft border border-base">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="hidden sm:flex items-center gap-6 text-center">
                  <div>
                    <div className="font-bold text-lg">{student.stats.projects}</div>
                    <div className="text-xs text-faint">Projects</div>
                  </div>
                  <div>
                    <div className="font-bold text-lg">{student.stats.revived}</div>
                    <div className="text-xs text-faint">Revived</div>
                  </div>
                  <div>
                    <div className="font-bold text-lg">{student.stats.contributions}</div>
                    <div className="text-xs text-faint">Contribs</div>
                  </div>
                </div>

                {/* Score */}
                <div className="text-right shrink-0">
                  <div className="font-display text-xl font-bold gradient-text">{student.innovationScore?.toLocaleString()}</div>
                  <div className="text-xs text-faint">innovation score</div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {activeTab === 'projects' && (
        <div className="space-y-3">
          {topProjects.map((project, i) => {
            const rank = i + 1;
            return (
              <Card
                key={project.id}
                className={`p-5 flex items-center gap-4 transition-all hover:border-strong ${
                  rank <= 3 ? 'border-accent-500/30 bg-accent-500/5' : ''
                }`}
              >
                <div className="shrink-0">
                  {rank === 1 && (
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center">
                      <Medal className="w-6 h-6 text-white" />
                    </div>
                  )}
                  {rank === 2 && (
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-300 to-slate-500 flex items-center justify-center">
                      <Medal className="w-6 h-6 text-white" />
                    </div>
                  )}
                  {rank === 3 && (
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-orange-700 flex items-center justify-center">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                  )}
                  {rank > 3 && (
                    <div className="w-12 h-12 rounded-xl bg-soft flex items-center justify-center text-lg font-bold text-soft">
                      {rank}
                    </div>
                  )}
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${project.color} shrink-0`} />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold">{project.name}</h3>
                  <p className="text-xs text-soft">{project.tagline}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {project.domain.map((d) => (
                      <Badge key={d} color="neutral">{d}</Badge>
                    ))}
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-6 text-center">
                  <div>
                    <div className="font-bold text-lg flex items-center gap-1 justify-center">
                      <Star className="w-3.5 h-3.5 text-warning-500 fill-warning-500" /> {project.stars}
                    </div>
                    <div className="text-xs text-faint">Stars</div>
                  </div>
                  <div>
                    <div className="font-bold text-lg flex items-center gap-1 justify-center">
                      <GitFork className="w-3.5 h-3.5" /> {project.forks}
                    </div>
                    <div className="text-xs text-faint">Forks</div>
                  </div>
                  <div>
                    <div className="font-bold text-lg">{project.views.toLocaleString()}</div>
                    <div className="text-xs text-faint">Views</div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
