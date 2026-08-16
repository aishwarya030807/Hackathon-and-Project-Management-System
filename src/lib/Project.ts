import { supabase } from "./supabaseClient";
import type { Project, ProjectStatus, TimelineEntry } from "@/types";

function mapStatus(dbStatus: string, isOpenForAdoption: boolean): ProjectStatus {
  if (isOpenForAdoption) return "Looking for Contributors";
  switch (dbStatus) {
    case "active":
      return "Active";
    case "completed":
      return "Archived";
    case "abandoned":
      return "Abandoned";
    case "archived":
      return "Archived";
    default:
      return "Active";
  }
}

function mapMaturity(level: number): Project["maturity"] {
  switch (level) {
    case 1:
      return "Concept";
    case 2:
      return "Prototype";
    case 3:
      return "MVP";
    case 4:
      return "Beta";
    case 5:
      return "Production";
    default:
      return "Prototype";
  }
}

const COLOR_PALETTE = [
  "from-indigo-500 to-purple-600",
  "from-emerald-500 to-teal-600",
  "from-orange-500 to-rose-600",
  "from-blue-500 to-cyan-600",
];
function colorFor(id: string) {
  const hash = id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return COLOR_PALETTE[hash % COLOR_PALETTE.length];
}

interface RawProjectRow {
  id: string;
  title: string;
  tagline: string | null;
  description: string;
  domain: string[];
  status: string;
  maturity_level: number;
  github_url: string | null;
  demo_video_url: string | null;
  presentation_url: string | null;
  report_url: string | null;
  cover_image_url: string | null;
  is_open_for_adoption: boolean;
  created_at: string;
  project_contributors: {
    role: string;
    profiles: { id: string; full_name: string; avatar_url: string | null };
  }[];
}

function toProject(row: RawProjectRow): Project {
  const owner = row.project_contributors.find((c) => c.role === "owner");
  const maintainers = row.project_contributors.filter((c) => c.role === "maintainer");
  const contributors = row.project_contributors.filter((c) => c.role === "contributor");

  return {
    id: row.id,
    name: row.title,
    tagline: row.tagline ?? "",
    description: row.description,
    problem: "",
    solution: "",
    features: [],
    techStack: [],
    domain: row.domain as Project["domain"],
    year: new Date(row.created_at).getFullYear(),
    status: mapStatus(row.status, row.is_open_for_adoption),
    maturity: mapMaturity(row.maturity_level),
    difficulty: "Intermediate",
    thumbnail: row.cover_image_url ?? "",
    color: colorFor(row.id),
    originalTeam: {
      name: owner ? owner.profiles.full_name : "Unknown",
      members: owner
        ? [{ name: owner.profiles.full_name, role: "Owner", avatar: owner.profiles.full_name[0] }]
        : [],
    },
    currentMaintainers: maintainers.map((m) => ({
      name: m.profiles.full_name,
      role: "Maintainer",
      avatar: m.profiles.full_name[0],
    })),
    contributors: contributors.map((c) => ({
      name: c.profiles.full_name,
      role: "Contributor",
      avatar: c.profiles.full_name[0],
    })),
    hackathonId: "",
    hackathonName: "",
    challenges: [],
    futureImprovements: [],
    documentation: row.report_url
      ? [{ title: "Project Report", type: "Report", date: row.created_at.slice(0, 10) }]
      : [],
    presentations: row.presentation_url
      ? [{ title: "Presentation", event: "", date: row.created_at.slice(0, 10) }]
      : [],
    stars: 0,
    forks: 0,
    views: 0,
    featured: false,
    suggestedImprovements: [],
  };
}

const PROJECT_SELECT = `
  id, title, tagline, description, domain, status, maturity_level,
  github_url, demo_video_url, presentation_url, report_url, cover_image_url,
  is_open_for_adoption, created_at,
  project_contributors ( role, profiles ( id, full_name, avatar_url ) )
`;

export async function fetchProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select(PROJECT_SELECT)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as unknown as RawProjectRow[]).map(toProject);
}

export async function fetchProjectById(id: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from("projects")
    .select(PROJECT_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  return toProject(data as unknown as RawProjectRow);
}

export async function fetchProjectTimeline(projectId: string): Promise<TimelineEntry[]> {
  const { data, error } = await supabase
    .from("project_versions")
    .select("id, version_label, changes_summary, created_at, hackathons ( title ), edited_by, profiles:edited_by ( full_name )")
    .eq("project_id", projectId)
    .order("created_at", { ascending: true });

  if (error) throw error;

  return (data as any[]).map((v, i) => ({
    year: new Date(v.created_at).getFullYear(),
    title: v.version_label,
    subtitle: v.hackathons?.title ?? "",
    description: v.changes_summary,
    team: v.profiles?.full_name ?? "Unknown",
    additions: [],
    type: i === 0 ? "created" : "evolved",
  }));
}
