"use client";

import { useRef, type ComponentPropsWithoutRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

type OdometerProps = Omit<ComponentPropsWithoutRef<"span">, "children"> & {
  value: number;
  duration?: number;
  stagger?: number;
  ease?: string;
};

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

export function Odometer({
  value,
  duration = 1,
  stagger = 0.05,
  ease = "power3.out",
  className = "",
  ...props
}: OdometerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  // per column, keyed by place: where it is now (can be mid-roll), where it's headed, and the value it shows
  const columns = useRef(new Map<number, { pos: number; target: number; last: number }>());
  const n = Math.max(0, Math.round(value));
  const places = String(n).length;

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const tl = gsap.timeline();
      for (let place = 0; place < places; place++) {
        const strip = ref.current!.querySelector<HTMLElement>(`[data-place="${place}"]`)!;
        const col = columns.current.get(place) ?? { pos: 0, target: 0, last: 0 };
        columns.current.set(place, col);
        const next = Math.floor(n / 10 ** place);
        const delta = next - col.last;
        col.last = next;
        // big jumps spin at most one extra lap, so the last digit still lands right without a blur
        const laps = Math.abs(delta) >= 10 ? 10 : 0;
        col.target += Math.sign(delta) * ((Math.abs(delta) % 10) + laps);
        const render = () => gsap.set(strip, { yPercent: (-100 / 11) * (((col.pos % 10) + 10) % 10) });
        tl.to(col, { pos: col.target, duration: reduce ? 0 : duration, ease, overwrite: "auto", onUpdate: render }, reduce ? 0 : place * stagger);
      }
      for (const place of columns.current.keys()) if (place >= places) columns.current.delete(place);
    },
    { scope: ref, dependencies: [n, duration, stagger, ease] },
  );

  return (
    <span ref={ref} className={`inline-flex tabular-nums ${className}`} {...props}>
      <span className="sr-only">{n}</span>
      {Array.from({ length: places }, (_, i) => places - 1 - i).map((place) => (
        <span key={place} aria-hidden="true" className="relative inline-block h-[1em] overflow-hidden leading-none">
          <span data-place={place} className="flex flex-col">
            {DIGITS.map((d, i) => (
              <span key={i} className="h-[1em] leading-none">
                {d}
              </span>
            ))}
          </span>
        </span>
      ))}
    </span>
  );
}
