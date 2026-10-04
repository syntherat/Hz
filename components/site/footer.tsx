import Link from "next/link";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mx-auto mt-16 flex max-w-[1280px] flex-wrap justify-between gap-6 border-t border-hairline px-4 pt-12 pb-16 text-sm text-muted sm:px-6">
      <div className="flex flex-col gap-1.5">
        <span className="text-xl font-semibold tracking-[-0.06em] text-ink">Hz</span>
        <span>Built with GSAP, free for everyone since 2025. License: [license].</span>
      </div>
      <div className="flex flex-wrap items-end gap-6">
        <Link href="/docs" className="hover:text-ink">Docs</Link>
        <Link href="/about" className="hover:text-ink">About</Link>
        <a href={site.github || "#"} className="hover:text-ink">GitHub</a>
        <span>Made by [your name]</span>
      </div>
    </footer>
  );
}
