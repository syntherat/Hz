"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { RouteTransition, TransitionLink } from "@/registry/hz/route-transition/route-transition";
import type { DemoProps } from "@/components/recipe/demos";
import { unquote, useTicker } from "@/components/recipe/demos/kit";

const pages: Record<string, { title: string; body: string; fill: string }> = {
  "/": { title: "Home", body: "A small studio that tunes motion by hand.", fill: "bg-fill-1" },
  "/work": { title: "Work", body: "Twenty-four recipes, each one measured.", fill: "bg-fill-2" },
  "/about": { title: "About", body: "Calm is a craft, not a setting.", fill: "bg-surface" },
};

export function RouteTransitionDemo({ values, reduced, onReadout }: DemoProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const [path, setPath] = useState("/");
  const [phase, setPhase] = useState("IDLE");

  useTicker(() => {
    const c = wrap.current?.querySelector<HTMLElement>("[data-curtain]");
    if (!c) return;
    const y = Number(gsap.getProperty(c, "yPercent"));
    const next = !gsap.isTweening(c) ? "IDLE" : Math.abs(y) < 0.5 ? "SWAPPING" : (y > 0) === (unquote(values.direction) === "up") ? "COVERING" : "REVEALING";
    if (next !== phase) setPhase(next);
  });

  useEffect(() => {
    onReadout(`${phase} · ${path}`);
  }, [phase, path, onReadout]);

  const page = pages[path];

  return (
    <div ref={wrap} className="absolute inset-x-4 top-11 bottom-[96px] overflow-hidden rounded-[10px] ring-1 ring-hairline sm:inset-x-6 sm:bottom-[60px]">
      <RouteTransition
        key={reduced ? "still" : "live"}
        contained
        navigate={setPath}
        routeKey={path}
        duration={reduced ? 0 : Number(values.duration)}
        ease={String(values.ease)}
        direction={unquote(values.direction) as "up" | "down"}
        className="bg-ink"
      >
        <div className={`flex h-full flex-col ${page.fill}`}>
          <nav aria-label="Demo pages" className="flex items-center gap-5 border-b border-hairline px-5 py-3 font-mono text-xs">
            <span className="mr-auto text-muted">site.test</span>
            {Object.entries(pages).map(([href, p]) => (
              <TransitionLink key={href} href={href} prefetch={false} aria-current={href === path ? "page" : undefined} className="py-1 text-muted hover:text-ink aria-[current=page]:text-ink">
                {p.title}
              </TransitionLink>
            ))}
          </nav>
          <div className="flex flex-1 flex-col justify-center gap-3 px-6">
            <span className="font-mono text-xs text-muted">{path}</span>
            <h3 className="text-[44px] leading-none font-medium tracking-[-0.045em]">{page.title}</h3>
            <p className="text-ink-2">{page.body}</p>
          </div>
        </div>
      </RouteTransition>
    </div>
  );
}
