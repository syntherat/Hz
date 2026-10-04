"use client";

import { useEffect, useRef, useState } from "react";
import { Draggable } from "gsap/Draggable";
import { ToastStack, type ToastStackHandle } from "@/registry/hz/toast-stack/toast-stack";
import type { DemoProps } from "@/components/recipe/demos";
import { Tool, Tools, useSettled, useTicker } from "@/components/recipe/demos/kit";

const messages = [
  ["Copied", "npx shadcn add hz.dev/r/toast-stack"],
  ["Saved", "Knob values written to the file."],
  ["Build passed", "24 pages generated."],
  ["Link shared", "Anyone with the link can view."],
];

export function ToastStackDemo({ values, reduced, onReadout, tools }: DemoProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const stack = useRef<ToastStackHandle>(null);
  const [n, setN] = useState(0);
  const [view, setView] = useSettled({ count: 0, swiping: false });

  useTicker(() => {
    const items = Array.from(wrap.current?.querySelectorAll("li") ?? []);
    setView({ count: items.length, swiping: items.some((li) => Draggable.get(li)?.isDragging) });
  });

  useEffect(() => {
    onReadout(`${view.count} / ${values.limit} toasts${view.swiping ? " · SWIPING" : ""}`);
  }, [view, values.limit, onReadout]);

  const add = () => {
    const [title, body] = messages[n % messages.length];
    stack.current?.push({ title, body });
    setN(n + 1);
  };

  return (
    <div ref={wrap} className="absolute inset-x-4 top-11 bottom-[96px] flex flex-col items-center justify-end sm:inset-x-6 sm:bottom-[60px]">
      {view.count === 0 && <p className="mb-auto pt-24 text-center text-ink-2">Add a toast, then swipe it sideways or press its close button.</p>}
      <ToastStack
        key={`${reduced}-${values.limit}`}
        ref={stack}
        limit={Number(values.limit)}
        duration={reduced ? 0 : Number(values.duration)}
        ease={String(values.ease)}
        className="flex w-full max-w-[340px] flex-col gap-2 pb-2 [&>li]:cursor-grab [&>li]:bg-fill-2 [&>li]:text-ink [&>li]:ring-hairline [&_button]:cursor-pointer"
      />
      <Tools tools={tools}>
        <Tool onClick={add} primary>
          Add toast
        </Tool>
      </Tools>
    </div>
  );
}
