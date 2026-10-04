"use client";

import { useRef, type ComponentPropsWithoutRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(SplitText, useGSAP);

type LineMaskHeadlineProps = ComponentPropsWithoutRef<"h2"> & {
  duration?: number;
  stagger?: number;
  ease?: string;
};

export function LineMaskHeadline({
  duration = 0.9,
  stagger = 0.08,
  ease = "expo.out",
  children,
  ...props
}: LineMaskHeadlineProps) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // autoSplit re-splits when fonts load or the width changes; returning the tween lets it carry progress over
      SplitText.create(ref.current, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        onSplit: (self) => gsap.from(self.lines, { yPercent: 105, duration, ease, stagger }),
      });
    },
    { scope: ref, dependencies: [duration, stagger, ease], revertOnUpdate: true },
  );

  return (
    <h2 ref={ref} {...props}>
      {children}
    </h2>
  );
}
