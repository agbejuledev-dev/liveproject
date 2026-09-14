
"use client";

import type { MouseEvent, ReactNode } from "react";

type Props = {
  path: string;
  children: ReactNode;
  className?: string;
};

export default function ProtectedLink({
  path,
  children,
  className,
}: Props) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();

    try {
      const rawSession = sessionStorage.getItem("liveproject_session");
      const session = rawSession ? JSON.parse(rawSession) : null;

      if (session?.loggedIn) {
        window.location.href = path;
        return;
      }

      sessionStorage.setItem("liveproject_after_auth", path);
    } catch {
      try {
        sessionStorage.setItem("liveproject_after_auth", path);
      } catch {}
    }

    window.location.href = "/register";
  }

  return (
    <a
      href={path}
      className={className}
      onClick={handleClick}
    >
      {children}
    </a>
  );
}
