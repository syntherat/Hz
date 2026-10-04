import { curvePath } from "@/lib/eases";

type CurveProps = {
  ease: string;
  className?: string;
  strokeWidth?: number;
  guides?: boolean;
  marker?: { t: number; p: number };
};

export function Curve({ ease, className, strokeWidth = 2.5, guides = true, marker }: CurveProps) {
  return (
    <svg viewBox="0 -30 240 150" fill="none" aria-hidden="true" className={className}>
      {guides && (
        <>
          <line x1="0" y1="110" x2="240" y2="110" stroke="var(--color-line-strong)" />
          <line x1="0" y1="10" x2="240" y2="10" stroke="var(--color-line-strong)" strokeDasharray="3 4" />
        </>
      )}
      <path d={curvePath(ease)} stroke="var(--color-signal)" strokeWidth={strokeWidth} strokeLinejoin="round" />
      {marker && <circle cx={240 * marker.t} cy={110 - 100 * marker.p} r="6" fill="var(--color-signal)" />}
    </svg>
  );
}
