"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PinnedGallery } from "@/registry/hz/pinned-horizontal-gallery/pinned-horizontal-gallery";
import type { DemoProps } from "@/components/recipe/demos";

const titles = ["Prepare", "Measure", "Tune", "Ship", "Rest"];

type View = { top: number; vh: number; total: number; start: number; end: number; p: number; pinned: boolean };

function Filler({ label }: { label: string }) {
  return (
    <div className="flex h-[150px] flex-col justify-center gap-2.5 px-5" aria-hidden="true">
      <span className="font-mono text-[11px] text-muted">{label}</span>
      <span className="h-2 w-3/4 rounded bg-hairline" />
      <span className="h-2 w-2/3 rounded bg-hairline" />
      <span className="h-2 w-1/2 rounded bg-hairline" />
    </div>
  );
}

function Panels() {
  return titles.map((t, i) => (
    <div key={t} className="h-[232px] w-[72cqw] shrink-0 p-3">
      <div className={`flex h-full flex-col justify-between rounded-lg p-5 ${i % 2 ? "bg-[#232328]" : "bg-[#1E1E22]"}`}>
        <span className="font-mono text-xs text-muted">0{i + 1} / 05</span>
        <span className="text-[28px] font-medium tracking-[-0.04em]">{t}</span>
      </div>
    </div>
  ));
}

export function PinnedGalleryDemo({ values, reduced, onReadout, tools }: DemoProps) {
  const [scroller, setScroller] = useState<HTMLDivElement | null>(null);
  const [view, setView] = useState<View>({ top: 0, vh: 1, total: 1, start: -1, end: -1, p: 0, pinned: false });
  const auto = useRef<gsap.core.Tween>(null);

  useEffect(() => {
    if (!scroller) return;
    const read = () => {
      const st = ScrollTrigger.getAll().find((t) => t.trigger === scroller.querySelector("section"));
      const next: View = {
        top: scroller.scrollTop,
        vh: scroller.clientHeight,
        total: scroller.scrollHeight,
        start: st ? st.start : -1,
        end: st ? st.end : -1,
        p: Math.round((st?.animation?.progress() ?? 0) * 100) / 100,
        pinned: !!st?.isActive,
      };
      setView((v) => ((Object.keys(next) as (keyof View)[]).every((k) => v[k] === next[k]) ? v : next));
    };
    const stop = () => auto.current?.kill();
    gsap.ticker.add(read);
    scroller.addEventListener("wheel", stop, { passive: true });
    scroller.addEventListener("pointerdown", stop);
    return () => {
      gsap.ticker.remove(read);
      scroller.removeEventListener("wheel", stop);
      scroller.removeEventListener("pointerdown", stop);
      stop();
    };
  }, [scroller]);

  const max = Math.max(1, view.total - view.vh);
  const hasPin = view.start >= 0;
  const state = reduced ? "NATIVE SCROLL" : view.pinned ? "PINNED" : view.top < view.start ? "BEFORE" : "RELEASED";

  useEffect(() => {
    onReadout(`${state} · progress ${view.p.toFixed(2)}`);
  }, [state, view.p, onReadout]);

  const scrollTo = (s: number) => {
    auto.current?.kill();
    if (scroller) scroller.scrollTop = s * max;
  };
  const autoScroll = () => {
    if (!scroller) return;
    auto.current?.kill();
    auto.current = gsap.fromTo(scroller, { scrollTop: 0 }, { scrollTop: max, duration: 5, ease: "none" });
  };

  const pct = (n: number) => `${(100 * n) / view.total}%`;
  const scrub = values.scrub === "true" ? true : Number(values.scrub);

  return (
    <div className="absolute inset-x-4 top-11 bottom-[96px] flex gap-4 sm:bottom-[60px]">
      <div className="flex min-w-0 flex-1 flex-col gap-2.5">
        <div className="relative">
          <div
            ref={setScroller}
            className="@container h-[232px] overflow-y-auto overscroll-contain rounded-[10px] bg-ground [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <Filler label="Page content above" />
            {scroller &&
              (reduced ? (
                <section className="h-[232px] overflow-x-auto">
                  <div className="flex w-max">
                    <Panels />
                  </div>
                </section>
              ) : (
                <PinnedGallery
                  scroller={scroller}
                  scrub={scrub}
                  scrollLength={Number(values.scrollLength)}
                  snap={values.snap === "true"}
                  className="h-[232px]"
                  aria-label="Gallery"
                >
                  <Panels />
                </PinnedGallery>
              ))}
            <Filler label="Page content below" />
          </div>
          <div
            className={`pointer-events-none absolute inset-0 rounded-[10px] ring-1 ring-inset ${view.pinned && !reduced ? "ring-signal" : "ring-hairline"}`}
            aria-hidden="true"
          />
          {view.pinned && !reduced && (
            <span className="pointer-events-none absolute top-2.5 right-2.5 rounded-[5px] bg-signal px-[7px] py-[3px] font-mono text-[11px] text-ground">
              PINNED
            </span>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="page-scroll" className="flex justify-between font-mono text-xs text-muted">
            <span>PAGE SCROLL</span>
            <span className="text-ink">{Math.round((100 * view.top) / max)}%</span>
          </label>
          <input
            id="page-scroll"
            type="range"
            min={0}
            max={1}
            step={0.001}
            value={view.top / max}
            onChange={(e) => scrollTo(Number(e.target.value))}
            className="h-6 w-full accent-ink"
          />
        </div>
      </div>

      <div className="flex w-[72px] shrink-0 flex-col gap-2" aria-hidden="true">
        <span className="font-mono text-[11px] text-muted">MAP</span>
        <div className="relative flex-1 overflow-hidden rounded-lg border border-hairline bg-ground">
          {hasPin && !reduced && (
            <>
              <div className="absolute inset-x-0 border-y border-signal bg-signal/12" style={{ top: pct(view.start), height: pct(view.end - view.start + view.vh) }} />
              <span className="absolute left-1.5 mt-[3px] font-mono text-[10px] text-code-live" style={{ top: pct(view.start) }}>
                start
              </span>
              <span className="absolute left-1.5 -mt-[15px] font-mono text-[10px] text-code-live" style={{ top: pct(view.end + view.vh) }}>
                end
              </span>
            </>
          )}
          <div className="absolute inset-x-[3px] rounded border-[1.5px] border-ink" style={{ top: pct(view.top), height: pct(view.vh) }} />
        </div>
      </div>

      {tools &&
        createPortal(
          <button
            type="button"
            onClick={autoScroll}
            className="h-9 rounded-lg border border-hairline bg-surface px-3 text-[13px] text-ink hover:border-line-strong"
          >
            Auto-scroll
          </button>,
          tools,
        )}
    </div>
  );
}
