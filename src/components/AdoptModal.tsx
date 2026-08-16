import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui';
import { StatusBadge } from '@/components/ui/Badge';
import { useToast } from '@/lib/toast';
import { supabase } from '@/lib/supabase';
import type { Project } from '@/types';
import { Users, Clock, Lightbulb, CheckCircle2, Send } from 'lucide-react';
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
  const [adopted, setAdopted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  if (!project) return null;

  const handleAdopt = async () => {
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast('Please log in to adopt a project.', 'error');
      setLoading(false);
      return;
    }

    const { error } = await supabase.from('project_adoptions').insert({
      user_id: user.id,
      project_id: project.id,
      message: message || 'I would like to continue developing this project.',
    });

    setLoading(false);

    if (error) {
      if (error.code === '23505') {
        toast('You already have a pending request for this project.', 'error');
      } else {
        toast('Something went wrong sending your request.', 'error');
        console.error(error);
      }
      return;
    }

    setAdopted(true);
    toast(`Request sent! The maintainers of ${project.name} will review it.`, 'success');
    setTimeout(() => {
      onClose();
      setAdopted(false);
      setMessage('');
    }, 1800);
  };

  return (
    <Modal open={open} onClose={onClose} title="Revive this Project">
      {adopted ? (
        <div className="flex flex-col items-center text-center py-8">
          <div className="w-16 h-16 rounded-full bg-success-500/10 flex items-center justify-center mb-4 animate-scale-in">
            <CheckCircle2 className="w-8 h-8 text-success-500" />
          </div>
          <h3 className="text-lg font-semibold mb-1">Request sent!</h3>
          <p className="text-sm text-soft">
            The current maintainers of {project.name} will review your request.
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-start gap-3 p-4 rounded-xl bg-soft border border-base mb-4">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${project.color} shrink-0`} />
            <div>
              <h3 className="font-semibold">{project.name}</h3>
              <p className="text-xs text-soft">{project.tagline}</p>
              <div className="mt-1.5">
                <StatusBadge status={project.status} />
              </div>
            </div>
          </div>

          <p className="text-sm text-soft mb-5">
            This project was archived after the original hackathon. Send a request to become a new
            maintainer and continue its development.
          </p>

          <div className="mb-4">
            <label className="text-xs font-medium text-soft mb-2 block">Message (optional)</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What do you want to build on this project?"
              rows={3}
              className="w-full text-sm rounded-xl bg-soft border border-base p-3 focus:outline-none focus:border-strong resize-none"
            />
          </div>

          <div className="mb-4">
            <p className="text-xs font-medium text-soft mb-2 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" /> Original Creators
            </p>
            <div className="flex flex-wrap gap-2">
              {project.originalTeam.members.map((m) => (
                <div key={m.name} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-soft border border-base">
                  <Avatar initials={m.avatar} size="xs" />
                  <span className="text-xs">{m.name}</span>
                  <span className="text-xs text-faint">{m.role}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4 flex items-center gap-2 text-sm text-soft">
            <Clock className="w-4 h-4 text-faint" />
            Last updated: {project.year}
          </div>

          {project.suggestedImprovements && project.suggestedImprovements.length > 0 && (
            <div className="mb-5">
              <p className="text-xs font-medium text-soft mb-2 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5" /> Suggested Improvements
              </p>
              <ul className="space-y-1.5">
                {project.suggestedImprovements.map((imp, i) => (
                  <li key={i} className="text-sm text-soft flex items-start gap-2">
                    <span className="text-accent-500 mt-0.5">→</span>
                    {imp}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex gap-3">
            <Button variant="primary" onClick={handleAdopt} className="flex-1" disabled={loading}>
              <Send className="w-4 h-4" /> {loading ? 'Sending...' : 'Send Adoption Request'}
            </Button>
            <Button variant="secondary" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
}
