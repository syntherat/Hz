import Link from "next/link";
import type { Metadata } from "next";
import { SineMark } from "@/components/wordmark";
import { recipes } from "@/content/recipes";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: "Why Hz exists, and the rules every recipe follows.",
};

const principles = [
  { n: "01", title: "Measured, not busy", body: "Every motion earns its place. Calm is the default." },
  { n: "02", title: "Show the numbers", body: "Ease, duration, progress and frame rate stay visible, like an instrument." },
  { n: "03", title: "The stage is the hero", body: "The interface steps back, like walls in a gallery." },
];

const rules = [
  "Only gsap and @gsap/react as dependencies.",
  "Under 150 lines for the component.",
  "Set up inside useGSAP, so cleanup is automatic.",
  "Safe for server rendering in the App Router.",
  "A real reduced-motion fallback.",
  "Interruptible where it matters.",
  "Keyboard friendly, with alternatives for pointer-only gestures.",
];

export default function AboutPage() {
  const ready = recipes.filter((r) => r.ready).length;

  return (
    <main className="mx-auto flex max-w-[960px] flex-col gap-16 px-4 pt-12 pb-16 sm:px-6">
      <div className="flex flex-col gap-5">
        <span className="eyebrow flex items-center gap-2">
          About <SineMark />
        </span>
        <h1 className="text-[40px] leading-[1.02] font-medium tracking-[-0.045em] sm:text-[64px]">
          Motion that feels crafted, not busy.
        </h1>
        <p className="max-w-[640px] text-lg leading-[1.6] text-ink-2">
          Hz is a set of GSAP interaction recipes for Next.js. Each one is small enough to read in a minute, tuned until it feels right, and
          explained so you know why it works. The name is the unit of frequency: smooth motion is a frame rate you never notice.
        </p>
        <p className="font-mono text-sm text-muted">
          {ready} of {recipes.length} recipes ready
        </p>
      </div>

      <section className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-3">
        {principles.map((p) => (
          <div key={p.n} className="flex flex-col gap-2 rounded-[14px] border border-hairline bg-surface p-5">
            <span className="font-mono text-xs text-muted">{p.n}</span>
            <h2 className="text-[17px] font-semibold">{p.title}</h2>
            <p className="text-sm leading-normal text-ink-2">{p.body}</p>
          </div>
        ))}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-[28px] font-medium tracking-[-0.03em]">Every recipe follows the same rules</h2>
        <ol className="flex flex-col divide-y divide-hairline rounded-[14px] border border-hairline bg-surface">
          {rules.map((r, i) => (
            <li key={r} className="flex gap-4 px-5 py-3.5 text-[15px]">
              <span className="w-6 font-mono text-xs leading-6 text-muted">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-ink-2">{r}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-[28px] font-medium tracking-[-0.03em]">Credits</h2>
        <p className="max-w-[640px] leading-[1.65] text-ink-2">
          Built on <a href="https://gsap.com" className="text-ink underline underline-offset-4">GSAP</a>, which became free for everyone in
          2025. Distributed through the{" "}
          <a href="https://ui.shadcn.com/docs/registry" className="text-ink underline underline-offset-4">shadcn registry</a>. Type set in
          Geist. Made by{" "}
          <a href={site.author.url} className="text-ink underline underline-offset-4">{site.author.name}</a>. The code is MIT licensed and
          on <a href={site.github} className="text-ink underline underline-offset-4">GitHub</a>.
        </p>
        <Link href="/docs" className="text-sm text-muted hover:text-ink">
          Read the docs →
        </Link>
      </section>
    </main>
  );
}
