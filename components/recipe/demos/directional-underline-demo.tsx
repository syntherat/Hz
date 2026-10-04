"use client";

import { useEffect, useState, type PointerEvent } from "react";
import { DirectionalLink } from "@/registry/hz/directional-underline/directional-underline";
import type { DemoProps } from "@/components/recipe/demos";

const links = ["Work", "Studio", "Journal", "Contact"];

const side = (e: PointerEvent<HTMLElement>) => {
  const box = e.currentTarget.getBoundingClientRect();
  return e.clientX < box.left + box.width / 2 ? "LEFT" : "RIGHT";
};

export function DirectionalUnderlineDemo({ values, reduced, onReadout }: DemoProps) {
  const [last, setLast] = useState("hover a link");

  useEffect(() => {
    onReadout(last);
  }, [last, onReadout]);

  return (
    <nav aria-label="Demo" className="flex flex-wrap justify-center gap-x-8 gap-y-4 px-6 pb-10">
      {links.map((l) => (
        <DirectionalLink
          key={`${l}-${reduced}`}
          href="#"
          onClick={(e) => e.preventDefault()}
          onPointerEnter={(e) => setLast(`${l.toUpperCase()} · IN FROM ${side(e)}`)}
          onPointerLeave={(e) => setLast(`${l.toUpperCase()} · OUT TO ${side(e)}`)}
          duration={reduced ? 0 : Number(values.duration)}
          ease={String(values.ease)}
          className="pb-1 text-[32px] font-medium tracking-[-0.04em] sm:text-[40px]"
        >
          {l}
        </DirectionalLink>
      ))}
    </nav>
  );
}
