import type { MetadataRoute } from "next";
import { IBlog } from "@/interfaces/blogs.interfaces";
import { getBaseUrl, getFrontendBaseUrl } from "@/lib/apiConfig";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes: MetadataRoute.Sitemap = [
    {
      url: getFrontendBaseUrl(),
    },
    {
      url: `${getFrontendBaseUrl()}/about`,
    },
    {
      url: `${getFrontendBaseUrl()}/projects`,
    },
    {
      url: `${getFrontendBaseUrl()}/blogs`,
    },
    {
      url: `${getFrontendBaseUrl()}/contact`,
    },
  ];

  const apiBaseUrl = getBaseUrl();

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
          url: `${getFrontendBaseUrl()}/blogs/${blog.slug}`,
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
