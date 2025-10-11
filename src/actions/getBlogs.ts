"use server";

export async function getAllBlogs() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/blogs/all`);
  const data = await res.json();
  console.log(res);

  const blogs = data.data;
  return blogs;
}
