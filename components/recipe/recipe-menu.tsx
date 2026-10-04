"use client";

import Link from "next/link";
import { useRef } from "react";
import { RecipeList } from "@/components/recipe/sidebar";

export function RecipeMenu({ current, id, total }: { current: string; id: string; total: number }) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  function open() {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    dialog.querySelector("[aria-current]")?.scrollIntoView({ block: "center" });
  }

  const close = () => dialogRef.current?.close();

  return (
    <div className="-mb-2 flex h-11 items-center justify-between lg:hidden">
      <Link href="/#recipes" className="-ml-2.5 flex h-11 items-center gap-1.5 px-2.5 text-sm text-ink-2 hover:text-ink">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Recipes
      </Link>
      <span className="font-mono text-xs text-muted">
        {id} / {total}
      </span>
      <button
        type="button"
        onClick={open}
        aria-label="All recipes"
        aria-haspopup="dialog"
        className="-mr-2.5 flex size-11 items-center justify-center rounded-[10px] text-ink hover:bg-surface"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
          <path d="M4 7h16M4 12h16M4 17h10" />
        </svg>
      </button>

      <dialog
        ref={dialogRef}
        aria-label="All recipes"
        onClick={(e) => {
          // backdrop clicks land on the dialog itself; link clicks close it before the route changes
          if (e.target === e.currentTarget || (e.target as Element).closest("a")) close();
        }}
        className="mx-0 mt-auto mb-0 max-h-[85dvh] w-full max-w-full rounded-t-[20px] border border-b-0 border-hairline bg-ground p-0 text-ink backdrop:bg-black/60 backdrop:backdrop-blur-[2px]"
      >
        <div className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-hairline bg-ground pr-2 pl-4">
          <span className="eyebrow">All recipes</span>
          <button type="button" onClick={close} aria-label="Close" className="flex size-11 items-center justify-center rounded-[10px] text-ink hover:bg-surface">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <nav aria-label="All recipes" className="flex flex-col gap-6 px-2 pt-4 [&_a]:py-2.5 pb-[calc(24px+env(safe-area-inset-bottom))]">
          <RecipeList current={current} />
        </nav>
      </dialog>
    </div>
  );
}
