"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";

export const toolClass = "h-9 rounded-lg border border-hairline bg-surface px-3 text-[13px] text-ink hover:border-line-strong";
export const primaryToolClass = "h-9 rounded-lg bg-ink px-4 text-[13px] font-medium text-ground hover:bg-ink-2";
export const fills = ["bg-fill-1", "bg-fill-2"];

export function Tools({ tools, children }: { tools: HTMLElement | null; children: ReactNode }) {
  return tools ? createPortal(children, tools) : null;
}

export function Tool({ onClick, primary, children }: { onClick: () => void; primary?: boolean; children: ReactNode }) {
  return (
    <button type="button" onClick={onClick} className={primary ? primaryToolClass : toolClass}>
      {children}
    </button>
  );
}

// runs every gsap tick; keep the callback cheap and only set state when something changed
export function useTicker(read: () => void) {
  const ref = useRef(read);
  ref.current = read;
  useEffect(() => {
    const tick = () => ref.current();
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);
}

// state that only updates when the new value differs, so ticker reads don't re-render every frame
export function useSettled<T extends Record<string, unknown>>(initial: T) {
  const [value, setValue] = useState(initial);
  const set = (next: T) => setValue((v) => ((Object.keys(next) as (keyof T)[]).every((k) => v[k] === next[k]) ? v : next));
  return [value, set] as const;
}

// a clock on the global timeline, so it follows the 0.25x slow-motion toggle
export function useClock(total: number, run: unknown) {
  const [t, setT] = useState(0);
  useEffect(() => {
    const o = { t: 0 };
    setT(0);
    const tw = gsap.to(o, { t: total, duration: total, ease: "none", onUpdate: () => setT(o.t) });
    return () => {
      tw.kill();
    };
  }, [total, run]);
  return t;
}

export function Filler({ label, height = 150 }: { label: string; height?: number }) {
  return (
    <div className="flex flex-col justify-center gap-2.5 px-5" style={{ height }} aria-hidden="true">
      <span className="font-mono text-[11px] text-muted">{label}</span>
      <span className="h-2 w-3/4 rounded bg-hairline" />
      <span className="h-2 w-2/3 rounded bg-hairline" />
      <span className="h-2 w-1/2 rounded bg-hairline" />
    </div>
  );
}

type ScrollBoxProps = {
  tools: HTMLElement | null;
  children: (scroller: HTMLDivElement) => ReactNode;
  autoDuration?: number;
  side?: ReactNode;
  // room for the stage toolbar; demos with extra buttons wrap to more rows on phones
  bottom?: string;
};

// a small scroll container that stands in for the page, with a PAGE SCROLL slider and Auto-scroll
export function ScrollBox({ tools, children, autoDuration = 5, side, bottom = "bottom-[96px]" }: ScrollBoxProps) {
  const [scroller, setScroller] = useState<HTMLDivElement | null>(null);
  const [view, setView] = useSettled({ top: 0, max: 1 });
  const auto = useRef<gsap.core.Tween>(null);

  useTicker(() => {
    if (scroller) setView({ top: scroller.scrollTop, max: Math.max(1, scroller.scrollHeight - scroller.clientHeight) });
  });

  useEffect(() => {
    if (!scroller) return;
    const stop = () => auto.current?.kill();
    scroller.addEventListener("wheel", stop, { passive: true });
    scroller.addEventListener("pointerdown", stop);
    return () => {
      scroller.removeEventListener("wheel", stop);
      scroller.removeEventListener("pointerdown", stop);
      stop();
    };
  }, [scroller]);

  const autoScroll = () => {
    if (!scroller) return;
    auto.current?.kill();
    const max = scroller.scrollHeight - scroller.clientHeight;
    auto.current = gsap.fromTo(scroller, { scrollTop: 0 }, { scrollTop: max, duration: autoDuration, ease: "none" });
  };

  return (
    <div className={`absolute inset-x-4 top-11 flex gap-4 sm:bottom-[60px] ${bottom}`}>
      <div className="flex min-w-0 flex-1 flex-col gap-2.5">
        <div
          ref={setScroller}
          className="@container relative min-h-0 flex-1 overflow-y-auto overscroll-contain rounded-[10px] bg-ground ring-1 ring-hairline ring-inset [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {scroller && children(scroller)}
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="page-scroll" className="flex justify-between font-mono text-xs text-muted">
            <span>PAGE SCROLL</span>
            <span className="text-ink">{Math.round((100 * view.top) / view.max)}%</span>
          </label>
          <input
            id="page-scroll"
            type="range"
            min={0}
            max={1}
            step={0.001}
            value={view.top / view.max}
            onChange={(e) => {
              auto.current?.kill();
              if (scroller) scroller.scrollTop = Number(e.target.value) * view.max;
            }}
            className="h-6 w-full accent-ink"
          />
        </div>
      </div>
      {side}
      <Tools tools={tools}>
        <Tool onClick={autoScroll}>Auto-scroll</Tool>
      </Tools>
    </div>
  );
}

export const unquote = (v: unknown) => String(v).replace(/^"|"$/g, "");
