import { useMemo, useState } from 'react';
import { Target, Sparkles } from 'lucide-react';
import { SearchBar } from '@/components/ui/SearchBar';
import { FilterBar, type FilterGroup } from '@/components/FilterBar';
import { HackathonCard } from '@/components/HackathonCard';
import { SectionHeader, EmptyState } from '@/components/ui';
import { hackathons } from '@/data/mock';
import type { Domain } from '@/types';

const domainOptions: Domain[] = [
  'AI / ML', 'Web Development', 'Healthcare', 'FinTech', 'Climate Tech',
  'Cybersecurity', 'Education', 'IoT', 'Social Impact', 'Mobility',
];

const filterGroups: FilterGroup[] = [
  {
    label: 'Domain',
    key: 'domain',
    options: domainOptions.map((d) => ({ label: d, value: d })),
  },
  {
    label: 'Mode',
    key: 'mode',
    options: [
      { label: 'Online', value: 'Online' },
      { label: 'Offline', value: 'Offline' },
      { label: 'Hybrid', value: 'Hybrid' },
    ],
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
    label: 'Prize Pool',
    key: 'prize',
    options: [
      { label: 'Under \u20b91L', value: '0-100000' },
      { label: '\u20b91L - 3L', value: '100000-300000' },
      { label: '\u20b93L+', value: '300000-9999999' },
    ],
  },
  {
    label: 'Deadline',
    key: 'deadline',
    options: [
      { label: 'Within 7 days', value: '7' },
      { label: 'Within 14 days', value: '14' },
      { label: 'Within 30 days', value: '30' },
    ],
  },
  {
    label: 'Team Size',
    key: 'team',
    options: [
      { label: 'Solo', value: '1' },
      { label: '2-4', value: '2-4' },
      { label: '5+', value: '5' },
    ],
  },
];

const sortOptions = [
  { label: 'Recommended', value: 'recommended' },
  { label: 'Deadline Soon', value: 'deadline' },
  { label: 'Highest Prize', value: 'prize' },
  { label: 'Newest', value: 'newest' },
];

export function HackathonsPage() {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sort, setSort] = useState('recommended');

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value === 'all' ? '' : value }));
  };

  const filtered = useMemo(() => {
    let result = hackathons.filter((h) => {
      if (search) {
        const q = search.toLowerCase();
        if (!h.name.toLowerCase().includes(q) && !h.organizer.toLowerCase().includes(q)) return false;
      }
      if (filters.domain && !h.domains.includes(filters.domain as Domain)) return false;
      if (filters.mode && h.mode !== filters.mode) return false;
      if (filters.difficulty && h.difficulty !== filters.difficulty) return false;
      if (filters.prize) {
        const [min, max] = filters.prize.split('-').map(Number);
        if (h.prizePool < min || h.prizePool > max) return false;
      }
      if (filters.deadline) {
        const days = Math.ceil((new Date(h.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        if (days > Number(filters.deadline)) return false;
      }
      if (filters.team) {
        if (filters.team === '1' && !h.teamSize.includes('1')) return false;
        if (filters.team === '2-4' && !h.teamSize.includes('2')) return false;
        if (filters.team === '5' && !h.teamSize.includes('5') && !h.teamSize.includes('6')) return false;
      }
      return true;
    });

    switch (sort) {
      case 'deadline':
        result = [...result].sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
        break;
      case 'prize':
        result = [...result].sort((a, b) => b.prizePool - a.prizePool);
        break;
      case 'newest':
        result = [...result].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
        break;
    }
    return result;
  }, [search, filters, sort]);

  const recommended = hackathons.filter((h) => h.featured).slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-500/10 border border-accent-500/20 text-xs font-medium text-accent-500 mb-4">
          <Target className="w-3.5 h-3.5" /> Hackathon Discovery
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">Discover Your Next Challenge</h1>
        <p className="text-soft max-w-2xl">
          Find competitions that match your skills, interests, and ambition.
        </p>
      </div>

      {/* Recommended */}
      {recommended.length > 0 && (
        <div className="mb-10">
          <SectionHeader
            title="Recommended for You"
            subtitle="Based on your skills and past project domains."
            className="mb-5"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommended.map((h) => (
              <HackathonCard key={h.id} hackathon={h} />
            ))}
          </div>
        </div>
      )}

      {/* Search + filters */}
      <div className="space-y-4 mb-6">
        <SearchBar value={search} onChange={setSearch} placeholder="Search hackathons or organizers..." />
        <FilterBar
          groups={filterGroups}
          values={filters}
          onChange={handleFilterChange}
          sortOptions={sortOptions}
          sortValue={sort}
          onSortChange={setSort}
        />
      </div>

      {/* Results */}
      <SectionHeader
        title="All Hackathons"
        subtitle={`${filtered.length} hackathon${filtered.length !== 1 ? 's' : ''} found`}
        className="mb-5"
      />

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Target className="w-8 h-8" />}
          title="No hackathons match your filters"
          description="Try adjusting your search or clearing some filters to see more results."
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((h) => (
            <HackathonCard key={h.id} hackathon={h} />
          ))}
        </div>
      )}
    </div>
  );
}
