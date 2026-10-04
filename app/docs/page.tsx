import Link from "next/link";
import type { Metadata } from "next";
import { highlight, type CodeToken } from "@/lib/highlight";
import { installCommand } from "@/lib/site";
import { CopyButton } from "@/components/copy-button";

export const metadata: Metadata = {
  title: "Docs",
  description: "Install Hz recipes with the shadcn CLI or by copying the file, and use them in the Next.js App Router.",
};

const toc = [
  { id: "requirements", label: "Requirements" },
  { id: "install", label: "Install a recipe" },
  { id: "use", label: "Use it" },
  { id: "knobs", label: "Knobs are props" },
  { id: "app-router", label: "GSAP in the App Router" },
  { id: "reduced-motion", label: "Reduced motion" },
  { id: "prompt", label: "Copy as prompt" },
  { id: "faq", label: "FAQ" },
];

function Code({ lines, raw, title, shell }: { lines: CodeToken[][]; raw: string; title: string; shell?: boolean }) {
  return (
    <figure className="overflow-hidden rounded-2xl border border-hairline bg-console">
      <figcaption className="flex h-11 items-center justify-between gap-3 border-b border-hairline pr-1.5 pl-4">
        <span className="truncate font-mono text-xs text-code-muted">{title}</span>
        <CopyButton
          text={raw}
          label="Copy"
          aria-label={`Copy ${title}`}
          className="h-8 flex-none rounded-lg px-3 text-[13px] text-code-muted hover:bg-hairline hover:text-code"
        />
      </figcaption>
      <pre className="overflow-x-auto px-5 py-4 font-mono text-[13px] leading-[22px] text-code">
        <code>
          {lines.map((line, i) => {
            const text = line.map((t) => t.text).join("");
            return (
              <div key={i} className="min-h-[22px] whitespace-pre">
                {shell && text && !text.startsWith("#") && <span className="text-code-muted select-none">$ </span>}
                {line.map((t, j) => (
                  <span key={j} style={{ color: t.color }}>
                    {t.text}
                  </span>
                ))}
              </div>
            );
          })}
        </code>
      </pre>
    </figure>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="flex scroll-mt-8 flex-col gap-4">
      <h2 className="text-[28px] font-medium tracking-[-0.03em]">{title}</h2>
      {children}
    </section>
  );
}

const P = ({ children }: { children: React.ReactNode }) => <p className="max-w-[680px] text-base leading-[1.65] text-ink-2">{children}</p>;
const C = ({ children }: { children: React.ReactNode }) => (
  <code className="rounded-md border border-hairline bg-surface box-decoration-clone px-1.5 py-px font-mono text-[0.875em] text-ink">{children}</code>
);

const snippets = {
  deps: "npm i gsap @gsap/react",
  install: `${installCommand("magnetic-button")}`,
  use: `import { MagneticButton } from "@/components/magnetic-button";

export default function Page() {
  return (
    <MagneticButton strength={0.4} className="rounded-full bg-black px-6 py-3 text-white">
      Get started
    </MagneticButton>
  );
}`,
  register: `"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);`,
  reduced: `useGSAP(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  // animation setup
});`,
};

