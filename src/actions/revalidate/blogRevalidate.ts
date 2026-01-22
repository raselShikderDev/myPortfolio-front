// src/actions/revalidateProjects.ts
"use server";

import { revalidateTag } from "next/cache";

export async function revalidateBlogs() {
  revalidateTag("blogs", {});
  revalidateTag("dashboard/manage-blogs", {});
}
