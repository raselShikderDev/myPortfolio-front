"use server";

import { IProject } from "@/interfaces/projects.interfaces";
import { getBaseUrl } from "@/lib/apiConfig";

export async function getAllProjects(): Promise<IProject[]> {
  const res = await fetch(`${getBaseUrl()}/projects/all`);
  const data = await res.json();

  const projects = data.data;
  return projects;
}

