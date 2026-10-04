"use client";

import { Children, useRef, type ComponentPropsWithoutRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type StackingCardsProps = ComponentPropsWithoutRef<"div"> & {
  scaleStep?: number;
  offset?: number;
  dim?: boolean;
  top?: number;
  scroller?: string | Element;
};

export function StackingCards({
  scaleStep = 0.05,
  offset = 16,
  dim = true,
  top = 24,
  scroller,
  children,
  ...props
}: StackingCardsProps) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const cards = gsap.utils.toArray<HTMLElement>(root.current!.children);
        const last = cards[cards.length - 1];
        cards.slice(0, -1).forEach((card, i) => {
          // shrinks from when the next card starts to cover it until the last card lands,
          // so cards deeper in the stack end up smaller
          const depth = cards.length - 1 - i;
          // filter needs an explicit start: tweening from "none" interpolates badly
          gsap.fromTo(card, { scale: 1, filter: "brightness(1)" }, {
            scale: 1 - scaleStep * depth,
            filter: `brightness(${dim ? 1 - 0.12 * depth : 1})`,
            transformOrigin: "50% 0%",
            ease: "none",
            scrollTrigger: {
              trigger: cards[i + 1],
              endTrigger: last,
              scroller,
              start: "top bottom",
              end: `top ${top + offset * (cards.length - 1)}px`,
              scrub: true,
              invalidateOnRefresh: true,
            },
          });
        });
      });
    },
    { scope: root, dependencies: [scaleStep, offset, dim, top, scroller], revertOnUpdate: true },
  );

  // sticky does the stacking; each card sits a little lower so the edges of the ones beneath show
  return (
    <div ref={root} {...props}>
      {Children.map(children, (child, i) => (
        <div className="sticky" style={{ top: top + offset * i }}>
          {child}
        </div>
      ))}
    </div>
  );
}
