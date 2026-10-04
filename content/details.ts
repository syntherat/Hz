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
  "line-mask-headline": {
    file: "hz/line-mask-headline/line-mask-headline.tsx",
    fileName: "LineMaskHeadline.tsx",
    description:
      "Each line of the headline rises from behind its own edge, one after another. No fade, no blur: the text is crisp the whole way and simply arrives.",
    chips: ["SplitText", "mask: lines", "Reduced motion: static text"],
    knobs: [
      { id: "ease", label: "Ease", kind: "ease", prefix: "ease = ", default: "expo.out", options: ["expo.out", "power3.out", "circ.out", "back.out(1.7)"] },
      { id: "duration", label: "Duration", kind: "choice", prefix: "duration = ", default: 0.9, options: [0.6, 0.9, 1.2], unit: "s" },
      { id: "stagger", label: "Stagger", kind: "choice", prefix: "stagger = ", default: 0.08, options: [0.04, 0.08, 0.12], unit: "s" },
    ],
    notes: [
      { title: "Ease", body: "expo.out puts almost all the travel in the first third. Each line arrives decisively, then spends the rest of its time settling." },
      { title: "Stagger", body: "0.08s between lines reads as a sequence, top to bottom, while the whole headline still lands in about a second." },
      { title: "Mask", body: "Lines rise from behind a clip instead of fading in, so the type stays sharp. autoSplit re-splits on resize and font load and carries the progress over." },
    ],
    accessibility:
      "SplitText labels the heading with its full text and hides the split pieces, so screen readers read it once, as written. With reduced motion on, the headline is static. It plays once on mount and never loops.",
  },
  odometer: {
    file: "hz/odometer/odometer.tsx",
    fileName: "Odometer.tsx",
    description:
      "Each digit is a column that rolls to its new value, the way a mechanical counter does. A change reads as movement in a direction, not a number swapping out.",
    chips: ["gsap.timeline", "Digit columns", "Reduced motion: jumps"],
    knobs: [
      { id: "ease", label: "Ease", kind: "ease", prefix: "ease = ", default: "power3.out", options: ["power3.out", "expo.out", "back.out(1.7)", "elastic.out(1, 0.3)"] },
      { id: "duration", label: "Duration", kind: "choice", prefix: "duration = ", default: 1, options: [0.6, 1, 1.4], unit: "s" },
      { id: "stagger", label: "Stagger", kind: "choice", prefix: "stagger = ", default: 0.05, options: [0, 0.05, 0.1], unit: "s" },
    ],
    notes: [
      { title: "Direction", body: "Columns roll forward when the number goes up and back when it goes down, through 9 to 0 like a real counter. Big jumps spin at most one extra lap, so nothing blurs." },
      { title: "Stagger", body: "The ones column moves first and higher places follow a beat later, right to left, the order a carry would travel." },
      { title: "Interruption", body: "A new value mid-roll starts each column from where it is on screen, so rapid updates stay continuous instead of snapping back." },
    ],
    accessibility:
      "The number is in the page once as visually hidden text, and the digit strips are hidden from screen readers. Add aria-live to a parent if changes should be announced. With reduced motion on, the digits change without rolling.",
  },
  "text-scramble": {
    file: "hz/text-scramble/text-scramble.tsx",
    fileName: "TextScramble.tsx",
    description:
      "The text decodes into place: random characters settle into the real ones from left to right. Good for short status labels and moments that should feel computed.",
    chips: ["ScrambleTextPlugin", "ease: none", "Screen readers: final text"],
    knobs: [
      {
        id: "chars",
        label: "Characters",
        kind: "option",
        prefix: "chars = ",
        default: '"upperCase"',
        options: [
          { value: '"upperCase"', label: "A-Z", head: "upperCase" },
          { value: '"lowerCase"', label: "a-z", head: "lowerCase" },
          { value: '"01"', label: "01", head: "binary" },
        ],
      },
      { id: "duration", label: "Duration", kind: "choice", prefix: "duration = ", default: 1, options: [0.6, 1, 1.6], unit: "s" },
      { id: "revealDelay", label: "Reveal delay", kind: "choice", prefix: "revealDelay = ", default: 0.3, options: [0, 0.3, 0.6], unit: "s" },
    ],
    notes: [
      { title: "Ease", body: 'ease: "none". Characters lock in at a steady rate, like a decoder. An eased scramble rushes, then stalls, and the stall reads as lag.' },
      { title: "Reveal delay", body: "A short spell of pure noise before any letter locks in sets up the decode. Much longer and it starts to look broken." },
      { title: "Interruption", body: "A new text mid-scramble starts from whatever is on screen, so quick changes flow into each other instead of resetting." },
    ],
    accessibility:
      "Screen readers get the final text from a visually hidden copy; the scrambling characters are hidden from them. With reduced motion on, the text swaps instantly. Keep it to short labels, never body copy.",
  },
  "copy-button-morph": {
    file: "hz/copy-button-morph/copy-button-morph.tsx",
    fileName: "CopyButton.tsx",
    description:
      "The clipboard icon morphs into a check with a small pop, holds, then morphs back. The button itself confirms the copy, no toast needed.",
    chips: ["MorphSVGPlugin", "navigator.clipboard", "Announces: Copied"],
    knobs: [
      { id: "ease", label: "Ease", kind: "ease", prefix: "ease = ", default: "back.out(1.7)", options: ["back.out(1.7)", "power3.out", "expo.out", "elastic.out(1, 0.3)"] },
      { id: "duration", label: "Duration", kind: "choice", prefix: "duration = ", default: 0.5, options: [0.3, 0.5, 0.8], unit: "s" },
      { id: "resetAfter", label: "Reset after", kind: "choice", prefix: "resetAfter = ", default: 1.5, options: [1, 1.5, 3], unit: "s" },
    ],
    notes: [
      { title: "Ease", body: "back.out overshoots a touch, so the check lands with a small pop. It is the confirmation, quick and a little pleased." },
      { title: "Morph", body: "One path changes shape instead of one icon swapping for another. The eye follows a single object, so the change reads as cause and effect." },
      { title: "Reset", body: "1.5s is long enough to see the check, short enough that a second copy isn't confusing. The way back is a quick, quiet power2.inOut." },
    ],
    accessibility:
      'The button\'s label changes to "Copied" and a status region announces "Copied to clipboard". With reduced motion on, the icon swaps without morphing. Clicking again restarts from the shape on screen.',
  },
  "directional-underline": {
    file: "hz/directional-underline/directional-underline.tsx",
    fileName: "DirectionalLink.tsx",
    description:
      "The underline enters from the side the cursor came in on and leaves toward the side it went out. A small detail that makes a link feel like it noticed you.",
    chips: ["Core", "clip-path", "Keyboard: focus shows line"],
    knobs: [
      { id: "ease", label: "Ease", kind: "ease", prefix: "ease = ", default: "power3.out", options: ["power3.out", "expo.out", "circ.out", "power3.inOut"] },
      { id: "duration", label: "Duration", kind: "choice", prefix: "duration = ", default: 0.4, options: [0.25, 0.4, 0.6], unit: "s" },
    ],
    notes: [
      { title: "Direction", body: "The line follows the hand: in from where the pointer came, out toward where it went. The motion has a cause you can see." },
      { title: "Edges", body: "Both edges of the line are tracked, so reversing mid-move continues from what is visible. There is never a jump to restart." },
      { title: "Timing", body: "0.4s with power3.out keeps up with a quick pass across a menu but still shows the direction." },
    ],
    accessibility:
      "Keyboard focus draws the line from the left and keeps it while the link is focused. It adds to the focus ring, it does not replace it. With reduced motion on, the line appears and disappears without moving.",
  },
  "squash-toggle": {
    file: "hz/squash-toggle/squash-toggle.tsx",
    fileName: "SquashToggle.tsx",
    description:
      "The knob stretches along its travel and lands round again, with a little overshoot. A toggle that feels like it has mass, without getting silly.",
    chips: ["Core", "role=switch", "Reduced motion: no squash"],
    knobs: [
      { id: "ease", label: "Ease", kind: "ease", prefix: "ease = ", default: "back.out(1.7)", options: ["back.out(1.7)", "power3.out", "expo.out", "elastic.out(1, 0.3)"] },
      { id: "duration", label: "Duration", kind: "choice", prefix: "duration = ", default: 0.45, options: [0.3, 0.45, 0.7], unit: "s" },
      { id: "squash", label: "Squash", kind: "range", prefix: "squash = ", default: 0.25, min: 0, max: 0.4, step: 0.05 },
    ],
    notes: [
      { title: "Squash", body: "The knob stretches away from the side it leaves, then rounds out as it lands. It reads as speed and weight. Past about 0.3 it starts to look like rubber." },
      { title: "Ease", body: "back.out lands with a small overshoot, so the switch clicks into place instead of sliding to a stop." },
      { title: "Interruption", body: "A second click mid-travel turns the knob around from where it is. No queueing, no snap back to the start." },
    ],
    accessibility:
      "A real button with role=\"switch\" and aria-checked, so Space and Enter work and the state is announced. On and off differ in brightness, not only hue. With reduced motion on, the knob moves instantly with no squash.",
  },
  "sliding-tab-indicator": {
    file: "hz/sliding-tab-indicator/sliding-tab-indicator.tsx",
    fileName: "SlidingTabs.tsx",
    description:
      "The highlight slides from the old tab to the new one and resizes on the way. The indicator lives inside the selected tab, and Flip handles the trip.",
    chips: ["Flip", "role=tablist", "Keyboard: arrows, Home, End"],
    knobs: [
      { id: "ease", label: "Ease", kind: "ease", prefix: "ease = ", default: "expo.out", options: ["expo.out", "power3.out", "back.out(1.7)", "power3.inOut"] },
      { id: "duration", label: "Duration", kind: "choice", prefix: "duration = ", default: 0.5, options: [0.3, 0.5, 0.8], unit: "s" },
    ],
    notes: [
      { title: "Flip", body: "The indicator is rendered inside the selected tab, so the layout stays plain and honest. Flip animates it from the old box to the new one, width included." },
      { title: "Ease", body: "expo.out covers nearly the whole distance at once, so the tab feels selected the moment you click. The rest is a soft landing." },
      { title: "Interruption", body: "Clicking again mid-slide records the indicator where it is on screen and heads for the new tab from there." },
    ],
    accessibility:
      "Uses tablist, tab and tabpanel roles with a roving tabindex. Arrow keys, Home and End move between tabs, and selection follows focus. With reduced motion on, the indicator jumps.",
  },
  "flip-filter-grid": {
    file: "hz/flip-filter-grid/flip-filter-grid.tsx",
    fileName: "FlipFilterGrid.tsx",
    description:
      "Pick a filter and the remaining items glide to their new places while the others shrink away. You can follow every item, so the change makes sense.",
    chips: ["Flip", "absolute: true", "Filters: aria-pressed"],
    knobs: [
      { id: "ease", label: "Ease", kind: "ease", prefix: "ease = ", default: "power3.out", options: ["power3.out", "expo.out", "back.out(1.7)", "power3.inOut"] },
      { id: "duration", label: "Duration", kind: "choice", prefix: "duration = ", default: 0.6, options: [0.4, 0.6, 0.9], unit: "s" },
      { id: "stagger", label: "Stagger", kind: "choice", prefix: "stagger = ", default: 0.02, options: [0, 0.02, 0.05], unit: "s" },
    ],
    notes: [
      { title: "Continuity", body: "Items move from where they were to where they end up, so you can see what stayed, what left and what arrived." },
      { title: "Enter and leave", body: "Leaving items fade and shrink in place, entering ones grow in. They stay in the DOM with display: none, so they can animate out." },
      { title: "Interruption", body: "Switching filters mid-move records where everything is right now and continues from there. Nothing snaps." },
    ],
    accessibility:
      "Filter buttons use aria-pressed. Hidden items are display: none, so they leave the tab order and the accessibility tree. With reduced motion on, the grid changes instantly.",
  },
  "card-to-detail": {
    file: "hz/card-to-detail/card-to-detail.tsx",
    fileName: "CardToDetail.tsx",
    description:
      "The card itself grows into the detail view, from exactly where it sat. Close it and it shrinks back into its slot. The eye never loses the object.",
    chips: ["Flip", "Escape closes", "Focus managed"],
    knobs: [
      { id: "ease", label: "Ease", kind: "ease", prefix: "ease = ", default: "expo.out", options: ["expo.out", "power3.out", "power3.inOut", "back.out(1.7)"] },
      { id: "duration", label: "Duration", kind: "choice", prefix: "duration = ", default: 0.7, options: [0.5, 0.7, 1], unit: "s" },
    ],
    notes: [
      { title: "Continuity", body: "It is the same element, lifted out of the layout and resized. Nothing cross-fades, so there is no moment where you wonder which card opened." },
      { title: "Ease", body: "expo.out does most of the growing at once, so opening feels immediate and the long tail settles the frame gently." },
      { title: "Sequence", body: "The detail contents fade in after the box has mostly arrived, one after another, so text never reflows while you read it." },
    ],
    accessibility:
      "The card opens from a real button labelled with the card's title. Focus moves to Close when it opens and back to the card when it closes, and Escape closes it. With reduced motion on, it opens and closes without moving.",
  },
  "stacking-cards": {
    file: "hz/stacking-cards/stacking-cards.tsx",
    fileName: "StackingCards.tsx",
    description:
      "Each card slides up over the one before it and the cards underneath shrink back a little, like a deck being dealt. CSS sticky does the stacking, scroll does the rest.",
    chips: ["ScrollTrigger", "position: sticky", "Reduced motion: no scaling"],
    knobs: [
      { id: "scaleStep", label: "Scale step", kind: "choice", prefix: "scaleStep = ", default: 0.05, options: [0, 0.05, 0.1] },
      {
        id: "offset",
        label: "Offset",
        kind: "option",
        prefix: "offset = ",
        default: "16",
        options: [
          { value: "0", label: "0", note: "Cards land exactly on top of each other. Clean, but the stack is invisible." },
          { value: "16", label: "16px", note: "A sliver of each card below shows, so you can count the stack." },
          { value: "32", label: "32px", note: "Room for a title strip on each card. Uses more of the screen." },
        ],
      },
      {
        id: "dim",
        label: "Dim underneath",
        kind: "option",
        prefix: "dim = ",
        default: "true",
        options: [
          { value: "true", label: "on" },
          { value: "false", label: "off" },
        ],
      },
    ],
    notes: [
      { title: "Ease", body: 'ease: "none" with scrub. The cards move exactly as far as the page does, so the stack never drifts from the hand that is scrolling.' },
      { title: "Sticky", body: "position: sticky does the stacking and ScrollTrigger only scrubs the scale. No pin spacers, and the layout stays native." },
      { title: "Depth", body: "Cards deeper in the stack end up smaller and darker, so the pile reads as depth rather than a jumble of edges." },
    ],
    accessibility:
      "Cards stay in normal flow and reading order. With reduced motion on, only the sticky stacking remains and nothing scales. Covered cards can't be read, so keep each card's content short enough to fit on screen.",
  },
  "height-auto-accordion": {
    file: "hz/height-auto-accordion/height-auto-accordion.tsx",
    fileName: "Accordion.tsx",
    description:
      "Panels open to their natural height, whatever the content, and the contents fade in one by one. Closing is quicker and quieter than opening.",
    chips: ['height: "auto"', "aria-expanded", "Closed panels: inert"],
    knobs: [
      { id: "ease", label: "Ease", kind: "ease", prefix: "ease = ", default: "power3.out", options: ["power3.out", "expo.out", "power3.inOut", "back.out(1.7)"] },
      { id: "duration", label: "Duration", kind: "choice", prefix: "duration = ", default: 0.5, options: [0.3, 0.5, 0.8], unit: "s" },
      { id: "stagger", label: "Stagger", kind: "choice", prefix: "stagger = ", default: 0.05, options: [0, 0.05, 0.1], unit: "s" },
    ],
    notes: [
      { title: "Height", body: 'GSAP measures height: "auto" when the tween starts and ends on auto, so an open panel still resizes with its content.' },
      { title: "Sequence", body: "Contents fade in top to bottom just after the panel starts to open. Closing fades them out together and faster, because leaving needs less attention." },
      { title: "Interruption", body: "Clicking again mid-open reverses from the current height. No jump to fully open first." },
    ],
    accessibility:
      "Each trigger is a button inside a heading, with aria-expanded and aria-controls. Panels are labelled regions, and closed ones are inert, so their contents leave the tab order. With reduced motion on, panels open instantly.",
  },
  "scroll-read-highlight": {
    file: "hz/scroll-read-highlight/scroll-read-highlight.tsx",
    fileName: "ScrollHighlight.tsx",
    description:
      "Words light up one by one as the paragraph moves up the screen, at the pace you scroll. Made for a single statement you want people to actually read.",
    chips: ["ScrollTrigger", "scrub", "Screen readers: one sentence"],
    knobs: [
      { id: "dimOpacity", label: "Dim opacity", kind: "choice", prefix: "dimOpacity = ", default: 0.2, options: [0.1, 0.2, 0.35] },
      {
        id: "scrub",
        label: "Scrub",
        kind: "option",
        prefix: "scrub = ",
        default: "true",
        options: [
          { value: "true", label: "true", note: "Locked to the scroll. Each word lights exactly when the reading line passes it." },
          { value: "0.5", label: "0.5", note: "Catches up in half a second. Softer on mouse wheels." },
          { value: "1", label: "1", note: "Catches up in one second. Smooth, but trails a fast scroll." },
        ],
      },
      {
        id: "end",
        label: "Finish line",
        kind: "option",
        prefix: "end = ",
        default: '"bottom 55%"',
        options: [
          { value: '"bottom 75%"', label: "early", head: "bottom 75%" },
          { value: '"bottom 55%"', label: "middle", head: "bottom 55%" },
          { value: '"bottom 35%"', label: "late", head: "bottom 35%" },
        ],
      },
    ],
    notes: [
      { title: "Ease", body: 'ease: "none" on one tween with a stagger. The words are spread evenly along the scroll distance, so the light moves at reading speed.' },
      { title: "Finish line", body: "Every word is lit by the time the paragraph's bottom reaches the middle of the screen, about where eyes rest while reading." },
      { title: "Dim", body: "0.2 keeps unread words faint but legible, so you can still skim ahead. Lower than 0.1 and the sentence looks unfinished." },
    ],
    accessibility:
      "The sentence is read once from a visually hidden copy; the word spans are hidden from screen readers. Dimmed words fail contrast until they light up, so use this for short display text, never for essential content. With reduced motion on, every word is fully lit.",
  },
  "clip-path-image-reveal": {
    file: "hz/clip-path-image-reveal/clip-path-image-reveal.tsx",
    fileName: "ClipReveal.tsx",
    description:
      "A clip-path wipes the frame open while the image inside eases down from a slight zoom. Both finish together, so the picture settles as it is revealed.",
    chips: ["Core", "IntersectionObserver", "Reduced motion: shown"],
    knobs: [
      { id: "ease", label: "Ease", kind: "ease", prefix: "ease = ", default: "expo.out", options: ["expo.out", "power3.out", "power3.inOut", "circ.out"] },
      { id: "duration", label: "Duration", kind: "choice", prefix: "duration = ", default: 1.2, options: [0.8, 1.2, 1.6], unit: "s" },
      {
        id: "from",
        label: "Wipe from",
        kind: "option",
        prefix: "from = ",
        default: '"bottom"',
        options: [
          { value: '"bottom"', label: "bottom" },
          { value: '"left"', label: "left" },
          { value: '"center"', label: "center" },
        ],
      },
      { id: "scale", label: "Start scale", kind: "choice", prefix: "scale = ", default: 1.25, options: [1, 1.25, 1.5] },
    ],
    notes: [
      { title: "Two motions, one ease", body: "The wipe and the scale share duration and ease, so they finish on the same frame. The image comes to rest exactly as the frame opens." },
      { title: "Ease", body: "expo.out reveals most of the picture immediately, then spends a long tail settling the zoom. It reads as a camera finding focus." },
      { title: "Trigger", body: "It plays once, when 30% of the frame is on screen. A plain IntersectionObserver is enough; no scroll plugin needed." },
    ],
    accessibility:
      "The media keeps its own alt text and nothing is hidden from screen readers. With reduced motion on, the image is simply shown. The wipe plays once and never loops.",
  },
  "svg-line-draw": {
    file: "hz/svg-line-draw/svg-line-draw.tsx",
    fileName: "ScrollDraw.tsx",
    description:
      "Every stroke in an SVG draws itself as you scroll past it, and undraws if you scroll back. Wrap any inline SVG and it works.",
    chips: ["DrawSVGPlugin", "ScrollTrigger", "Reduced motion: drawn"],
    knobs: [
      {
        id: "from",
        label: "Draw from",
        kind: "option",
        prefix: "from = ",
        default: '"start"',
        options: [
          { value: '"start"', label: "start", note: "The line grows from its first point, the way a pen would draw it." },
          { value: '"middle"', label: "middle", note: "The line grows outward from its midpoint. Symmetric, good for dividers." },
        ],
      },
      {
        id: "scrub",
        label: "Scrub",
        kind: "option",
        prefix: "scrub = ",
        default: "true",
        options: [
          { value: "true", label: "true" },
          { value: "0.5", label: "0.5" },
          { value: "1", label: "1" },
        ],
      },
      { id: "stagger", label: "Stagger", kind: "choice", prefix: "stagger = ", default: 0, options: [0, 0.3, 0.6] },
    ],
    notes: [
      { title: "Ease", body: 'ease: "none". The pen moves exactly as fast as the reader scrolls, and stops when they stop.' },
      { title: "From", body: "Drawing from the start reads as handwriting. Drawing from the middle reads as something opening, which suits rules and dividers." },
      { title: "Stagger", body: "With several paths, a stagger hands the pen from one stroke to the next along the same scroll distance." },
    ],
    accessibility:
      "Give a meaningful drawing a title or aria-label; decorative ones should be aria-hidden, like the demo. With reduced motion on, the drawing is fully drawn and nothing is tied to scroll.",
  },
  "velocity-marquee": {
    file: "hz/velocity-marquee/velocity-marquee.tsx",
    fileName: "VelocityMarquee.tsx",
    description:
      "An endless row that drifts on its own, speeds up and leans when you scroll fast, and follows the direction you scroll. Then it eases back to cruising.",
    chips: ["ScrollTrigger", "getVelocity()", "Pause button"],
    knobs: [
      {
        id: "speed",
        label: "Cruise speed",
        kind: "option",
        prefix: "speed = ",
        default: "80",
        options: [
          { value: "40", label: "40", head: "40 px/s" },
          { value: "80", label: "80", head: "80 px/s" },
          { value: "160", label: "160", head: "160 px/s" },
        ],
      },
      {
        id: "boost",
        label: "Boost",
        kind: "option",
        prefix: "boost = ",
        default: "3",
        options: [
          { value: "1", label: "1", head: "up to 2× speed" },
          { value: "3", label: "3", head: "up to 4× speed" },
          { value: "6", label: "6", head: "up to 7× speed" },
        ],
      },
      {
        id: "maxSkew",
        label: "Lean",
        kind: "option",
        prefix: "maxSkew = ",
        default: "8",
        options: [
          { value: "0", label: "off" },
          { value: "8", label: "8°" },
          { value: "15", label: "15°" },
        ],
      },
    ],
    notes: [
      { title: "Velocity", body: "The loop's timeScale follows how fast you scroll and in which direction, then eases back to cruising over about a second. It feels connected without being chained." },
      { title: "Lean", body: "A skew in proportion to scroll speed sells the speed. Capped at 8° by default; past 15° the type gets hard to read." },
      { title: "Loop", body: "The content is rendered twice and slides by exactly half its width, so the seam never shows at any screen size." },
    ],
    accessibility:
      "Moving content needs a way to stop it, so the marquee has a Pause button. The duplicate copy is hidden from screen readers and inert. With reduced motion on, nothing loops and the row becomes a native sideways scroller.",
  },
  "route-transition": {
    file: "hz/route-transition/route-transition.tsx",
    fileName: "RouteTransition.tsx",
    description:
      "A curtain sweeps over the page, the route changes underneath, and the curtain lifts off the far side once the new page has rendered. One continuous wipe.",
    chips: ["App Router", "usePathname", "Reduced motion: instant"],
    knobs: [
      { id: "ease", label: "Ease", kind: "ease", prefix: "ease = ", default: "power3.inOut", options: ["power3.inOut", "sine.inOut", "power3.out", "expo.out"] },
      { id: "duration", label: "Duration", kind: "choice", prefix: "duration = ", default: 0.6, options: [0.4, 0.6, 0.9], unit: "s" },
      {
        id: "direction",
        label: "Direction",
        kind: "option",
        prefix: "direction = ",
        default: '"up"',
        options: [
          { value: '"up"', label: "up" },
          { value: '"down"', label: "down" },
        ],
      },
    ],
    notes: [
      { title: "Ease", body: "power3.inOut starts slow, which reads as intent, moves fast across the middle where nothing needs watching, and settles at the end." },
      { title: "Handoff", body: "The curtain only lifts after the pathname changes, so the new page is already rendered underneath. No flash of the old page, no blank frame." },
      { title: "Direction", body: "It enters and leaves in the same direction, so the two halves read as one sweep rather than a door closing and opening." },
    ],
    accessibility:
      "Links stay real links: new-tab and modified clicks keep the browser's behavior, and the curtain is hidden from screen readers. Next.js still handles focus and scroll after navigation. With reduced motion on, navigation happens immediately with no curtain.",
  },
  "cursor-follower": {
    file: "hz/cursor-follower/cursor-follower.tsx",
    fileName: "CursorFollower.tsx",
    description:
      "A small dot trails the mouse with a little lag. Over a button or link it grows to wrap the target, then shrinks back to a dot when you leave.",
    chips: ["gsap.quickTo", "Mouse only", "Native cursor kept"],
    knobs: [
      { id: "ease", label: "Ease", kind: "ease", prefix: "ease = ", default: "power3.out", options: ["power3.out", "expo.out", "back.out(1.7)", "sine.inOut"] },
      { id: "duration", label: "Duration", kind: "choice", prefix: "duration = ", default: 0.5, options: [0.3, 0.5, 0.8], unit: "s" },
      {
        id: "size",
        label: "Dot size",
        kind: "option",
        prefix: "size = ",
        default: "12",
        options: [
          { value: "8", label: "8px" },
          { value: "12", label: "12px" },
          { value: "20", label: "20px" },
        ],
      },
    ],
    notes: [
      { title: "Lag", body: "Half a second of trail gives the dot weight. It follows you, it doesn't replace the cursor, and the native cursor stays where it is." },
      { title: "Targets", body: "Over a target the dot sits on its center, nudged slightly toward the pointer, and wraps it with a little padding. The target looks picked up." },
      { title: "Interruption", body: "quickTo retargets the running tween on every move, so fast sweeps never stutter or queue." },
    ],
    accessibility:
      "The follower is decorative: hidden from screen readers and ignoring pointer events. The native cursor is never hidden, and touch and pen input are ignored. With reduced motion on, there is no follower at all.",
  },
  "toast-stack": {
    file: "hz/toast-stack/toast-stack.tsx",
    fileName: "ToastStack.tsx",
    description:
      "New notifications pop in at the bottom and the others make room. Swipe one sideways to dismiss it, or press its close button; the gap closes smoothly.",
    chips: ["Flip", "Draggable", "aria-live: polite"],
    knobs: [
      { id: "ease", label: "Ease", kind: "ease", prefix: "ease = ", default: "back.out(1.7)", options: ["back.out(1.7)", "power3.out", "expo.out", "elastic.out(1, 0.3)"] },
      { id: "duration", label: "Duration", kind: "choice", prefix: "duration = ", default: 0.5, options: [0.3, 0.5, 0.8], unit: "s" },
      {
        id: "limit",
        label: "Limit",
        kind: "option",
        prefix: "limit = ",
        default: "3",
        options: [
          { value: "3", label: "3", head: "3 at a time" },
          { value: "5", label: "5", head: "5 at a time" },
        ],
      },
    ],
    notes: [
      { title: "Enter", body: "A new toast pops in with back.out while the others move up with Flip from where they were. Arrival and making room happen as one beat." },
      { title: "Swipe", body: "Past 80px a release throws the toast off in the direction you swiped. A shorter drag springs back, so an accidental nudge does nothing." },
      { title: "Order", body: "A dismissed toast leaves first, then the gap closes. Doing both at once makes the stack look like it lost track." },
    ],
    accessibility:
      "The list is a polite live region, so new toasts are announced. Every toast has a Dismiss button as the keyboard alternative to swiping, and nothing auto-dismisses before it can be read. With reduced motion on, toasts appear and leave without moving.",
  },
  "draggable-bottom-sheet": {
    file: "hz/draggable-bottom-sheet/draggable-bottom-sheet.tsx",
    fileName: "BottomSheet.tsx",
    description:
      "A sheet you drag by its handle between snap points. Flick it and it lands on the point you were heading for, with a springy settle. Drag it low enough and it closes.",
    chips: ["Draggable", "role=dialog", "Escape closes"],
    knobs: [
      { id: "ease", label: "Ease", kind: "ease", prefix: "ease = ", default: "elastic.out(1, 0.3)", options: ["elastic.out(1, 0.3)", "back.out(1.7)", "expo.out", "power3.out"] },
      { id: "duration", label: "Duration", kind: "choice", prefix: "duration = ", default: 0.8, options: [0.5, 0.8, 1.2], unit: "s" },
      {
        id: "snapPoints",
        label: "Snap points",
        kind: "option",
        prefix: "snapPoints = ",
        default: "[0.4, 0.9]",
        options: [
          { value: "[0.9]", label: "1", head: "90%" },
          { value: "[0.4, 0.9]", label: "2", head: "40% · 90%" },
          { value: "[0.25, 0.6, 0.95]", label: "3", head: "25% · 60% · 95%" },
        ],
      },
    ],
    notes: [
      { title: "Spring", body: "elastic.out lands with a small wobble, which tells you the sheet is a physical thing you can push. For dense content, back.out is calmer." },
      { title: "Flick", body: "On release the sheet aims 0.2s ahead along the flick, then picks the nearest snap point. A quick upward flick goes up even if your finger stopped low." },
      { title: "Close", body: "Aim below halfway to the first snap point and it closes. Closing uses a short power3.in with no bounce: leaving should not wobble." },
    ],
    accessibility:
      "The sheet is a dialog with aria-modal. Focus moves into it when it opens and back to the trigger when it closes; Escape and the backdrop close it. The handle is a button that steps through the snap points for keyboard users. Closed, it is inert. It does not trap focus, so add a focus trap if the sheet holds many controls. With reduced motion on, it snaps without travel.",
  },
  "cursor-image-trail": {
    file: "hz/cursor-image-trail/cursor-image-trail.tsx",
    fileName: "ImageTrail.tsx",
    description:
      "Images drop behind the cursor as it moves, drift a little in the direction of travel, and fade. Slow moves leave a sparse trail, fast ones a dense one.",
    chips: ["Core", "Pooled elements", "Reduced motion: off"],
    knobs: [
      { id: "ease", label: "Ease", kind: "ease", prefix: "ease = ", default: "power3.out", options: ["power3.out", "expo.out", "back.out(1.7)", "circ.out"] },
      { id: "duration", label: "Duration", kind: "choice", prefix: "duration = ", default: 0.8, options: [0.6, 0.8, 1.2], unit: "s" },
      {
        id: "threshold",
        label: "Spacing",
        kind: "option",
        prefix: "threshold = ",
        default: "80",
        options: [
          { value: "40", label: "40px", note: "Dense. Reads as a smear; better with small images." },
          { value: "80", label: "80px", note: "Each image is seen on its own, but the trail still feels continuous." },
          { value: "140", label: "140px", note: "Sparse. Each drop is an event." },
        ],
      },
    ],
    notes: [
      { title: "Distance, not time", body: "A new image drops every 80px of travel, not every few milliseconds. The trail's density follows the hand, and a still cursor leaves nothing." },
      { title: "Drift", body: "Each image keeps moving a little along the direction of travel as it appears. The trail feels thrown, not stamped." },
      { title: "Pool", body: "A fixed set of elements is reused in turn. No elements are created while moving, so long sessions stay smooth." },
    ],
    accessibility:
      "The trail is decorative: hidden from screen readers and ignoring pointer events, so the content underneath stays usable. Don't put information in the trail images. With reduced motion on, there is no trail.",
  },
  "preloader-handoff": {
    file: "hz/preloader-handoff/preloader-handoff.tsx",
    fileName: "Preloader.tsx",
    description:
      "A counter runs to 100, the cover lifts, and the hero starts rising before the cover has gone. Two animations, handed off so they read as one move.",
    chips: ["gsap.timeline", "Position parameter", "Reduced motion: skipped"],
    knobs: [
      { id: "ease", label: "Exit ease", kind: "ease", prefix: "ease = ", default: "power3.inOut", options: ["power3.inOut", "expo.out", "power3.out", "sine.inOut"] },
      { id: "duration", label: "Count", kind: "choice", prefix: "duration = ", default: 1.6, options: [1, 1.6, 2.4], unit: "s" },
      {
        id: "overlap",
        label: "Overlap",
        kind: "option",
        prefix: "overlap = ",
        default: "0.3",
        options: [
          { value: "0", label: "0s", note: "The hero waits for the cover to leave. Two separate moves." },
          { value: "0.3", label: "0.3s", note: "The hero starts as the cover clears the middle. One move." },
          { value: "0.6", label: "0.6s", note: "The hero rises almost with the cover. Fast, a little crowded." },
        ],
      },
    ],
    notes: [
      { title: "Handoff", body: "The hero starts 0.3s before the cover finishes leaving, using the timeline's position parameter. The eye goes straight from one to the other." },
      { title: "Counter", body: "The count is timed, not tied to real loading. If you have real progress, drive the counter from it and keep the rest of the timeline." },
      { title: "Exit", body: "power3.inOut lifts the cover slowly at first, then clears it fast, so the reveal feels deliberate rather than abrupt." },
    ],
    accessibility:
      "The cover is hidden from screen readers and the content underneath is in the page from the start, so nothing waits on the animation. With reduced motion on, the preloader is skipped. Without JavaScript, a noscript style hides the cover. Keep the whole thing under about 2.5s.",
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
