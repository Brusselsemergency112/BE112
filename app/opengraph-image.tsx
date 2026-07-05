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
          background: "#14130e",
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
          Photographie documentaire · Bruxelles
        </div>
        <div style={{ display: "flex", fontSize: 88, color: "#f7f4ec", marginTop: 26 }}>
          Brussels Emergency 112
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 24,
            color: "#c96a4d",
            marginTop: 26,
            letterSpacing: 4,
          }}
        >
          par Ilias Remchani
        </div>
      </div>
    ),
    size
  );
}
