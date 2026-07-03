"use client";

import { cn } from "@/lib/utils";

/**
 * A donut gauge for exam readiness (average answer accuracy). Color shifts
 * with the score so a glance tells you where you stand.
 */
export function ReadinessRing({
  pct,
  size = 96,
  stroke = 9,
  label,
}: {
  pct: number | null;
  size?: number;
  stroke?: number;
  label?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const value = pct ?? 0;
  const dash = (value / 100) * c;

  const color =
    pct === null
      ? "hsl(var(--muted-foreground))"
      : pct >= 85
        ? "hsl(142 71% 45%)"
        : pct >= 70
          ? "hsl(var(--primary))"
          : pct >= 50
            ? "hsl(33 90% 54%)"
            : "hsl(0 72% 55%)";

  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${pct === null ? "Not started" : `${pct}% ready`}`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
          className="transition-[stroke-dasharray] duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn("font-bold leading-none", size >= 88 ? "text-2xl" : "text-lg")}>
          {pct === null ? "—" : `${pct}%`}
        </span>
        {label && (
          <span className="mt-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
