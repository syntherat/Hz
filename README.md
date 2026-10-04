# Hz

**Motion, measured.** GSAP interaction recipes for Next.js.

Each recipe is one small, typed React component. You can tune it live on the site, read why it feels right, then copy the file or
install it with one command.

Site: https://hz.sounakpal.dev

## Why

Most React motion collections are built on Framer Motion. GSAP's own demos are plain-JavaScript CodePens. Hz sits in between:
GSAP-first components written properly for React and the App Router, now that every GSAP plugin (SplitText, MorphSVG, Inertia,
ScrambleText, DrawSVG and the rest) is free.

Every recipe explains its choices: the ease and why it was picked, the timing, what happens if you interrupt it, and how it
behaves with reduced motion turned on.

## Install a recipe

With the shadcn CLI:

```bash
npx shadcn@latest add https://hz.sounakpal.dev/r/magnetic-button.json
```

Or copy the file from the recipe page (or from `registry/hz/<slug>/`) and install the two dependencies:

```bash
npm i gsap @gsap/react
```

Then use it like any component:

```tsx
import { MagneticButton } from "@/components/magnetic-button";

export default function Page() {
  return (
    <MagneticButton strength={0.4} className="rounded-full bg-black px-6 py-3 text-white">
      Get started
    </MagneticButton>
  );
}
```

The knobs on each recipe page are the component's prop defaults. When you copy from the site, you get the file with your tuned
values already in place.

## Rules every recipe follows

- Only `gsap` and `@gsap/react` as dependencies.
- Under 150 lines for the component.
- `"use client"`, with all setup inside `useGSAP`, so cleanup is automatic.
- Safe for server rendering in the App Router.
- A real reduced-motion fallback, not just "do nothing".
- Interruptible where it matters.
- Keyboard friendly, with alternatives for pointer-only gestures.

## Recipes

Available now:

| ID | Recipe | Section | Uses |
|---|---|---|---|
| R01 | [Magnetic button](https://hz.sounakpal.dev/recipes/magnetic-button) | Micro | quickTo |
| R02 | [Line-mask headline](https://hz.sounakpal.dev/recipes/line-mask-headline) | Micro | SplitText |
| R04 | [Text scramble](https://hz.sounakpal.dev/recipes/text-scramble) | Micro | ScrambleText |
| R08 | [Sliding tab indicator](https://hz.sounakpal.dev/recipes/sliding-tab-indicator) | Micro | Flip |
| R09 | [Flip filter grid](https://hz.sounakpal.dev/recipes/flip-filter-grid) | Layout & scroll | Flip |
| R11 | [Pinned horizontal gallery](https://hz.sounakpal.dev/recipes/pinned-horizontal-gallery) | Layout & scroll | ScrollTrigger |
| R13 | [Height-auto accordion](https://hz.sounakpal.dev/recipes/height-auto-accordion) | Layout & scroll | Core |
| R14 | [Scroll-read highlight](https://hz.sounakpal.dev/recipes/scroll-read-highlight) | Layout & scroll | ScrollTrigger |
| R17 | [Velocity marquee](https://hz.sounakpal.dev/recipes/velocity-marquee) | Physics & delight | ScrollTrigger |
| R18 | [Inertia carousel](https://hz.sounakpal.dev/recipes/inertia-carousel) | Physics & delight | Draggable, Inertia |
| R19 | [Route transition](https://hz.sounakpal.dev/recipes/route-transition) | Physics & delight | App Router |
| R20 | [Cursor follower](https://hz.sounakpal.dev/recipes/cursor-follower) | Physics & delight | quickTo |

Twelve more are on the way and land in batches.

There's also an [Easing lab](https://hz.sounakpal.dev/easing): scrub time, race every ease side by side, and copy the GSAP or CSS
version of any curve.

## Run the site locally

Developed on Node 24 and npm 11.

```bash
npm install
```

```bash
npm run dev
```

| Script | What it does |
|---|---|
| `npm run dev` | Dev server on http://localhost:3000 |
| `npm run build` | Builds the shadcn registry into `public/r/`, then the Next.js app |
| `npm run start` | Serves the production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run registry:build` | Only the registry |

Environment variables (see `.env.example`), all optional:

- `NEXT_PUBLIC_SITE_URL`: the public URL used in install commands and social images. Defaults to `https://hz.sounakpal.dev`.
- `NEXT_PUBLIC_GITHUB_URL`: the repo link. Defaults to this repo.
- `GITHUB_TOKEN`: a token with no scopes, so the star count in the header isn't rate limited.

## Project layout

```
app/                     pages: home, recipes/[slug], easing, docs, about
components/recipe/       recipe page: stage, knobs, code panel, one demo per recipe
components/easing/       the Easing lab
content/                 recipe list and per-recipe page content (knobs, notes)
lib/                     site config, eases, highlighting
registry/hz/<slug>/      the recipe source, exactly what users copy or install
registry.json            shadcn registry definition
```

Built with Next.js, TypeScript, Tailwind CSS, GSAP and shiki.

## License

[MIT](LICENSE). Made by [Sounak Pal](https://sounakpal.dev).
