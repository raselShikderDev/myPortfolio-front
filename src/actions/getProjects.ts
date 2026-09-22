"use server";

import { IProject } from "@/interfaces/projects.interfaces";

export async function getAllProjects(): Promise<IProject[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/projects/all`);
  const data = await res.json();

  const projects = data.data;
  return projects;
}

