"use client";

import { createContext, useContext, useRef, type ComponentProps, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const TransitionContext = createContext<(href: string) => void>(() => {});
export const useRouteTransition = () => useContext(TransitionContext);

type RouteTransitionProps = {
  children: ReactNode;
  duration?: number;
  ease?: string;
  direction?: "up" | "down";
  // curtain styles; it fills the viewport, or its positioned parent when contained
  className?: string;
  contained?: boolean;
  // for routers other than the App Router: how to navigate, and a value that changes once the new route renders
  navigate?: (href: string) => void;
  routeKey?: string;
};

// put it in app/layout.tsx around {children}: the layout stays mounted, so the curtain survives navigation
export function RouteTransition({
  children,
  duration = 0.6,
  ease = "power3.inOut",
  direction = "up",
  className = "bg-neutral-950",
  contained = false,
  navigate,
  routeKey,
}: RouteTransitionProps) {
  const router = useRouter();
  const pathname = usePathname();
  const key = routeKey ?? pathname;
  const curtain = useRef<HTMLDivElement>(null);
  const covered = useRef(false);
  const from = direction === "up" ? 100 : -100;
  const { contextSafe } = useGSAP();

  const go = contextSafe((href: string) => {
    const push = () => (navigate ? navigate(href) : router.push(href));
    if (href === key || gsap.isTweening(curtain.current)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return push();
    gsap.fromTo(
      curtain.current,
      { yPercent: from, visibility: "visible" },
      {
        yPercent: 0,
        duration,
        ease,
        onComplete: () => {
          covered.current = true;
          push();
        },
      },
    );
  });

  // the new route has rendered underneath: lift the curtain off the far side
  useGSAP(
    () => {
      if (!covered.current) return;
      covered.current = false;
      gsap.to(curtain.current, { yPercent: -from, duration, ease, delay: 0.05, onComplete: () => gsap.set(curtain.current, { visibility: "hidden" }) });
    },
    { dependencies: [key] },
  );

  return (
    <TransitionContext.Provider value={go}>
      {children}
      <div ref={curtain} data-curtain aria-hidden="true" className={`${contained ? "absolute" : "fixed"} invisible inset-0 z-50 ${className}`} />
    </TransitionContext.Provider>
  );
}

export function TransitionLink({ href, onClick, ...props }: ComponentProps<typeof Link> & { href: string }) {
  const go = useRouteTransition();
  return (
    <Link
      href={href}
      onClick={(e) => {
        onClick?.(e);
        // new tabs, modified clicks and handled clicks keep the browser's behavior
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        go(href);
      }}
      {...props}
    />
  );
}
