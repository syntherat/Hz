"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { FlipFilterGrid } from "@/registry/hz/flip-filter-grid/flip-filter-grid";
import { recipes } from "@/content/recipes";
import type { DemoProps } from "@/components/recipe/demos";
import { useTicker } from "@/components/recipe/demos/kit";

const tagOf = { Micro: "Micro", "Layout & scroll": "Scroll", "Physics & delight": "Physics" } as const;
const picks = recipes.filter((_, i) => [0, 2, 4, 6, 8, 11, 14, 16, 19, 22].includes(i));
const items = picks.map((r, i) => ({
  id: r.id,
  tag: tagOf[r.section],
  content: (
    <div className={`flex h-[64px] flex-col justify-between rounded-lg p-2.5 ring-1 ring-hairline ring-inset sm:h-[76px] ${i % 2 ? "bg-fill-2" : "bg-fill-1"}`}>
      <span className="font-mono text-[11px] text-muted">{r.id}</span>
      <span className="truncate text-[13px] font-medium">{r.name}</span>
    </div>
  ),
}));

export function FlipFilterGridDemo({ values, reduced, onReadout }: DemoProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState({ tag: "All", count: items.length });
  const [moving, setMoving] = useState(false);

  useTicker(() => {
    const next = Array.from(wrap.current?.querySelectorAll("li") ?? []).some((li) => gsap.isTweening(li));
    if (next !== moving) setMoving(next);
  });

  useEffect(() => {
    onReadout(`${shown.tag} · ${shown.count} / ${items.length} · ${moving ? "MOVING" : "AT REST"}`);
  }, [shown, moving, onReadout]);

  return (
    <div ref={wrap} className="absolute inset-x-4 top-11 bottom-[96px] overflow-hidden sm:inset-x-6 sm:bottom-[60px]">
      <FlipFilterGrid
        key={reduced ? "still" : "live"}
        items={items}
        tags={["Micro", "Scroll", "Physics"]}
        onFilterChange={(tag, count) => setShown({ tag, count })}
        duration={reduced ? 0 : Number(values.duration)}
        stagger={reduced ? 0 : Number(values.stagger)}
        ease={String(values.ease)}
        className="text-ink [&_button]:cursor-pointer [&_button]:font-mono [&_button]:text-xs sm:[&_ul]:grid-cols-[repeat(auto-fill,minmax(112px,1fr))]"
      />
    </div>
  );
}
