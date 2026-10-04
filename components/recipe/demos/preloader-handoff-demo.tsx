"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Preloader } from "@/registry/hz/preloader-handoff/preloader-handoff";
import type { DemoProps } from "@/components/recipe/demos";
import { Tool, Tools, useTicker } from "@/components/recipe/demos/kit";

export function PreloaderHandoffDemo({ values, reduced, onReadout, tools }: DemoProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState(0);
  const [phase, setPhase] = useState("COUNTING 000");

  useTicker(() => {
    const cover = wrap.current?.querySelector<HTMLElement>("[data-preloader]");
    if (!cover) return;
    const y = Number(gsap.getProperty(cover, "yPercent"));
    const next =
      reduced || getComputedStyle(cover).display === "none"
        ? "DONE"
        : y < -0.5
          ? "HANDOFF"
          : `COUNTING ${cover.firstElementChild?.textContent ?? ""}`;
    if (next !== phase) setPhase(next);
  });

  useEffect(() => {
    onReadout(`${phase} · overlap ${Number(values.overlap).toFixed(1)}s`);
  }, [phase, values.overlap, onReadout]);

  const hero = (
    <div className="flex h-full flex-col justify-center gap-3 bg-ground px-6 sm:px-10">
      <span data-handoff className="font-mono text-xs text-muted">
        R24 · STUDIO SITE
      </span>
      <h3 data-handoff className="text-[40px] leading-[1.02] font-medium tracking-[-0.045em] sm:text-[52px]">
        Motion, measured.
      </h3>
      <p data-handoff className="max-w-[380px] text-ink-2">
        The counter hands off to the hero: the headline starts rising before the cover has gone.
      </p>
    </div>
  );

  return (
    <div ref={wrap} className="absolute inset-x-4 top-11 bottom-[96px] overflow-hidden rounded-[10px] ring-1 ring-hairline sm:inset-x-6 sm:bottom-[60px]">
      {reduced ? (
        <>
          {hero}
          <span data-preloader className="hidden" />
        </>
      ) : (
        <Preloader
          key={run}
          contained
          duration={Number(values.duration)}
          ease={String(values.ease)}
          overlap={Number(values.overlap)}
          className="h-full [&>[data-preloader]]:bg-fill-2 [&>[data-preloader]]:text-ink"
        >
          {hero}
        </Preloader>
      )}
      <Tools tools={tools}>
        <Tool onClick={() => setRun((r) => r + 1)}>Replay</Tool>
      </Tools>
    </div>
  );
}
