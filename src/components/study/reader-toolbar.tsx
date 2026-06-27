"use client";

import { Type } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  FONT_LABELS,
  type ReaderFont,
  type ReaderSize,
} from "@/lib/reading";

const FONTS: ReaderFont[] = ["sans", "serif", "notes"];
const SIZES: { value: ReaderSize; label: string }[] = [
  { value: "sm", label: "A" },
  { value: "md", label: "A" },
  { value: "lg", label: "A" },
];

export function ReaderToolbar({
  font,
  setFont,
  size,
  setSize,
}: {
  font: ReaderFont;
  setFont: (f: ReaderFont) => void;
  size: ReaderSize;
  setSize: (s: ReaderSize) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border bg-card p-2">
      <span className="ml-1 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Type className="h-3.5 w-3.5" /> Reading
      </span>
      <div className="flex items-center gap-1">
        {FONTS.map((f) => (
          <button
            key={f}
            onClick={() => setFont(f)}
            className={cn(
              "rounded-lg px-2.5 py-1 text-sm transition-colors hover:bg-accent",
              f === "serif" && "font-serif",
              f === "notes" && "font-notes",
              font === f && "bg-secondary font-medium text-foreground",
            )}
          >
            {FONT_LABELS[f]}
          </button>
        ))}
      </div>
      <div className="h-5 w-px bg-border" />
      <div className="flex items-center gap-1">
        {SIZES.map((s, i) => (
          <button
            key={s.value}
            onClick={() => setSize(s.value)}
            className={cn(
              "rounded-lg px-2 py-1 transition-colors hover:bg-accent",
              i === 0 ? "text-xs" : i === 1 ? "text-sm" : "text-base",
              size === s.value && "bg-secondary text-foreground",
            )}
            aria-label={`Text size ${s.value}`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
