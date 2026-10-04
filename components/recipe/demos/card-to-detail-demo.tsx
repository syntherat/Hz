"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { CardToDetail } from "@/registry/hz/card-to-detail/card-to-detail";
import { getRecipe } from "@/content/recipes";
import type { DemoProps } from "@/components/recipe/demos";
import { useTicker } from "@/components/recipe/demos/kit";

const cards = ["magnetic-button", "pinned-horizontal-gallery", "inertia-carousel"].map((s) => getRecipe(s)!);

export function CardToDetailDemo({ values, reduced, onReadout }: DemoProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [moving, setMoving] = useState(false);

  useTicker(() => {
    const next = Array.from(wrap.current?.querySelectorAll("article") ?? []).some((a) => gsap.isTweening(a));
    if (next !== moving) setMoving(next);
  });

  useEffect(() => {
    onReadout(`${open ? `OPEN · ${open}` : "CLOSED"}${moving ? " · MOVING" : ""}`);
  }, [open, moving, onReadout]);

  return (
    <div
      ref={wrap}
      key={reduced ? "still" : "live"}
      className="absolute inset-x-4 top-11 bottom-[96px] grid grid-cols-1 content-start gap-2 sm:grid-cols-3 sm:gap-3 sm:inset-x-6 sm:bottom-[60px]"
    >
      {cards.map((r, i) => (
        <CardToDetail
          key={r.id}
          title={<span className="text-lg leading-tight font-medium tracking-[-0.03em] sm:text-[22px]">{r.name}</span>}
          summary={<span className="font-mono text-[11px] text-muted">{r.id} · {r.plugins}</span>}
          onOpenChange={(o) => setOpen(o ? r.id : null)}
          duration={reduced ? 0 : Number(values.duration)}
          ease={String(values.ease)}
          className={`flex min-h-[72px] flex-col gap-1 rounded-xl p-4 sm:min-h-[180px] sm:gap-2 ring-1 ring-hairline ring-inset ${i % 2 ? "bg-fill-2" : "bg-fill-1"}`}
        >
          <div className="mt-2 flex max-w-[460px] flex-col gap-3">
            <p className="text-[15px] leading-[1.55] text-ink-2">{r.summary}</p>
            <p className="font-mono text-xs text-muted">ease {r.ease}</p>
            <div className="h-px bg-hairline" />
            <p className="text-sm leading-[1.55] text-ink-2">
              The card grows from where it sat into the full panel, so the eye never loses it. Close it or press Escape to send it back.
            </p>
          </div>
        </CardToDetail>
      ))}
    </div>
  );
}
