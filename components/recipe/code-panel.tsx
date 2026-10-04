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

const PREVIEW_LINES = 7;

export function CodePanel({ fileName, lines, installLines, knobs, values, code, install, prompt }: CodePanelProps) {
  const [tab, setTab] = useState<"code" | "install">("code");
  const [expanded, setExpanded] = useState(false);
  const shown = tab === "code" ? lines : installLines;
  // phones get a 7 line preview around the first knob value; Install is short enough to show whole
  const foldable = tab === "code" && lines.length > PREVIEW_LINES;
  const folded = foldable && !expanded;
  const firstKnob = lines.findIndex((line) => line.some((t) => /__K\d+__/.test(t.text)));
  const from = Math.max(0, Math.min(firstKnob - 1, lines.length - PREVIEW_LINES));

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
          <span className="group relative">
            <CopyButton text={prompt} label="Copy as prompt" className={ghost} aria-describedby="copy-prompt-tip" />
            <span
              id="copy-prompt-tip"
              role="tooltip"
              className="pointer-events-none absolute top-full left-0 z-10 mt-2 hidden w-64 max-w-[calc(100vw-2rem)] rounded-lg border border-line-strong bg-console px-3 py-2 text-xs leading-[18px] text-code shadow-lg group-hover:block group-has-focus-visible:block sm:right-0 sm:left-auto"
            >
              A ready-made request for an AI assistant like Claude, Cursor or Copilot: the rules, install command and code at your knob values.
            </span>
          </span>
          <CopyButton
            text={tab === "code" ? code : () => install}
            label="Copy"
            className="h-9 rounded-lg bg-ink px-3.5 text-[13px] font-medium text-ground hover:bg-ink-2"
          />
        </div>
      </div>
      <pre
        id="code-panel-body"
        role="tabpanel"
        className={`overflow-x-auto px-6 pt-5 pb-6 font-mono text-[13px] leading-[21px] max-sm:px-4 max-sm:pt-3.5 max-sm:text-xs max-sm:leading-5 ${folded ? "max-sm:pb-3" : ""}`}
      >
        <code>
          {shown.map((line, i) => (
            <div key={i} className={`min-h-[21px] whitespace-pre max-sm:min-h-5 ${folded && (i < from || i >= from + PREVIEW_LINES) ? "max-sm:hidden" : ""}`}>
              {line.map((t, j) => renderToken(t, knobs, values, `${i}-${j}`))}
            </div>
          ))}
        </code>
      </pre>
      {foldable && (
        <div className="px-4 pb-3.5 font-mono text-[11px] text-code-muted sm:hidden">
          {folded ? `Showing ${PREVIEW_LINES} of ${lines.length} lines · ` : `${lines.length} lines · `}
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            aria-expanded={expanded}
            aria-controls="code-panel-body"
            className="-my-3 py-3 text-code underline-offset-4 hover:underline"
          >
            {folded ? "Expand" : "Collapse"}
          </button>
        </div>
      )}
    </div>
  );
}
