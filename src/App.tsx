import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ToastProvider } from '@/lib/toast';
import { useRoute } from '@/lib/router';
import {
  InnovaraOverview,
  InnovaraHackathons,
  InnovaraHackathonDetail,
  InnovaraProjects,
  InnovaraProjectDetail,
  InnovaraOpportunities,
  InnovaraLeaderboard,
  InnovaraWorkspace,
  InnovaraOrganizer,
  InnovaraProfile,
  InnovaraSearch,
} from '@/pages/innovara';

function Router() {
  const route = useRoute();

  // Route matching
  if (route === '/' || route === '/innovara' || route === '/innovara/') return <InnovaraOverview />;
  if (route === '/hackathons' || route === '/innovara/hackathons') return <InnovaraHackathons />;
  if (route.startsWith('/hackathons/') || route.startsWith('/innovara/hackathons/')) return <InnovaraHackathonDetail />;
  if (route === '/projects' || route === '/innovara/projects') return <InnovaraProjects />;
  if (route.startsWith('/projects/') || route.startsWith('/innovara/projects/')) return <InnovaraProjectDetail />;
  if (route === '/opportunities' || route === '/innovara/opportunities') return <InnovaraOpportunities />;
  if (route === '/leaderboard' || route === '/innovara/leaderboard') return <InnovaraLeaderboard />;
  if (route === '/workspace' || route === '/innovara/workspace') return <InnovaraWorkspace />;
  if (route === '/organizer' || route === '/innovara/organizer') return <InnovaraOrganizer />;
  if (route === '/search' || route === '/innovara/search') return <InnovaraSearch />;
  if (route.startsWith('/profile/') || route.startsWith('/innovara/profile/')) return <InnovaraProfile />;

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
