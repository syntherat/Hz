import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Sidebar } from "@/components/recipe/sidebar";
import { Playground } from "@/components/recipe/playground";
import { Curve } from "@/components/curve";
import { details } from "@/content/details";
import { getRecipe, neighbours, recipes } from "@/content/recipes";
import { highlight, highlightWithKnobs, readSource } from "@/lib/highlight";
import { installCommand } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return recipes.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/recipes/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const recipe = getRecipe(slug);
  if (!recipe) return {};
  return {
    title: `${recipe.id} ${recipe.name}`,
    description: details[slug]?.description ?? recipe.summary,
  };
}

function Chip({ children }: { children: React.ReactNode }) {
  return <span className="rounded-md border border-hairline bg-surface px-2.5 py-1 font-mono text-xs">{children}</span>;
}

export default async function RecipePage({ params }: PageProps<"/recipes/[slug]">) {
  const { slug } = await params;
  const recipe = getRecipe(slug);
  if (!recipe) notFound();

  const d = details[slug];
  const { prev, next } = neighbours(slug);
  const install = installCommand(slug);

  let body: React.ReactNode;
  let lineCount: number | null = null;

  if (d) {
    const source = await readSource(d.file);
    lineCount = source.trimEnd().split("\n").length;
    const [lines, installLines] = await Promise.all([
      highlightWithKnobs(source, d.knobs),
      highlight(`# with the shadcn CLI, adds the file and its dependencies\n${install}\n\n# or copy the file, then\nnpm i gsap @gsap/react`, "bash"),
    ]);
    body = (
      <>
        <Playground recipe={recipe} source={source} lines={lines} installLines={installLines} install={install} />

        <section className="flex flex-col gap-4">
          <h2 className="text-[28px] font-medium tracking-[-0.03em]">Why it feels right</h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-3">
            {d.notes.map((n) => (
              <div key={n.title} className="flex flex-col gap-2 rounded-[14px] border border-hairline bg-surface p-5">
                <h3 className="eyebrow">{n.title}</h3>
                <p className="text-[15px] leading-[1.55] text-ink-2">{n.body}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-6 rounded-[14px] border border-hairline bg-surface p-5">
            <h3 className="eyebrow flex-[0_0_140px]">Accessibility</h3>
            <p className="flex-[1_1_320px] text-[15px] leading-[1.55] text-ink-2">{d.accessibility}</p>
          </div>
        </section>
      </>
    );
  } else {
    body = (
      <section className="flex flex-col items-center gap-5 rounded-[20px] border border-dashed border-hairline px-6 py-16 text-center">
        <div className="dot-grid flex h-[140px] w-[220px] items-center justify-center rounded-[14px] bg-stage">
          <Curve ease={recipe.ease} className="h-[88px] w-[140px]" />
        </div>
        <span className="eyebrow">Not built yet</span>
        <p className="max-w-md text-ink-2">
          {recipe.summary} It will use <span className="font-mono text-ink">{recipe.plugins}</span> with{" "}
          <span className="font-mono text-ink">{recipe.ease}</span>. Recipes ship one at a time, each fully tuned and documented.
        </p>
        <Link href="/recipes/magnetic-button" className="flex h-11 items-center rounded-xl bg-ink px-4 text-sm font-medium text-ground hover:bg-ink-2">
          Try R01 Magnetic button
        </Link>
      </section>
    );
  }

  return (
    <div className="mx-auto flex max-w-[1440px] flex-wrap items-start gap-10 px-4 pt-8 pb-16 sm:px-6">
      <Sidebar current={slug} />
      <main className="flex min-w-0 flex-[999_1_640px] flex-col gap-8">
        <div className="flex flex-col gap-3.5">
          <nav aria-label="Breadcrumb" className="font-mono text-xs text-muted">
            <Link href="/" className="hover:text-ink">Recipes</Link> / {recipe.section} / {recipe.id}
          </nav>
          <h1 className="text-[38px] leading-none font-medium tracking-[-0.045em] sm:text-[56px]">{recipe.name}</h1>
          <p className="max-w-[640px] text-lg leading-[1.55] text-ink-2">{d?.description ?? recipe.summary}</p>
          <div className="flex flex-wrap gap-2">
            {(d?.chips ?? [recipe.plugins]).map((c) => (
              <Chip key={c}>{c}</Chip>
            ))}
            {lineCount && <Chip>{lineCount} lines</Chip>}
          </div>
        </div>

        {body}

        <nav aria-label="Next and previous recipe" className="flex flex-wrap justify-between gap-3 border-t border-hairline pt-6">
          <Link href={`/recipes/${prev.slug}`} className="flex flex-col gap-1 text-muted hover:text-ink">
            <span className="font-mono text-xs">← {prev.id}</span>
            <span className="text-base text-ink">{prev.name}</span>
          </Link>
          <Link href={`/recipes/${next.slug}`} className="flex flex-col items-end gap-1 text-muted hover:text-ink">
            <span className="font-mono text-xs">{next.id} →</span>
            <span className="text-base text-ink">{next.name}</span>
          </Link>
        </nav>
      </main>
    </div>
  );
}
