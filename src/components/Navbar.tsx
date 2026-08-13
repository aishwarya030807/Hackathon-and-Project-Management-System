import { useEffect, useState } from 'react';
import {
  Menu,
  X,
  Search,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  Compass,
  FolderGit2,
  Trophy,
  LayoutDashboard,
  Target,
  Sparkles,
  User,
  Settings,
  LogOut,
} from 'lucide-react';
import { Link, useRoute, useNavigate } from '@/lib/router';
import { useTheme } from '@/lib/useTheme';
import { notifications as mockNotifications } from '@/data/mock';
import { Avatar } from '@/components/ui';

const navItems = [
  { label: 'Overview', path: '/innovara', icon: Compass },
  { label: 'Hackathons', path: '/innovara/hackathons', icon: Target },
  { label: 'Projects', path: '/innovara/projects', icon: FolderGit2 },
  { label: 'Opportunities', path: '/innovara/opportunities', icon: Sparkles },
  { label: 'Workspace', path: '/innovara/workspace', icon: LayoutDashboard },
  { label: 'Leaderboard', path: '/innovara/leaderboard', icon: Trophy },
];

export function Navbar() {
  const route = useRoute();
  const navigate = useNavigate();
  const { theme, toggle } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setNotifOpen(false);
    setProfileOpen(false);
  }, [route]);

  const isActive = (path: string) => {
    const cleanPath = path.replace(/^\/innovara/, '') || '/';
    const cleanRoute = route.replace(/^\/innovara/, '') || '/';
    if (cleanPath === '/') return cleanRoute === '/';
    return cleanRoute.startsWith(cleanPath);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'glass-strong border-b border-base shadow-soft' : 'border-b border-transparent'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center">
              <Sparkles className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight">Innovara</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive(item.path)
                      ? 'text-accent-500 bg-accent-500/10'
                      : 'text-soft hover:text-base hover:bg-soft'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => navigate('/search')}
              className="p-2 rounded-lg text-soft hover:text-base hover:bg-soft transition-colors"
              aria-label="Search"
            >
              <Search className="w-4.5 h-4.5" />
            </button>

            <button
              onClick={toggle}
              className="p-2 rounded-lg text-soft hover:text-base hover:bg-soft transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen((v) => !v)}
                className="p-2 rounded-lg text-soft hover:text-base hover:bg-soft transition-colors relative"
                aria-label="Notifications"
              >
                <Bell className="w-4.5 h-4.5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent-500 animate-pulse-ring" />
              </button>
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-elev border border-base rounded-xl shadow-float animate-scale-in overflow-hidden">
                  <div className="px-4 py-3 border-b border-base flex items-center justify-between">
                    <span className="font-semibold text-sm">Notifications</span>
                    <span className="text-xs text-accent-500">{mockNotifications.filter((n) => !n.read).length} new</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {mockNotifications.map((n) => (
                      <div
                        key={n.id}
                        className={`px-4 py-3 border-b border-base hover:bg-soft transition-colors cursor-pointer ${
                          !n.read ? 'bg-accent-500/5' : ''
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {!n.read && <span className="w-2 h-2 rounded-full bg-accent-500 mt-1.5 shrink-0" />}
                          <div className="flex-1">
                            <p className="text-sm font-medium">{n.title}</p>
                            <p className="text-xs text-soft mt-0.5">{n.body}</p>
                            <p className="text-xs text-faint mt-1">{n.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen((v) => !v)}
                className="flex items-center gap-1.5 p-1 rounded-lg hover:bg-soft transition-colors"
              >
                <Avatar initials="SR" size="sm" />
                <ChevronDown className="w-3.5 h-3.5 text-faint hidden sm:block" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-elev border border-base rounded-xl shadow-float animate-scale-in overflow-hidden">
                  <div className="px-4 py-3 border-b border-base">
                    <p className="font-semibold text-sm">Sneha Reddy</p>
                    <p className="text-xs text-soft">IIIT Hyderabad</p>
                  </div>
                  <div className="py-1">
                    {[
                      { label: 'Innovator Workspace', icon: LayoutDashboard, path: '/innovara/workspace' },
                      { label: 'My Profile', icon: User, path: '/innovara/profile/s1' },
                      { label: 'Organizer Portal', icon: Settings, path: '/innovara/organizer' },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.path}
                          onClick={() => navigate(item.path)}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-soft hover:text-base hover:bg-soft transition-colors"
                        >
                          <Icon className="w-4 h-4" />
                          {item.label}
                        </button>
                      );
                    })}
                    <div className="border-t border-base mt-1 pt-1">
                      <button className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-soft hover:text-base hover:bg-soft transition-colors">
                        <LogOut className="w-4 h-4" />
                        Sign out
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden p-2 rounded-lg text-soft hover:text-base hover:bg-soft transition-colors"
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden glass-strong border-t border-base animate-fade-in">
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive(item.path)
                        ? 'text-accent-500 bg-accent-500/10'
                        : 'text-soft hover:text-base hover:bg-soft'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </header>
      <div className="h-16" />
    </>
  );
}
