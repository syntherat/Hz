import type { CSSProperties } from "react";
import Link from "next/link";
import { Curve } from "@/components/curve";
import { eases, shortEaseName } from "@/lib/eases";
import type { Recipe } from "@/content/recipes";

export function RecipeCard({ recipe, duration = 1 }: { recipe: Recipe; duration?: number }) {
  const dot = { "--dur": `${duration}s`, "--ease": eases[recipe.ease]?.css ?? "linear" } as CSSProperties;
  return (
    <Link
      href={`/recipes/${recipe.slug}`}
      className="group flex flex-col rounded-2xl border border-hairline bg-surface p-1.5 transition-colors hover:border-line-strong"
    >
      <div className="dot-grid relative flex h-[168px] items-center justify-center rounded-[11px] bg-stage">
        <span className="absolute top-2.5 left-3 font-mono text-xs text-muted">{recipe.id}</span>
        <span className="absolute top-2.5 right-3 font-mono text-xs text-muted">{shortEaseName(recipe.ease)}</span>
        <div className="relative h-[94px] w-[150px]">
          <Curve ease={recipe.ease} className="size-full" />
          <span className="curve-dot" style={dot} aria-hidden="true">
            <span />
          </span>
        </div>
        {!recipe.ready && (
          <span className="absolute bottom-2.5 left-3 rounded border border-hairline bg-ground px-1.5 font-mono text-[11px] text-muted">
            soon
          </span>
        )}
      </div>
      <div className="flex flex-col gap-2.5 px-2.5 pt-3.5 pb-2.5">
        <span className="text-base font-medium tracking-[-0.01em]">{recipe.name}</span>
        <span className="flex justify-between gap-2 font-mono text-xs text-muted">
          <span>{recipe.plugins}</span>
          <span>{recipe.section}</span>
        </span>
      </div>
    </Link>
  );
}
