"use client";

import { useRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

type ImageTrailProps = ComponentPropsWithoutRef<"div"> & {
  items: ReactNode[];
  threshold?: number;
  duration?: number;
  ease?: string;
};

// items are reused in turn, so a handful of images makes an endless trail
export function ImageTrail({
  items,
  threshold = 80,
  duration = 0.8,
  ease = "power3.out",
  className = "",
  children,
  ...props
}: ImageTrailProps) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const box = root.current!;
      const pool = gsap.utils.toArray<HTMLElement>("[data-trail]");
      let next = 0;
      let z = 1;
      let last: { x: number; y: number } | null = null;

      const move = (e: PointerEvent) => {
        const b = box.getBoundingClientRect();
        const x = e.clientX - b.left;
        const y = e.clientY - b.top;
        if (!last) last = { x, y };
        const dx = x - last.x;
        const dy = y - last.y;
        // drop by distance, not time: slow moves leave a sparse trail, fast ones a dense one
        if (Math.hypot(dx, dy) < threshold) return;
        last = { x, y };

        const el = pool[next++ % pool.length];
        gsap.killTweensOf(el);
        gsap.set(el, { x, y, xPercent: -50, yPercent: -50, zIndex: z++, opacity: 1, scale: 0.6, rotate: gsap.utils.random(-6, 6) });
        gsap
          .timeline()
          // a little drift along the direction of travel, so the trail feels thrown, not stamped
          .to(el, { x: x + dx * 0.4, y: y + dy * 0.4, scale: 1, duration: duration * 0.6, ease })
          .to(el, { opacity: 0, scale: 0.85, duration: duration * 0.4, ease: "power2.in" }, duration * 0.45);
      };
      const leave = () => {
        last = null;
      };

      box.addEventListener("pointermove", move);
      box.addEventListener("pointerleave", leave);
      return () => {
        box.removeEventListener("pointermove", move);
        box.removeEventListener("pointerleave", leave);
      };
    },
    { scope: root, dependencies: [items.length, threshold, duration, ease], revertOnUpdate: true },
  );

  return (
    <div ref={root} className={`relative overflow-hidden ${className}`} {...props}>
      {children}
      {items.map((item, i) => (
        <div key={i} data-trail aria-hidden="true" className="pointer-events-none absolute top-0 left-0 opacity-0">
          {item}
        </div>
      ))}
    </div>
  );
}
