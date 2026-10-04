export type Knob =
  | {
      id: string;
      label: string;
      kind: "ease";
      prefix: string;
      default: string;
      options: string[];
    }
  | {
      id: string;
      label: string;
      kind: "choice";
      prefix: string;
      default: number;
      options: number[];
      unit?: string;
    }
  | {
      id: string;
      label: string;
      kind: "range";
      prefix: string;
      default: number;
      min: number;
      max: number;
      step: number;
    };

export type KnobValue = string | number;

export type RecipeDetails = {
  file: string;
  fileName: string;
  description: string;
  chips: string[];
  knobs: Knob[];
  notes: { title: string; body: string }[];
  accessibility: string;
};

export const details: Record<string, RecipeDetails> = {
  "magnetic-button": {
    file: "hz/magnetic-button/magnetic-button.tsx",
    fileName: "MagneticButton.tsx",
    description:
      "The button leans toward the cursor and settles back when it leaves. A small pull that makes a primary action feel alive without shouting.",
    chips: ["gsap.quickTo", "useGSAP", "Reduced motion: handled"],
    knobs: [
      {
        id: "ease",
        label: "Ease",
        kind: "ease",
        prefix: "ease = ",
        default: "power3.out",
        options: ["power3.out", "expo.out", "back.out(1.7)", "elastic.out(1, 0.3)"],
      },
      {
        id: "duration",
        label: "Duration",
        kind: "choice",
        prefix: "duration = ",
        default: 0.6,
        options: [0.4, 0.6, 0.9],
        unit: "s",
      },
      {
        id: "strength",
        label: "Strength",
        kind: "range",
        prefix: "strength = ",
        default: 0.4,
        min: 0.1,
        max: 1,
        step: 0.05,
      },
    ],
    notes: [
      {
        title: "Ease",
        body: "An out-ease reacts instantly to the cursor, then takes its time arriving. The response feels quick but never jumpy.",
      },
      {
        title: "Timing",
        body: "Around 0.6s trails the pointer just enough to read as weight. Much shorter feels stuck to the cursor, much longer feels laggy.",
      },
      {
        title: "Interruption",
        body: "quickTo retargets the running tween instead of starting a new one, so fast cursor moves never stutter or snap.",
      },
    ],
    accessibility:
      "With reduced motion on, the button stays put. Keyboard focus is untouched: the magnet only follows a pointer, so the focus ring never moves.",
  },
};

export function formatKnob(knob: Knob, value: KnobValue) {
  return knob.kind === "ease" ? `"${value}"` : String(value);
}

export function defaultValues(knobs: Knob[]) {
  return Object.fromEntries(knobs.map((k) => [k.id, k.default])) as Record<string, KnobValue>;
}

export function applyKnobs(source: string, knobs: Knob[], values: Record<string, KnobValue>) {
  return knobs.reduce(
    (code, k) => code.replace(k.prefix + formatKnob(k, k.default), k.prefix + formatKnob(k, values[k.id] ?? k.default)),
    source,
  );
}
