"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { StackingCards } from "@/registry/hz/stacking-cards/stacking-cards";
import type { DemoProps } from "@/components/recipe/demos";
import { Filler, ScrollBox, useSettled, useTicker } from "@/components/recipe/demos/kit";

const titles = ["Prepare", "Measure", "Tune", "Ship"];

export function StackingCardsDemo({ values, reduced, onReadout, tools }: DemoProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const [view, setView] = useSettled({ scale: 1, under: 0 });

  useTicker(() => {
    const cards = Array.from(wrap.current?.querySelectorAll<HTMLElement>("[data-stack] > div") ?? []);
    if (!cards.length) return;
    const scale = Math.round(Number(gsap.getProperty(cards[0], "scale")) * 1000) / 1000;
    const under = cards.slice(0, -1).filter((c) => Number(gsap.getProperty(c, "scale")) < 0.999).length;
    setView({ scale, under });
  });

  useEffect(() => {
    onReadout(reduced ? "STICKY ONLY · no scaling" : `${view.under} under · card 1 scale ${view.scale.toFixed(3)}`);
  }, [reduced, view, onReadout]);

  return (
    <div ref={wrap} className="contents">
      <ScrollBox tools={tools} autoDuration={6}>
        {(scroller) => (
          <>
            <Filler label="Page content above" height={120} />
            <StackingCards
              key={reduced ? "still" : "live"}
              data-stack
              scroller={scroller}
              scaleStep={reduced ? 0 : Number(values.scaleStep)}
              offset={Number(values.offset)}
              dim={!reduced && values.dim === "true"}
              top={16}
              className="flex flex-col gap-16 px-4 pb-6"
            >
              {titles.map((t, i) => (
                <div
                  key={t}
                  className={`flex h-[150px] flex-col justify-between rounded-xl p-5 ring-1 ring-hairline ring-inset ${i % 2 ? "bg-fill-2" : "bg-fill-1"}`}
                >
                  <span className="font-mono text-xs text-muted">0{i + 1} / 04</span>
                  <span className="text-[28px] font-medium tracking-[-0.04em]">{t}</span>
                </div>
              ))}
            </StackingCards>
            <Filler label="Page content below" height={260} />
          </>
        )}
      </ScrollBox>
    </div>
  );
}
