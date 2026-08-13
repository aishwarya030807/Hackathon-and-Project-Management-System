import { useState } from 'react';
import { Target, CheckCircle2, ArrowRight, Trophy, Clock, Users, Sparkles, Building2, DollarSign, Handshake, Code2 } from 'lucide-react';
import { Card, Badge, Avatar } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/lib/toast';
import { opportunities } from '@/data/mock';
import { Link } from '@/lib/router';

const categories = [
  { id: 'ALL', label: 'All Opportunities', icon: Sparkles },
  { id: 'REVIVE PROJECT', label: 'Revive Project', icon: Users },
  { id: 'CONTRIBUTE', label: 'Contribute', icon: Code2 },
  { id: 'MENTORSHIP', label: 'Mentorship', icon: Users },
  { id: 'FUNDING', label: 'Funding', icon: DollarSign },
  { id: 'GRANT', label: 'Grants', icon: Building2 },
  { id: 'STARTUP', label: 'Startup Co-Founder', icon: Handshake },
  { id: 'COLLABORATION', label: 'Collaboration', icon: Handshake },
];

const mockPostings = [
  {
    id: 'opp-1',
    title: 'Frontend Lead Needed for AI Diagnostic Revival',
    projectName: 'MedVision AI',
    projectId: 'p1',
    type: 'REVIVE PROJECT',
    description: 'We are reviving MedVision AI for the upcoming HealthHack India 2025. Looking for a skilled React / Tailwind engineer to revamp the clinic dashboard.',
    requiredSkills: ['React', 'TypeScript', 'Tailwind CSS', 'WebSockets'],
    slots: 2,
    deadline: 'May 15, 2025',
    creator: 'Sneha Reddy',
    creatorAvatar: 'SR',
    status: 'OPEN',
  },
  {
    id: 'opp-2',
    title: 'ML Specialist for Edge Traffic Optimization',
    projectName: 'SafeRoute',
    projectId: 'p2',
    type: 'CONTRIBUTE',
    description: 'SafeRoute is scaling its traffic accident risk forecasting algorithm. Need an ML contributor experienced in PyTorch and spatial data.',
    requiredSkills: ['PyTorch', 'Python', 'GIS Data', 'FastAPI'],
    slots: 1,
    deadline: 'June 01, 2025',
    creator: 'Rohan Verma',
    creatorAvatar: 'RV',
    status: 'OPEN',
  },
  {
    id: 'opp-3',
    title: 'EdTech Industry Mentor for Gamified Learning',
    projectName: 'NeuroLearn',
    projectId: 'p3',
    type: 'MENTORSHIP',
    description: 'Seeking an experienced product advisor from the EdTech domain to guide pricing model and adaptive curriculum design.',
    requiredSkills: ['Product Strategy', 'EdTech', 'User Retention'],
    slots: 1,
    deadline: 'May 30, 2025',
    creator: 'Priya Patel',
    creatorAvatar: 'PP',
    status: 'OPEN',
  },
  {
    id: 'opp-4',
    title: 'Seed Grant & Acceleration Support',
    projectName: 'EcoGrid Tech',
    projectId: 'p4',
    type: 'GRANT',
    description: 'Climate Tech Grant offering up to ₹5,000,000 for student teams working on smart microgrid load balancing.',
    requiredSkills: ['IoT Hardware', 'Power Electronics', 'CleanTech'],
    slots: 5,
    deadline: 'July 10, 2025',
    creator: 'Green Tech Foundation',
    creatorAvatar: 'GT',
    status: 'OPEN',
  },
  {
    id: 'opp-5',
    title: 'Technical Co-Founder Wanted for FinTech App',
    projectName: 'VaultFlow',
    projectId: 'p5',
    type: 'STARTUP',
    description: 'Building a micro-savings protocol for college students in India. Seeking a full-stack co-founder to take lead on backend architecture.',
    requiredSkills: ['Node.js', 'PostgreSQL', 'FinTech APIs', 'Security'],
    slots: 1,
    deadline: 'June 20, 2025',
    creator: 'Ananya Sharma',
    creatorAvatar: 'AS',
    status: 'OPEN',
  },
];

