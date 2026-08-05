import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ToastProvider } from '@/lib/toast';
import { useRoute } from '@/lib/router';
import { LandingPage } from '@/pages/LandingPage';
import { HackathonsPage } from '@/pages/HackathonsPage';
import { HackathonDetailPage } from '@/pages/HackathonDetailPage';
import { ProjectsPage } from '@/pages/ProjectsPage';
import { ProjectDetailPage } from '@/pages/ProjectDetailPage';
import { OpportunitiesPage } from '@/pages/OpportunitiesPage';
import { LeaderboardPage } from '@/pages/LeaderboardPage';
import { WorkspacePage } from '@/pages/WorkspacePage';
import { OrganizerPage } from '@/pages/OrganizerPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { SearchPage } from '@/pages/SearchPage';

function Router() {
  const route = useRoute();

  // Route matching
  if (route === '/') return <LandingPage />;
  if (route === '/hackathons') return <HackathonsPage />;
  if (route.startsWith('/hackathons/')) return <HackathonDetailPage />;
  if (route === '/projects') return <ProjectsPage />;
  if (route.startsWith('/projects/')) return <ProjectDetailPage />;
  if (route === '/opportunities') return <OpportunitiesPage />;
  if (route === '/leaderboard') return <LeaderboardPage />;
  if (route === '/workspace') return <WorkspacePage />;
  if (route === '/organizer') return <OrganizerPage />;
  if (route === '/search') return <SearchPage />;
  if (route.startsWith('/profile/')) return <ProfilePage />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center">
      <h1 className="font-display text-4xl font-bold mb-2">404</h1>
      <p className="text-soft">This page doesn't exist.</p>
    </div>
  );
}

function App() {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-base flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Router />
        </main>
        <Footer />
      </div>
    </ToastProvider>
  );
}

export default App;
