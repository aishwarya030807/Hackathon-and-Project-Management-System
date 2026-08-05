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
  const [adopted, setAdopted] = useState(false);

  if (!project) return null;

  const handleAdopt = () => {
    setAdopted(true);
    toast(`You are now a maintainer of ${project.name}!`, 'success');
    setTimeout(() => {
      onClose();
      setAdopted(false);
    }, 1500);
  };

  return (
    <Modal open={open} onClose={onClose} title="Revive this Project">
      {adopted ? (
        <div className="flex flex-col items-center text-center py-8">
          <div className="w-16 h-16 rounded-full bg-success-500/10 flex items-center justify-center mb-4 animate-scale-in">
            <CheckCircle2 className="w-8 h-8 text-success-500" />
          </div>
          <h3 className="text-lg font-semibold mb-1">You're now a maintainer!</h3>
          <p className="text-sm text-soft">
            {project.name} is now in your workspace. Continue building where the original team left off.
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
            This project was archived after the original hackathon. You can become a new maintainer and
            continue its development.
          </p>

          {/* Original creators */}
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

          {/* Last updated */}
          <div className="mb-4 flex items-center gap-2 text-sm text-soft">
            <Clock className="w-4 h-4 text-faint" />
            Last updated: {project.year}
          </div>

          {/* Suggested improvements */}
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
            <Button variant="primary" onClick={handleAdopt} className="flex-1">
              Become a Maintainer
            </Button>
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
}
