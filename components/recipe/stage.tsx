"use client";

import { useEffect, type ReactNode } from "react";
import gsap from "gsap";
import { FrameRate } from "@/components/recipe/frame-rate";

type StageProps = {
  label: string;
  readout?: ReactNode;
  slow: boolean;
  reduced: boolean;
  onSlow: (v: boolean) => void;
  onReduced: (v: boolean) => void;
  tools?: ReactNode;
  children: ReactNode;
};

function Toggle({ on, onClick, children, mono }: { on: boolean; onClick: () => void; children: ReactNode; mono?: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`h-9 rounded-lg border px-3 text-[13px] ${mono ? "font-mono text-xs" : ""} ${
        on ? "border-ink bg-ink text-ground" : "border-hairline bg-surface text-ink hover:border-line-strong"
      }`}
    >
      {children}
    </button>
  );
}

export function Stage({ label, readout, slow, reduced, onSlow, onReduced, tools, children }: StageProps) {
  useEffect(() => {
    gsap.globalTimeline.timeScale(slow ? 0.25 : 1);
    return () => {
      gsap.globalTimeline.timeScale(1);
    };
  }, [slow]);

  return (
    <div className="flex min-w-0 flex-[999_1_480px] flex-col rounded-[20px] border border-hairline bg-surface p-2">
      <div className="dot-grid relative flex h-[440px] items-center justify-center overflow-hidden rounded-[14px] bg-stage">
        <div className="pointer-events-none absolute inset-x-4 top-3.5 flex justify-between font-mono text-xs text-muted">
          <span>{label} · STAGE</span>
          <span>{readout}</span>
        </div>
        {children}
        <div className="absolute inset-x-3 bottom-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            {tools}
            <Toggle on={slow} onClick={() => onSlow(!slow)} mono>
              0.25×
            </Toggle>
            <Toggle on={reduced} onClick={() => onReduced(!reduced)}>
              Reduced motion
            </Toggle>
          </div>
          <span className="font-mono text-xs text-muted">
            <FrameRate scale={slow ? 0.25 : 1} />
          </span>
        </div>
      </div>
    </div>
  );
}
