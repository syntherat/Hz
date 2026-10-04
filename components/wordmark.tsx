import Link from "next/link";

export function SineMark({ className }: { className?: string }) {
  return (
    <svg width="22" height="12" viewBox="0 0 22 12" fill="none" aria-hidden="true" className={className}>
      <path d="M1 6 Q 4.5 0 8 6 T 15 6 T 21 6" stroke="var(--color-signal)" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function Wordmark() {
  return (
    <Link href="/" className="flex items-center gap-2 text-2xl font-semibold tracking-[-0.06em]" aria-label="Hz home">
      Hz
      <SineMark />
    </Link>
  );
}
