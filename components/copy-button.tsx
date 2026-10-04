"use client";

import { useEffect, useState, type ReactNode } from "react";

type CopyButtonProps = {
  text: string | (() => string);
  label?: ReactNode;
  copiedLabel?: ReactNode;
  className?: string;
  "aria-label"?: string;
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

export function CopyButton({ text, label, copiedLabel = "Copied", className, ...rest }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(id);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(typeof text === "function" ? text() : text);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  const iconOnly = label === undefined;

  return (
    <button type="button" onClick={copy} className={className} aria-label={rest["aria-label"]}>
      {iconOnly ? copied ? <CheckIcon /> : <CopyIcon /> : copied ? copiedLabel : label}
      <span className="sr-only" aria-live="polite">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </button>
  );
}
