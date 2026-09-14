// components/ProtectedRoute.tsx

"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";

type ProtectedRouteProps = {
  children: ReactNode;
};

export default function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const session = sessionStorage.getItem("liveproject_session");

    if (!session) {
      router.replace("/login");
      return;
    }

    try {
      const user = JSON.parse(session);

      if (!user.loggedIn) {
        router.replace("/login");
        return;
      }

      setChecking(false);
    } catch {
      router.replace("/login");
    }
  }, [router]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <LoaderCircle
            className="animate-spin text-[#0b5cff]"
            size={32}
          />

          <p className="text-sm font-medium text-slate-500">
            Checking your session...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}