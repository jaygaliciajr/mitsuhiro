import type { MetadataRoute } from "next";

import { isSiteUrlConfigured, siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // With no domain configured, every canonical URL on the site points at
  // localhost. Being indexed in that state is worse than not being indexed.
  if (!isSiteUrlConfigured) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Internal working page and the write endpoint.
      disallow: ["/owner-checklist", "/api/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
