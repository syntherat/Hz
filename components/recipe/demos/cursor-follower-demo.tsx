"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { CursorFollower } from "@/registry/hz/cursor-follower/cursor-follower";
import type { DemoProps } from "@/components/recipe/demos";
import { useSettled, useTicker } from "@/components/recipe/demos/kit";

export function CursorFollowerDemo({ values, reduced, onReadout }: DemoProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const size = Number(values.size);
  const [view, setView] = useSettled({ x: 0, y: 0, w: 0, h: 0 });

  useTicker(() => {
    const dot = wrap.current?.querySelector("[data-follower] > [aria-hidden]");
    if (!dot) return;
    const g = (p: string) => Math.round(Number(gsap.getProperty(dot, p)));
    setView({ x: g("x"), y: g("y"), w: g("width"), h: g("height") });
  });

  useEffect(() => {
    if (reduced) return onReadout("OFF · native cursor only");
    onReadout(`${view.w > size + 1 ? `WRAPPING ${view.w}×${view.h}` : "FOLLOWING"} · x ${view.x} y ${view.y}`);
  }, [reduced, view, size, onReadout]);

  const content = (
    <div className="flex h-full flex-col items-center justify-center gap-6 p-6 text-ink">
      <p className="max-w-[360px] text-center text-ink-2">Move the mouse around. Over a button or link, the dot wraps it.</p>
      <div className="flex flex-wrap justify-center gap-3">
        <button type="button" className="h-11 rounded-xl bg-ink px-5 text-sm font-medium text-ground">
          Get started
        </button>
        <button type="button" className="h-11 rounded-full border border-hairline px-5 text-sm">
          Read the docs
        </button>
      </div>
      <a href="#" onClick={(e) => e.preventDefault()} className="font-mono text-xs text-muted hover:text-ink">
        hz.dev/r/cursor-follower
      </a>
    </div>
  );

  return (
    <div ref={wrap} className="absolute inset-x-4 top-11 bottom-[96px] sm:inset-x-6 sm:bottom-[60px]">
      {reduced ? (
        content
      ) : (
        <CursorFollower
          data-follower
          duration={Number(values.duration)}
          ease={String(values.ease)}
          size={size}
          className="h-full text-signal"
        >
          {content}
        </CursorFollower>
      )}
    </div>
  );
}
