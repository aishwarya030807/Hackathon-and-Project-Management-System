import { useState } from 'react';
import {
  Plus, Users, FileText, FolderGit2, Activity, Calendar,
  MapPin, Trophy, Eye, ArrowRight, X,
} from 'lucide-react';
import { Card, Avatar, Badge, SectionHeader, EmptyState } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/lib/toast';
import { hackathons, projects } from '@/data/mock';

export function OrganizerPage() {
  const { toast } = useToast();
  const [createOpen, setCreateOpen] = useState(false);

  const stats = [
    { label: 'Participants', value: '1,240', icon: Users, color: 'text-accent-500' },
    { label: 'Applications', value: '342', icon: FileText, color: 'text-accent2-500' },
    { label: 'Projects Submitted', value: '87', icon: FolderGit2, color: 'text-success-500' },
    { label: 'Active Teams', value: '56', icon: Activity, color: 'text-warning-500' },
  ];

  const myHackathons = hackathons.slice(0, 3);
  const submittedProjects = projects.slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-500/10 border border-accent-500/20 text-xs font-medium text-accent-500 mb-3">
            <Activity className="w-3.5 h-3.5" /> Organizer Dashboard
          </div>
          <h1 className="font-display text-3xl font-bold">Organizer Experience</h1>
          <p className="text-sm text-soft mt-1">Manage your hackathons, applications, and participants.</p>
        </div>
        <Button variant="primary" onClick={() => setCreateOpen(true)}>
          <Plus className="w-4 h-4" /> Create Hackathon
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
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

      {/* Manage hackathons */}
      <SectionHeader title="My Hackathons" className="mb-4" />
      <div className="space-y-3 mb-8">
        {myHackathons.map((h) => (
          <Card key={h.id} className="p-4 flex flex-wrap items-center justify-between gap-4 hover:border-strong transition-all">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${h.banner} shrink-0`} />
              <div>
                <h3 className="font-semibold text-sm">{h.name}</h3>
                <div className="flex flex-wrap items-center gap-3 text-xs text-soft mt-1">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {h.startDate}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {h.location}</span>
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {h.participants.toLocaleString()}</span>
                  <span className="flex items-center gap-1"><Trophy className="w-3 h-3" /> \u20b9{(h.prizePool / 100000).toFixed(1)}L</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge color="success">Active</Badge>
              <Button variant="secondary" size="sm" onClick={() => toast('Manage page is a demo', 'info')}>
                Manage
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Applications */}
      <SectionHeader title="Recent Applications" className="mb-4" />
      <Card className="divide-y divide-[var(--border)] mb-8">
        {[
          { name: 'Aarav Sharma', team: 'Team Phoenix', hackathon: 'HealthHack India 2025', status: 'Pending' },
          { name: 'Diya Patel', team: 'Team Nova', hackathon: 'GreenTech Challenge 2025', status: 'Accepted' },
          { name: 'Vivaan Gupta', team: 'Team Codex', hackathon: 'AI for Good', status: 'Pending' },
          { name: 'Anika Reddy', team: 'Team Zenith', hackathon: 'CodeForCampus', status: 'Waitlisted' },
        ].map((app, i) => (
          <div key={i} className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar initials={app.name.split(' ').map((n) => n[0]).join('')} size="sm" />
              <div>
                <div className="text-sm font-semibold">{app.name}</div>
                <div className="text-xs text-soft">{app.team} &middot; {app.hackathon}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge color={app.status === 'Accepted' ? 'success' : app.status === 'Waitlisted' ? 'warning' : 'neutral'}>
                {app.status}
              </Badge>
              <Button variant="ghost" size="sm" onClick={() => toast('Application reviewed', 'success')}>
                Review
              </Button>
            </div>
          </div>
        ))}
      </Card>

      {/* Submitted projects */}
      <SectionHeader title="Submitted Projects" className="mb-4" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {submittedProjects.map((p) => (
          <Card key={p.id} className="p-4 hover:border-strong transition-all">
            <div className={`w-full h-20 rounded-lg bg-gradient-to-br ${p.color} mb-3`} />
            <h3 className="font-semibold text-sm">{p.name}</h3>
            <p className="text-xs text-soft mt-0.5 line-clamp-2">{p.tagline}</p>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-base text-xs text-faint">
              <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {p.views.toLocaleString()}</span>
              <span>{p.year}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Create Hackathon Modal */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create Hackathon" maxWidth="max-w-xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setCreateOpen(false);
            toast('Hackathon created! (demo)', 'success');
          }}
          className="space-y-4"
        >
          <div>
            <label className="text-xs font-medium text-soft mb-1.5 block">Hackathon Name</label>
            <input
              type="text"
              placeholder="e.g. Innovara Buildathon 2025"
              className="w-full px-3 py-2.5 text-sm bg-elev border border-base rounded-lg text-base placeholder:text-faint focus:outline-none focus:border-accent-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-soft mb-1.5 block">Organizer</label>
              <input
                type="text"
                placeholder="Organization name"
                className="w-full px-3 py-2.5 text-sm bg-elev border border-base rounded-lg text-base placeholder:text-faint focus:outline-none focus:border-accent-500"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-soft mb-1.5 block">Prize Pool (\u20b9)</label>
              <input
                type="number"
                placeholder="100000"
                className="w-full px-3 py-2.5 text-sm bg-elev border border-base rounded-lg text-base placeholder:text-faint focus:outline-none focus:border-accent-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-soft mb-1.5 block">Mode</label>
              <select className="w-full px-3 py-2.5 text-sm bg-elev border border-base rounded-lg text-base focus:outline-none focus:border-accent-500">
                <option>Online</option>
                <option>Offline</option>
                <option>Hybrid</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-soft mb-1.5 block">Team Size</label>
              <input
                type="text"
                placeholder="2-5 members"
                className="w-full px-3 py-2.5 text-sm bg-elev border border-base rounded-lg text-base placeholder:text-faint focus:outline-none focus:border-accent-500"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-soft mb-1.5 block">Description</label>
            <textarea
              placeholder="Describe your hackathon..."
              rows={3}
              className="w-full px-3 py-2.5 text-sm bg-elev border border-base rounded-lg text-base placeholder:text-faint focus:outline-none focus:border-accent-500 resize-none"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" variant="primary" className="flex-1">Create Hackathon</Button>
            <Button type="button" variant="secondary" onClick={() => setCreateOpen(false)}>Cancel</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
