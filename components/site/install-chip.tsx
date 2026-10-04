import { CopyButton } from "@/components/copy-button";
import { installCommand, shortInstallCommand } from "@/lib/site";

export function InstallChip({ slug, className = "" }: { slug: string; className?: string }) {
  return (
    <div className={`flex h-12 min-w-0 max-w-full items-center gap-3 rounded-xl border border-hairline bg-surface pr-1.5 pl-4 ${className}`}>
      <code className="min-w-0 flex-1 truncate font-mono text-[13px]">
        <span className="text-muted">$ </span>
        {shortInstallCommand(slug)}
      </code>
      <CopyButton
        text={installCommand(slug)}
        aria-label="Copy install command"
        className="flex size-10 flex-none items-center justify-center rounded-lg bg-ground text-ink hover:bg-hairline"
      />
    </div>
  );
}
