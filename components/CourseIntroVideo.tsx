"use client";

import { useState } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Video,
} from "lucide-react";

type CourseIntroVideoProps = {
  title: string;
  description: string;
  videoUrl?: string;
  posterUrl?: string;
};

function getYouTubeId(url: string) {
  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.replace("/", "");
    }

    if (parsed.hostname.includes("youtube.com")) {
      return parsed.searchParams.get("v") || "";
    }

    return "";
  } catch {
    return "";
  }
}

export default function CourseIntroVideo({
  title,
  description,
  videoUrl,
  posterUrl,
}: CourseIntroVideoProps) {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  const youtubeId = videoUrl ? getYouTubeId(videoUrl) : "";

  return (
    <section className="overflow-hidden rounded-[2rem] border border-black/6 bg-white shadow-sm">
      <div className="border-b border-black/5 px-5 py-5 sm:px-6">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-teal-700">
          <Video size={13} />
          Course Introduction
        </div>

        <h3 className="mt-2 text-xl font-black tracking-tight text-slate-950">
          What this course is about
        </h3>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
          {description}
        </p>
      </div>

      <div className="relative aspect-video overflow-hidden bg-[#071f1f]">
        {youtubeId ? (
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1&playsinline=1`}
            title={`${title} introduction video`}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : videoUrl ? (
          <video
            className="h-full w-full object-cover"
            controls
            preload="metadata"
            poster={posterUrl}
            muted={muted}
            autoPlay={false}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support video playback.
          </video>
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center bg-cover bg-center"
            style={{
              backgroundImage: posterUrl
                ? `linear-gradient(rgba(3,25,24,.7),rgba(3,25,24,.86)), url("${posterUrl}")`
                : "linear-gradient(135deg,#073b39,#061f1e)",
            }}
          >
            <div className="px-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-300 text-slate-950 shadow-2xl">
                <Play size={25} fill="currentColor" />
              </div>

              <h4 className="mt-5 text-lg font-black text-white">
                Introduction video coming soon
              </h4>

              <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-slate-400">
                This short video will explain what {title} covers, what you
                will learn and how the course can benefit your career.
              </p>
            </div>
          </div>
        )}
      </div>

      {videoUrl && !youtubeId && (
        <div className="flex items-center justify-between border-t border-black/5 px-5 py-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            {playing ? (
              <>
                <Pause size={13} />
                Playing introduction
              </>
            ) : (
              <>
                <Play size={13} />
                Course introduction
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMuted((value) => !value)}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition hover:bg-slate-200"
              aria-label={muted ? "Unmute video" : "Mute video"}
            >
              {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>

            <button
              type="button"
              onClick={() => {
                const video = document.querySelector(
                  "video"
                ) as HTMLVideoElement | null;

                video?.requestFullscreen?.();
              }}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition hover:bg-slate-200"
              aria-label="Fullscreen video"
            >
              <Maximize size={14} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}