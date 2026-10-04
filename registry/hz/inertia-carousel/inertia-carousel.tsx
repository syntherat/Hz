"use client";

import { useRef, type ComponentPropsWithoutRef } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(Draggable, InertiaPlugin, useGSAP);

type InertiaCarouselProps = ComponentPropsWithoutRef<"div"> & {
  throwResistance?: number;
  snap?: boolean;
  edgeResistance?: number;
};

const reduceMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

export function InertiaCarousel({
  throwResistance = 1000,
  snap = true,
  edgeResistance = 0.65,
  children,
  ...props
}: InertiaCarouselProps) {
  const root = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const drag = useRef<Draggable>(null);

  // distance between slide starts, so the gap is included whatever it is
  const step = () => {
    const [a, b] = Array.from(track.current!.children) as HTMLElement[];
    return b ? b.offsetLeft - a.offsetLeft : a?.offsetWidth || 1;
  };
  const minX = () => Math.min(0, viewport.current!.offsetWidth - track.current!.offsetWidth);
  const clampX = (x: number) => gsap.utils.clamp(minX(), 0, x);

  const { contextSafe } = useGSAP(
    () => {
      const el = track.current!;
      [drag.current] = Draggable.create(el, {
        type: "x",
        bounds: viewport.current,
        edgeResistance,
        inertia: !reduceMotion(),
        throwResistance,
        snap: snap ? (x: number) => Math.round(x / step()) * step() : undefined,
        onPress: () => gsap.killTweensOf(el),
      });

      // focus can scroll an overflow-hidden box; undo that and bring the slide into view instead
      const onFocus = (e: FocusEvent) => {
        const slide = Array.from(el.children).find((c) => c.contains(e.target as Node)) as HTMLElement | undefined;
        viewport.current!.scrollLeft = 0;
        if (!slide) return;
        const x = Number(gsap.getProperty(el, "x"));
        const left = slide.offsetLeft + x;
        if (left >= 0 && left + slide.offsetWidth <= viewport.current!.offsetWidth) return;
        moveTo(-slide.offsetLeft);
      };
      el.addEventListener("focusin", onFocus);
      return () => el.removeEventListener("focusin", onFocus);
    },
    { scope: root, dependencies: [throwResistance, snap, edgeResistance], revertOnUpdate: true },
  );

  const moveTo = contextSafe((x: number) => {
    gsap.to(track.current, {
      x: clampX(x),
      duration: reduceMotion() ? 0 : 0.6,
      ease: "expo.out",
      overwrite: true,
      onUpdate: () => drag.current?.update(),
    });
  });

  // the last stop is the end of the track, not a whole slide, so step off the current position
  const go = (dir: 1 | -1) => {
    const at = -Number(gsap.getProperty(track.current, "x")) / step();
    const i = dir > 0 ? Math.floor(at + 0.01) + 1 : Math.ceil(at - 0.01) - 1;
    moveTo(-i * step());
  };

  const button = "grid size-10 place-items-center rounded-lg border border-current/20 hover:border-current/50";

  return (
    <div ref={root} aria-roledescription="carousel" {...props}>
      <div ref={viewport} className="overflow-hidden touch-pan-y">
        <div ref={track} className="flex w-max gap-4">
          {children}
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <button type="button" aria-label="Previous slide" onClick={() => go(-1)} className={button}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button type="button" aria-label="Next slide" onClick={() => go(1)} className={button}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
