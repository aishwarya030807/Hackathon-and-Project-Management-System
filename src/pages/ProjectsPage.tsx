import { useMemo, useState } from 'react';
import { FolderGit2, Sparkles } from 'lucide-react';
import { SearchBar } from '@/components/ui/SearchBar';
import { FilterBar, type FilterGroup } from '@/components/FilterBar';
import { ProjectCard } from '@/components/ProjectCard';
import { SectionHeader, EmptyState } from '@/components/ui';
import { projects } from '@/data/mock';
import type { Domain, ProjectStatus, Maturity } from '@/types';

const domainOptions: Domain[] = [
  'AI / ML', 'Web Development', 'Healthcare', 'FinTech', 'Climate Tech',
  'Cybersecurity', 'Education', 'IoT', 'Social Impact', 'Mobility',
];

const statusOptions: ProjectStatus[] = ['Active', 'Archived', 'Looking for Contributors', 'Abandoned', 'Revived'];
const maturityOptions: Maturity[] = ['Concept', 'Prototype', 'MVP', 'Beta', 'Production'];

const filterGroups: FilterGroup[] = [
  {
    label: 'Domain',
    key: 'domain',
    options: domainOptions.map((d) => ({ label: d, value: d })),
  },
  {
    label: 'Year',
    key: 'year',
    options: [
      { label: '2023', value: '2023' },
      { label: '2024', value: '2024' },
      { label: '2025', value: '2025' },
    ],
  },
  {
    label: 'Status',
    key: 'status',
    options: statusOptions.map((s) => ({ label: s, value: s })),
  },
  {
    label: 'Difficulty',
    key: 'difficulty',
    options: [
      { label: 'Beginner', value: 'Beginner' },
      { label: 'Intermediate', value: 'Intermediate' },
      { label: 'Advanced', value: 'Advanced' },
    ],
  },
  {
    label: 'Maturity',
    key: 'maturity',
    options: maturityOptions.map((m) => ({ label: m, value: m })),
  },
];

const sortOptions = [
  { label: 'Most Stars', value: 'stars' },
  { label: 'Most Views', value: 'views' },
  { label: 'Newest', value: 'newest' },
  { label: 'Oldest', value: 'oldest' },
];

export function ProjectsPage() {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sort, setSort] = useState('stars');

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value === 'all' ? '' : value }));
  };

  const filtered = useMemo(() => {
    let result = projects.filter((p) => {
      if (search) {
        const q = search.toLowerCase();
        if (!p.name.toLowerCase().includes(q) && !p.tagline.toLowerCase().includes(q) && !p.description.toLowerCase().includes(q)) return false;
      }
      if (filters.domain && !p.domain.includes(filters.domain as Domain)) return false;
      if (filters.year && p.year !== Number(filters.year)) return false;
      if (filters.status && p.status !== filters.status) return false;
      if (filters.difficulty && p.difficulty !== filters.difficulty) return false;
      if (filters.maturity && p.maturity !== filters.maturity) return false;
      return true;
    });

    switch (sort) {
      case 'stars': result = [...result].sort((a, b) => b.stars - a.stars); break;
      case 'views': result = [...result].sort((a, b) => b.views - a.views); break;
      case 'newest': result = [...result].sort((a, b) => b.year - a.year); break;
      case 'oldest': result = [...result].sort((a, b) => a.year - b.year); break;
    }
    return result;
  }, [search, filters, sort]);

  const featured = filtered.filter((p) => p.featured);
  const regular = filtered.filter((p) => !p.featured);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-500/10 border border-accent-500/20 text-xs font-medium text-accent-500 mb-4">
          <FolderGit2 className="w-3.5 h-3.5" /> Innovation Repository
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">Innovation Repository</h1>
        <p className="text-soft max-w-2xl">
          Explore what students built before you. Continue it. Improve it. Make it yours.
        </p>
      </div>

      {/* Search + filters */}
      <div className="space-y-4 mb-6">
        <SearchBar value={search} onChange={setSearch} placeholder="Search projects, technologies, domains..." />
        <FilterBar
          groups={filterGroups}
          values={filters}
          onChange={handleFilterChange}
          sortOptions={sortOptions}
          sortValue={sort}
          onSortChange={setSort}
        />
      </div>

      <SectionHeader
        title="All Projects"
        subtitle={`${filtered.length} project${filtered.length !== 1 ? 's' : ''} found`}
        className="mb-5"
      />

      {filtered.length === 0 ? (
        <EmptyState
          icon={<FolderGit2 className="w-8 h-8" />}
          title="No projects match your filters"
          description="Try adjusting your search or clearing some filters to see more results."
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featured.map((p) => (
            <ProjectCard key={p.id} project={p} featured />
          ))}
          {regular.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}
    </div>
  );
}
