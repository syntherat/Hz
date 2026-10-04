"use client";

import { useRef, type ComponentPropsWithoutRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

type ClipRevealProps = ComponentPropsWithoutRef<"div"> & {
  from?: "bottom" | "left" | "center";
  duration?: number;
  ease?: string;
  scale?: number;
  threshold?: number;
};

const hidden = {
  bottom: "inset(100% 0% 0% 0%)",
  left: "inset(0% 100% 0% 0%)",
  center: "inset(50% 50% 50% 50%)",
};

// wrap an image (or next/image, or video); the wrapper is clipped and the media inside scales down
export function ClipReveal({
  from = "bottom",
  duration = 1.2,
  ease = "expo.out",
  scale = 1.25,
  threshold = 0.3,
  className = "",
  children,
  ...props
}: ClipRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const clip = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const el = clip.current!;
      // both share one ease and duration, so the scale settles exactly as the wipe finishes
      const tl = gsap
        .timeline({ paused: true, defaults: { duration, ease } })
        .fromTo(el, { clipPath: hidden[from] }, { clipPath: "inset(0% 0% 0% 0%)" }, 0)
        .fromTo(el.firstElementChild, { scale }, { scale: 1 }, 0);

      const io = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          tl.play();
          io.disconnect();
        },
        { threshold },
      );
      // observe the outer box: chrome treats a fully clipped element as never intersecting
      io.observe(ref.current!);
      return () => io.disconnect();
    },
    { scope: ref, dependencies: [from, duration, ease, scale, threshold], revertOnUpdate: true },
  );

  return (
    <div ref={ref} className={className} {...props}>
      <div ref={clip} className="h-full w-full overflow-hidden rounded-[inherit]">
        {children}
      </div>
    </div>
  );
}
