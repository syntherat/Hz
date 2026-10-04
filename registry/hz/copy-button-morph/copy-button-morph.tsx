"use client";

import { useRef, useState, type ComponentPropsWithoutRef } from "react";
import gsap from "gsap";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(MorphSVGPlugin, useGSAP);

type CopyButtonProps = Omit<ComponentPropsWithoutRef<"button">, "children" | "onClick"> & {
  text: string;
  duration?: number;
  ease?: string;
  resetAfter?: number;
};

const CLIPBOARD = "M9 3.5h6v3H9z M8 5H6v15.5h12V5h-2";
const CHECK = "M5 12.5l4.5 4.5L19 7";

export function CopyButton({
  text,
  duration = 0.5,
  ease = "back.out(1.7)",
  resetAfter = 1.5,
  ...props
}: CopyButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const tl = useRef<gsap.core.Timeline>(null);
  const [copied, setCopied] = useState(false);
  const { contextSafe } = useGSAP({ scope: ref });

  const copy = contextSafe(() => {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopied(true);
    const d = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 1;
    // a new click kills the old run; morphSVG starts from whatever shape is on screen
    tl.current?.kill();
    tl.current = gsap
      .timeline()
      .to("path", { morphSVG: CHECK, duration: duration * d, ease }, 0)
      .fromTo("svg", { scale: 1 - 0.25 * d }, { scale: 1, duration: duration * d, ease }, 0)
      .to("path", { morphSVG: CLIPBOARD, duration: 0.3 * d, ease: "power2.inOut" }, `+=${resetAfter}`)
      .call(() => setCopied(false));
  });

  return (
    <button ref={ref} type="button" onClick={copy} aria-label={copied ? "Copied" : "Copy to clipboard"} {...props}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d={CLIPBOARD} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span role="status" className="sr-only">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </button>
  );
}
