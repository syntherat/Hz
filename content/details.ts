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
      kind: "option";
      prefix: string;
      default: string;
      options: { value: string; label: string; head?: string; note?: string }[];
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
  "pinned-horizontal-gallery": {
    file: "hz/pinned-horizontal-gallery/pinned-horizontal-gallery.tsx",
    fileName: "PinnedGallery.tsx",
    description:
      "The section locks in place while vertical scroll moves a row of panels sideways. When the last panel arrives, the page lets go and carries on.",
    chips: ["ScrollTrigger", "pin · scrub", "Reduced motion: native scroller"],
    knobs: [
      {
        id: "scrub",
        label: "Scrub",
        kind: "option",
        prefix: "scrub = ",
        default: "1",
        options: [
          { value: "true", label: "true", note: "Locked 1:1 to the scrollbar. Precise, but every notch of a mouse wheel shows as a jump." },
          { value: "0.5", label: "0.5", note: "Catches up in half a second. Smooth on wheels, still tight on trackpads." },
          { value: "1", label: "1", note: "Catches up in one second. The calm default: smooth on every input, barely any drift." },
        ],
      },
      {
        id: "scrollLength",
        label: "Scroll length",
        kind: "option",
        prefix: "scrollLength = ",
        default: "1",
        options: [
          { value: "1", label: "1×", head: "1× track width" },
          { value: "1.5", label: "1.5×", head: "1.5× track width" },
          { value: "2", label: "2×", head: "2× track width" },
        ],
      },
      {
        id: "snap",
        label: "Snap to panels",
        kind: "option",
        prefix: "snap = ",
        default: "false",
        options: [
          { value: "false", label: "off" },
          { value: "true", label: "on" },
        ],
      },
    ],
    notes: [
      {
        title: "Ease",
        body: 'ease: "none". The reader\'s own wheel or thumb sets the speed, so the scroll is the ease. A curve on top would fight their hand.',
      },
      {
        title: "Scrub",
        body: "A small catch-up smooths out notchy mouse wheels without feeling detached. Too much and the panels drift after the reader has stopped.",
      },
      {
        title: "Length",
        body: "At 1×, the scroll distance equals the track's width, so sideways speed matches downward speed. Nothing feels sped up or slowed down.",
      },
    ],
    accessibility:
      "With reduced motion on, nothing pins: the row becomes a native sideways scroller, and every panel stays reachable by Tab. While pinned, tabbing into a hidden panel scrolls the page to it instead of shifting the row. On phones, test the pin with real thumbs; if it feels heavy, use the native scroller below 768px.",
  },
  "inertia-carousel": {
    file: "hz/inertia-carousel/inertia-carousel.tsx",
    fileName: "InertiaCarousel.tsx",
    description:
      "Drag it, fling it, and it glides on with the speed of your hand, slowing down naturally until it lands exactly on a slide. One motion, no correction at the end.",
    chips: ["Draggable", "InertiaPlugin", "Keyboard: prev / next"],
    knobs: [
      {
        id: "throwResistance",
        label: "Throw resistance",
        kind: "option",
        prefix: "throwResistance = ",
        default: "1000",
        options: [
          { value: "500", label: "500", note: "Glides a long way. Good for long, browsable rows." },
          { value: "1000", label: "1000", note: "The default. A firm flick travels a few slides, then settles." },
          { value: "3000", label: "3000", note: "Stops quickly. Feels precise, close to one slide per flick." },
        ],
      },
      {
        id: "snap",
        label: "Snap",
        kind: "option",
        prefix: "snap = ",
        default: "true",
        options: [
          { value: "false", label: "free" },
          { value: "true", label: "per slide" },
        ],
      },
      {
        id: "edgeResistance",
        label: "Edges",
        kind: "option",
        prefix: "edgeResistance = ",
        default: "0.65",
        options: [
          { value: "0.65", label: "rubber", head: "edgeResistance 0.65" },
          { value: "1", label: "hard", head: "edgeResistance 1" },
        ],
      },
    ],
    notes: [
      {
        title: "Momentum",
        body: "The track keeps the speed of your flick and slows down on its own, so it behaves like an object with weight, not a slideshow.",
      },
      {
        title: "Snap",
        body: "The landing point is adjusted the moment you let go, not after the glide. You see one smooth motion instead of a glide plus a correction.",
      },
      {
        title: "Edges",
        body: "Rubber edges let you pull slightly past the end and spring back. The limit is felt, not hit like a wall.",
      },
    ],
    accessibility:
      "Dragging only works with a pointer, so the recipe ships previous and next buttons that move one slide. Tabbing into a slide that is out of view brings it into view. With reduced motion on, dragging still works but throws stop where you let go, and the buttons jump instead of gliding.",
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
