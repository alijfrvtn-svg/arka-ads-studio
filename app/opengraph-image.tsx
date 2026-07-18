import { ImageResponse } from "next/og";
import { SITE } from "@/lib/constants";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = SITE.nameEn;

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "80px",
          background: "linear-gradient(135deg, #04060d 0%, #0d1526 100%)",
          color: "#f5f8fe",
        }}
      >
        <div style={{ display: "flex", fontSize: 40, fontWeight: 700, color: "#6699ff", letterSpacing: 4, textTransform: "uppercase" }}>
          {SITE.nameEn}
        </div>
        <div style={{ display: "flex", marginTop: 24, fontSize: 64, fontWeight: 800, lineHeight: 1.15, maxWidth: 980 }}>
          Creative Production &amp; Digital Marketing Studio
        </div>
        <div style={{ display: "flex", marginTop: 28, fontSize: 30, color: "#9aa3ad" }}>{SITE.sloganEn}</div>
      </div>
    ),
    { ...size }
  );
}
