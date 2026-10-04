"use client";

import { useRef, type ComponentPropsWithoutRef } from "react";
import gsap from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(DrawSVGPlugin, ScrollTrigger, useGSAP);

type ScrollDrawProps = ComponentPropsWithoutRef<"div"> & {
  from?: "start" | "middle" | "end";
  scrub?: boolean | number;
  stagger?: number;
  start?: string;
  end?: string;
  scroller?: string | Element;
};

const origin = { start: "0% 0%", middle: "50% 50%", end: "100% 100%" };

// wrap an inline <svg>; every stroked path, line and polyline in it draws as you scroll
export function ScrollDraw({
  from = "start",
  scrub = true,
  stagger = 0,
  start = "top 80%",
  end = "bottom 40%",
  scroller,
  children,
  ...props
}: ScrollDrawProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // set first: with a stagger, later strokes wouldn't get their start value until their turn
        gsap.set("path, line, polyline", { drawSVG: origin[from] });
        gsap.to("path, line, polyline", {
          drawSVG: "0% 100%",
          // the scroll is the ease, so the line moves exactly as fast as the reader does
          ease: "none",
          stagger,
          scrollTrigger: { trigger: ref.current, scroller, start, end, scrub, invalidateOnRefresh: true },
        });
      });
    },
    { scope: ref, dependencies: [from, scrub, stagger, start, end, scroller], revertOnUpdate: true },
  );

  return (
    <div ref={ref} {...props}>
      {children}
    </div>
  );
}
