"use client";

import { Curve } from "@/components/curve";
import { eases, shortEaseName } from "@/lib/eases";
import type { Knob, KnobValue } from "@/content/details";

type KnobsProps = {
  knobs: Knob[];
  values: Record<string, KnobValue>;
  onChange: (id: string, value: KnobValue) => void;
  onReset: () => void;
};

const segment = (on: boolean) =>
  `h-10 rounded-lg border px-2.5 font-mono text-xs ${
    on ? "border-ink bg-ink text-ground" : "border-hairline bg-surface text-ink hover:border-line-strong"
  }`;

function Head({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between font-mono text-xs text-muted">
      <span className="uppercase">{label}</span>
      <span className="text-ink">{value}</span>
    </div>
  );
}

export function Knobs({ knobs, values, onChange, onReset }: KnobsProps) {
  return (
    <div className="flex min-w-0 flex-[1_1_280px] flex-col gap-[22px] rounded-[20px] border border-hairline bg-surface p-5">
      <div className="flex items-baseline justify-between">
        <h2 className="text-[15px] font-semibold">Knobs</h2>
        <button type="button" onClick={onReset} className="py-2 font-mono text-xs text-muted hover:text-ink">
          Reset
        </button>
      </div>

      {knobs.map((k) => {
        const value = values[k.id] ?? k.default;

        if (k.kind === "ease") {
          return (
            <fieldset key={k.id} className="flex flex-col gap-2.5">
              <legend className="contents">
                <Head label={k.label} value={String(value)} />
              </legend>
              <div className="rounded-[10px] bg-ground p-2.5">
                <Curve ease={String(value)} className="h-[120px] w-full" />
              </div>
              <div role="radiogroup" aria-label={k.label} className="grid grid-cols-2 gap-1.5">
                {k.options.map((o) => (
                  <button key={o} type="button" role="radio" aria-checked={o === value} onClick={() => onChange(k.id, o)} className={`${segment(o === value)} text-left`}>
                    {shortEaseName(o)}
                  </button>
                ))}
              </div>
              <p className="text-[13px] leading-normal text-ink-2">{eases[String(value)]?.note}</p>
            </fieldset>
          );
        }

        if (k.kind === "choice") {
          return (
            <fieldset key={k.id} className="flex flex-col gap-2.5">
              <legend className="contents">
                <Head label={k.label} value={`${Number(value).toFixed(2)}${k.unit ?? ""}`} />
              </legend>
              <div role="radiogroup" aria-label={k.label} className="grid grid-cols-3 gap-1.5">
                {k.options.map((o) => (
                  <button key={o} type="button" role="radio" aria-checked={o === value} onClick={() => onChange(k.id, o)} className={segment(o === value)}>
                    {o.toFixed(2)}
                    {k.unit}
                  </button>
                ))}
              </div>
            </fieldset>
          );
        }

        if (k.kind === "option") {
          const picked = k.options.find((o) => o.value === value) ?? k.options[0];
          return (
            <fieldset key={k.id} className="flex flex-col gap-2.5">
              <legend className="contents">
                <Head label={k.label} value={picked.head ?? picked.label} />
              </legend>
              <div role="radiogroup" aria-label={k.label} className={`grid gap-1.5 ${k.options.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
                {k.options.map((o) => (
                  <button key={o.value} type="button" role="radio" aria-checked={o.value === value} onClick={() => onChange(k.id, o.value)} className={segment(o.value === value)}>
                    {o.label}
                  </button>
                ))}
              </div>
              {picked.note && <p className="text-[13px] leading-normal text-ink-2">{picked.note}</p>}
            </fieldset>
          );
        }

        return (
          <div key={k.id} className="flex flex-col gap-2.5">
            <label htmlFor={`knob-${k.id}`}>
              <Head label={k.label} value={Number(value).toFixed(2)} />
            </label>
            <input
              id={`knob-${k.id}`}
              type="range"
              min={k.min}
              max={k.max}
              step={k.step}
              value={Number(value)}
              onChange={(e) => onChange(k.id, Number(e.target.value))}
              className="h-6 w-full accent-ink"
            />
          </div>
        );
      })}
    </div>
  );
}
