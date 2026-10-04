"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { CopyButton } from "@/components/copy-button";
import { curvePath, easeFn, eases } from "@/lib/eases";

const names = Object.keys(eases);
const durations = [0.4, 0.6, 1, 2];

const segment = (on: boolean) =>
  `h-9 rounded-lg border px-2.5 font-mono text-xs ${
    on ? "border-ink bg-ink text-ground" : "border-hairline bg-surface text-ink hover:border-line-strong"
  }`;

export function EasingLab() {
  const [t, setT] = useState(0.35);
  const [sel, setSel] = useState("expo.out");
  const [duration, setDuration] = useState(0.6);
  const [slow, setSlow] = useState(false);
  const [playing, setPlaying] = useState(false);
  const clock = useRef({ t: 0.35 });
  const tween = useRef<gsap.core.Tween | null>(null);
  const { contextSafe } = useGSAP();

  // the selected ease lives in the hash so a link opens on it
  useEffect(() => {
    const fromHash = decodeURIComponent(location.hash.slice(1));
    if (eases[fromHash]) setSel(fromHash);
  }, []);

  function pick(name: string) {
    setSel(name);
    history.replaceState(null, "", `#${encodeURIComponent(name)}`);
  }

  const stop = contextSafe(() => {
    tween.current?.kill();
    tween.current = null;
    setPlaying(false);
  });

  const race = contextSafe(() => {
    tween.current?.kill();
    clock.current.t = 0;
    setPlaying(true);
    tween.current = gsap.to(clock.current, {
      t: 1,
      duration: slow ? duration * 4 : duration,
      ease: "none",
      onUpdate: () => setT(clock.current.t),
      onComplete: stop,
    });
  });

  function scrub(value: number) {
    stop();
    clock.current.t = value;
    setT(value);
  }

  const p = easeFn(sel)(t);
  const x = 240 * t;
  const y = 110 - 100 * p;
  const gsapLine = `gsap.to(el, { x: 240, duration: ${duration}, ease: "${sel}" });`;
  const cssLine = `transition: transform ${duration}s ${eases[sel].css};`;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="flex max-w-[640px] flex-col gap-3">
          <span className="eyebrow">Tool · {names.length} eases</span>
          <h1 className="text-[40px] leading-none font-medium tracking-[-0.045em] sm:text-[56px]">Easing lab</h1>
          <p className="text-lg leading-[1.55] text-ink-2">
            Scrub time and watch every ease race side by side. Pick one to see its curve, its value at any moment, and the code for GSAP
            and CSS.
          </p>
        </div>
        <div className="flex min-w-0 flex-[0_1_380px] flex-col gap-3">
          <label htmlFor="lab-t" className="flex justify-between font-mono text-xs text-muted">
            <span>TIME</span>
            <span className="text-ink">t {t.toFixed(2)}</span>
          </label>
          <input
            id="lab-t"
            type="range"
            min={0}
            max={1}
            step={0.005}
            value={t}
            onChange={(e) => scrub(Number(e.target.value))}
            className="h-6 w-full accent-ink"
          />
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={playing ? stop : race}
              className="h-9 w-[76px] rounded-lg bg-ink text-[13px] font-medium text-ground hover:bg-ink-2"
            >
              {playing ? "Stop" : "Race"}
            </button>
            <div role="radiogroup" aria-label="Duration" className="flex gap-1.5">
              {durations.map((d) => (
                <button key={d} type="button" role="radio" aria-checked={d === duration} onClick={() => setDuration(d)} className={segment(d === duration)}>
                  {d}s
                </button>
              ))}
            </div>
            <button type="button" aria-pressed={slow} onClick={() => setSlow(!slow)} className={segment(slow)}>
              0.25×
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-start gap-4">
        <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-0.5 rounded-[20px] border border-hairline bg-surface p-2">
          {names.map((n) => {
            const v = easeFn(n)(t);
            const on = n === sel;
            return (
              <button
                key={n}
                type="button"
                aria-pressed={on}
                aria-label={`${n}, p ${v.toFixed(2)}`}
                onClick={() => pick(n)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left sm:gap-4 ${on ? "bg-ground" : "hover:bg-hairline/50"}`}
              >
                <span className="flex-[0_0_120px] font-mono text-xs sm:flex-[0_0_150px] sm:text-[13px]">{n}</span>
                <svg viewBox="0 -30 240 150" width="56" height="35" fill="none" aria-hidden="true" className="hidden flex-none sm:block">
                  <path d={curvePath(n)} stroke="var(--color-signal)" strokeWidth="5" strokeLinejoin="round" />
                </svg>
                <span className="relative mr-4 ml-2 h-6 flex-auto sm:mr-6" aria-hidden="true">
                  <span className="absolute inset-x-0 top-[11px] h-0.5 bg-hairline" />
                  <span className="absolute top-1 right-0 h-4 w-px bg-muted" />
                  <span
                    className="absolute top-1 -ml-2 size-4 rounded-full bg-ink"
                    style={{ left: `${Math.max(-0.1, Math.min(1.15, v)) * 100}%` }}
                  />
                </span>
                <span className="flex-[0_0_44px] text-right font-mono text-xs text-muted">{v.toFixed(2)}</span>
              </button>
            );
          })}
        </div>

        <div className="flex min-w-0 flex-[1_1_360px] flex-col gap-4">
          <div className="rounded-[20px] border border-hairline bg-surface p-2">
            <div className="dot-grid flex flex-col gap-2.5 rounded-[14px] bg-stage p-4">
              <div className="flex justify-between font-mono text-xs text-muted">
                <span>{sel}</span>
                <span>p {p.toFixed(3)}</span>
              </div>
              <svg viewBox="-10 -40 260 170" fill="none" aria-hidden="true" className="h-[260px] w-full">
                <line x1="0" y1="110" x2="240" y2="110" stroke="var(--color-muted)" />
                <line x1="0" y1="10" x2="240" y2="10" stroke="var(--color-muted)" strokeDasharray="3 4" />
                <line x1={x} y1="-35" x2={x} y2="110" stroke="var(--color-muted)" strokeDasharray="2 3" />
                <path d={curvePath(sel, 120)} stroke="var(--color-signal)" strokeWidth="2.5" strokeLinejoin="round" />
                <circle cx={x} cy={y} r="5" fill="var(--color-ink)" />
              </svg>
              <div className="flex justify-between font-mono text-xs text-muted">
                <span>t 0</span>
                <span>t 1</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2.5 rounded-[20px] border border-hairline bg-surface p-5">
            <h2 className="eyebrow">Character</h2>
            <p className="text-[15px] leading-[1.55] text-ink-2">{eases[sel].note}</p>
          </div>

          <div className="flex flex-col gap-3.5 rounded-[20px] border border-hairline bg-console px-5 py-[18px] font-mono text-[13px] leading-[21px] text-code">
            <CodeRow label="GSAP" copy={gsapLine}>
              gsap.to(el, {"{"} x: 240, duration: <span className="text-code-live">{duration}</span>, ease:{" "}
              <span className="text-code-live">&quot;{sel}&quot;</span> {"}"});
            </CodeRow>
            <div className="h-px bg-hairline" />
            <CodeRow label="CSS" copy={cssLine}>
              transition: transform <span className="text-code-live">{duration}s</span>{" "}
              <span className="text-code-live">{eases[sel].css}</span>;
            </CodeRow>
          </div>
        </div>
      </div>
    </div>
  );
}

function CodeRow({ label, copy, children }: { label: string; copy: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-code-muted">{label}</span>
        <CopyButton
          text={copy}
          label="Copy"
          aria-label={`Copy ${label} code`}
          className="h-8 rounded-lg bg-ink px-3 font-sans text-[13px] text-ground hover:bg-ink-2"
        />
      </div>
      <div className="overflow-x-auto whitespace-pre">{children}</div>
    </div>
  );
}
