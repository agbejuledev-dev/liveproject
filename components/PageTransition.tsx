"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function PageTransition({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(false);

    const frame = requestAnimationFrame(() => {
      setVisible(true);
    });

    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return (
    <>
      <div
        aria-hidden="true"
        className={`pointer-events-none fixed left-0 top-0 z-[9998] h-[2px] bg-teal-500 transition-all duration-500 ${
          visible ? "w-0 opacity-0" : "w-full opacity-100"
        }`}
      />

      <div
        className={`min-h-screen transition-[opacity,transform] duration-300 ease-out ${
          visible
            ? "translate-y-0 opacity-100"
            : "translate-y-[3px] opacity-0"
        }`}
      >
        {children}
      </div>
    </>
  );
}