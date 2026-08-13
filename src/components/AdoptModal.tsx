import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui';
import { StatusBadge } from '@/components/ui/Badge';
import { useToast } from '@/lib/toast';
import type { Project } from '@/types';
import { Users, Clock, Lightbulb, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

export function AdoptModal({
  open,
  onClose,
  project,
}: {
  open: boolean;
  onClose: () => void;
  project: Project | null;
}) {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [teamName, setTeamName] = useState('Team Beta');
  const [motivation, setMotivation] = useState('');
  const [technicalPlan, setTechnicalPlan] = useState('');
  const [skills, setSkills] = useState('React, Node.js, Python, ML');
  const [timeline, setTimeline] = useState('3 months to MVP');

  if (!project) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast(`Adoption request submitted for ${project.name}!`, 'success');
    setTimeout(() => {
      onClose();
      setSubmitted(false);
    }, 2000);
  };

  return (
    <Modal open={open} onClose={onClose} title={`Adopt & Revive: ${project.name}`} maxWidth="max-w-xl">
      {submitted ? (
        <div className="flex flex-col items-center text-center py-8">
          <div className="w-16 h-16 rounded-full bg-success-500/10 flex items-center justify-center mb-4 animate-scale-in">
            <CheckCircle2 className="w-8 h-8 text-success-500" />
          </div>
          <h3 className="text-lg font-semibold mb-1">Adoption Request Submitted!</h3>
          <p className="text-sm text-soft max-w-md">
            Status: <span className="font-semibold text-accent-500">PENDING</span>. The original creators and platform moderators have been notified. Once approved, you will be assigned as maintainer!
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-soft border border-base">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${project.color} shrink-0`} />
            <div>
              <h3 className="font-semibold text-sm">{project.name}</h3>
              <p className="text-xs text-soft">{project.tagline}</p>
              <div className="mt-1">
                <StatusBadge status={project.status} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-soft mb-1 block">Applicant / Team Name</label>
              <input
                type="text"
                required
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="e.g. Team Beta"
                className="w-full px-3 py-2 text-sm bg-elev border border-base rounded-lg focus:outline-none focus:border-accent-500"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-soft mb-1 block">Relevant Skills</label>
              <input
                type="text"
                required
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="e.g. React, Python, PyTorch"
                className="w-full px-3 py-2 text-sm bg-elev border border-base rounded-lg focus:outline-none focus:border-accent-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-soft mb-1 block">Motivation & Goals</label>
            <textarea
              required
              rows={2}
              value={motivation}
              onChange={(e) => setMotivation(e.target.value)}
              placeholder="Why do you want to adopt and maintain this project?"
              className="w-full px-3 py-2 text-sm bg-elev border border-base rounded-lg focus:outline-none focus:border-accent-500 resize-none"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-soft mb-1 block">Technical Roadmap & Proposed Improvements</label>
            <textarea
              required
              rows={2}
              value={technicalPlan}
              onChange={(e) => setTechnicalPlan(e.target.value)}
              placeholder="What architecture changes or new features will you build?"
              className="w-full px-3 py-2 text-sm bg-elev border border-base rounded-lg focus:outline-none focus:border-accent-500 resize-none"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-soft mb-1 block">Expected Timeline</label>
            <input
              type="text"
              required
              value={timeline}
              onChange={(e) => setTimeline(e.target.value)}
              placeholder="e.g. 2 months for MVP release"
              className="w-full px-3 py-2 text-sm bg-elev border border-base rounded-lg focus:outline-none focus:border-accent-500"
            />
          </div>

          {/* Original creators */}
          <div className="pt-2 border-t border-base">
            <p className="text-xs font-medium text-soft mb-2 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-faint" /> Original Team Attribution Retained:
            </p>
            <div className="flex flex-wrap gap-2">
              {project.originalTeam.members.map((m) => (
                <div key={m.name} className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-soft border border-base text-xs">
                  <Avatar initials={m.avatar} size="xs" />
                  <span>{m.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" variant="primary" className="flex-1">
              Submit Adoption Application
            </Button>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
