"use client";

import { useRef, useState, type ComponentPropsWithoutRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type VelocityMarqueeProps = ComponentPropsWithoutRef<"div"> & {
  speed?: number;
  boost?: number;
  maxSkew?: number;
  scroller?: string | Element;
};

export function VelocityMarquee({
  speed = 80,
  boost = 3,
  maxSkew = 8,
  scroller,
  className = "",
  children,
  ...props
}: VelocityMarqueeProps) {
  const root = useRef<HTMLDivElement>(null);
  const lean = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const loop = useRef<gsap.core.Tween>(null);
  const [paused, setPaused] = useState(false);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const el = track.current!;
        // the content is rendered twice, so sliding by half the width loops seamlessly
        const tween = gsap.to(el, { xPercent: -50, ease: "none", repeat: -1, duration: el.scrollWidth / 2 / speed });
        // start deep into the repeats so a negative timeScale (scrolling up) has room to run backwards
        tween.totalTime(tween.duration() * 1e4).paused(paused);
        loop.current = tween;

        ScrollTrigger.create({
          trigger: root.current,
          scroller,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            const dir = self.direction;
            const amount = gsap.utils.clamp(0, 1, Math.abs(self.getVelocity()) / 3000);
            // kick up to the scroll's speed fast, then ease back to cruising once the scroll stops
            gsap.to(tween, { timeScale: dir * (1 + boost * amount), duration: 0.15, overwrite: true });
            gsap.to(tween, { timeScale: dir, duration: 1.2, delay: 0.15, ease: "power3.out" });
            gsap.to(lean.current, { skewX: -dir * maxSkew * amount, duration: 0.15, overwrite: true });
            gsap.to(lean.current, { skewX: 0, duration: 0.8, delay: 0.15, ease: "power3.out" });
          },
        });
        return () => {
          loop.current = null;
        };
      });
    },
    { scope: root, dependencies: [speed, boost, maxSkew, scroller], revertOnUpdate: true },
  );

  const togglePause = () => {
    loop.current?.paused(!paused);
    setPaused(!paused);
  };

  return (
    <div ref={root} className={`relative overflow-hidden motion-reduce:overflow-x-auto ${className}`} {...props}>
      <div ref={lean}>
        <div ref={track} className="flex w-max">
          <div className="flex shrink-0">{children}</div>
          <div className="flex shrink-0 motion-reduce:hidden" aria-hidden="true" inert>
            {children}
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={togglePause}
        className="absolute top-2 right-2 rounded-md bg-current/10 px-2 py-1 text-xs motion-reduce:hidden"
      >
        {paused ? "Play" : "Pause"}
      </button>
    </div>
  );
}
