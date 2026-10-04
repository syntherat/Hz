"use client";

import { useRef, type ComponentPropsWithoutRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type PinnedGalleryProps = ComponentPropsWithoutRef<"section"> & {
  scrub?: boolean | number;
  scrollLength?: number;
  snap?: boolean;
  scroller?: string | Element;
};

export function PinnedGallery({
  scrub = 1,
  scrollLength = 1,
  snap = false,
  scroller,
  className = "",
  children,
  ...props
}: PinnedGalleryProps) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const wrap = section.current!;
        const el = track.current!;
        const panels = Array.from(el.children) as HTMLElement[];
        const distance = () => el.scrollWidth - wrap.clientWidth;
        // panel edges as progress values, so snapping works for any panel width
        const stops = () => panels.map((p) => Math.min(1, p.offsetLeft / distance()));

        const tween = gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: wrap,
            scroller,
            start: "top top",
            end: () => "+=" + distance() * scrollLength,
            pin: true,
            scrub,
            snap: snap ? (p: number) => gsap.utils.snap(stops(), p) : undefined,
            invalidateOnRefresh: true,
          },
        });

        // tabbing into a hidden panel scrolls the section sideways; turn that into page scroll instead
        const onFocus = (e: FocusEvent) => {
          const i = panels.findIndex((p) => p.contains(e.target as Node));
          const st = tween.scrollTrigger;
          if (i < 0 || !st) return;
          wrap.scrollLeft = 0;
          st.scroll(st.start + (st.end - st.start) * stops()[i]);
        };
        wrap.addEventListener("focusin", onFocus);
        return () => wrap.removeEventListener("focusin", onFocus);
      });
    },
    { scope: section, dependencies: [scrub, scrollLength, snap, scroller], revertOnUpdate: true },
  );

  return (
    <section ref={section} className={`overflow-x-auto motion-safe:overflow-hidden ${className}`} {...props}>
      <div ref={track} className="flex w-max">
        {children}
      </div>
    </section>
  );
}
