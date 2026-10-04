"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { BottomSheet } from "@/registry/hz/draggable-bottom-sheet/draggable-bottom-sheet";
import type { DemoProps } from "@/components/recipe/demos";
import { Tool, Tools, useSettled, useTicker } from "@/components/recipe/demos/kit";

const rows = ["Ease", "Duration", "Snap points", "Edges", "Reduced motion", "Keyboard"];

export function DraggableBottomSheetDemo({ values, reduced, onReadout, tools }: DemoProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [snap, setSnap] = useState(0);
  const [view, setView] = useSettled({ y: 0, dragging: false });
  const points = useMemo(() => JSON.parse(String(values.snapPoints)) as number[], [values.snapPoints]);

  useTicker(() => {
    const el = wrap.current?.querySelector('[role="dialog"]');
    if (el) setView({ y: Math.round(Number(gsap.getProperty(el, "y"))), dragging: !!Draggable.get(el)?.isDragging });
  });

  useEffect(() => {
    if (!open) return onReadout("CLOSED");
    const at = `SNAP ${snap + 1} / ${points.length} · ${Math.round((points[snap] ?? 0) * 100)}%`;
    onReadout(`${view.dragging ? "DRAGGING" : at} · y ${view.y}px`);
  }, [open, snap, view, points, onReadout]);

  return (
    <div ref={wrap} className="absolute inset-x-4 top-11 bottom-[136px] overflow-hidden rounded-[10px] ring-1 ring-hairline sm:inset-x-6 sm:bottom-[60px]">
      <div className="flex h-full flex-col items-center justify-center gap-2 bg-ground p-6 text-center">
        <span className="font-mono text-xs text-muted">APP SCREEN</span>
        <p className="max-w-[320px] text-ink-2">Open the sheet, then drag the handle or flick it between snap points.</p>
      </div>
      <BottomSheet
        key={`${reduced}-${values.snapPoints}`}
        contained
        open={open}
        onOpenChange={setOpen}
        onSnap={setSnap}
        title={<span className="text-lg font-medium tracking-[-0.02em]">Knobs</span>}
        snapPoints={points}
        duration={reduced ? 0 : Number(values.duration)}
        ease={String(values.ease)}
        className="bg-surface text-ink ring-1 ring-hairline [&_[data-grab]_button]:cursor-pointer"
      >
        <ul className="flex flex-col">
          {rows.map((r) => (
            <li key={r} className="flex justify-between border-b border-hairline py-3 text-sm">
              <span>{r}</span>
              <span className="font-mono text-xs text-muted">set</span>
            </li>
          ))}
        </ul>
      </BottomSheet>
      <Tools tools={tools}>
        <Tool onClick={() => setOpen(!open)} primary>
          {open ? "Close sheet" : "Open sheet"}
        </Tool>
      </Tools>
    </div>
  );
}
