// app/layout.tsx

import type { Metadata, Viewport } from "next";
import "./globals.css";
import LiveProjectAI from "@/components/liveproject-ai";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
      "https://liveproject.vercel.app"
  ),

  title: {
    default:
      "LiveProject — Learn. Work on Live Projects. Build Verified Experience. Get Hired.",
    template: "%s | LiveProject",
  },

  description:
    "LiveProject helps professionals learn practical skills, work on real-world projects, build verified experience and access career opportunities.",

  applicationName: "LiveProject",

  keywords: [
    "LiveProject",
    "real world projects",
    "professional experience",
    "verified experience",
    "career development",
    "project based learning",
    "professional learning",
    "UK jobs",
    "career opportunities",
    "Agile",
    "Scrum",
    "Product Management",
    "Business Analysis",
    "Frontend Development",
    "UX Design",
    "Data Analytics",
  ],

  authors: [
    {
      name: "LiveProject",
    },
  ],

  creator: "LiveProject",

  publisher: "LiveProject",

  category: "Education",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "/",
    siteName: "LiveProject",
    title:
      "LiveProject — Learn. Work on Live Projects. Build Verified Experience. Get Hired.",
    description:
      "Learn practical skills, work on live projects, build verified experience and move closer to meaningful career opportunities.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt:
          "LiveProject — Learn. Work on Live Projects. Build Verified Experience. Get Hired.",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title:
      "LiveProject — Build Verified Experience. Get Hired.",
    description:
      "Learn practical skills, work on live projects and build verified professional experience.",
    images: ["/twitter-image"],
  },

  icons: {
    icon: [
      {
        url: "/icon",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/apple-icon",
        type: "image/png",
      },
    ],
  },

  manifest: "/manifest.webmanifest",

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0d9488",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#f6f9f9] text-slate-950 antialiased">
        {children}

        <LiveProjectAI mode="chatbot" />
      </body>
    </html>
  );
}