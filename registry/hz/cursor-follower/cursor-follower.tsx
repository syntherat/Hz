"use client";

import { useRef, type ComponentPropsWithoutRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

type CursorFollowerProps = ComponentPropsWithoutRef<"div"> & {
  duration?: number;
  ease?: string;
  size?: number;
  padding?: number;
  targets?: string;
};

// follows the mouse inside this wrapper; wrap the whole page or a single section
export function CursorFollower({
  duration = 0.5,
  ease = "power3.out",
  size = 12,
  padding = 6,
  targets = "a, button, [data-cursor]",
  className = "",
  children,
  ...props
}: CursorFollowerProps) {
  const root = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const box = root.current!;
      const el = dot.current!;
      gsap.set(el, { xPercent: -50, yPercent: -50, width: size, height: size, borderRadius: size });
      const xTo = gsap.quickTo(el, "x", { duration, ease });
      const yTo = gsap.quickTo(el, "y", { duration, ease });
      let target: HTMLElement | null = null;
      let visible = false;

      const shape = (t: HTMLElement | null) => {
        const r = t?.getBoundingClientRect();
        const radius = t ? parseFloat(getComputedStyle(t).borderTopLeftRadius) + padding : size;
        gsap.to(el, { width: r ? r.width + padding * 2 : size, height: r ? r.height + padding * 2 : size, borderRadius: radius, duration, ease, overwrite: "auto" });
        gsap.to(el.firstElementChild, { opacity: t ? 0 : 1, duration: 0.2, overwrite: true });
      };

      const move = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        const b = box.getBoundingClientRect();
        const hit = (e.target as Element).closest<HTMLElement>(targets);
        const t = hit && box.contains(hit) ? hit : null;
        if (t !== target) shape((target = t));
        // over a target it sits on the target's center, nudged slightly toward the pointer
        const r = t?.getBoundingClientRect();
        const x = r ? r.left + r.width / 2 + (e.clientX - r.left - r.width / 2) * 0.1 : e.clientX;
        const y = r ? r.top + r.height / 2 + (e.clientY - r.top - r.height / 2) * 0.1 : e.clientY;
        // the first move jumps straight to the pointer instead of flying in from the corner
        xTo(x - b.left, visible ? undefined : x - b.left);
        yTo(y - b.top, visible ? undefined : y - b.top);
        if (!visible) gsap.to(el, { opacity: 1, duration: 0.2 });
        visible = true;
      };
      const leave = () => {
        visible = false;
        if (target) shape((target = null));
        gsap.to(el, { opacity: 0, duration: 0.2 });
      };

      box.addEventListener("pointermove", move);
      box.addEventListener("pointerleave", leave);
      return () => {
        box.removeEventListener("pointermove", move);
        box.removeEventListener("pointerleave", leave);
      };
    },
    { scope: root, dependencies: [duration, ease, size, padding, targets], revertOnUpdate: true },
  );

  return (
    <div ref={root} className={`relative ${className}`} {...props}>
      {children}
      <div ref={dot} aria-hidden="true" className="pointer-events-none absolute top-0 left-0 z-10 border-[1.5px] border-current opacity-0">
        <div className="absolute inset-0 rounded-[inherit] bg-current" />
      </div>
    </div>
  );
}
