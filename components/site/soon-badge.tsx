export function SoonBadge({ large }: { large?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border border-line-strong bg-ground font-mono tracking-[0.06em] text-ink uppercase ${
        large ? "h-8 px-2.5 text-xs" : "h-6 px-2 text-[11px]"
      }`}
    >
      <span className={`rounded-full bg-signal ${large ? "size-1.5" : "size-[5px]"}`} aria-hidden="true" />
      Coming soon
    </span>
  );
}
