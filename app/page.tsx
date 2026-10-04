import { HeroStage } from "@/components/site/hero-stage";
import { InstallChip } from "@/components/site/install-chip";
import { RecipeIndex } from "@/components/site/recipe-index";
import { recipes } from "@/content/recipes";
import { site } from "@/lib/site";

const specs = [
  { k: "Dependencies", v: "gsap + @gsap/react" },
  { k: "Size", v: "Under 150 lines each" },
  { k: "Cleanup", v: "useGSAP, no leaks" },
  { k: "Accessibility", v: "Reduced-motion fallback" },
  { k: "Install", v: "Copy, or shadcn CLI" },
];

export default function Home() {
  return (
    <main>
      <section className="mx-auto flex max-w-[1280px] flex-wrap items-center gap-12 px-4 pt-16 pb-12 sm:px-6 sm:pt-[72px]">
        <div className="flex min-w-0 flex-[1_1_440px] flex-col gap-6">
          <span className="eyebrow">GSAP · Next.js · {recipes.length} recipes</span>
          <h1 className="text-[clamp(48px,7vw,88px)] leading-[0.95] font-medium tracking-[-0.05em]">{site.tagline}</h1>
          <p className="max-w-[480px] text-lg leading-[1.55] text-ink-2">{site.description}</p>
          <div className="flex flex-wrap items-center gap-3">
            <a href="#recipes" className="flex h-12 items-center rounded-xl bg-ink px-5 text-[15px] font-medium text-ground hover:bg-ink-2">
              Browse recipes
            </a>
            <InstallChip slug="magnetic-button" />
          </div>
        </div>
        <HeroStage />
      </section>

      <section className="border-y border-hairline">
        <dl className="mx-auto grid max-w-[1280px] grid-cols-[repeat(auto-fit,minmax(200px,1fr))] px-4 sm:px-6">
          {specs.map((s) => (
            <div key={s.k} className="flex flex-col gap-1 py-5">
              <dt className="eyebrow">{s.k}</dt>
              <dd className="text-[15px] font-medium">{s.v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <RecipeIndex />
    </main>
  );
}
