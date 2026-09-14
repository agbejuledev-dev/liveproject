// app/apple-icon.tsx

import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#061f1e",
          borderRadius: 42,
        }}
      >
        <div
          style={{
            width: 112,
            height: 112,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 30,
            background: "#2dd4bf",
            color: "#061f1e",
            fontSize: 48,
            fontWeight: 900,
            letterSpacing: "-3px",
          }}
        >
          LP
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}