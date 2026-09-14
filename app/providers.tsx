"use client";

import { ReactNode } from "react";
import PageTransition from "@/components/PageTransition";
import LiveProjectAI from "@/components/liveproject-ai";
import ScrollToTop from "@/components/ScrollToTop";

export default function Providers({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <ScrollToTop />
      <PageTransition>{children}</PageTransition>
      <LiveProjectAI mode="chatbot" />
    </>
  );
}