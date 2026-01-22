// src/actions/revalidateProjects.ts
"use server";

import { revalidateTag } from "next/cache";

export async function revalidateWorkExp() {
  revalidateTag("projects");
  revalidateTag("workExp");
  revalidateTag("manage-experiences");
}
