// app/opengraph-image.tsx

import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt =
  "LiveProject — Learn. Work on Live Projects. Build Verified Experience. Get Hired.";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          background: "#061f1e",
          color: "#ffffff",
          padding: "70px 80px",
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
            position: "absolute",
            right: "-120px",
            top: "-150px",
            width: "520px",
            height: "520px",
            borderRadius: "999px",
            background: "rgba(45,212,191,.14)",
            filter: "blur(70px)",
          }}
        />

        <div
          style={{
            position: "absolute",
            left: "-120px",
            bottom: "-180px",
            width: "460px",
            height: "460px",
            borderRadius: "999px",
            background: "rgba(34,211,238,.08)",
            filter: "blur(70px)",
          }}
        />

        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            gap: "18px",
          }}
        >
          <div
            style={{
              width: "62px",
              height: "62px",
              borderRadius: "18px",
              background: "#2dd4bf",
              color: "#061f1e",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px",
              fontWeight: 900,
            }}
          >
            LP
          </div>

          <span
            style={{
              fontSize: "34px",
              fontWeight: 800,
            }}
          >
            LiveProject
          </span>
        </div>

        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            marginTop: "55px",
            maxWidth: "990px",
          }}
        >
          <div
            style={{
              fontSize: "62px",
              lineHeight: 1.04,
              fontWeight: 900,
              letterSpacing: "-3px",
            }}
          >
            Learn. Work on Live Projects.
          </div>

          <div
            style={{
              marginTop: "12px",
              fontSize: "62px",
              lineHeight: 1.04,
              fontWeight: 900,
              letterSpacing: "-3px",
              color: "#5eead4",
            }}
          >
            Build Verified Experience.
          </div>

          <div
            style={{
              marginTop: "25px",
              fontSize: "28px",
              color: "#cbd5e1",
              fontWeight: 500,
            }}
          >
            Get Hired.
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: "52px",
            left: "80px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            color: "#94a3b8",
            fontSize: "19px",
          }}
        >
          Real-world projects • Professional learning • Career opportunities
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}