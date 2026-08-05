export type Theme = 'light' | 'dark';

export type Domain =
  | 'AI / ML'
  | 'Web Development'
  | 'Healthcare'
  | 'FinTech'
  | 'Climate Tech'
  | 'Cybersecurity'
  | 'Education'
  | 'IoT'
  | 'Social Impact'
  | 'Mobility';

export type HackathonMode = 'Online' | 'Offline' | 'Hybrid';
export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Hackathon {
  id: string;
  name: string;
  organizer: string;
  domains: Domain[];
  mode: HackathonMode;
  location: string;
  prizePool: number;
  teamSize: string;
  deadline: string;
  startDate: string;
  endDate: string;
  difficulty: Difficulty;
  eligibility: string;
  description: string;
  problemStatements: string[];
  timeline: { label: string; date: string }[];
  rules: string[];
  prizes: { place: string; amount: number; perks?: string }[];
  judgingCriteria: { criterion: string; weight: number }[];
  faqs: { q: string; a: string }[];
  banner: string;
  logo: string;
  participants: number;
  featured?: boolean;
}

export type ProjectStatus =
  | 'Active'
  | 'Archived'
  | 'Looking for Contributors'
  | 'Abandoned'
  | 'Revived';

export type Maturity = 'Concept' | 'Prototype' | 'MVP' | 'Beta' | 'Production';

export interface TeamMember {
  name: string;
  role: string;
  avatar: string;
}

export interface Project {
  id: string;
  name: string;
  tagline: string;
  description: string;
  problem: string;
  solution: string;
  features: string[];
  techStack: string[];
  domain: Domain[];
  year: number;
  status: ProjectStatus;
  maturity: Maturity;
  difficulty: Difficulty;
  thumbnail: string;
  color: string;
  originalTeam: { name: string; members: TeamMember[] };
  currentMaintainers: TeamMember[];
  contributors: TeamMember[];
  hackathonId: string;
  hackathonName: string;
  challenges: string[];
  futureImprovements: string[];
  documentation: { title: string; type: string; date: string }[];
  presentations: { title: string; event: string; date: string }[];
  stars: number;
  forks: number;
  views: number;
  featured?: boolean;
  suggestedImprovements?: string[];
}

export interface TimelineEntry {
  year: number;
  title: string;
  subtitle: string;
  description: string;
  team: string;
  additions?: string[];
  type: 'created' | 'revived' | 'evolved' | 'submitted';
}

export interface Student {
  id: string;
  name: string;
  avatar: string;
  college: string;
  year: string;
  bio: string;
  skills: string[];
  stats: { projects: number; hackathons: number; contributions: number; revived: number };
  featuredProjects: string[];
  achievements: { title: string; icon: string; date: string }[];
  rank?: number;
  innovationScore?: number;
}

export interface Opportunity {
  id: string;
  projectName: string;
  projectDomain: string;
  projectMaturity: Maturity;
  matches: {
    id: string;
    name: string;
    organizer: string;
    matchPercent: number;
    reasons: string[];
    deadline: string;
    prize: number;
  }[];
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  type: 'hackathon' | 'project' | 'collab' | 'system';
}
