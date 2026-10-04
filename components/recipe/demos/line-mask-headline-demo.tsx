"use client";

import { useEffect, useRef, useState } from "react";
import { LineMaskHeadline } from "@/registry/hz/line-mask-headline/line-mask-headline";
import type { DemoProps } from "@/components/recipe/demos";
import { Tool, Tools, useClock, useTicker } from "@/components/recipe/demos/kit";

export function LineMaskHeadlineDemo({ values, reduced, onReadout, tools }: DemoProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState(0);
  const [lines, setLines] = useState(3);
  const duration = Number(values.duration);
  const stagger = Number(values.stagger);
  const total = duration + stagger * (lines - 1);
  const t = useClock(total, `${run}-${duration}-${stagger}-${values.ease}`);

  useTicker(() => {
    const n = wrap.current?.querySelector("h2")?.children.length ?? 0;
    if (n && n !== lines) setLines(n);
  });

  useEffect(() => {
    onReadout(reduced ? "STATIC · no motion" : `${lines} lines · t ${Math.min(t, total).toFixed(2)} / ${total.toFixed(2)}s`);
  }, [reduced, lines, t, total, onReadout]);

  return (
    <div ref={wrap} className="w-full max-w-[560px] px-6 pb-10">
      {reduced ? (
        <h2 className="text-[40px] leading-[1.05] font-medium tracking-[-0.045em] sm:text-[52px]">Calm is a craft, not a setting.</h2>
      ) : (
        <LineMaskHeadline
          key={run}
          duration={duration}
          stagger={stagger}
          ease={String(values.ease)}
          className="text-[40px] leading-[1.05] font-medium tracking-[-0.045em] sm:text-[52px]"
        >
          Calm is a craft, not a setting.
        </LineMaskHeadline>
      )}
      <Tools tools={tools}>
        <Tool onClick={() => setRun((r) => r + 1)}>Replay</Tool>
      </Tools>
    </div>
  );
}
