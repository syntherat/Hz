"use client";

import { useId, useRef, useState, type ComponentPropsWithoutRef, type KeyboardEvent, type ReactNode } from "react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(Flip, useGSAP);

type SlidingTabsProps = Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  tabs: { label: string; content: ReactNode }[];
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
  duration?: number;
  ease?: string;
};

export function SlidingTabs({
  tabs,
  defaultIndex = 0,
  onIndexChange,
  duration = 0.5,
  ease = "expo.out",
  ...props
}: SlidingTabsProps) {
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const state = useRef<Flip.FlipState>(null);
  const [active, setActive] = useState(defaultIndex);

  // the indicator remounts inside the new tab; data-flip-id lets Flip treat both as one element
  useGSAP(
    () => {
      if (!state.current) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      Flip.from(state.current, { targets: root.current!.querySelector("[data-flip-id]"), duration: reduce ? 0 : duration, ease });
      state.current = null;
    },
    { scope: root, dependencies: [active] },
  );

  const select = (i: number) => {
    if (i === active) return;
    // getState also stops a slide in progress, so the next one starts from where it is on screen
    state.current = Flip.getState(root.current!.querySelector("[data-flip-id]"));
    setActive(i);
    onIndexChange?.(i);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    const to = step ? (active + step + tabs.length) % tabs.length : e.key === "Home" ? 0 : e.key === "End" ? tabs.length - 1 : -1;
    if (to < 0) return;
    e.preventDefault();
    select(to);
    root.current!.querySelectorAll<HTMLElement>('[role="tab"]')[to].focus();
  };

  return (
    <div ref={root} {...props}>
      <div role="tablist" onKeyDown={onKeyDown} className="inline-flex gap-1 rounded-xl bg-current/5 p-1">
        {tabs.map((t, i) => (
          <button
            key={t.label}
            type="button"
            role="tab"
            id={`${id}-tab-${i}`}
            aria-selected={i === active}
            aria-controls={`${id}-panel`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => select(i)}
            className="relative rounded-lg px-4 py-2 text-sm"
          >
            {i === active && <span data-flip-id={`${id}-indicator`} aria-hidden="true" className="absolute inset-0 rounded-lg bg-current/10" />}
            <span className="relative">{t.label}</span>
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-tab-${active}`} tabIndex={0} className="mt-4">
        {tabs[active].content}
      </div>
    </div>
  );
}
