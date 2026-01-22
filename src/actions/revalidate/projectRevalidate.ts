// src/actions/revalidateProjects.ts
"use server";

import { revalidateTag } from "next/cache";

export async function revalidateProjects() {
  revalidateTag("projects", {});
  revalidateTag("workExp", {});
  revalidateTag("dashboard/manage-projects", {});
}
