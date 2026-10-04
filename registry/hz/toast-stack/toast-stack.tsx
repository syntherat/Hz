"use client";

import { useImperativeHandle, useRef, useState, type ComponentPropsWithoutRef, type ReactNode, type Ref } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { Flip } from "gsap/Flip";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(Draggable, Flip, useGSAP);

export type Toast = { id: number; title: ReactNode; body?: ReactNode };
export type ToastStackHandle = { push: (toast: Omit<Toast, "id">) => void; dismiss: (id: number) => void };

type ToastStackProps = Omit<ComponentPropsWithoutRef<"ol">, "children"> & {
  ref?: Ref<ToastStackHandle>;
  limit?: number;
  duration?: number;
  ease?: string;
  swipe?: number;
};

const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function ToastStack({
  ref,
  limit = 3,
  duration = 0.5,
  ease = "back.out(1.7)",
  swipe = 80,
  ...props
}: ToastStackProps) {
  const list = useRef<HTMLOListElement>(null);
  const state = useRef<Flip.FlipState>(null);
  const nextId = useRef(0);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const { contextSafe } = useGSAP({ scope: list });

  // positions have to be recorded before react moves anything
  const update = (fn: (ts: Toast[]) => Toast[]) => {
    state.current = Flip.getState(list.current!.children);
    setToasts(fn);
  };

  const dismiss = contextSafe((id: number, dir = 1) => {
    const el = list.current?.querySelector<HTMLElement>(`[data-id="${id}"]`);
    if (!el) return;
    gsap.to(el, {
      x: dir * el.offsetWidth,
      opacity: 0,
      duration: reduceMotion() ? 0 : 0.25,
      ease: "power2.in",
      onComplete: () => update((ts) => ts.filter((t) => t.id !== id)),
    });
  });

  useImperativeHandle(ref, () => ({
    push: (toast) => update((ts) => [...ts, { ...toast, id: nextId.current++ }].slice(-limit)),
    dismiss,
  }));

  useGSAP(
    () => {
      const items = Array.from(list.current!.children) as HTMLElement[];
      // every new toast gets a swipe; a short throw springs back, a long one dismisses
      items.forEach((el) => {
        if (Draggable.get(el)) return;
        Draggable.create(el, {
          type: "x",
          onRelease() {
            if (Math.abs(this.x) > swipe) dismiss(Number(el.dataset.id), Math.sign(this.x));
            else gsap.to(el, { x: 0, duration: reduceMotion() ? 0 : 0.5, ease: "elastic.out(1, 0.6)" });
          },
        });
      });
      if (!state.current) return;
      const d = reduceMotion() ? 0 : duration;
      Flip.from(state.current, {
        targets: items,
        duration: d,
        ease,
        onEnter: (els) => gsap.fromTo(els, { opacity: 0, y: 24, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: d, ease }),
      });
      state.current = null;
    },
    { dependencies: [toasts] },
  );

  return (
    <ol ref={list} aria-live="polite" aria-label="Notifications" {...props}>
      {toasts.map((t) => (
        <li key={t.id} data-id={t.id} className="flex touch-pan-y items-start gap-3 rounded-xl bg-neutral-900 p-4 text-sm text-neutral-100 shadow-lg ring-1 ring-white/10">
          <div className="flex-1">
            <p className="font-medium">{t.title}</p>
            {t.body && <p className="mt-1 opacity-70">{t.body}</p>}
          </div>
          <button type="button" aria-label="Dismiss" onClick={() => dismiss(t.id)} className="-m-1 grid size-8 place-items-center rounded-md opacity-60 hover:opacity-100">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </li>
      ))}
    </ol>
  );
}
