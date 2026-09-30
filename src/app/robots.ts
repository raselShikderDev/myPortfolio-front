import type { MetadataRoute } from "next";
import { FRONTEND_BASE_URL } from "@/lib/apiConfig";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/login", "/dashboard", "/api"],
    },
    sitemap: `${FRONTEND_BASE_URL}/sitemap.xml`,
  };
}
