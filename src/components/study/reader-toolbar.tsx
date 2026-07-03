"use client";

import { Type, Highlighter } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  FONT_LABELS,
  PAPER_LABELS,
  type ReaderFont,
  type ReaderPaper,
  type ReaderSize,
} from "@/lib/reading";

const FONTS: ReaderFont[] = ["sans", "serif", "notes"];
const SIZES: { value: ReaderSize; label: string }[] = [
  { value: "sm", label: "A" },
  { value: "md", label: "A" },
  { value: "lg", label: "A" },
];

/** Miniature previews of each paper style for the picker. */
const PAPER_SWATCH: Record<ReaderPaper, string> = {
  ruled:
    "bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_4px,hsl(210_60%_70%/.55)_4px,hsl(210_60%_70%/.55)_5px)]",
  grid: "bg-[linear-gradient(to_right,hsl(210_50%_60%/.4)_1px,transparent_1px),linear-gradient(to_bottom,hsl(210_50%_60%/.4)_1px,transparent_1px)] bg-[size:5px_5px]",
  plain: "bg-amber-50 dark:bg-stone-800",
  none: "bg-white dark:bg-zinc-100",
};

export function ReaderToolbar({
  font,
  setFont,
  size,
  setSize,
  paper,
  setPaper,
}: {
  font: ReaderFont;
  setFont: (f: ReaderFont) => void;
  size: ReaderSize;
  setSize: (s: ReaderSize) => void;
  paper: ReaderPaper;
  setPaper: (p: ReaderPaper) => void;
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
      <div className="h-5 w-px bg-border" />
      {/* paper background picker */}
      <div className="flex items-center gap-1">
        {(Object.keys(PAPER_LABELS) as ReaderPaper[]).map((p) => (
          <button
            key={p}
            onClick={() => setPaper(p)}
            title={`${PAPER_LABELS[p]} paper`}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs transition-colors hover:bg-accent",
              paper === p && "bg-secondary font-medium text-foreground",
            )}
          >
            <span
              className={cn(
                "h-4 w-4 rounded-[4px] border border-border/70",
                PAPER_SWATCH[p],
              )}
            />
            {PAPER_LABELS[p]}
          </button>
        ))}
      </div>
      <span className="ml-auto mr-1 hidden items-center gap-1.5 text-[11px] text-muted-foreground lg:flex">
        <Highlighter className="h-3.5 w-3.5" /> Select any text to highlight it
      </span>
    </div>
  );
}