export default async function DocsPage() {
  const [deps, install, use, register, reduced] = await Promise.all([
    highlight(snippets.deps, "bash"),
    highlight(snippets.install, "bash"),
    highlight(snippets.use),
    highlight(snippets.register),
    highlight(snippets.reduced),
  ]);

  return (
    <div className="mx-auto flex max-w-[1280px] flex-wrap items-start gap-12 px-4 pt-12 pb-16 sm:px-6">
      <nav aria-label="On this page" className="flex flex-[1_1_200px] flex-col gap-1 lg:sticky lg:top-8">
        <span className="eyebrow pb-2">On this page</span>
        {toc.map((t) => (
          <a key={t.id} href={`#${t.id}`} className="rounded-lg py-1.5 text-sm text-ink-2 hover:text-ink">
            {t.label}
          </a>
        ))}
      </nav>

      <main className="flex min-w-0 flex-[999_1_640px] flex-col gap-14">
        <div className="flex flex-col gap-3">
          <span className="eyebrow">Docs</span>
          <h1 className="text-[40px] leading-none font-medium tracking-[-0.045em] sm:text-[56px]">Using Hz</h1>
          <P>
            Every recipe is one small, typed React component. Install it with the shadcn CLI or copy the file. Either way the code lives in
            your project and is yours to change.
          </P>
        </div>

        <Section id="requirements" title="Requirements">
          <P>
            A Next.js project using the App Router, React 19, and two packages: <C>gsap</C> and <C>@gsap/react</C>. Demos use Tailwind
            classes, but the recipes themselves don&apos;t depend on Tailwind.
          </P>
          <Code lines={deps} raw={snippets.deps} title="Terminal" shell />
        </Section>

        <Section id="install" title="Install a recipe">
          <P>
            With the shadcn CLI, one command adds the component file and its dependencies. Every recipe page has the exact command on its
            Install tab.
          </P>
          <Code lines={install} raw={snippets.install} title="Terminal" shell />
          <P>
            Prefer not to use the CLI? Open the recipe, press <strong className="text-ink">Copy</strong> on the code panel, and paste it
            into a file in your components folder.
          </P>
        </Section>

        <Section id="use" title="Use it">
          <P>Import it like any other component. Every prop is typed and has a default, so you only pass what you want to change.</P>
          <Code lines={use} raw={snippets.use} title="app/page.tsx" />
        </Section>

        <Section id="knobs" title="Knobs are props">
          <P>
            The knobs on a recipe page map to the component&apos;s props, and their defaults are the values you see in the code. Tune them
            on the page, then copy: the code you get has your values baked in as the new defaults.
          </P>
        </Section>

        <Section id="app-router" title="GSAP in the App Router">
          <P>
            Anything that animates runs in the browser, so recipe files start with <C>&quot;use client&quot;</C>. All setup happens inside{" "}
            <C>useGSAP</C>, which reverts tweens and ScrollTriggers when the component unmounts, so navigating between pages never leaks
            animations. Register plugins once, at the top of the file that uses them.
          </P>
          <Code lines={register} raw={snippets.register} title="components/pinned-horizontal-gallery.tsx" />
        </Section>

        <Section id="reduced-motion" title="Reduced motion">
          <P>
            Every recipe checks <C>prefers-reduced-motion</C> and has a real fallback, not just a disabled effect. Each recipe page says
            exactly what happens, and the stage has a toggle so you can see it without changing your system settings.
          </P>
          <Code lines={reduced} raw={snippets.reduced} title="Inside a recipe" />
        </Section>

        <Section id="prompt" title="Copy as prompt">
          <P>
            The <strong className="text-ink">Copy as prompt</strong> button copies the recipe, its rules and your tuned code as one block
            you can paste into Cursor, Claude or any AI editor, so it adapts the recipe instead of reinventing it.
          </P>
        </Section>

        <Section id="faq" title="FAQ">
          <dl className="flex max-w-[680px] flex-col gap-6">
            <div className="flex flex-col gap-1.5">
              <dt className="font-medium">Is GSAP free?</dt>
              <dd className="leading-[1.65] text-ink-2">
                Yes. Since 2025 GSAP and all its plugins, including SplitText, MorphSVG and Inertia, are free to use. See GSAP&apos;s own
                license for the details.
              </dd>
            </div>
            <div className="flex flex-col gap-1.5">
              <dt className="font-medium">Why not Framer Motion?</dt>
              <dd className="leading-[1.65] text-ink-2">
                Nothing wrong with it. Hz exists because there are few GSAP-first collections written properly for React and the App Router.
              </dd>
            </div>
            <div className="flex flex-col gap-1.5">
              <dt className="font-medium">A recipe says &ldquo;Coming soon&rdquo;.</dt>
              <dd className="leading-[1.65] text-ink-2">
                It&apos;s queued for a later release. Recipes ship in batches, each with its notes and registry entry.{" "}
                <Link href="/" className="text-ink underline underline-offset-4">See what&apos;s ready</Link>.
              </dd>
            </div>
          </dl>
        </Section>
      </main>
    </div>
  );
}