export function OpportunitiesPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'hub' | 'matcher'>('hub');
  const [selectedCat, setSelectedCat] = useState('ALL');
  const opp = opportunities[0];

  const filteredPostings = mockPostings.filter(
    (item) => selectedCat === 'ALL' || item.type === selectedCat
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-500/10 border border-accent-500/20 text-xs font-medium text-accent-500 mb-4">
          <Target className="w-3.5 h-3.5" /> Opportunity Hub
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">
          Discover Opportunities & Match Competitions
        </h1>
        <p className="text-soft max-w-2xl">
          Apply to project revival requests, open contributor roles, mentorship positions, seed grants, and AI-powered competition recommendations.
        </p>
      </div>

      {/* Main Mode Toggle */}
      <div className="flex gap-2 p-1.5 rounded-2xl bg-elev border border-base max-w-md mb-8">
        <button
          onClick={() => setActiveTab('hub')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'hub'
              ? 'gradient-accent text-white shadow-soft'
              : 'text-soft hover:text-base'
          }`}
        >
          Opportunity Hub
        </button>
        <button
          onClick={() => setActiveTab('matcher')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'matcher'
              ? 'gradient-accent text-white shadow-soft'
              : 'text-soft hover:text-base'
          }`}
        >
          Competition Matcher
        </button>
      </div>

      {activeTab === 'hub' ? (
        <>
          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCat(cat.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border ${
                    selectedCat === cat.id
                      ? 'bg-accent-500 text-white border-accent-500 shadow-soft'
                      : 'bg-elev border-base text-soft hover:text-base hover:border-strong'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* List of Opportunities */}
          <div className="grid md:grid-cols-2 gap-4 mb-12">
            {filteredPostings.map((item) => (
              <Card key={item.id} className="p-6 flex flex-col justify-between hover:border-strong transition-all">
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <Badge color="accent">{item.type}</Badge>
                    <span className="text-xs text-faint flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {item.deadline}
                    </span>
                  </div>

                  <h3 className="font-semibold text-base mb-1">{item.title}</h3>
                  <p className="text-xs text-accent-500 font-medium mb-3">Project: {item.projectName}</p>
                  <p className="text-sm text-soft mb-4">{item.description}</p>

                  <div className="mb-4">
                    <span className="text-xs text-faint block mb-2 font-medium">Required Skills:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {item.requiredSkills.map((sk) => (
                        <span key={sk} className="text-xs px-2.5 py-1 rounded-lg bg-soft border border-base text-soft">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-base flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Avatar initials={item.creatorAvatar} size="xs" />
                    <span className="text-xs text-soft">{item.creator} &middot; {item.slots} slot(s)</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link to={`/innovara/projects/${item.projectId}`}>
                      <Button variant="secondary" size="sm">
                        View Project
                      </Button>
                    </Link>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => toast(`Application submitted for ${item.title}`, 'success')}
                    >
                      Apply Now
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <>
          {/* Sample project */}
          <Card className="p-6 mb-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 shrink-0" />
                <div>
                  <h2 className="font-semibold text-lg">{opp.projectName}</h2>
                  <p className="text-sm text-soft">{opp.projectDomain} &middot; Maturity: {opp.projectMaturity}</p>
                </div>
              </div>
              <Badge color="info">{opp.projectMaturity}</Badge>
            </div>
          </Card>

          {/* Recommendations */}
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-1">Recommended Competitions</h2>
            <p className="text-sm text-soft">Sorted by match score</p>
          </div>

          <div className="space-y-4">
            {opp.matches.map((match) => (
              <Card key={match.id} className="p-6 hover:border-strong transition-all animate-fade-up">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent-500/10 flex items-center justify-center shrink-0">
                      <Trophy className="w-6 h-6 text-accent-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{match.name}</h3>
                      <p className="text-xs text-soft">{match.organizer}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-2xl font-bold gradient-text">{match.matchPercent}%</div>
                    <div className="text-xs text-faint">match</div>
                  </div>
                </div>

                {/* Match progress bar */}
                <div className="mb-4">
                  <div className="h-2 bg-soft rounded-full overflow-hidden">
                    <div
                      className="h-full gradient-accent rounded-full transition-all duration-700"
                      style={{ width: `${match.matchPercent}%` }}
                    />
                  </div>
                </div>

                {/* Reasons */}
                <div className="grid sm:grid-cols-2 gap-2 mb-4">
                  {match.reasons.map((reason, j) => (
                    <div key={j} className="flex items-start gap-2 text-sm text-soft">
                      <CheckCircle2 className="w-4 h-4 text-success-500 shrink-0 mt-0.5" />
                      {reason}
                    </div>
                  ))}
                </div>

                {/* Meta */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-base">
                  <div className="flex flex-wrap gap-4 text-xs text-soft">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-faint" /> Deadline: {match.deadline}</span>
                    <span className="flex items-center gap-1"><Trophy className="w-3.5 h-3.5 text-faint" /> Prize: ₹{(match.prize / 100000).toFixed(1)}L</span>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => toast(`Applied to ${match.name}!`, 'success')}
                  >
                    Apply <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
