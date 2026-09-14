"use client";

import { useEffect } from "react";
import {
  AlertCircle,
  Check,
  Info,
  X,
} from "lucide-react";

export type ToastType = "success" | "error" | "info";

type ToastProps = {
  show: boolean;
  type?: ToastType;
  title: string;
  message?: string;
  duration?: number;
  onClose: () => void;
};

export default function Toast({
  show,
  type = "success",
  title,
  message,
  duration = 2500,
  onClose,
}: ToastProps) {
  useEffect(() => {
    if (!show) return;

    const timer = window.setTimeout(() => {
      onClose();
    }, duration);

    return () => window.clearTimeout(timer);
  }, [show, duration, onClose]);

  if (!show) return null;

  const config = {
    success: {
      icon: Check,
      iconClass: "bg-emerald-50 text-emerald-600",
      progressClass: "bg-emerald-500",
    },
    error: {
      icon: AlertCircle,
      iconClass: "bg-red-50 text-red-600",
      progressClass: "bg-red-500",
    },
    info: {
      icon: Info,
      iconClass: "bg-blue-50 text-blue-600",
      progressClass: "bg-blue-500",
    },
  }[type];

  const Icon = config.icon;

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[9999] w-[calc(100vw-2.5rem)] max-w-sm sm:bottom-7 sm:right-7">
      <div className="pointer-events-auto animate-[toast-in_0.3s_ease-out] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/10">
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${config.iconClass}`}
            >
              <Icon className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-black text-slate-950">
                {title}
              </p>

              {message && (
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  {message}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close notification"
              className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="h-1 w-full bg-slate-100">
          <div
            className={`h-full origin-left animate-[toast-progress_2.5s_linear_forwards] ${config.progressClass}`}
            style={{
              animationDuration: `${duration}ms`,
            }}
          />
        </div>
      </div>
    </div>
  );
}