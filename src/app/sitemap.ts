import type { MetadataRoute } from "next";
import { IBlog } from "@/interfaces/blogs.interfaces";

const baseUrl = "https://raselsdev.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
    },
    {
      url: `${baseUrl}/about`,
    },
    {
      url: `${baseUrl}/projects`,
    },
    {
      url: `${baseUrl}/blogs`,
    },
    {
      url: `${baseUrl}/contact`,
    },
  ];

  const apiBaseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  if (!apiBaseUrl) {
    return routes;
  }

  try {
    const res = await fetch(`${apiBaseUrl}/blogs/all`, {
      next: { revalidate: 3600 },
    });

    if (res.ok) {
      const data = await res.json();
      const blogs: IBlog[] = data?.data || [];

      const blogRoutes: MetadataRoute.Sitemap = blogs
        .filter((blog) => blog?.slug)
        .map((blog) => ({
          url: `${baseUrl}/blogs/${blog.slug}`,
          lastModified: blog.updatedAt
            ? new Date(blog.updatedAt)
            : blog.createdAt
            ? new Date(blog.createdAt)
            : undefined,
        }));

      return [...routes, ...blogRoutes];
    }
  } catch (error) {
    console.error("Sitemap generation: Failed to fetch dynamic blog posts:", error);
  }

  return routes;
}
