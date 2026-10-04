"use client";

import { useEffect, useState } from "react";
import { TextScramble } from "@/registry/hz/text-scramble/text-scramble";
import type { DemoProps } from "@/components/recipe/demos";
import { Tool, Tools, unquote, useClock } from "@/components/recipe/demos/kit";

const texts = ["Motion, measured.", "Signal acquired.", "Tuned by hand.", "Ready to ship."];

export function TextScrambleDemo({ values, reduced, onReadout, tools }: DemoProps) {
  const [i, setI] = useState(0);
  const duration = reduced ? 0 : Number(values.duration);
  const t = useClock(duration, i);

  useEffect(() => {
    onReadout(`${t < duration ? "DECODING" : "SETTLED"} · t ${t.toFixed(2)} / ${duration.toFixed(2)}s`);
  }, [t, duration, onReadout]);

  return (
    <div className="flex flex-col items-center gap-3 px-6 pb-10 text-center">
      <span className="font-mono text-xs text-muted">STATUS</span>
      <TextScramble
        key={reduced ? "still" : "live"}
        text={texts[i]}
        duration={duration}
        revealDelay={Number(values.revealDelay)}
        chars={unquote(values.chars)}
        className="font-mono text-[32px] font-medium tracking-[-0.03em] sm:text-[44px]"
      />
      <Tools tools={tools}>
        <Tool onClick={() => setI((n) => (n + 1) % texts.length)} primary>
          Next text
        </Tool>
      </Tools>
    </div>
  );
}
