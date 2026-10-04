"use client";

import { useRef, useState, type ComponentPropsWithoutRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

type SquashToggleProps = Omit<ComponentPropsWithoutRef<"button">, "onChange"> & {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  duration?: number;
  ease?: string;
  squash?: number;
};

export function SquashToggle({
  checked,
  defaultChecked = false,
  onCheckedChange,
  duration = 0.45,
  ease = "back.out(1.7)",
  squash = 0.25,
  className = "",
  ...props
}: SquashToggleProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const knob = useRef<HTMLSpanElement>(null);
  const last = useRef<boolean>(null);
  const [inner, setInner] = useState(defaultChecked);
  const on = checked ?? inner;

  useGSAP(
    () => {
      const k = knob.current!;
      const x = on ? ref.current!.clientWidth - k.offsetWidth - 2 * k.offsetLeft : 0;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      // first render (and strict mode's second run) just places the knob
      if (last.current === on || last.current === null || reduce) {
        last.current = on;
        gsap.set(k, { x, scaleX: 1, scaleY: 1 });
        return;
      }
      last.current = on;
      gsap
        .timeline()
        .to(k, { x, duration, ease, overwrite: true }, 0)
        // stretch away from the side it leaves, then land round again
        .set(k, { transformOrigin: on ? "left center" : "right center" }, 0)
        .to(k, { scaleX: 1 + squash, scaleY: 1 - squash / 2, duration: duration * 0.3, ease: "power2.out" }, 0)
        .to(k, { scaleX: 1, scaleY: 1, duration: duration * 0.7, ease: "back.out(3)" });
    },
    { scope: ref, dependencies: [on] },
  );

  const toggle = () => {
    setInner(!on);
    onCheckedChange?.(!on);
  };

  return (
    <button
      ref={ref}
      type="button"
      role="switch"
      aria-checked={on}
      onClick={toggle}
      className={`group relative inline-flex h-8 w-14 shrink-0 rounded-full bg-neutral-600 transition-colors duration-300 aria-checked:bg-neutral-200 ${className}`}
      {...props}
    >
      <span
        ref={knob}
        aria-hidden="true"
        className="absolute top-1 left-1 size-6 rounded-full bg-white transition-colors duration-300 group-aria-checked:bg-neutral-900"
      />
    </button>
  );
}
