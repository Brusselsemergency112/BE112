import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
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
          background: "#16150f",
          color: "#f8f6f0",
          fontSize: 24,
          fontWeight: 700,
          letterSpacing: "-1px",
        }}
      >
        112
      </div>
    ),
    size
  );
}
