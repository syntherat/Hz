import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// ios rounds the corners itself, so this one is a full square
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#0b0b0c" }}>
        <svg width="132" height="132" viewBox="0 0 32 32" fill="none">
          <path d="M5 16 Q 8.67 8 12.33 16 T 19.67 16 T 27 16" stroke="#ff4f00" strokeWidth="2.6" strokeLinecap="round" />
        </svg>
      </div>
    ),
    size,
  );
}
