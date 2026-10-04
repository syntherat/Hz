"use client";

import { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollDraw } from "@/registry/hz/svg-line-draw/svg-line-draw";
import type { DemoProps } from "@/components/recipe/demos";
import { Filler, ScrollBox, unquote, useSettled, useTicker } from "@/components/recipe/demos/kit";

function Drawing() {
  return (
    <svg viewBox="0 0 480 200" fill="none" strokeLinecap="round" className="h-auto w-full" aria-hidden="true">
      <path d="M10 100 Q 50 20 90 100 T 170 100 T 250 100 T 330 100 T 410 100 T 470 100" stroke="var(--color-signal)" strokeWidth="3" />
      <path d="M10 160 C 120 160 140 40 240 40 S 360 160 470 160" stroke="var(--color-ink-2)" strokeWidth="2" />
      <path d="M10 186 H 470" stroke="var(--color-line-strong)" strokeWidth="2" />
    </svg>
  );
}

export function SvgLineDrawDemo({ values, reduced, onReadout, tools }: DemoProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const [view, setView] = useSettled({ p: 0 });

  useTicker(() => {
    const el = wrap.current?.querySelector("[data-draw]");
    const st = ScrollTrigger.getAll().find((t) => t.trigger === el);
    setView({ p: Math.round((st?.progress ?? 0) * 100) / 100 });
  });

  useEffect(() => {
    onReadout(reduced ? "DRAWN · no scroll link" : `progress ${view.p.toFixed(2)}`);
  }, [reduced, view, onReadout]);

  return (
    <div ref={wrap} className="contents">
      <ScrollBox tools={tools} autoDuration={5}>
        {(scroller) => (
          <>
            <Filler label="Page content above" height={190} />
            <div className="px-5">
              {reduced ? (
                <Drawing />
              ) : (
                <ScrollDraw
                  data-draw
                  scroller={scroller}
                  from={unquote(values.from) as "start" | "middle"}
                  scrub={values.scrub === "true" ? true : Number(values.scrub)}
                  stagger={Number(values.stagger)}
                >
                  <Drawing />
                </ScrollDraw>
              )}
            </div>
            <Filler label="Page content below" height={220} />
          </>
        )}
      </ScrollBox>
    </div>
  );
}
