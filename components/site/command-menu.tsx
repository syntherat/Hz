"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { recipes } from "@/content/recipes";

type Item = { id: string; label: string; meta: string; href: string; group: string; soon?: boolean };

const pages: Item[] = [
  { id: "home", label: "All recipes", meta: "Home", href: "/", group: "Pages" },
  { id: "easing", label: "Easing lab", meta: "Tool", href: "/easing", group: "Pages" },
  { id: "docs", label: "Docs", meta: "Install and usage", href: "/docs", group: "Pages" },
  { id: "about", label: "About", meta: "What Hz is", href: "/about", group: "Pages" },
];

const items: Item[] = [
  ...recipes.map((r) => ({
    id: r.id,
    label: r.name,
    meta: `${r.id} · ${r.plugins}`,
    href: `/recipes/${r.slug}`,
    group: r.section,
    soon: !r.ready,
  })),
  ...pages,
];

function matches(item: Item, q: string) {
  const hay = `${item.label} ${item.meta} ${item.group}`.toLowerCase();
  return q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => hay.includes(word));
}

export function CommandMenu() {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const results = useMemo(() => (query ? items.filter((i) => matches(i, query)) : items), [query]);

  function open() {
    setQuery("");
    setActive(0);
    dialogRef.current?.showModal();
    inputRef.current?.focus();
  }

  function close() {
    dialogRef.current?.close();
  }

  function go(item: Item | undefined) {
    if (!item) return;
    close();
    router.push(item.href);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (dialogRef.current?.open) close();
        else open();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.getElementById(`cmd-${results[active]?.id}`)?.scrollIntoView({ block: "nearest" });
  }, [active, results]);

  function onInputKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      go(results[active]);
    }
  }

  let lastGroup = "";

  return (
    <>
      <button
        type="button"
        onClick={open}
        className="flex h-10 items-center gap-6 rounded-[10px] border border-hairline bg-surface px-3 text-sm text-muted hover:text-ink"
      >
        Search recipes
        <kbd className="rounded border border-hairline px-1.5 font-mono text-xs">⌘K</kbd>
      </button>

      <dialog
        ref={dialogRef}
        aria-label="Search recipes and pages"
        onClick={(e) => e.target === e.currentTarget && close()}
        className="m-auto mt-[12vh] w-[min(640px,calc(100vw-32px))] rounded-2xl border border-hairline bg-surface p-0 text-ink backdrop:bg-black/60 backdrop:backdrop-blur-[2px]"
      >
        <div className="flex items-center gap-3 border-b border-hairline px-4">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true" className="text-muted">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onInputKey}
            placeholder="Search by name, plugin or section"
            aria-label="Search"
            role="combobox"
            aria-expanded="true"
            aria-controls="cmd-list"
            aria-activedescendant={results[active] ? `cmd-${results[active].id}` : undefined}
            className="h-14 flex-1 bg-transparent text-base outline-none placeholder:text-muted"
          />
          <kbd className="rounded border border-hairline px-1.5 font-mono text-xs text-muted">esc</kbd>
        </div>

        {results.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-6 py-14 text-center">
            <p className="eyebrow">No matches</p>
            <p className="text-ink-2">
              Nothing matches &ldquo;{query}&rdquo;. Try a plugin like <span className="font-mono text-ink">Flip</span> or{" "}
              <span className="font-mono text-ink">ScrollTrigger</span>.
            </p>
          </div>
        ) : (
          <ul id="cmd-list" role="listbox" className="max-h-[min(420px,60vh)] overflow-y-auto p-2">
            {results.map((item, i) => {
              const header = item.group !== lastGroup ? item.group : null;
              lastGroup = item.group;
              return (
                <li key={item.id} role="presentation">
                  {header && <div className="eyebrow px-3 pt-3 pb-2">{header}</div>}
                  <div
                    id={`cmd-${item.id}`}
                    role="option"
                    aria-selected={i === active}
                    onMouseMove={() => setActive(i)}
                    onClick={() => go(item)}
                    className={`flex cursor-pointer items-center justify-between gap-4 rounded-lg px-3 py-2.5 text-sm ${i === active ? "bg-hairline" : ""}`}
                  >
                    <span>{item.label}</span>
                    <span className="flex items-center gap-2 font-mono text-xs text-muted">
                      {item.soon && <span className="rounded border border-hairline px-1.5">soon</span>}
                      {item.meta}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </dialog>
    </>
  );
}
