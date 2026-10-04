import type { ComponentType } from "react";
import type { KnobValue } from "@/content/details";
import { MagneticButtonDemo } from "@/components/recipe/demos/magnetic-button-demo";
import { PinnedGalleryDemo } from "@/components/recipe/demos/pinned-gallery-demo";
import { InertiaCarouselDemo } from "@/components/recipe/demos/inertia-carousel-demo";

export type DemoProps = {
  values: Record<string, KnobValue>;
  reduced: boolean;
  onReadout: (text: string) => void;
  // stage toolbar element, for demos that portal in their own buttons
  tools: HTMLElement | null;
};

export const demos: Record<string, ComponentType<DemoProps>> = {
  "magnetic-button": MagneticButtonDemo,
  "pinned-horizontal-gallery": PinnedGalleryDemo,
  "inertia-carousel": InertiaCarouselDemo,
};
