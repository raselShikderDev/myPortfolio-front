"use server";

import { IBlog } from "@/interfaces/blogs.interfaces";
import { buildApiUrl } from "@/lib/apiConfig";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

export async function getAllBlogs(): Promise<IBlog[]> {
  const res = await fetchWithAuth(buildApiUrl("/blogs/all"));

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: "Network error" }));
    throw new Error(errorData.message || "Failed to fetch blogs");
  }

  const data = await res.json();
  return data.data;
}