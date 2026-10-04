"use client";

import { useEffect, useRef, useState } from "react";
import { Accordion } from "@/registry/hz/height-auto-accordion/height-auto-accordion";
import type { DemoProps } from "@/components/recipe/demos";
import { useTicker } from "@/components/recipe/demos/kit";

const faq = [
  ["What does it depend on?", ["gsap and @gsap/react. Nothing else.", "No CSS framework is required for the motion itself."]],
  ["Does it work with server rendering?", ["Yes. Nothing touches window until the component mounts.", "Panels render closed on the server."]],
  ["What about reduced motion?", ["Panels open instantly.", "Contents appear without the fade.", "Nothing else changes."]],
  ["Can more than one be open?", ["Pass multiple and each panel opens on its own."]],
] as const;

const items = faq.map(([title, lines]) => ({
  title: <span className="text-[17px] font-medium tracking-[-0.02em]">{title}</span>,
  content: lines.map((l) => (
    <p key={l} className="text-[15px] leading-[1.6] text-ink-2">
      {l}
    </p>
  )),
}));

export function HeightAutoAccordionDemo({ values, reduced, onReadout }: DemoProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<number[]>([]);
  const [height, setHeight] = useState(0);

  useTicker(() => {
    const panels = Array.from(wrap.current?.querySelectorAll<HTMLElement>("[data-panel]") ?? []);
    const h = Math.round(panels.reduce((sum, p) => sum + p.getBoundingClientRect().height, 0));
    if (h !== height) setHeight(h);
  });

  useEffect(() => {
    onReadout(`${open.length ? `item ${open[0] + 1} OPEN` : "ALL CLOSED"} · height ${height}px`);
  }, [open, height, onReadout]);

  return (
    <div ref={wrap} className="absolute inset-x-4 top-11 bottom-[96px] overflow-y-auto sm:inset-x-10 sm:bottom-[60px]">
      <Accordion
        key={reduced ? "still" : "live"}
        items={items}
        onOpenChange={setOpen}
        duration={reduced ? 0 : Number(values.duration)}
        stagger={reduced ? 0 : Number(values.stagger)}
        ease={String(values.ease)}
        className="mx-auto max-w-[520px] text-ink [&_button]:cursor-pointer [&_button]:font-sans"
      />
    </div>
  );
}
