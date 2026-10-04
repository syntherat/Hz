"use client";

import { useCallback, useState } from "react";
import { Stage } from "@/components/recipe/stage";
import { Knobs } from "@/components/recipe/knobs";
import { CodePanel } from "@/components/recipe/code-panel";
import { demos } from "@/components/recipe/demos";
import { applyKnobs, defaultValues, details, type KnobValue } from "@/content/details";
import type { CodeToken } from "@/lib/highlight";
import type { Recipe } from "@/content/recipes";

type PlaygroundProps = {
  recipe: Recipe;
  source: string;
  lines: CodeToken[][];
  installLines: CodeToken[][];
  install: string;
};

export function Playground({ recipe, source, lines, installLines, install }: PlaygroundProps) {
  const d = details[recipe.slug];
  const Demo = demos[recipe.slug];
  const [values, setValues] = useState<Record<string, KnobValue>>(() => defaultValues(d.knobs));
  const [slow, setSlow] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [readout, setReadout] = useState("");
  const [tools, setTools] = useState<HTMLElement | null>(null);

  const onReadout = useCallback((text: string) => setReadout(text), []);
  const code = () => applyKnobs(source, d.knobs, values);

  const prompt = () =>
    [
      `Add the "${recipe.name}" interaction (${recipe.id} from Hz) to my Next.js App Router project.`,
      "",
      d.description,
      "",
      "Rules: TypeScript, \"use client\", only gsap and @gsap/react, set up inside useGSAP so cleanup is automatic, respect prefers-reduced-motion, keep it interruptible.",
      "",
      `Install: ${install}`,
      "",
      `\`\`\`tsx\n${code().trimEnd()}\n\`\`\``,
    ].join("\n");

  return (
    <>
      <div className="flex flex-wrap items-stretch gap-4">
        <Stage
          label={recipe.id}
          readout={readout}
          slow={slow}
          reduced={reduced}
          onSlow={setSlow}
          onReduced={setReduced}
          tools={<div ref={setTools} className="contents" />}
        >
          <Demo values={values} reduced={reduced} onReadout={onReadout} tools={tools} />
        </Stage>
        <Knobs
          knobs={d.knobs}
          values={values}
          onChange={(id, v) => setValues((prev) => ({ ...prev, [id]: v }))}
          onReset={() => setValues(defaultValues(d.knobs))}
        />
      </div>
      <CodePanel
        fileName={d.fileName}
        lines={lines}
        installLines={installLines}
        knobs={d.knobs}
        values={values}
        code={code}
        install={install}
        prompt={prompt}
      />
    </>
  );
}
