import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { codeToTokens, type ThemeRegistrationRaw } from "shiki";
import { formatKnob, type Knob } from "@/content/details";

export type CodeToken = { text: string; color?: string };

const theme: ThemeRegistrationRaw = {
  name: "hz",
  type: "dark",
  settings: [
    { settings: { foreground: "#e6e6e3", background: "#101012" } },
    {
      scope: [
        "keyword",
        "storage",
        "storage.type",
        "storage.modifier",
        "constant.language",
        "variable.language",
        "comment",
        "punctuation.definition.comment",
      ],
      settings: { foreground: "#8a8a90" },
    },
    { scope: ["string", "string.quoted", "punctuation.definition.string"], settings: { foreground: "#9fd8a6" } },
  ],
};

export async function readSource(file: string) {
  return readFile(join(process.cwd(), "registry", file), "utf8");
}

// knob literals become __K0__, __K1__… so the client can swap in live values after highlighting
export async function highlightWithKnobs(source: string, knobs: Knob[]) {
  const marked = knobs.reduce(
    (code, k, i) => code.replace(k.prefix + formatKnob(k, k.default), `${k.prefix}__K${i}__`),
    source,
  );
  const { tokens } = await codeToTokens(marked.trimEnd(), { lang: "tsx", theme });
  return tokens.map((line) => line.map((t): CodeToken => ({ text: t.content, color: t.color })));
}

export async function highlight(code: string, lang: "tsx" | "bash" = "tsx") {
  const { tokens } = await codeToTokens(code.trimEnd(), { lang, theme });
  return tokens.map((line) => line.map((t): CodeToken => ({ text: t.content, color: t.color })));
}
