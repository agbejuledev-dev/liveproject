// app/twitter-image.tsx

import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "LiveProject";

export const size = {
  width: 1200,
  height: 600,
};

export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          background: "#061f1e",
          color: "white",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.3,
            backgroundImage:
              "linear-gradient(rgba(45,212,191,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(45,212,191,.08) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            maxWidth: "1000px",
          }}
        >
          <div
            style={{
              width: "76px",
              height: "76px",
              borderRadius: "22px",
              background: "#2dd4bf",
              color: "#061f1e",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "32px",
              fontWeight: 900,
              marginBottom: "25px",
            }}
          >
            LP
          </div>

          <div
            style={{
              fontSize: "58px",
              lineHeight: 1.05,
              fontWeight: 900,
              letterSpacing: "-2px",
            }}
          >
            LiveProject
          </div>

          <div
            style={{
              marginTop: "20px",
              fontSize: "29px",
              color: "#5eead4",
              fontWeight: 700,
            }}
          >
            Build Verified Experience. Get Hired.
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}