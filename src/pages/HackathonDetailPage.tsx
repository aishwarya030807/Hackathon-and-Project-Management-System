import { useState } from 'react';
import {
  ArrowLeft, Bookmark, MapPin, Users, Clock, Trophy, Calendar,
  CheckCircle2, ChevronDown, Lightbulb, Target, Eye,
} from 'lucide-react';
import { useParams, useNavigate, Link } from '@/lib/router';
import { Button, LinkButton } from '@/components/ui/Button';
import { Badge, ModeBadge, DifficultyBadge } from '@/components/ui/Badge';
import { Card, Avatar, EmptyState } from '@/components/ui';
import { ProjectCard } from '@/components/ProjectCard';
import { useToast } from '@/lib/toast';
import { hackathons, projects } from '@/data/mock';

function daysRemaining(deadline: string): number {
  return Math.max(0, Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
}

function formatPrize(amount: number): string {
  if (amount >= 100000) return `\u20b9${(amount / 100000).toFixed(1)}L`;
  return `\u20b9${amount.toLocaleString('en-IN')}`;
}

const tabs = ['About', 'Problem Statements', 'Timeline', 'Rules', 'Eligibility', 'Prizes', 'Judging Criteria', 'FAQs'];

export function HackathonDetailPage() {
  const { id } = useParams('/hackathons/:id');
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bookmarked, setBookmarked] = useState(false);
  const [activeTab, setActiveTab] = useState('About');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const hackathon = hackathons.find((h) => h.id === id);

  if (!hackathon) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <EmptyState
          icon={<Target className="w-8 h-8" />}
          title="Hackathon not found"
          description="This hackathon may have been removed."
          action={<LinkButton to="/hackathons" variant="secondary" size="md">Back to hackathons</LinkButton>}
        />
      </div>
    );
  }

  const days = daysRemaining(hackathon.deadline);
  const relatedProjects = projects
    .filter((p) => p.domain.some((d) => hackathon.domains.includes(d)))
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Back */}
      <button
        onClick={() => navigate('/hackathons')}
        className="flex items-center gap-1.5 text-sm text-soft hover:text-base transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to hackathons
      </button>

      {/* Hero banner */}
      <div className={`relative h-48 sm:h-64 rounded-2xl bg-gradient-to-br ${hackathon.banner} overflow-hidden mb-6`}>
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 bg-gradient-to-t from-black/40 to-transparent">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {hackathon.featured && <Badge color="accent">Featured</Badge>}
            <ModeBadge mode={hackathon.mode} />
            <DifficultyBadge difficulty={hackathon.difficulty} />
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">{hackathon.name}</h1>
          <p className="text-sm text-white/80 mt-1">by {hackathon.organizer}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick info */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: Trophy, label: 'Prize Pool', value: formatPrize(hackathon.prizePool) },
              { icon: Users, label: 'Team Size', value: hackathon.teamSize },
              { icon: MapPin, label: 'Location', value: hackathon.location },
              { icon: Eye, label: 'Applicants', value: hackathon.participants.toLocaleString() },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.label} className="p-3">
                  <Icon className="w-4 h-4 text-accent-500 mb-1.5" />
                  <div className="text-xs text-faint">{item.label}</div>
                  <div className="text-sm font-semibold truncate">{item.value}</div>
                </Card>
              );
            })}
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-1.5 border-b border-base pb-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                  activeTab === tab
                    ? 'text-accent-500 bg-accent-500/10'
                    : 'text-soft hover:text-base hover:bg-soft'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <Card className="p-6">
            {activeTab === 'About' && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">About this hackathon</h2>
                <p className="text-sm text-soft leading-relaxed">{hackathon.description}</p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {hackathon.domains.map((d) => (
                    <Badge key={d} color="accent">{d}</Badge>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'Problem Statements' && (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold mb-4">Problem Statements</h2>
                {hackathon.problemStatements.map((ps, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-soft border border-base">
                    <div className="w-7 h-7 rounded-lg bg-accent-500/10 flex items-center justify-center text-accent-500 text-xs font-bold shrink-0">
                      {i + 1}
                    </div>
                    <p className="text-sm text-soft">{ps}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'Timeline' && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold mb-4">Timeline</h2>
                <div className="relative pl-6">
                  <div className="absolute left-2 top-1 bottom-1 w-px bg-base" />
                  {hackathon.timeline.map((t, i) => (
                    <div key={i} className="relative mb-6 last:mb-0">
                      <div className="absolute -left-4 top-1 w-3 h-3 rounded-full bg-accent-500 ring-4 ring-accent-500/20" />
                      <div className="text-sm font-semibold">{t.label}</div>
                      <div className="text-xs text-soft mt-0.5">{t.date}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'Rules' && (
              <div className="space-y-2">
                <h2 className="text-lg font-semibold mb-4">Rules</h2>
                {hackathon.rules.map((rule, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-sm text-soft">
                    <CheckCircle2 className="w-4 h-4 text-success-500 shrink-0 mt-0.5" />
                    {rule}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'Eligibility' && (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold mb-4">Eligibility</h2>
                <p className="text-sm text-soft">{hackathon.eligibility}</p>
              </div>
            )}

            {activeTab === 'Prizes' && (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold mb-4">Prizes</h2>
                {hackathon.prizes.map((prize, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-soft border border-base">
                    <div>
                      <div className="text-sm font-semibold">{prize.place}</div>
                      {prize.perks && <div className="text-xs text-soft mt-0.5">{prize.perks}</div>}
                    </div>
                    <div className="text-lg font-bold gradient-text">{formatPrize(prize.amount)}</div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'Judging Criteria' && (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold mb-4">Judging Criteria</h2>
                {hackathon.judgingCriteria.map((jc, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-soft">{jc.criterion}</span>
                      <span className="text-xs font-medium text-accent-500">{jc.weight}%</span>
                    </div>
                    <div className="h-1.5 bg-soft rounded-full overflow-hidden">
                      <div className="h-full gradient-accent rounded-full" style={{ width: `${jc.weight}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'FAQs' && (
              <div className="space-y-2">
                <h2 className="text-lg font-semibold mb-4">Frequently Asked Questions</h2>
                {hackathon.faqs.map((faq, i) => (
                  <div key={i} className="border-b border-base last:border-0">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between py-3 text-left"
                    >
                      <span className="text-sm font-medium">{faq.q}</span>
                      <ChevronDown className={`w-4 h-4 text-faint transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                    </button>
                    {openFaq === i && (
                      <p className="text-sm text-soft pb-3 animate-fade-in">{faq.a}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Projects you could build */}
          {relatedProjects.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-warning-500" />
                <h2 className="text-lg font-semibold">Projects You Could Build</h2>
              </div>
              <p className="text-sm text-soft mb-4">
                Existing projects from the Innovara repository relevant to this hackathon's domains.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {relatedProjects.map((p) => (
                  <ProjectCard key={p.id} project={p} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Countdown */}
          <Card className="p-5 sticky top-20">
            <div className="text-center mb-4">
              <div className="text-xs text-soft mb-1">Application Deadline</div>
              <div className="font-display text-3xl font-bold gradient-text">{days}</div>
              <div className="text-xs text-soft">days remaining</div>
            </div>

            <div className="h-px bg-base my-4" />

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-soft flex items-center gap-2"><Trophy className="w-4 h-4 text-faint" /> Prize Pool</span>
                <span className="font-semibold">{formatPrize(hackathon.prizePool)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-soft flex items-center gap-2"><Users className="w-4 h-4 text-faint" /> Team Size</span>
                <span className="font-semibold">{hackathon.teamSize}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-soft flex items-center gap-2"><MapPin className="w-4 h-4 text-faint" /> Mode</span>
                <span className="font-semibold">{hackathon.mode}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-soft flex items-center gap-2"><Calendar className="w-4 h-4 text-faint" /> Deadline</span>
                <span className="font-semibold">{hackathon.deadline}</span>
              </div>
            </div>

            <div className="space-y-2 mt-5">
              <Button
                variant="primary"
                className="w-full"
                onClick={() => toast(`Applied to ${hackathon.name}!`, 'success')}
              >
                Apply Now
              </Button>
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => {
                  setBookmarked((b) => !b);
                  toast(bookmarked ? 'Removed from saved' : 'Hackathon bookmarked');
                }}
              >
                <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
                {bookmarked ? 'Saved' : 'Bookmark'}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
