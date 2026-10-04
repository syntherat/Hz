"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { VelocityMarquee } from "@/registry/hz/velocity-marquee/velocity-marquee";
import type { DemoProps } from "@/components/recipe/demos";
import { Filler, ScrollBox, Tool, Tools, useSettled, useTicker } from "@/components/recipe/demos/kit";

const words = ["Motion", "measured", "Ease", "Timing", "Interruption", "Reduced motion"];

function Words() {
  return words.map((w) => (
    <span key={w} className="flex items-center gap-6 pr-6 text-[40px] font-medium tracking-[-0.04em] whitespace-nowrap">
      {w}
      <svg width="22" height="12" viewBox="0 0 22 12" fill="none" aria-hidden="true">
        <path d="M1 6 Q 4.5 0 8 6 T 15 6 T 21 6" stroke="var(--color-signal)" strokeWidth="1.6" />
      </svg>
    </span>
  ));
}

export function VelocityMarqueeDemo({ values, reduced, onReadout, tools }: DemoProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const [view, setView] = useSettled({ ts: 1, skew: 0 });

  useTicker(() => {
    const lean = wrap.current?.querySelector<HTMLElement>("[data-marquee] > div");
    const track = lean?.firstElementChild;
    if (!lean || !track) return;
    const ts = gsap.getTweensOf(track).find((t) => t.repeat() === -1)?.timeScale() ?? 0;
    setView({ ts: Math.round(ts * 100) / 100, skew: Math.round(Number(gsap.getProperty(lean, "skewX")) * 10) / 10 });
  });

  useEffect(() => {
    onReadout(reduced ? "STATIC ROW · no loop" : `timeScale ${view.ts.toFixed(2)} · skew ${view.skew.toFixed(1)}°`);
  }, [reduced, view, onReadout]);

  const fastScroll = () => {
    const scroller = wrap.current?.querySelector<HTMLElement>("[data-marquee]")?.parentElement;
    if (!scroller) return;
    const max = scroller.scrollHeight - scroller.clientHeight;
    gsap.to(scroller, { scrollTop: scroller.scrollTop > max / 2 ? 0 : max, duration: 0.5, ease: "power2.inOut" });
  };

  return (
    <div ref={wrap} className="contents">
      <ScrollBox tools={tools} autoDuration={6} bottom="bottom-[136px]">
        {(scroller) => (
          <>
            <Filler label="Page content above" height={160} />
            {reduced ? (
              <div data-marquee className="flex overflow-x-auto border-y border-hairline py-5">
                <Words />
              </div>
            ) : (
              <VelocityMarquee
                data-marquee
                scroller={scroller}
                speed={Number(values.speed)}
                boost={Number(values.boost)}
                maxSkew={Number(values.maxSkew)}
                className="border-y border-hairline py-5 [&>button]:cursor-pointer [&>button]:font-mono"
              >
                <Words />
              </VelocityMarquee>
            )}
            <Filler label="Page content below" height={200} />
          </>
        )}
      </ScrollBox>
      <Tools tools={tools}>
        <Tool onClick={fastScroll} primary>
          Fast scroll
        </Tool>
      </Tools>
    </div>
  );
}
