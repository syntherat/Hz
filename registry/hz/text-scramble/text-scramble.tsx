"use client";

import { useRef, type ComponentPropsWithoutRef } from "react";
import gsap from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrambleTextPlugin, useGSAP);

type TextScrambleProps = Omit<ComponentPropsWithoutRef<"span">, "children"> & {
  text: string;
  duration?: number;
  revealDelay?: number;
  chars?: string;
};

export function TextScramble({
  text,
  duration = 1,
  revealDelay = 0.3,
  chars = "upperCase",
  ...props
}: TextScrambleProps) {
  const ref = useRef<HTMLSpanElement>(null);
  // react renders the first text once (for the server and no-js); after that gsap owns the node
  const first = useRef(text).current;

  useGSAP(
    () => {
      const el = ref.current!;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        el.textContent = text;
        return;
      }
      // starts from whatever is showing, so a new text mid-scramble picks up where the old one was
      gsap.to(el, {
        duration,
        ease: "none",
        overwrite: true,
        scrambleText: { text, chars, revealDelay, speed: 0.5 },
      });
    },
    { dependencies: [text, duration, revealDelay, chars] },
  );

  // screen readers get the final text once, not every scrambled frame
  return (
    <span {...props}>
      <span className="sr-only">{text}</span>
      <span ref={ref} aria-hidden="true">
        {first}
      </span>
    </span>
  );
}
