"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Recipes", match: (p: string) => p === "/" || p.startsWith("/recipes") },
  { href: "/easing", label: "Easing lab", match: (p: string) => p.startsWith("/easing") },
  { href: "/docs", label: "Docs", match: (p: string) => p.startsWith("/docs") },
  { href: "/about", label: "About", match: (p: string) => p.startsWith("/about") },
];

export function NavLinks() {
  const pathname = usePathname();
  return (
    <nav aria-label="Primary" className="flex flex-wrap gap-6 text-sm">
      {links.map((l) => {
        const active = l.match(pathname);
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={active ? "page" : undefined}
            className={active ? "text-ink" : "text-muted hover:text-ink"}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
