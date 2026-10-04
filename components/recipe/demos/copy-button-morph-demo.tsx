"use client";

import { useEffect, useRef, useState } from "react";
import { CopyButton } from "@/registry/hz/copy-button-morph/copy-button-morph";
import type { DemoProps } from "@/components/recipe/demos";
import { useTicker } from "@/components/recipe/demos/kit";

const command = "npm i gsap @gsap/react";

export function CopyButtonMorphDemo({ values, reduced, onReadout }: DemoProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const [state, setState] = useState("IDLE");

  useTicker(() => {
    const next = wrap.current?.querySelector("button")?.getAttribute("aria-label") === "Copied" ? "COPIED" : "IDLE";
    if (next !== state) setState(next);
  });

  useEffect(() => {
    onReadout(`${state} · reset after ${Number(values.resetAfter).toFixed(1)}s`);
  }, [state, values.resetAfter, onReadout]);

  return (
    <div ref={wrap} className="flex items-center gap-2 rounded-xl border border-hairline bg-console py-2 pr-2 pl-4 font-mono text-sm sm:text-base">
      <span className="text-muted">$</span>
      <span className="mr-2">{command}</span>
      <CopyButton
        key={reduced ? "still" : "live"}
        text={command}
        duration={reduced ? 0 : Number(values.duration)}
        ease={String(values.ease)}
        resetAfter={Number(values.resetAfter)}
        className="grid size-11 cursor-pointer place-items-center rounded-lg border border-hairline text-ink hover:border-line-strong"
      />
    </div>
  );
}
