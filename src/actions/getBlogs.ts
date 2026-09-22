"use server";

import { IBlog } from "@/interfaces/blogs.interfaces";

export async function getAllBlogs(): Promise<IBlog[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/blogs/all`);
  const data = await res.json();

  const blogs = data.data;
  return blogs;
}
