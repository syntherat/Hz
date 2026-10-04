"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Curve } from "@/components/curve";
import { easeFn } from "@/lib/eases";
import { FrameRate } from "@/components/recipe/frame-rate";

gsap.registerPlugin(useGSAP);

const lines = ["Calm is", "a craft,", "not a setting."];
const DURATION = 0.6;
const STAGGER = 0.08;

export function HeroStage() {
  const root = useRef<HTMLDivElement>(null);
  const [t, setT] = useState(0);

  useGSAP(
    () => {
      const words = gsap.utils.toArray<HTMLElement>("[data-line]");
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setT(1);
        return;
      }
      const tl = gsap.timeline({
        repeat: -1,
        repeatDelay: 1.6,
        onUpdate: () => setT(tl.time()),
      });
      tl.fromTo(words, { yPercent: 105 }, { yPercent: 0, duration: DURATION, ease: "expo.out", stagger: STAGGER });
      tl.to(words, { yPercent: -105, duration: 0.4, ease: "power3.in", stagger: 0.04 }, "+=1.4");
    },
    { scope: root },
  );

  const total = DURATION + STAGGER * (lines.length - 1);
  const rise = Math.min(t, total) / total;
  const p = easeFn("expo.out")(Math.min(t / DURATION, 1));

  return (
    <div ref={root} className="min-w-0 flex-[1_1_520px] rounded-[20px] border border-hairline bg-surface p-2">
      <div className="dot-grid relative flex h-[400px] flex-col justify-center overflow-hidden rounded-[14px] bg-stage px-6 sm:px-10">
        <div className="absolute inset-x-4 top-3.5 flex justify-between font-mono text-xs text-muted">
          <span>R02 · LINE-MASK HEADLINE</span>
          <span className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-signal" />
            LIVE
          </span>
        </div>
        <div className="text-[40px] leading-[1.05] font-medium tracking-[-0.045em] sm:text-[52px]" aria-label={lines.join(" ")}>
          {lines.map((line) => (
            <div key={line} className="overflow-hidden pb-[0.06em]" aria-hidden="true">
              <div data-line className="will-change-transform">
                {line}
              </div>
            </div>
          ))}
        </div>
        <Curve ease="expo.out" strokeWidth={3} marker={{ t: Math.min(t / DURATION, 1), p }} className="absolute top-12 right-5 hidden h-[76px] w-[140px] sm:block" />
        <div className="absolute inset-x-4 bottom-3.5 flex flex-col gap-2">
          <div className="h-[3px] rounded-full bg-line-strong">
            <div className="h-[3px] rounded-full bg-ink" style={{ width: `${rise * 100}%` }} />
          </div>
          <div className="flex justify-between font-mono text-xs text-muted">
            <span>
              t {Math.min(t, total).toFixed(2)} / {total.toFixed(2)}s · stagger {STAGGER}
            </span>
            <span>
              expo.out · <FrameRate />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
