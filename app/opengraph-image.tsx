import { ImageResponse } from "next/og";
import { recipes } from "@/content/recipes";
import { OgCard, ogFonts, ogSize } from "@/lib/og";
import { site } from "@/lib/site";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Hz: Motion, measured.";

export default async function Image() {
  return new ImageResponse(
    (
      <OgCard
        eyebrow={`GSAP · NEXT.JS · ${recipes.length} RECIPES`}
        title={site.tagline}
        ease="expo.out"
        meta="Interaction recipes. Tuned, explained, copy-ready."
        command={`npx shadcn add ${site.url}/r/...`}
      />
    ),
    { ...size, fonts: await ogFonts() },
  );
}
