import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#16150f",
          padding: "90px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 22,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#a39d8a",
          }}
        >
          Photographe · Bruxelles
        </div>
        <div style={{ display: "flex", fontSize: 104, color: "#f8f6f0", marginTop: 22 }}>
          Ilias Remchani
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 26,
            color: "#c96a4d",
            marginTop: 24,
            letterSpacing: 6,
          }}
        >
          BE112
        </div>
      </div>
    ),
    size
  );
}
