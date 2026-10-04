export const site = {
  name: "Hz",
  tagline: "Motion, measured.",
  description:
    "Interaction recipes for Next.js, built with GSAP. Tune each one live, read why it works, then copy the code or install it with one command.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://hz.sounakpal.dev").replace(/\/$/, ""),
  github: process.env.NEXT_PUBLIC_GITHUB_URL || "https://github.com/syntherat/Hz",
  author: { name: "Sounak Pal", url: "https://sounakpal.dev" },
};

export function installCommand(slug: string) {
  return `npx shadcn@latest add ${site.url}/r/${slug}.json`;
}

export function shortInstallCommand(slug: string) {
  return `npx shadcn add ${site.url.replace(/^https?:\/\//, "")}/r/${slug}`;
}
