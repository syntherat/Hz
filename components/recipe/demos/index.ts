import type { ComponentType } from "react";
import type { KnobValue } from "@/content/details";
import { MagneticButtonDemo } from "@/components/recipe/demos/magnetic-button-demo";
import { LineMaskHeadlineDemo } from "@/components/recipe/demos/line-mask-headline-demo";
import { OdometerDemo } from "@/components/recipe/demos/odometer-demo";
import { TextScrambleDemo } from "@/components/recipe/demos/text-scramble-demo";
import { CopyButtonMorphDemo } from "@/components/recipe/demos/copy-button-morph-demo";
import { DirectionalUnderlineDemo } from "@/components/recipe/demos/directional-underline-demo";
import { SquashToggleDemo } from "@/components/recipe/demos/squash-toggle-demo";
import { SlidingTabIndicatorDemo } from "@/components/recipe/demos/sliding-tab-indicator-demo";
import { FlipFilterGridDemo } from "@/components/recipe/demos/flip-filter-grid-demo";
import { CardToDetailDemo } from "@/components/recipe/demos/card-to-detail-demo";
import { PinnedGalleryDemo } from "@/components/recipe/demos/pinned-gallery-demo";
import { StackingCardsDemo } from "@/components/recipe/demos/stacking-cards-demo";
import { HeightAutoAccordionDemo } from "@/components/recipe/demos/height-auto-accordion-demo";
import { ScrollReadHighlightDemo } from "@/components/recipe/demos/scroll-read-highlight-demo";
import { ClipPathImageRevealDemo } from "@/components/recipe/demos/clip-path-image-reveal-demo";
import { SvgLineDrawDemo } from "@/components/recipe/demos/svg-line-draw-demo";
import { VelocityMarqueeDemo } from "@/components/recipe/demos/velocity-marquee-demo";
import { InertiaCarouselDemo } from "@/components/recipe/demos/inertia-carousel-demo";
import { RouteTransitionDemo } from "@/components/recipe/demos/route-transition-demo";
import { CursorFollowerDemo } from "@/components/recipe/demos/cursor-follower-demo";
import { ToastStackDemo } from "@/components/recipe/demos/toast-stack-demo";
import { DraggableBottomSheetDemo } from "@/components/recipe/demos/draggable-bottom-sheet-demo";
import { CursorImageTrailDemo } from "@/components/recipe/demos/cursor-image-trail-demo";
import { PreloaderHandoffDemo } from "@/components/recipe/demos/preloader-handoff-demo";

export type DemoProps = {
  values: Record<string, KnobValue>;
  reduced: boolean;
  onReadout: (text: string) => void;
  // stage toolbar element, for demos that portal in their own buttons
  tools: HTMLElement | null;
};

export const demos: Record<string, ComponentType<DemoProps>> = {
  "magnetic-button": MagneticButtonDemo,
  "line-mask-headline": LineMaskHeadlineDemo,
  odometer: OdometerDemo,
  "text-scramble": TextScrambleDemo,
  "copy-button-morph": CopyButtonMorphDemo,
  "directional-underline": DirectionalUnderlineDemo,
  "squash-toggle": SquashToggleDemo,
  "sliding-tab-indicator": SlidingTabIndicatorDemo,
  "flip-filter-grid": FlipFilterGridDemo,
  "card-to-detail": CardToDetailDemo,
  "pinned-horizontal-gallery": PinnedGalleryDemo,
  "stacking-cards": StackingCardsDemo,
  "height-auto-accordion": HeightAutoAccordionDemo,
  "scroll-read-highlight": ScrollReadHighlightDemo,
  "clip-path-image-reveal": ClipPathImageRevealDemo,
  "svg-line-draw": SvgLineDrawDemo,
  "velocity-marquee": VelocityMarqueeDemo,
  "inertia-carousel": InertiaCarouselDemo,
  "route-transition": RouteTransitionDemo,
  "cursor-follower": CursorFollowerDemo,
  "toast-stack": ToastStackDemo,
  "draggable-bottom-sheet": DraggableBottomSheetDemo,
  "cursor-image-trail": CursorImageTrailDemo,
  "preloader-handoff": PreloaderHandoffDemo,
};
