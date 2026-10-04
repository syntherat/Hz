"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { SlidingTabs } from "@/registry/hz/sliding-tab-indicator/sliding-tab-indicator";
import type { DemoProps } from "@/components/recipe/demos";
import { useTicker } from "@/components/recipe/demos/kit";

const tabs = [
  { label: "Overview", content: "Every recipe ships a live stage, knobs and copyable code." },
  { label: "Knobs", content: "Knob values are prop defaults, so copied code is tuned code." },
  { label: "Install", content: "One command through the shadcn registry, or copy the file." },
  { label: "Notes", content: "Why it feels right: the ease, the timing, the interruption." },
].map((t) => ({ label: t.label, content: <p className="text-[15px] leading-[1.55] text-ink-2">{t.content}</p> }));

export function SlidingTabIndicatorDemo({ values, reduced, onReadout }: DemoProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [moving, setMoving] = useState(false);

  useTicker(() => {
    const el = wrap.current?.querySelector("[data-flip-id]");
    const next = !!el && gsap.isTweening(el);
    if (next !== moving) setMoving(next);
  });

  useEffect(() => {
    onReadout(`tab ${index + 1} / ${tabs.length} · ${moving ? "MOVING" : "AT REST"}`);
  }, [index, moving, onReadout]);

  return (
    <div ref={wrap} className="w-full max-w-[480px] px-4 pb-10 sm:px-6">
      <SlidingTabs
        key={reduced ? "still" : "live"}
        tabs={tabs}
        defaultIndex={index}
        onIndexChange={setIndex}
        duration={reduced ? 0 : Number(values.duration)}
        ease={String(values.ease)}
        className="text-ink [&_[role=tab]]:cursor-pointer [&_[role=tab]]:px-3 sm:[&_[role=tab]]:px-4 [&_[role=tabpanel]]:min-h-12 [&_[role=tabpanel]]:rounded-md"
      />
    </div>
  );
}
