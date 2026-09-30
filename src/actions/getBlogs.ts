"use server";

import { IBlog } from "@/interfaces/blogs.interfaces";
import { getBaseUrl } from "@/lib/apiConfig";

export async function getAllBlogs(): Promise<IBlog[]> {
  const res = await fetch(`${getBaseUrl()}/blogs/all`);
  const data = await res.json();

  const blogs = data.data;
  return blogs;
}
