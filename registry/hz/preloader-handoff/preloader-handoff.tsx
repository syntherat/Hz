"use client";

import { useRef, type ComponentPropsWithoutRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

type PreloaderProps = ComponentPropsWithoutRef<"div"> & {
  duration?: number;
  ease?: string;
  overlap?: number;
  onDone?: () => void;
  // cover the nearest positioned parent instead of the viewport
  contained?: boolean;
};

// wrap the hero; anything inside marked data-handoff rises in as the preloader leaves
export function Preloader({
  duration = 1.6,
  ease = "power3.inOut",
  overlap = 0.3,
  onDone,
  contained = false,
  className = "",
  children,
  ...props
}: PreloaderProps) {
  const root = useRef<HTMLDivElement>(null);
  const cover = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(cover.current, { display: "none" });
        onDone?.();
        return;
      }
      const n = { value: 0 };
      gsap
        .timeline({ onComplete: onDone })
        .to(n, {
          value: 100,
          duration,
          ease: "power2.inOut",
          onUpdate: () => {
            count.current!.textContent = String(Math.round(n.value)).padStart(3, "0");
          },
        })
        .to("[data-bar]", { scaleX: 1, duration, ease: "power2.inOut" }, 0)
        .to(cover.current, { yPercent: -100, duration: 0.9, ease })
        // the hero starts before the cover is gone, so the two read as one move instead of two
        .from("[data-handoff]", { y: 48, opacity: 0, duration: 0.9, ease: "expo.out", stagger: 0.08 }, `-=${overlap}`)
        .set(cover.current, { display: "none" });
    },
    { scope: root, dependencies: [duration, ease, overlap], revertOnUpdate: true },
  );

  return (
    <div ref={root} className={className} {...props}>
      {children}
      <div
        ref={cover}
        data-preloader
        aria-hidden="true"
        className={`${contained ? "absolute" : "fixed"} inset-0 z-50 flex flex-col justify-end bg-neutral-950 p-6 text-neutral-100`}
      >
        <span ref={count} className="text-[clamp(64px,14vw,160px)] leading-none font-medium tabular-nums">
          000
        </span>
        <span data-bar style={{ transform: "scaleX(0)" }} className="mt-4 block h-px origin-left bg-current" />
      </div>
      {/* without javascript the cover would never lift */}
      <noscript>
        <style>{"[data-preloader]{display:none}"}</style>
      </noscript>
    </div>
  );
}
