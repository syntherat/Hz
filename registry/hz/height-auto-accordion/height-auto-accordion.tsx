"use client";

import { useId, useRef, useState, type ComponentPropsWithoutRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

type AccordionProps = Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  items: { title: ReactNode; content: ReactNode }[];
  multiple?: boolean;
  onOpenChange?: (open: number[]) => void;
  duration?: number;
  stagger?: number;
  ease?: string;
};

export function Accordion({
  items,
  multiple = false,
  onOpenChange,
  duration = 0.5,
  stagger = 0.05,
  ease = "power3.out",
  ...props
}: AccordionProps) {
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<number[]>([]);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const panels = gsap.utils.toArray<HTMLElement>("[data-panel]");
      panels.forEach((panel, i) => {
        const isOpen = open.includes(i);
        if (panel.dataset.open === String(isOpen)) return;
        const first = panel.dataset.open === undefined;
        panel.dataset.open = String(isOpen);
        const d = first || reduce ? 0 : duration;
        // height "auto" is measured at the start, and a reversal starts from the current height
        gsap.to(panel, { height: isOpen ? "auto" : 0, duration: d, ease, overwrite: true });
        gsap.to(panel.firstElementChild!.children, isOpen
          ? { opacity: 1, y: 0, duration: d, ease, stagger: reduce ? 0 : stagger, delay: d * 0.15, overwrite: true }
          : { opacity: 0, y: -6, duration: d * 0.4, ease: "power2.in", overwrite: true });
      });
    },
    { scope: root, dependencies: [open] },
  );

  const toggle = (i: number) => {
    const next = open.includes(i) ? open.filter((n) => n !== i) : multiple ? [...open, i] : [i];
    setOpen(next);
    onOpenChange?.(next);
  };

  return (
    <div ref={root} {...props}>
      {items.map((item, i) => (
        <div key={i} className="border-b border-current/15">
          <h3>
            <button
              type="button"
              id={`${id}-h${i}`}
              aria-expanded={open.includes(i)}
              aria-controls={`${id}-p${i}`}
              onClick={() => toggle(i)}
              className="flex w-full items-center justify-between py-4 text-left"
            >
              {item.title}
              <span aria-hidden="true" className={`transition-transform duration-300 ${open.includes(i) ? "rotate-45" : ""}`}>
                +
              </span>
            </button>
          </h3>
          {/* inert keeps closed content out of the tab order and the accessibility tree */}
          <div
            id={`${id}-p${i}`}
            role="region"
            aria-labelledby={`${id}-h${i}`}
            data-panel
            inert={!open.includes(i)}
            className="h-0 overflow-hidden"
          >
            <div className="pb-4 [&>*]:opacity-0">{item.content}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
