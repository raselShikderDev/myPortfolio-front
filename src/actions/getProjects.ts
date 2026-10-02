"use server";

import { IProject } from "@/interfaces/projects.interfaces";
import { buildApiUrl } from "@/lib/apiConfig";



export async function getAllProjects(): Promise<IProject[]> {
  const res = await fetch(buildApiUrl("/projects/all"));

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: 'Network error' }));
    throw new Error(errorData.message || 'Failed to fetch projects');
  }

  const data = await res.json();
  return data.data;
}

