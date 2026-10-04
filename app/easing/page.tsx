import Link from "next/link";
import type { Metadata } from "next";
import { Curve } from "@/components/curve";
import { eases } from "@/lib/eases";

export const metadata: Metadata = { title: "Easing lab" };

export default function EasingPage() {
  const names = Object.keys(eases);
  return (
    <main className="mx-auto flex max-w-[1280px] flex-col gap-8 px-4 pt-12 pb-16 sm:px-6">
      <div className="flex max-w-[640px] flex-col gap-3">
        <span className="eyebrow">Tool · {names.length} eases</span>
        <h1 className="text-[40px] leading-none font-medium tracking-[-0.045em] sm:text-[56px]">Easing lab</h1>
        <p className="text-lg leading-[1.55] text-ink-2">
          Scrub time and watch every ease race side by side. The interactive lab is not built yet. Until then, here is the full set with
          what each one is good for.
        </p>
      </div>
      <ul className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3">
        {names.map((n) => (
          <li key={n} className="flex flex-col gap-3 rounded-2xl border border-hairline bg-surface p-4">
            <div className="dot-grid flex h-[120px] items-center justify-center rounded-[11px] bg-stage">
              <Curve ease={n} className="h-[80px] w-[128px]" />
            </div>
            <div className="flex items-baseline justify-between gap-2">
              <span className="font-mono text-sm">{n}</span>
              <span className="font-mono text-[11px] text-muted">{eases[n].css}</span>
            </div>
            <p className="text-sm leading-normal text-ink-2">{eases[n].note}</p>
          </li>
        ))}
      </ul>
      <Link href="/" className="text-sm text-muted hover:text-ink">
        ← Back to recipes
      </Link>
    </main>
  );
}
