// app/sitemap.ts

import type { MetadataRoute } from "next";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://liveproject.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const publicRoutes = [
    "",
    "/about",
    "/contact",
    "/courses",
    "/career-guides",
    "/blog",
    "/hackathons",
    "/templates",
    "/resources",
    "/projects",
    "/premium",
    "/privacy",
    "/terms",
    "/register",
    "/login",
  ];

  return publicRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency:
      route === "" || route === "/projects" || route === "/courses"
        ? "weekly"
        : "monthly",
    priority:
      route === ""
        ? 1
        : route === "/projects" || route === "/courses"
          ? 0.9
          : 0.7,
  }));
}