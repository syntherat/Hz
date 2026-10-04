import Link from "next/link";
import { recipes, sections } from "@/content/recipes";

export function RecipeList({ current }: { current: string }) {
  return sections.map((s) => (
    <div key={s} className="flex flex-col gap-0.5">
      <div className="eyebrow px-2.5 pb-2">{s}</div>
      {recipes
        .filter((r) => r.section === s)
        .map((r) => {
          const on = r.slug === current;
          return (
            <Link
              key={r.slug}
              href={`/recipes/${r.slug}`}
              aria-current={on ? "page" : undefined}
              className={`flex items-center gap-2.5 rounded-lg px-2.5 py-[7px] text-sm ${
                on ? "bg-surface text-ink shadow-[inset_0_0_0_1px_var(--color-hairline)]" : "text-ink-2 hover:text-ink"
              }`}
            >
              <span className="w-7 font-mono text-xs text-muted">{r.id}</span>
              <span className="flex-1">{r.name}</span>
              {!r.ready && <span className="size-1 rounded-full bg-line-strong" aria-label="Coming soon" />}
            </Link>
          );
        })}
    </div>
  ));
}

export function Sidebar({ current }: { current: string }) {
  return (
    <aside aria-label="All recipes" className="hidden max-w-full flex-[1_1_220px] flex-col gap-6 lg:flex">
      <RecipeList current={current} />
    </aside>
  );
}
