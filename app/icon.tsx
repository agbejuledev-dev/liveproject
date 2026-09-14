// app/icon.tsx

import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 512,
  height: 512,
};

export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: 112,
        }}
      >
        <div
          style={{
            width: 300,
            height: 300,
            borderRadius: 78,
            background: "#2dd4bf",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#061f1e",
            fontSize: 170,
            fontWeight: 900,
            boxShadow: "0 30px 80px rgba(45,212,191,.22)",
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
