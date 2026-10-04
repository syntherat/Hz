"use client";

import { useId, useRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(Draggable, useGSAP);

type BottomSheetProps = Omit<ComponentPropsWithoutRef<"div">, "title"> & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  onSnap?: (index: number) => void;
  snapPoints?: number[];
  duration?: number;
  ease?: string;
  // fill the nearest positioned parent instead of the viewport
  contained?: boolean;
};

const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function BottomSheet({
  open,
  onOpenChange,
  title,
  onSnap,
  snapPoints = [0.4, 0.9],
  duration = 0.8,
  ease = "elastic.out(1, 0.3)",
  contained = false,
  className = "",
  children,
  ...props
}: BottomSheetProps) {
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const sheet = useRef<HTMLDivElement>(null);
  const snap = useRef(0);
  const returnFocus = useRef<HTMLElement>(null);

  // snap points are fractions of the container's height; y is how far the sheet sits below its full height
  const height = () => root.current!.clientHeight;
  const yAt = (i: number) => height() * (1 - snapPoints[i]);

  const { contextSafe } = useGSAP(
    () => {
      const el = sheet.current!;
      let v = 0;
      let last = { y: 0, t: 0 };
      Draggable.create(el, {
        type: "y",
        trigger: el.querySelector("[data-grab]"),
        dragClickables: true,
        bounds: { minY: yAt(snapPoints.length - 1), maxY: height() },
        edgeResistance: 0.8,
        onPress() {
          gsap.killTweensOf(el);
          v = 0;
          last = { y: this.y, t: performance.now() };
        },
        onDrag() {
          const now = performance.now();
          v = v * 0.5 + ((this.y - last.y) / Math.max(1, now - last.t)) * 500;
          last = { y: this.y, t: now };
        },
        onRelease() {
          // aim where the flick was heading, not where the finger let go
          const aim = this.y + v * 0.2;
          if (aim > yAt(0) + (height() - yAt(0)) / 2) return onOpenChange(false);
          const i = snapPoints.reduce((best, _, n) => (Math.abs(yAt(n) - aim) < Math.abs(yAt(best) - aim) ? n : best), 0);
          snapTo(i);
        },
      });
      gsap.set(el, { y: open ? yAt(Math.min(snap.current, snapPoints.length - 1)) : height() });
    },
    { scope: root, dependencies: [snapPoints.join()], revertOnUpdate: true },
  );

  const snapTo = contextSafe((i: number) => {
    snap.current = i;
    onSnap?.(i);
    gsap.to(sheet.current, { y: yAt(i), duration: reduceMotion() ? 0 : duration, ease, overwrite: true, onUpdate: () => Draggable.get(sheet.current)?.update() });
  });

  useGSAP(
    () => {
      const d = reduceMotion() ? 0 : 1;
      if (open) {
        returnFocus.current = document.activeElement as HTMLElement;
        gsap.set(root.current, { visibility: "visible" });
        gsap.to("[data-backdrop]", { opacity: 1, duration: 0.3 * d });
        snapTo(0);
        sheet.current!.focus({ preventScroll: true });
      } else if (returnFocus.current) {
        gsap.to("[data-backdrop]", { opacity: 0, duration: 0.3 * d });
        gsap.to(sheet.current, {
          y: height(),
          duration: 0.35 * d,
          ease: "power3.in",
          overwrite: true,
          onComplete: () => gsap.set(root.current, { visibility: "hidden" }),
        });
        returnFocus.current.focus({ preventScroll: true });
        returnFocus.current = null;
      }
    },
    { scope: root, dependencies: [open] },
  );

  return (
    <div ref={root} inert={!open} className={`${contained ? "absolute" : "fixed"} invisible inset-0 z-50 overflow-hidden`}>
      <div data-backdrop onClick={() => onOpenChange(false)} className="absolute inset-0 bg-black/50 opacity-0" />
      <div
        ref={sheet}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${id}-title`}
        tabIndex={-1}
        onKeyDown={(e) => e.key === "Escape" && onOpenChange(false)}
        className={`absolute inset-x-0 bottom-0 flex h-full flex-col rounded-t-2xl outline-none ${className}`}
        {...props}
      >
        <div data-grab className="shrink-0 cursor-grab touch-none px-5 pt-2 pb-3 active:cursor-grabbing">
          <button
            type="button"
            aria-label="Resize sheet"
            onClick={() => snapTo((snap.current + 1) % snapPoints.length)}
            className="mx-auto block h-6 w-12 py-2.5"
          >
            <span className="block h-1 rounded-full bg-current opacity-30" />
          </button>
          <h2 id={`${id}-title`}>{title}</h2>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5">{children}</div>
      </div>
    </div>
  );
}
