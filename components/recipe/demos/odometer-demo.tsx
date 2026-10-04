"use client";

import { useEffect, useState } from "react";
import { Odometer } from "@/registry/hz/odometer/odometer";
import type { DemoProps } from "@/components/recipe/demos";
import { Tool, Tools, useClock } from "@/components/recipe/demos/kit";

export function OdometerDemo({ values, reduced, onReadout, tools }: DemoProps) {
  const [value, setValue] = useState(1284);
  const duration = reduced ? 0 : Number(values.duration);
  const stagger = reduced ? 0 : Number(values.stagger);
  const total = duration + stagger * (String(value).length - 1);
  const t = useClock(total, value);

  useEffect(() => {
    onReadout(`value ${value} · t ${Math.min(t, total).toFixed(2)} / ${total.toFixed(2)}s`);
  }, [value, t, total, onReadout]);

  return (
    <div className="flex flex-col items-center gap-3 pb-10">
      <span className="font-mono text-xs text-muted">ORDERS TODAY</span>
      <Odometer
        key={reduced ? "still" : "live"}
        value={value}
        duration={duration}
        stagger={stagger}
        ease={String(values.ease)}
        className="text-[88px] font-medium tracking-[-0.04em] sm:text-[112px]"
      />
      <Tools tools={tools}>
        <Tool onClick={() => setValue((v) => v + 1)}>+1</Tool>
        <Tool onClick={() => setValue((v) => v + 27)}>+27</Tool>
        <Tool onClick={() => setValue((v) => Math.max(0, v - 27))}>-27</Tool>
        <Tool onClick={() => setValue(Math.floor(Math.random() * 9900) + 100)} primary>
          Random
        </Tool>
      </Tools>
    </div>
  );
}
