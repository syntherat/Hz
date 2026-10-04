import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { curvePath } from "@/lib/eases";

export const ogSize = { width: 1200, height: 630 };

const fontDir = join(process.cwd(), "node_modules/geist/dist/fonts");

export async function ogFonts() {
  const [sans, mono] = await Promise.all([
    readFile(join(fontDir, "geist-sans/Geist-Medium.ttf")),
    readFile(join(fontDir, "geist-mono/GeistMono-Regular.ttf")),
  ]);
  return [
    { name: "Geist", data: sans, weight: 500 as const, style: "normal" as const },
    { name: "Geist Mono", data: mono, weight: 400 as const, style: "normal" as const },
  ];
}

type OgCardProps = {
  eyebrow: string;
  title: string;
  ease: string;
  meta: string;
  command: string;
};

export function OgCard({ eyebrow, title, ease, meta, command }: OgCardProps) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 64,
        background: "#0b0b0c",
        color: "#ededea",
        fontFamily: "Geist",
        backgroundImage: "radial-gradient(#1f1f23 1.5px, transparent 1.5px)",
        backgroundSize: "24px 24px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 44, letterSpacing: "-0.06em" }}>
          Hz
          <svg width="44" height="24" viewBox="0 0 22 12" fill="none">
            <path d="M1 6 Q 4.5 0 8 6 T 15 6 T 21 6" stroke="#ff4f00" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </div>
        <div style={{ fontFamily: "Geist Mono", fontSize: 22, color: "#8e8e93", letterSpacing: "0.06em" }}>{eyebrow}</div>
      </div>

      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 48 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 640 }}>
          <div style={{ fontSize: 92, lineHeight: 0.98, letterSpacing: "-0.05em" }}>{title}</div>
          <div style={{ fontFamily: "Geist Mono", fontSize: 24, color: "#b4b4b8" }}>{meta}</div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            padding: 20,
            borderRadius: 20,
            background: "#18181b",
            border: "1px solid #26262a",
          }}
        >
          <svg width="340" height="212" viewBox="0 -30 240 150" fill="none">
            <line x1="0" y1="110" x2="240" y2="110" stroke="#2e2e33" />
            <line x1="0" y1="10" x2="240" y2="10" stroke="#2e2e33" strokeDasharray="3 4" />
            <path d={curvePath(ease)} stroke="#ff4f00" strokeWidth="3" strokeLinejoin="round" />
          </svg>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "Geist Mono", fontSize: 18, color: "#8e8e93" }}>
            <span>{ease}</span>
            <span>60.0 Hz</span>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          fontFamily: "Geist Mono",
          fontSize: 22,
          color: "#ededea",
          borderTop: "1px solid #26262a",
          paddingTop: 28,
        }}
      >
        <span style={{ color: "#8e8e93" }}>$</span>
        {command}
      </div>
    </div>
  );
}
