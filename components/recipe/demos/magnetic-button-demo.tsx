"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { MagneticButton } from "@/registry/hz/magnetic-button/magnetic-button";
import type { DemoProps } from "@/components/recipe/demos";

export function MagneticButtonDemo({ values, reduced, onReadout }: DemoProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const read = () => {
      const btn = wrap.current?.querySelector("button");
      if (!btn) return;
      const x = Number(gsap.getProperty(btn, "x"));
      const y = Number(gsap.getProperty(btn, "y"));
      setOffset((o) => (Math.abs(o.x - x) < 0.05 && Math.abs(o.y - y) < 0.05 ? o : { x, y }));
    };
    gsap.ticker.add(read);
    return () => gsap.ticker.remove(read);
  }, []);

  useEffect(() => {
    const sign = (n: number) => (n >= 0 ? "+" : "−");
    onReadout(`x ${sign(offset.x)}${Math.abs(offset.x).toFixed(1)}  y ${sign(-offset.y)}${Math.abs(offset.y).toFixed(1)}`);
  }, [offset, onReadout]);

  return (
    <div ref={wrap} className="relative h-14 w-[200px]">
      <div className="absolute inset-0 rounded-full border border-dashed border-[#5a5a60]" aria-hidden="true" />
      <MagneticButton
        key={reduced ? "still" : "live"}
        strength={reduced ? 0 : Number(values.strength)}
        duration={Number(values.duration)}
        ease={String(values.ease)}
        className="absolute inset-0 cursor-pointer rounded-full bg-ink text-base font-medium text-ground"
      >
        Get started
      </MagneticButton>
    </div>
  );
}
