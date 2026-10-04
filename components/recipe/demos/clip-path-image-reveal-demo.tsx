"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ClipReveal } from "@/registry/hz/clip-path-image-reveal/clip-path-image-reveal";
import type { DemoProps } from "@/components/recipe/demos";
import { Tool, Tools, unquote, useSettled, useTicker } from "@/components/recipe/demos/kit";

function Artwork() {
  return (
    <div className="relative h-full w-full bg-[radial-gradient(120%_90%_at_20%_10%,#2e2e33_0%,#18181b_45%,#0b0b0c_100%)]" role="img" aria-label="Abstract artwork: a sine wave over a dark gradient">
      <div className="dot-grid absolute inset-0 opacity-60" />
      <svg viewBox="0 0 400 220" className="absolute inset-0 h-full w-full" fill="none" aria-hidden="true">
        <path d="M0 110 Q 50 20 100 110 T 200 110 T 300 110 T 400 110" stroke="var(--color-signal)" strokeWidth="3" />
      </svg>
      <span className="absolute bottom-4 left-5 text-[56px] leading-none font-semibold tracking-[-0.06em]">Hz</span>
      <span className="absolute top-4 right-5 font-mono text-xs text-muted">PLATE 01</span>
    </div>
  );
}

export function ClipPathImageRevealDemo({ values, reduced, onReadout, tools }: DemoProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState(0);
  const [view, setView] = useSettled({ scale: 1, moving: false });

  useTicker(() => {
    const box = wrap.current?.firstElementChild?.firstElementChild;
    const media = box?.firstElementChild;
    if (!box || !media) return;
    setView({ scale: Math.round(Number(gsap.getProperty(media, "scale")) * 100) / 100, moving: gsap.isTweening(box) });
  });

  useEffect(() => {
    onReadout(reduced ? "SHOWN · no motion" : `${view.moving ? "REVEALING" : "SHOWN"} · scale ${view.scale.toFixed(2)}`);
  }, [reduced, view, onReadout]);

  return (
    <div ref={wrap} className="w-[min(420px,calc(100%-48px))] pb-10">
      {reduced ? (
        <div className="aspect-[40/22] overflow-hidden rounded-xl">
          <Artwork />
        </div>
      ) : (
        <ClipReveal
          key={run}
          from={unquote(values.from) as "bottom" | "left" | "center"}
          duration={Number(values.duration)}
          ease={String(values.ease)}
          scale={Number(values.scale)}
          className="aspect-[40/22] rounded-xl"
        >
          <Artwork />
        </ClipReveal>
      )}
      <Tools tools={tools}>
        <Tool onClick={() => setRun((r) => r + 1)}>Replay</Tool>
      </Tools>
    </div>
  );
}
