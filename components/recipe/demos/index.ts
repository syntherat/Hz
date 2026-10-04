import type { ComponentType } from "react";
import type { KnobValue } from "@/content/details";
import { MagneticButtonDemo } from "@/components/recipe/demos/magnetic-button-demo";

export type DemoProps = {
  values: Record<string, KnobValue>;
  reduced: boolean;
  onReadout: (text: string) => void;
};

export const demos: Record<string, ComponentType<DemoProps>> = {
  "magnetic-button": MagneticButtonDemo,
};
