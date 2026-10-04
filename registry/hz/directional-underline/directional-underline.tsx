"use client";

import { useRef, type ComponentPropsWithoutRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

type DirectionalLinkProps = ComponentPropsWithoutRef<"a"> & {
  duration?: number;
  ease?: string;
};

export function DirectionalLink({
  duration = 0.4,
  ease = "power3.out",
  className = "",
  children,
  ...props
}: DirectionalLinkProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const line = useRef<HTMLSpanElement>(null);
  // visible part of the line as two edges (0 = left, 1 = right), so a reversal mid-move never jumps
  const edges = useRef({ l: 0, r: 0 });

  useGSAP(
    () => {
      const el = ref.current!;
      const e = edges.current;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const render = () => gsap.set(line.current, { clipPath: `inset(0 ${(1 - e.r) * 100}% 0 ${e.l * 100}%)` });
      const to = (l: number, r: number) =>
        gsap.to(e, { l, r, duration: reduce ? 0 : duration, ease, overwrite: true, onUpdate: render });
      const sideOf = (ev: PointerEvent) => {
        const box = el.getBoundingClientRect();
        return ev.clientX < box.left + box.width / 2 ? 0 : 1;
      };

      const show = (from: number) => {
        if (e.r - e.l < 0.001) e.l = e.r = from;
        to(0, 1);
      };
      const hide = (toward: number) => to(toward, toward);

      const enter = (ev: PointerEvent) => show(sideOf(ev));
      // a keyboard user still on the link keeps the line
      const leave = (ev: PointerEvent) => el.matches(":focus-visible") || hide(sideOf(ev));
      const focus = () => el.matches(":focus-visible") && show(0);
      const blur = () => el.matches(":hover") || hide(1);

      render();
      el.addEventListener("pointerenter", enter);
      el.addEventListener("pointerleave", leave);
      el.addEventListener("focus", focus);
      el.addEventListener("blur", blur);
      return () => {
        el.removeEventListener("pointerenter", enter);
        el.removeEventListener("pointerleave", leave);
        el.removeEventListener("focus", focus);
        el.removeEventListener("blur", blur);
      };
    },
    { scope: ref, dependencies: [duration, ease], revertOnUpdate: true },
  );

  return (
    <a ref={ref} className={`relative inline-block ${className}`} {...props}>
      {children}
      <span
        ref={line}
        aria-hidden="true"
        style={{ clipPath: "inset(0 100% 0 0)" }}
        className="pointer-events-none absolute inset-x-0 -bottom-0.5 h-px bg-current"
      />
    </a>
  );
}
