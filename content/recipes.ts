export type Section = "Micro" | "Layout & scroll" | "Physics & delight";

export type Recipe = {
  id: string;
  slug: string;
  name: string;
  section: Section;
  plugins: string;
  ease: string;
  summary: string;
  ready: boolean;
};

export const sections: Section[] = ["Micro", "Layout & scroll", "Physics & delight"];

export const recipes: Recipe[] = [
  { id: "R01", slug: "magnetic-button", name: "Magnetic button", section: "Micro", plugins: "quickTo", ease: "power3.out", summary: "Leans toward the cursor and springs back when it leaves.", ready: true },
  { id: "R02", slug: "line-mask-headline", name: "Line-mask headline", section: "Micro", plugins: "SplitText", ease: "expo.out", summary: "Lines rise from behind a mask, one after another.", ready: true },
  { id: "R03", slug: "odometer", name: "Odometer", section: "Micro", plugins: "Timeline", ease: "power3.out", summary: "Digits roll into place instead of jumping.", ready: false },
  { id: "R04", slug: "text-scramble", name: "Text scramble", section: "Micro", plugins: "ScrambleText", ease: "none", summary: "Text decodes into place.", ready: true },
  { id: "R05", slug: "copy-button-morph", name: "Copy-button morph", section: "Micro", plugins: "MorphSVG", ease: "back.out(1.7)", summary: "A clipboard icon morphs into a check with a small pop.", ready: false },
  { id: "R06", slug: "directional-underline", name: "Directional underline", section: "Micro", plugins: "Core", ease: "power3.out", summary: "The underline enters and leaves from the side the cursor came from.", ready: false },
  { id: "R07", slug: "squash-toggle", name: "Squash toggle", section: "Micro", plugins: "Core", ease: "back.out(1.7)", summary: "A toggle switch with a slight squash and stretch.", ready: false },
  { id: "R08", slug: "sliding-tab-indicator", name: "Sliding tab indicator", section: "Micro", plugins: "Flip", ease: "expo.out", summary: "The indicator slides to the selected tab.", ready: true },
  { id: "R09", slug: "flip-filter-grid", name: "Flip filter grid", section: "Layout & scroll", plugins: "Flip", ease: "power3.out", summary: "Grid items glide to their new places when you filter.", ready: true },
  { id: "R10", slug: "card-to-detail", name: "Card to detail", section: "Layout & scroll", plugins: "Flip", ease: "expo.out", summary: "A card grows into its detail view.", ready: false },
  { id: "R11", slug: "pinned-horizontal-gallery", name: "Pinned horizontal gallery", section: "Layout & scroll", plugins: "ScrollTrigger", ease: "none", summary: "The section pins and its panels move sideways as you scroll.", ready: true },
  { id: "R12", slug: "stacking-cards", name: "Stacking cards", section: "Layout & scroll", plugins: "ScrollTrigger", ease: "none", summary: "Cards stack on top of each other as you scroll.", ready: false },
  { id: "R13", slug: "height-auto-accordion", name: "Height-auto accordion", section: "Layout & scroll", plugins: "Core", ease: "power3.out", summary: "Opens to its natural height, contents fading in one by one.", ready: true },
  { id: "R14", slug: "scroll-read-highlight", name: "Scroll-read highlight", section: "Layout & scroll", plugins: "ScrollTrigger", ease: "none", summary: "Words light up as you read.", ready: true },
  { id: "R15", slug: "clip-path-image-reveal", name: "Clip-path image reveal", section: "Layout & scroll", plugins: "Core", ease: "expo.out", summary: "A clip-path wipe while the image inside scales.", ready: false },
  { id: "R16", slug: "svg-line-draw", name: "SVG line draw", section: "Layout & scroll", plugins: "DrawSVG", ease: "none", summary: "A path draws itself as you scroll.", ready: false },
  { id: "R17", slug: "velocity-marquee", name: "Velocity marquee", section: "Physics & delight", plugins: "ScrollTrigger", ease: "none", summary: "An endless loop that leans and speeds up with your scroll.", ready: true },
  { id: "R18", slug: "inertia-carousel", name: "Inertia carousel", section: "Physics & delight", plugins: "Draggable · Inertia", ease: "expo.out", summary: "Fling it, it glides, then snaps to a slide.", ready: true },
  { id: "R19", slug: "route-transition", name: "Route transition", section: "Physics & delight", plugins: "App Router", ease: "power3.inOut", summary: "A curtain wipe between pages.", ready: true },
  { id: "R20", slug: "cursor-follower", name: "Cursor follower", section: "Physics & delight", plugins: "quickTo", ease: "power3.out", summary: "A dot that trails the cursor and changes shape over targets.", ready: true },
  { id: "R21", slug: "toast-stack", name: "Toast stack", section: "Physics & delight", plugins: "Flip", ease: "back.out(1.7)", summary: "Stacked notifications you can swipe away.", ready: false },
  { id: "R22", slug: "draggable-bottom-sheet", name: "Draggable bottom sheet", section: "Physics & delight", plugins: "Draggable", ease: "elastic.out(1, 0.3)", summary: "A bottom sheet with springy snap points.", ready: false },
  { id: "R23", slug: "cursor-image-trail", name: "Cursor image trail", section: "Physics & delight", plugins: "Core", ease: "power3.out", summary: "Images trail behind the cursor.", ready: false },
  { id: "R24", slug: "preloader-handoff", name: "Preloader handoff", section: "Physics & delight", plugins: "Timeline", ease: "power3.inOut", summary: "A counter that hands off to the hero animation.", ready: false },
];

export function getRecipe(slug: string) {
  return recipes.find((r) => r.slug === slug);
}

// ready pages only link to ready pages, so prev/next never lands on a held recipe
export function neighbours(slug: string) {
  const list = getRecipe(slug)?.ready ? recipes.filter((r) => r.ready) : recipes;
  const i = list.findIndex((r) => r.slug === slug);
  const n = list.length;
  return { prev: list[(i - 1 + n) % n], next: list[(i + 1) % n] };
}
