"use client";

import { useRef, type ComponentPropsWithoutRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

type MagneticButtonProps = ComponentPropsWithoutRef<"button"> & {
  strength?: number;
  duration?: number;
  ease?: string;
};

export function MagneticButton({
  strength = 0.4,
  duration = 0.6,
  ease = "power3.out",
  children,
  ...props
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const xTo = gsap.quickTo(el, "x", { duration, ease });
      const yTo = gsap.quickTo(el, "y", { duration, ease });

      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        // measure from the resting center, otherwise the offset feeds on itself
        const restX = r.left - Number(gsap.getProperty(el, "x")) + r.width / 2;
        const restY = r.top - Number(gsap.getProperty(el, "y")) + r.height / 2;
        xTo((e.clientX - restX) * strength);
        yTo((e.clientY - restY) * strength);
      };
      const leave = () => {
        xTo(0);
        yTo(0);
      };

      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      return () => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", leave);
      };
    },
    { scope: ref, dependencies: [strength, duration, ease], revertOnUpdate: true },
  );

  return (
    <button ref={ref} {...props}>
      {children}
    </button>
  );
}
