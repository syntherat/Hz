"use client";

import { useRef, useState, type ComponentPropsWithoutRef, type ReactNode } from "react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(Flip, useGSAP);

type FlipFilterGridProps = Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  items: { id: string; tag: string; content: ReactNode }[];
  tags: string[];
  onFilterChange?: (tag: string, count: number) => void;
  duration?: number;
  stagger?: number;
  ease?: string;
};

export function FlipFilterGrid({
  items,
  tags,
  onFilterChange,
  duration = 0.6,
  stagger = 0.02,
  ease = "power3.out",
  ...props
}: FlipFilterGridProps) {
  const root = useRef<HTMLDivElement>(null);
  const state = useRef<Flip.FlipState>(null);
  const [filter, setFilter] = useState("All");

  useGSAP(
    () => {
      if (!state.current) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      Flip.from(state.current, {
        duration: reduce ? 0 : duration,
        ease,
        stagger: reduce ? 0 : stagger,
        // hidden items stay in the DOM (display: none) so they can fade out instead of vanishing
        absolute: true,
        onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: reduce ? 0 : duration, ease }),
        onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.85, duration: reduce ? 0 : duration * 0.6, ease: "power2.in" }),
      });
      state.current = null;
    },
    { scope: root, dependencies: [filter] },
  );

  const choose = (tag: string) => {
    if (tag === filter) return;
    // records where every item is right now, even mid-flip, and stops the running flip
    state.current = Flip.getState(root.current!.querySelectorAll("li"));
    setFilter(tag);
    onFilterChange?.(tag, items.filter((it) => tag === "All" || it.tag === tag).length);
  };

  return (
    <div ref={root} {...props}>
      <div role="group" aria-label="Filter" className="flex flex-wrap gap-1.5">
        {["All", ...tags].map((tag) => (
          <button
            key={tag}
            type="button"
            aria-pressed={tag === filter}
            onClick={() => choose(tag)}
            className="rounded-lg border border-current/20 px-3 py-1.5 text-sm aria-pressed:bg-current/15"
          >
            {tag}
          </button>
        ))}
      </div>
      <ul className="relative mt-4 grid grid-cols-[repeat(auto-fill,minmax(96px,1fr))] gap-3">
        {items.map((it) => (
          <li key={it.id} data-flip-id={it.id} className={filter === "All" || it.tag === filter ? "" : "hidden"}>
            {it.content}
          </li>
        ))}
      </ul>
    </div>
  );
}
