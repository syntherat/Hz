"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollHighlight } from "@/registry/hz/scroll-read-highlight/scroll-read-highlight";
import type { DemoProps } from "@/components/recipe/demos";
import { Filler, ScrollBox, unquote, useSettled, useTicker } from "@/components/recipe/demos/kit";

const text =
  "Good motion is measured. It starts quickly, lands softly, and gets out of the way. It answers the hand that moved it, it can be stopped halfway, and it stays still for anyone who asks it to.";

export function ScrollReadHighlightDemo({ values, reduced, onReadout, tools }: DemoProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const [view, setView] = useSettled({ lit: 0, total: 0 });

  useTicker(() => {
    const words = Array.from(wrap.current?.querySelectorAll<HTMLElement>("[data-word]") ?? []);
    setView({ lit: words.filter((w) => Number(gsap.getProperty(w, "opacity")) > 0.95).length, total: words.length });
  });

  useEffect(() => {
    onReadout(reduced ? "ALL LIT · no scroll link" : `${view.lit} / ${view.total} words lit`);
  }, [reduced, view, onReadout]);

  const scrub = values.scrub === "true" ? true : Number(values.scrub);

  return (
    <div ref={wrap} className="contents">
      <ScrollBox tools={tools} autoDuration={6}>
        {(scroller) => (
          <>
            <Filler label="Page content above" height={200} />
            {reduced ? (
              <p className="px-5 text-[22px] leading-[1.35] font-medium tracking-[-0.03em] sm:text-[26px]">{text}</p>
            ) : (
              <ScrollHighlight
                text={text}
                scroller={scroller}
                dimOpacity={Number(values.dimOpacity)}
                scrub={scrub}
                end={unquote(values.end)}
                className="px-5 text-[22px] leading-[1.35] font-medium tracking-[-0.03em] sm:text-[26px]"
              />
            )}
            <Filler label="Page content below" height={220} />
          </>
        )}
      </ScrollBox>
    </div>
  );
}
