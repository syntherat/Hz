"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { SquashToggle } from "@/registry/hz/squash-toggle/squash-toggle";
import type { DemoProps } from "@/components/recipe/demos";
import { useSettled, useTicker } from "@/components/recipe/demos/kit";

export function SquashToggleDemo({ values, reduced, onReadout }: DemoProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  const [view, setView] = useSettled({ sx: 1, sy: 1 });

  useTicker(() => {
    const k = wrap.current?.querySelector("button > span");
    if (k) setView({ sx: Math.round(Number(gsap.getProperty(k, "scaleX")) * 100) / 100, sy: Math.round(Number(gsap.getProperty(k, "scaleY")) * 100) / 100 });
  });

  useEffect(() => {
    onReadout(`${on ? "ON" : "OFF"} · scaleX ${view.sx.toFixed(2)} scaleY ${view.sy.toFixed(2)}`);
  }, [on, view, onReadout]);

  return (
    <div ref={wrap} className="flex items-center gap-6 pb-10">
      <label htmlFor="squash-demo" className="text-2xl font-medium tracking-[-0.03em]">
        Notifications
      </label>
      <div className="scale-150">
        <SquashToggle
          key={reduced ? "still" : "live"}
          id="squash-demo"
          checked={on}
          onCheckedChange={setOn}
          duration={reduced ? 0 : Number(values.duration)}
          ease={String(values.ease)}
          squash={reduced ? 0 : Number(values.squash)}
          className="cursor-pointer"
        />
      </div>
    </div>
  );
}
