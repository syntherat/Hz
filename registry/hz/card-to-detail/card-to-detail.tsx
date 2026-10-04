"use client";

import { useId, useRef, useState, type ComponentPropsWithoutRef, type ReactNode } from "react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(Flip, useGSAP);

type CardToDetailProps = Omit<ComponentPropsWithoutRef<"article">, "title"> & {
  title: ReactNode;
  summary: ReactNode;
  onOpenChange?: (open: boolean) => void;
  duration?: number;
  ease?: string;
};

// opens to fill the nearest positioned ancestor, so put the cards inside a `relative` container
export function CardToDetail({
  title,
  summary,
  onOpenChange,
  duration = 0.7,
  ease = "expo.out",
  className = "",
  children,
  ...props
}: CardToDetailProps) {
  const id = useId();
  const slot = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLElement>(null);
  const state = useRef<Flip.FlipState>(null);
  const [open, setOpen] = useState(false);

  useGSAP(
    () => {
      if (!state.current) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const d = reduce ? 0 : duration;
      Flip.from(state.current, {
        duration: d,
        ease,
        zIndex: 10,
        onComplete: () => {
          if (!open) slot.current!.style.minHeight = "";
        },
      });
      if (open) gsap.from("[data-detail] > *", { opacity: 0, y: 12, duration: d * 0.8, delay: d * 0.35, stagger: 0.05, ease: "power2.out" });
      card.current!.querySelector<HTMLElement>(open ? "[data-close]" : "[data-open]")?.focus({ preventScroll: true });
      state.current = null;
    },
    { scope: card, dependencies: [open] },
  );

  const toggle = (next: boolean) => {
    // the slot keeps the card's space in the layout while the card itself is lifted out
    if (next) slot.current!.style.minHeight = `${card.current!.offsetHeight}px`;
    state.current = Flip.getState(card.current);
    setOpen(next);
    onOpenChange?.(next);
  };

  return (
    <div ref={slot}>
      <article
        ref={card}
        onKeyDown={(e) => open && e.key === "Escape" && toggle(false)}
        className={`${open ? "absolute inset-0 z-10 overflow-auto" : "relative"} ${className}`}
        {...props}
      >
        <h3 id={`${id}-title`}>{title}</h3>
        <div>{summary}</div>
        {!open && (
          <button
            type="button"
            data-open
            aria-controls={`${id}-detail`}
            aria-labelledby={`${id}-title`}
            onClick={() => toggle(true)}
            className="absolute inset-0 cursor-pointer rounded-[inherit]"
          />
        )}
        <div id={`${id}-detail`} data-detail hidden={!open}>
          {children}
        </div>
        {open && (
          <button type="button" data-close aria-label="Close" onClick={() => toggle(false)} className="absolute top-3 right-3 grid size-10 place-items-center rounded-lg">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </article>
    </div>
  );
}
