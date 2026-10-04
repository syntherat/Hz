"use client";

import { useRef, type ComponentPropsWithoutRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type ScrollHighlightProps = Omit<ComponentPropsWithoutRef<"p">, "children"> & {
  text: string;
  dimOpacity?: number;
  scrub?: boolean | number;
  start?: string;
  end?: string;
  scroller?: string | Element;
};

export function ScrollHighlight({
  text,
  dimOpacity = 0.2,
  scrub = true,
  start = "top 85%",
  end = "bottom 55%",
  scroller,
  ...props
}: ScrollHighlightProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = text.split(/\s+/).filter(Boolean);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // set first: with a stagger, words the scroll hasn't reached yet wouldn't get their start value
        gsap.set("[data-word]", { opacity: dimOpacity });
        // one tween across all words: the stagger spreads them along the scroll distance
        gsap.to("[data-word]", {
          opacity: 1,
          ease: "none",
          stagger: 0.1,
          scrollTrigger: { trigger: ref.current, scroller, start, end, scrub, invalidateOnRefresh: true },
        });
      });
    },
    { scope: ref, dependencies: [text, dimOpacity, scrub, start, end, scroller], revertOnUpdate: true },
  );

  // the sentence is read once by screen readers, not word by word
  return (
    <p ref={ref} {...props}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((w, i) => (
          <span key={i} data-word>
            {w}{" "}
          </span>
        ))}
      </span>
    </p>
  );
}
