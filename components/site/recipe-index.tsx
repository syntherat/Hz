"use client";

import { useState } from "react";
import { recipes, sections, type Section } from "@/content/recipes";
import { RecipeCard } from "@/components/site/recipe-card";

type Filter = "All" | Section;

export function RecipeIndex() {
  const [filter, setFilter] = useState<Filter>("All");
  const [readyOnly, setReadyOnly] = useState(false);

  const shown = recipes.filter((r) => (filter === "All" || r.section === filter) && (!readyOnly || r.ready));
  const filters: { label: Filter; count: number }[] = [
    { label: "All", count: recipes.length },
    ...sections.map((s) => ({ label: s, count: recipes.filter((r) => r.section === s).length })),
  ];

  return (
    <section id="recipes" className="mx-auto flex max-w-[1280px] flex-col gap-7 px-4 pt-16 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <span className="eyebrow">Index · {recipes.length}</span>
          <h2 className="text-[40px] leading-none font-medium tracking-[-0.04em]">Recipes</h2>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex h-11 cursor-pointer items-center gap-2 text-sm text-ink-2">
            <input
              type="checkbox"
              checked={readyOnly}
              onChange={(e) => setReadyOnly(e.target.checked)}
              className="size-4 accent-ink"
            />
            Ready only
          </label>
          <div role="group" aria-label="Filter by section" className="-mx-4 flex gap-1 overflow-x-auto px-4 sm:mx-0 sm:rounded-xl sm:border sm:border-hairline sm:bg-surface sm:p-1">
            {filters.map((f) => {
              const on = f.label === filter;
              return (
                <button
                  key={f.label}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setFilter(f.label)}
                  className={`h-10 flex-none rounded-lg px-3.5 text-sm ${on ? "bg-ink text-ground" : "text-ink hover:bg-hairline"}`}
                >
                  {f.label}{" "}
                  <span className={`font-mono text-xs ${on ? "text-[#5a5a60]" : "text-muted"}`}>{f.count}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {shown.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-hairline px-6 py-16 text-center">
          <span className="eyebrow">Nothing here yet</span>
          <p className="max-w-md text-ink-2">
            No finished recipes in {filter === "All" ? "this view" : filter} yet. More ship in batches after launch.
          </p>
          <button type="button" onClick={() => setReadyOnly(false)} className="h-10 rounded-lg border border-hairline px-4 text-sm hover:bg-surface">
            Show upcoming recipes too
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
          {shown.map((r) => (
            <RecipeCard key={r.slug} recipe={r} />
          ))}
        </div>
      )}
    </section>
  );
}
