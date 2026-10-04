"use client";

import { useState } from "react";
import { CopyButton } from "@/components/copy-button";
import { formatKnob, type Knob, type KnobValue } from "@/content/details";
import type { CodeToken } from "@/lib/highlight";

type CodePanelProps = {
  fileName: string;
  lines: CodeToken[][];
  installLines: CodeToken[][];
  knobs: Knob[];
  values: Record<string, KnobValue>;
  code: () => string;
  install: string;
  prompt: () => string;
};

function renderToken(token: CodeToken, knobs: Knob[], values: Record<string, KnobValue>, key: string) {
  const parts = token.text.split(/__K(\d+)__/);
  if (parts.length === 1) {
    return (
      <span key={key} style={{ color: token.color }}>
        {token.text}
      </span>
    );
  }
  return parts.map((part, i) => {
    if (i % 2 === 0) {
      return part ? (
        <span key={`${key}-${i}`} style={{ color: token.color }}>
          {part}
        </span>
      ) : null;
    }
    const knob = knobs[Number(part)];
    return (
      <mark key={`${key}-${i}`} className="bg-transparent text-code-live">
        {formatKnob(knob, values[knob.id] ?? knob.default)}
      </mark>
    );
  });
}

export function CodePanel({ fileName, lines, installLines, knobs, values, code, install, prompt }: CodePanelProps) {
  const [tab, setTab] = useState<"code" | "install">("code");
  const shown = tab === "code" ? lines : installLines;

  const tabClass = (on: boolean) =>
    `h-9 rounded-lg px-3 font-mono text-xs ${on ? "bg-hairline text-white" : "text-code-muted hover:text-code"}`;
  const ghost = "h-9 rounded-lg border border-line-strong px-3 text-[13px] text-code hover:bg-hairline";

  return (
    <div className="overflow-hidden rounded-[20px] border border-hairline bg-console text-code">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline py-2.5 pr-3 pl-2.5">
        <div role="tablist" aria-label="Code" className="flex gap-1">
          <button type="button" role="tab" aria-selected={tab === "code"} onClick={() => setTab("code")} className={tabClass(tab === "code")}>
            {fileName}
          </button>
          <button type="button" role="tab" aria-selected={tab === "install"} onClick={() => setTab("install")} className={tabClass(tab === "install")}>
            Install
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <CopyButton text={prompt} label="Copy as prompt" className={ghost} />
          <CopyButton
            text={tab === "code" ? code : () => install}
            label="Copy"
            className="h-9 rounded-lg bg-ink px-3.5 text-[13px] font-medium text-ground hover:bg-ink-2"
          />
        </div>
      </div>
      <pre role="tabpanel" className="overflow-x-auto px-6 pt-5 pb-6 font-mono text-[13px] leading-[21px]">
        <code>
          {shown.map((line, i) => (
            <div key={i} className="min-h-[21px] whitespace-pre">
              {line.map((t, j) => renderToken(t, knobs, values, `${i}-${j}`))}
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
}
