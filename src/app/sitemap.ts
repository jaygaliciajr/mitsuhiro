import type { MetadataRoute } from "next";

import { isSiteUrlConfigured, routes, siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  // Listing localhost URLs would be worse than listing nothing.
  if (!isSiteUrlConfigured) return [];

  const lastModified = new Date();

  return routes.map((route) => ({
    url: `${siteUrl}${route.href === "/" ? "" : route.href}`,
    lastModified,
    changeFrequency: "monthly",
    priority: route.href === "/" ? 1 : 0.7,
  }));
}
