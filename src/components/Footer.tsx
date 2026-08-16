import { Sparkles, FolderGit2, Share2, Mail, Heart } from 'lucide-react';
import { Link } from '@/lib/router';

const footerLinks = {
  Platform: [
    { label: 'Hackathons', path: '/hackathons' },
    { label: 'Projects', path: '/projects' },
    { label: 'Opportunities', path: '/opportunities' },
    { label: 'Leaderboard', path: '/leaderboard' },
  ],
  Community: [
    { label: 'About', path: '/' },
    { label: 'My Workspace', path: '/workspace' },
    { label: 'Organizer Dashboard', path: '/organizer' },
    { label: 'Search', path: '/search' },
  ],
  Resources: [
    { label: 'Documentation', path: '/' },
    { label: 'Guides', path: '/' },
    { label: 'API Reference', path: '/' },
    { label: 'Changelog', path: '/' },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-base bg-elev mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center">
                <Sparkles className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="font-display font-bold text-lg">Innovara</span>
            </Link>
            <p className="text-sm text-soft max-w-xs">
              Where student ideas keep evolving. Transforming hackathons from one-time competitions
              into the beginning of a long-term project lifecycle.
            </p>
            <div className="flex items-center gap-3 mt-4">
              {[FolderGit2, Share2, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-lg bg-soft border border-base flex items-center justify-center text-soft hover:text-accent-500 hover:border-accent-500/30 transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold mb-3">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className="text-sm text-soft hover:text-accent-500 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-base flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-faint">
            &copy; {new Date().getFullYear()} Innovara. All rights reserved.
          </p>
          <p className="text-xs text-faint flex items-center gap-1.5">
            Built with <Heart className="w-3 h-3 text-accent-500" /> by the student community
          </p>
        </div>
      </div>
    </footer>
  );
}
