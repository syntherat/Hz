"use client";

import { useEffect, useState, type ReactNode } from "react";

type CopyButtonProps = {
  text: string | (() => string);
  label?: ReactNode;
  copiedLabel?: ReactNode;
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
};

export function CopyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="9" y="9" width="12" height="12" rx="2" />
      <path d="M5 15V5a2 2 0 0 1 2-2h10" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

// navigator.clipboard only exists on https and localhost, so a phone on the LAN ip needs the old textarea trick
function legacyCopy(value: string) {
  const active = document.activeElement as HTMLElement | null;
  const area = document.createElement("textarea");
  area.value = value;
  area.setAttribute("readonly", "");
  // 16px stops iOS from zooming in on focus
  area.style.cssText = "position:fixed;top:0;left:0;opacity:0;font-size:16px;";
  document.body.appendChild(area);
  area.select();
  area.setSelectionRange(0, value.length);
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {}
  area.remove();
  active?.focus({ preventScroll: true });
  return ok;
}

export function CopyButton({ text, label, copiedLabel = "Copied", className, ...rest }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(id);
  }, [copied]);

  async function copy() {
    const value = typeof text === "function" ? text() : text;
    if (!navigator.clipboard) {
      setCopied(legacyCopy(value));
      return;
    }
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {
      setCopied(legacyCopy(value));
    }
  }

  const iconOnly = label === undefined;

  return (
    <button type="button" onClick={copy} className={className} aria-label={rest["aria-label"]} aria-describedby={rest["aria-describedby"]}>
      {iconOnly ? copied ? <CheckIcon /> : <CopyIcon /> : copied ? copiedLabel : label}
      <span className="sr-only" aria-live="polite">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </button>
  );
}
