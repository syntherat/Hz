import Link from "next/link";
import { Curve } from "@/components/curve";

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-[720px] flex-col items-center gap-5 px-4 py-24 text-center">
      <div className="dot-grid flex h-[160px] w-[260px] items-center justify-center rounded-[14px] bg-stage">
        <Curve ease="bounce.out" className="h-[100px] w-[160px]" />
      </div>
      <span className="eyebrow">404 · no signal</span>
      <h1 className="text-[40px] leading-none font-medium tracking-[-0.04em]">This page doesn&apos;t exist.</h1>
      <p className="text-ink-2">The link may be old, or the recipe was renamed. Search with ⌘K or start from the index.</p>
      <Link href="/" className="flex h-11 items-center rounded-xl bg-ink px-4 text-sm font-medium text-ground hover:bg-ink-2">
        Back to recipes
      </Link>
    </main>
  );
}
