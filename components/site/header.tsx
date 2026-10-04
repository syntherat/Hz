import { Wordmark } from "@/components/wordmark";
import { NavLinks } from "@/components/site/nav-links";
import { CommandMenu } from "@/components/site/command-menu";
import { site } from "@/lib/site";

export function Header() {
  return (
    <header className="border-b border-hairline">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-x-8 gap-y-3 px-4 py-3.5 sm:px-6">
        <Wordmark />
        <NavLinks />
        <div className="ml-auto flex flex-wrap items-center gap-2.5">
          <CommandMenu />
          <a
            href={site.github || "#"}
            className="hidden h-10 items-center gap-2 rounded-[10px] bg-ink px-3.5 text-sm text-ground hover:bg-ink-2 sm:flex"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 2l3 6.5 7 .8-5.2 4.8 1.5 7-6.3-3.6L5.7 21l1.5-7L2 9.3l7-.8z" />
            </svg>
            Star on GitHub
            <span className="font-mono text-xs text-[#5a5a60]">[stars]</span>
          </a>
        </div>
      </div>
    </header>
  );
}
