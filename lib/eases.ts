type EaseFn = (t: number) => number;

const c1 = 1.70158;
const c3 = c1 + 1;
const c4 = (2 * Math.PI) / 3;

function bounceOut(t: number) {
  const n = 7.5625;
  const d = 2.75;
  if (t < 1 / d) return n * t * t;
  if (t < 2 / d) return n * (t -= 1.5 / d) * t + 0.75;
  if (t < 2.5 / d) return n * (t -= 2.25 / d) * t + 0.9375;
  return n * (t -= 2.625 / d) * t + 0.984375;
}

export const eases: Record<string, { fn: EaseFn; css: string; note: string }> = {
  none: {
    fn: (t) => t,
    css: "linear",
    note: "Constant speed. Mechanical on its own, right for scroll-scrubbed motion where the scroll is the ease.",
  },
  "sine.inOut": {
    fn: (t) => -(Math.cos(Math.PI * t) - 1) / 2,
    css: "cubic-bezier(0.37, 0, 0.63, 1)",
    note: "Gentle at both ends. Good for loops and ambient drift.",
  },
  "power1.out": {
    fn: (t) => 1 - (1 - t) ** 2,
    css: "cubic-bezier(0.5, 1, 0.89, 1)",
    note: "A light deceleration. Subtle, use it for small fades.",
  },
  "power2.out": {
    fn: (t) => 1 - (1 - t) ** 3,
    css: "cubic-bezier(0.33, 1, 0.68, 1)",
    note: "A clear but soft landing. A solid general default.",
  },
  "power3.out": {
    fn: (t) => 1 - (1 - t) ** 4,
    css: "cubic-bezier(0.25, 1, 0.5, 1)",
    note: "Quick off the mark, long soft landing. The safe default for most UI.",
  },
  "expo.out": {
    fn: (t) => (t === 1 ? 1 : 1 - 2 ** (-10 * t)),
    css: "cubic-bezier(0.16, 1, 0.3, 1)",
    note: "Almost all the movement happens up front. Feels snappy and precise.",
  },
  "circ.out": {
    fn: (t) => Math.sqrt(1 - (t - 1) ** 2),
    css: "cubic-bezier(0, 0.55, 0.45, 1)",
    note: "Very fast start with a rounded stop. Good for things that pop in.",
  },
  "power3.inOut": {
    fn: (t) => (t < 0.5 ? 8 * t ** 4 : 1 - (-2 * t + 2) ** 4 / 2),
    css: "cubic-bezier(0.76, 0, 0.24, 1)",
    note: "Slow start, fast middle, slow end. Made for big moves like page transitions.",
  },
  "back.out(1.7)": {
    fn: (t) => 1 + c3 * (t - 1) ** 3 + c1 * (t - 1) ** 2,
    css: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    note: "Overshoots a touch, then settles. Adds a little personality.",
  },
  "elastic.out(1, 0.3)": {
    fn: (t) => (t === 0 ? 0 : t === 1 ? 1 : 2 ** (-10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1),
    css: "linear(...) only",
    note: "Springs back and forth before resting. Playful, use it sparingly.",
  },
  "bounce.out": {
    fn: bounceOut,
    css: "linear(...) only",
    note: "Drops and bounces like a ball. Literal, keep it for playful moments.",
  },
};

export function easeFn(name: string): EaseFn {
  return eases[name]?.fn ?? eases.none.fn;
}

// viewBox is "0 -30 240 150": p=0 sits on y=110, p=1 on y=10, room above for overshoot
export function curvePath(name: string, samples = 60) {
  const fn = easeFn(name);
  let d = "";
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    d += `${i ? " L" : "M"}${(240 * t).toFixed(1)} ${(110 - 100 * fn(t)).toFixed(1)}`;
  }
  return d;
}

export function shortEaseName(name: string) {
  return name.replace(/\(.*\)$/, "");
}
