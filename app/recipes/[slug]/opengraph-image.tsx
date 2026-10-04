import { ImageResponse } from "next/og";
import { getRecipe, recipes } from "@/content/recipes";
import { OgCard, ogFonts, ogSize } from "@/lib/og";
import { shortInstallCommand } from "@/lib/site";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Hz recipe preview";

export function generateStaticParams() {
  return recipes.map((r) => ({ slug: r.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const recipe = getRecipe(slug) ?? recipes[0];

  return new ImageResponse(
    (
      <OgCard
        eyebrow={`${recipe.id} · ${recipe.section.toUpperCase()}`}
        title={recipe.name}
        ease={recipe.ease}
        meta={`${recipe.plugins} · GSAP for Next.js`}
        command={shortInstallCommand(recipe.slug)}
      />
    ),
    { ...size, fonts: await ogFonts() },
  );
}
