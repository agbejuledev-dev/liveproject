// app/manifest.ts

import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LiveProject",
    short_name: "LiveProject",
    description:
      "Learn. Work on Live Projects. Build Verified Experience. Get Hired.",
    start_url: "/",
    display: "standalone",
    background_color: "#061f1e",
    theme_color: "#0d9488",
    orientation: "portrait-primary",
    categories: [
      "education",
      "business",
      "productivity",
      "career",
    ],
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}