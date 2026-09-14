// app/robots.ts

import type { MetadataRoute } from "next";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://liveproject.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/about",
          "/courses",
          "/career-guides",
          "/blog",
          "/hackathons",
          "/templates",
          "/resources",
          "/projects",
          "/premium",
          "/contact",
          "/privacy",
          "/terms",
        ],
        disallow: [
          "/workspace/",
          "/business/",
          "/mentor/",
          "/project-admin/",
          "/settings/",
          "/notifications/",
          "/checkout/",
          "/api/",
          "/reset-password/",
          "/reset-otp/",
          "/courses/*/learn/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}