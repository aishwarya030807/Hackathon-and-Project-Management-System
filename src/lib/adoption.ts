import { supabase } from "./supabaseClient";
import type { ProjectAdoption } from "../types";

export async function requestAdoption(params: {
  projectId: string;
  requestedBy: string;
  message: string;
}) {
  const { data, error } = await supabase
    .from("project_adoptions")
    .insert({
      project_id: params.projectId,
      requested_by: params.requestedBy,
      message: params.message,
      status: "pending",
    })
    .select()
    .single();

  if (error) throw error;
  return data as ProjectAdoption;
}

export async function withdrawAdoption(adoptionId: string) {
  const { error } = await supabase
    .from("project_adoptions")
    .update({ status: "withdrawn", resolved_at: new Date().toISOString() })
    .eq("id", adoptionId);
  if (error) throw error;
}

export async function getIncomingAdoptionRequests() {
  const { data, error } = await supabase
    .from("project_adoptions")
    .select(
      `
      *,
      projects ( id, title, cover_image_url ),
      requester:profiles!project_adoptions_requested_by_fkey ( id, full_name, avatar_url )
    `
    )
    .eq("status", "pending")
    .order("requested_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function approveAdoption(params: {
  adoptionId: string;
  projectId: string;
  requesterId: string;
  closeAdoption?: boolean;
}) {
  const { error: updateError } = await supabase
    .from("project_adoptions")
    .update({ status: "approved", resolved_at: new Date().toISOString() })
    .eq("id", params.adoptionId);
  if (updateError) throw updateError;

  const { error: contributorError } = await supabase.from("project_contributors").insert({
    project_id: params.projectId,
    user_id: params.requesterId,
    role: "contributor",
  });
  if (contributorError) throw contributorError;

  if (params.closeAdoption) {
    const { error: projectError } = await supabase
      .from("projects")
      .update({ is_open_for_adoption: false, status: "active" })
      .eq("id", params.projectId);
    if (projectError) throw projectError;
  }
}

export async function rejectAdoption(adoptionId: string) {
  const { error } = await supabase
    .from("project_adoptions")
    .update({ status: "rejected", resolved_at: new Date().toISOString() })
    .eq("id", adoptionId);
  if (error) throw error;
}
