"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ImageTrail } from "@/registry/hz/cursor-image-trail/cursor-image-trail";
import { curvePath } from "@/lib/eases";
import type { DemoProps } from "@/components/recipe/demos";
import { useSettled, useTicker } from "@/components/recipe/demos/kit";

const plates = ["expo.out", "back.out(1.7)", "power3.inOut", "elastic.out(1, 0.3)", "sine.inOut", "bounce.out"];

const items = plates.map((ease, i) => (
  <div key={ease} className={`flex h-[132px] w-[104px] flex-col justify-between rounded-lg p-2.5 shadow-xl ring-1 ring-line-strong ring-inset ${i % 2 ? "bg-fill-2" : "bg-fill-1"}`}>
    <span className="font-mono text-[10px] text-muted">0{i + 1}</span>
    <svg viewBox="0 -30 240 150" fill="none" className="h-14 w-full" aria-hidden="true">
      <path d={curvePath(ease)} stroke="var(--color-signal)" strokeWidth="6" />
    </svg>
    <span className="truncate font-mono text-[10px] text-ink-2">{ease}</span>
  </div>
));

export function CursorImageTrailDemo({ values, reduced, onReadout }: DemoProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const [view, setView] = useSettled({ visible: 0, drops: 0 });

  useTicker(() => {
    const tiles = Array.from(wrap.current?.querySelectorAll("[data-trail]") ?? []);
    setView({
      visible: tiles.filter((t) => Number(gsap.getProperty(t, "opacity")) > 0.01).length,
      drops: Math.max(0, ...tiles.map((t) => Number(gsap.getProperty(t, "zIndex")) || 0)),
    });
  });

  useEffect(() => {
    onReadout(reduced ? "OFF · no trail" : `${view.drops} dropped · ${view.visible} on screen`);
  }, [reduced, view, onReadout]);

  const hint = (
    <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
      <span className="font-mono text-xs text-muted">EVERY {values.threshold}PX</span>
      <p className="max-w-[300px] text-ink-2">Move the pointer across the stage. Fast moves leave a denser trail.</p>
    </div>
  );

  return (
    <div ref={wrap} className="absolute inset-x-2 top-10 bottom-[92px] sm:bottom-[56px]">
      {reduced ? (
        hint
      ) : (
        <ImageTrail
          items={items}
          threshold={Number(values.threshold)}
          duration={Number(values.duration)}
          ease={String(values.ease)}
          className="h-full rounded-[10px]"
        >
          {hint}
        </ImageTrail>
      )}
    </div>
  );
}
