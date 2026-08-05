import { useState, useEffect, useMemo, useRef } from 'react';
import { Search, Target, FolderGit2, Users, Building2, ArrowRight } from 'lucide-react';
import { Card, Avatar, Badge, EmptyState } from '@/components/ui';
import { Link, useNavigate } from '@/lib/router';
import { hackathons, projects, students } from '@/data/mock';

const categories = [
  { key: 'all', label: 'All', icon: Search },
  { key: 'hackathons', label: 'Hackathons', icon: Target },
  { key: 'projects', label: 'Projects', icon: FolderGit2 },
  { key: 'students', label: 'Students', icon: Users },
  { key: 'organizations', label: 'Organizations', icon: Building2 },
];

export function SearchPage() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Keyboard shortcut to focus search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const results = useMemo(() => {
    if (!query.trim()) return { hackathons: [], projects: [], students: [], organizations: [] };
    const q = query.toLowerCase();
    return {
      hackathons: hackathons.filter((h) => h.name.toLowerCase().includes(q) || h.organizer.toLowerCase().includes(q)),
      projects: projects.filter((p) => p.name.toLowerCase().includes(q) || p.tagline.toLowerCase().includes(q) || p.techStack.some((t) => t.toLowerCase().includes(q))),
      students: students.filter((s) => s.name.toLowerCase().includes(q) || s.college.toLowerCase().includes(q) || s.skills.some((sk) => sk.toLowerCase().includes(q))),
      organizations: [...new Set(hackathons.map((h) => h.organizer))].filter((o) => o.toLowerCase().includes(q)),
    };
  }, [query]);

  const totalCount = results.hackathons.length + results.projects.length + results.students.length + results.organizations.length;

  const showCategory = (key: string) => activeCategory === 'all' || activeCategory === key;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-2">Search</h1>
        <p className="text-soft">Search across hackathons, projects, students, and organizations.</p>
      </div>

      {/* Search input */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-faint pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search... (press / to focus)"
          className="w-full pl-12 pr-4 py-4 text-base bg-elev border border-base rounded-2xl text-base placeholder:text-faint focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 transition-all"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && results.hackathons.length > 0) {
              navigate(`/hackathons/${results.hackathons[0].id}`);
            }
          }}
        />
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const count = cat.key === 'all' ? totalCount : (results as Record<string, unknown[]>)[cat.key]?.length ?? 0;
          return (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeCategory === cat.key
                  ? 'text-accent-500 bg-accent-500/10 border border-accent-500/20'
                  : 'text-soft hover:text-base hover:bg-soft border border-transparent'
              }`}
            >
              <Icon className="w-4 h-4" />
              {cat.label}
              {count > 0 && <span className="text-xs text-faint">{count}</span>}
            </button>
          );
        })}
      </div>

      {/* Results */}
      {!query.trim() ? (
        <EmptyState
          icon={<Search className="w-8 h-8" />}
          title="Start typing to search"
          description="Find hackathons, projects, students, and organizations across Innovara."
        />
      ) : totalCount === 0 ? (
        <EmptyState
          icon={<Search className="w-8 h-8" />}
          title={`No results for "${query}"`}
          description="Try different keywords or check your spelling."
        />
      ) : (
        <div className="space-y-8">
          {/* Hackathons */}
          {showCategory('hackathons') && results.hackathons.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-soft mb-3 flex items-center gap-2">
                <Target className="w-4 h-4" /> Hackathons ({results.hackathons.length})
              </h2>
              <div className="space-y-2">
                {results.hackathons.map((h) => (
                  <Link key={h.id} to={`/hackathons/${h.id}`}>
                    <Card className="p-4 flex items-center gap-4 hover:border-strong transition-all cursor-pointer">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${h.banner} shrink-0`} />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold">{h.name}</div>
                        <div className="text-xs text-soft">{h.organizer} &middot; {h.location}</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-faint" />
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {showCategory('projects') && results.projects.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-soft mb-3 flex items-center gap-2">
                <FolderGit2 className="w-4 h-4" /> Projects ({results.projects.length})
              </h2>
              <div className="space-y-2">
                {results.projects.map((p) => (
                  <Link key={p.id} to={`/projects/${p.id}`}>
                    <Card className="p-4 flex items-center gap-4 hover:border-strong transition-all cursor-pointer">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${p.color} shrink-0`} />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold">{p.name}</div>
                        <div className="text-xs text-soft truncate">{p.tagline}</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-faint" />
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Students */}
          {showCategory('students') && results.students.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-soft mb-3 flex items-center gap-2">
                <Users className="w-4 h-4" /> Students ({results.students.length})
              </h2>
              <div className="space-y-2">
                {results.students.map((s) => (
                  <Link key={s.id} to={`/profile/${s.id}`}>
                    <Card className="p-4 flex items-center gap-4 hover:border-strong transition-all cursor-pointer">
                      <Avatar initials={s.avatar} size="sm" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold">{s.name}</div>
                        <div className="text-xs text-soft">{s.college} &middot; {s.skills.slice(0, 2).join(', ')}</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-faint" />
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Organizations */}
          {showCategory('organizations') && results.organizations.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-soft mb-3 flex items-center gap-2">
                <Building2 className="w-4 h-4" /> Organizations ({results.organizations.length})
              </h2>
              <div className="space-y-2">
                {results.organizations.map((org) => (
                  <Card key={org} className="p-4 flex items-center gap-4 hover:border-strong transition-all cursor-pointer">
                    <div className="w-10 h-10 rounded-lg bg-soft flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5 text-soft" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold">{org}</div>
                      <div className="text-xs text-soft">Organizer</div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
