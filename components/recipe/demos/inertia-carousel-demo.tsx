"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { InertiaCarousel } from "@/registry/hz/inertia-carousel/inertia-carousel";
import type { DemoProps } from "@/components/recipe/demos";

const titles = ["Prepare", "Measure", "Tune", "Ship", "Rest", "Repeat"];

// InertiaPlugin projects a throw with power3.out, measured at 5% of the duration
const PROJECT = 0.05 / (1 - 0.95 ** 4);

type View = { x: number; v: number; phase: string; step: number; maxO: number };
type Throw = { natural: number; end: number; duration: number };
type Config = { resistance: number; snap: boolean; edge: number };

// Draggable's own duration limits for a throw, so the projection and Fling match a real release
function limits({ resistance, edge }: Config) {
  const overshoot = edge === 1 ? 0 : 1 - edge + 0.2;
  return { max: 2, min: overshoot === 0 || resistance > 1000 ? 0 : 0.5, overshoot };
}

function project(x: number, v: number, cfg: Config) {
  const { min, max } = limits(cfg);
  return x + gsap.utils.clamp(min, max, Math.abs(v / cfg.resistance)) * v * PROJECT;
}

export function InertiaCarouselDemo({ values, reduced, onReadout, tools }: DemoProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<View>({ x: 0, v: 0, phase: "AT REST", step: 256, maxO: 1 });
  const [last, setLast] = useState<Throw | null>(null);
  const [flick, setFlick] = useState(1800);

  // reduced motion is simulated: a huge resistance means a throw stops where it was released
  const cfg: Config = {
    resistance: reduced ? 1e6 : Number(values.throwResistance),
    snap: !reduced && values.snap === "true",
    edge: Number(values.edgeResistance),
  };
  const cfgRef = useRef(cfg);
  cfgRef.current = cfg;

  const getTrack = () => wrap.current?.querySelector<HTMLElement>('[aria-roledescription="carousel"] > div > div') ?? null;

  useEffect(() => {
    let prevX = 0;
    let prevT = performance.now();
    let vel = 0;
    let wasThrowing = false;
    let release = { x: 0, v: 0 };

    // capture phase runs before Draggable's own release handler, while the tracked velocity is still the hand's
    const onUp = () => {
      const el = getTrack();
      if (el && Draggable.get(el)?.isPressed) release = { x: Number(gsap.getProperty(el, "x")), v: InertiaPlugin.getVelocity(el, "x") };
    };
    const onDown = () => setLast(null);

    const read = () => {
      const el = getTrack();
      if (!el) return;
      const d = Draggable.get(el);
      const x = Number(gsap.getProperty(el, "x"));
      const now = performance.now();
      const dt = (now - prevT) / 1000;
      if (dt > 0) vel = vel * 0.6 + ((x - prevX) / dt) * 0.4;
      prevX = x;
      prevT = now;

      if (d?.isThrowing && !wasThrowing && d.tween) {
        setLast({ natural: project(release.x, release.v, cfgRef.current), end: d.endX, duration: d.tween.duration() });
      }
      wasThrowing = !!d?.isThrowing;

      const [a, b] = Array.from(el.children) as HTMLElement[];
      const phase = d?.isDragging ? "DRAGGING" : gsap.isTweening(el) ? "GLIDING" : "AT REST";
      const next: View = {
        x: Math.round(x * 10) / 10,
        v: phase === "AT REST" ? 0 : Math.round(Math.abs(vel) / 10) * 10,
        phase,
        step: b ? b.offsetLeft - a.offsetLeft : 256,
        maxO: Math.max(1, el.offsetWidth - (el.parentElement?.offsetWidth ?? 0)),
      };
      setView((v) => ((Object.keys(next) as (keyof View)[]).every((k) => v[k] === next[k]) ? v : next));
    };

    const root = wrap.current;
    window.addEventListener("pointerup", onUp, true);
    root?.addEventListener("pointerdown", onDown);
    gsap.ticker.add(read);
    return () => {
      window.removeEventListener("pointerup", onUp, true);
      root?.removeEventListener("pointerdown", onDown);
      gsap.ticker.remove(read);
    };
  }, []);

  useEffect(() => {
    onReadout(`${view.phase} · v ${view.v} px/s`);
  }, [view.phase, view.v, onReadout]);

  const fling = () => {
    const el = getTrack();
    const d = el && Draggable.get(el);
    if (!el || !d) return;
    gsap.killTweensOf(el);
    const x0 = Number(gsap.getProperty(el, "x"));
    const v = -flick;
    const s = view.step;
    const t = gsap.to(el, {
      inertia: {
        resistance: cfg.resistance,
        duration: limits(cfg),
        x: { velocity: v, min: -view.maxO, max: 0, ...(cfg.snap ? { end: (n: number) => Math.round(n / s) * s } : {}) },
      },
      onUpdate: () => d.update(),
    });
    // same trick Draggable uses: jump to the end so InertiaPlugin works out the landing, then play from the start
    t.render(1e9, true, true);
    const end = Number(gsap.getProperty(el, "x"));
    t.play(0);
    setLast({ natural: project(x0, v, cfg), end, duration: t.duration() });
  };

  const pad = view.maxO * 0.15;
  const pct = (x: number) => `${(100 * (gsap.utils.clamp(-pad, view.maxO + pad, -x) + pad)) / (view.maxO + 2 * pad)}%`;
  const slideLabel = (x: number) =>
    -x > view.maxO + 0.5 ? "past end" : -x < -0.5 ? "past start" : -x >= view.maxO - 0.5 ? "end" : `slide ${(-x / view.step + 1).toFixed(1).replace(/\.0$/, "")}`;
  const ticks: number[] = [];
  for (let o = 0; o < view.maxO - 0.5; o += view.step) ticks.push(o);
  ticks.push(view.maxO);

  return (
    <div ref={wrap} className="absolute inset-x-0 top-11 bottom-[124px] flex flex-col justify-between sm:bottom-[60px]">
      <InertiaCarousel
        throwResistance={cfg.resistance}
        snap={cfg.snap}
        edgeResistance={cfg.edge}
        aria-label="Steps"
        className="px-6"
      >
        {titles.map((t, i) => (
          <div
            key={t}
            className={`flex h-[120px] w-[240px] sm:h-[170px] shrink-0 select-none flex-col justify-between rounded-xl p-[18px] ring-1 ring-hairline ring-inset ${i % 2 ? "bg-[#232328]" : "bg-[#1E1E22]"}`}
          >
            <span className="font-mono text-xs text-muted">0{i + 1} / 06</span>
            <span className="text-[28px] font-medium tracking-[-0.04em]">{t}</span>
          </div>
        ))}
      </InertiaCarousel>

      <div className="flex flex-col gap-1.5 px-6" aria-hidden="true">
        <div className="relative h-[34px]">
          <div className="absolute inset-x-0 top-4 h-px bg-line-strong" />
          {ticks.map((o, i) => (
            <span key={o} className="absolute top-2.5" style={{ left: pct(-o) }}>
              <span className="absolute h-[13px] w-px bg-[#5a5a60]" />
              <span className="absolute top-3.5 -ml-1 font-mono text-[10px] text-muted">{i === ticks.length - 1 ? "end" : i + 1}</span>
            </span>
          ))}
          {last && (
            <>
              <span className="absolute top-2.5 -ml-[6px] size-2.5 rounded-full border-[1.5px] border-code-live" style={{ left: pct(last.natural) }} />
              <span className="absolute top-0.5 -ml-1 border-x-4 border-t-[6px] border-x-transparent border-t-signal" style={{ left: pct(last.end) }} />
            </>
          )}
          <span className="absolute top-[9px] -ml-px h-[15px] w-0.5 bg-ink" style={{ left: pct(view.x) }} />
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] text-muted">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full border-[1.5px] border-code-live" />
            natural landing {last ? slideLabel(last.natural) : "-"}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="border-x-4 border-t-[6px] border-x-transparent border-t-signal" />
            landed on {last ? slideLabel(last.end) : "-"}
          </span>
          <span>duration {last ? `${last.duration.toFixed(2)}s` : "-"}</span>
        </div>
      </div>

      {tools &&
        createPortal(
          <>
            <label htmlFor="flick" className="flex h-9 items-center gap-2 font-mono text-xs whitespace-nowrap text-muted">
              FLICK <span className="w-12 text-ink">{flick > 0 ? `+${flick}` : flick}</span>
            </label>
            <input
              id="flick"
              type="range"
              min={-3000}
              max={3000}
              step={100}
              value={flick}
              onChange={(e) => setFlick(Number(e.target.value))}
              aria-valuetext={`${flick} pixels per second`}
              className="h-9 w-24 accent-ink"
            />
            <button type="button" onClick={fling} className="h-9 rounded-lg bg-ink px-4 text-[13px] font-medium text-ground hover:bg-ink-2">
              Fling
            </button>
          </>,
          tools,
        )}
    </div>
  );
}
