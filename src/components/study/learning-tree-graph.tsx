"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import type { StudySection, WordChallenge } from "@/lib/types";

/**
 * A real left-to-right learning tree: the study set is the trunk, each section
 * a branch, and key terms the leaves. Done = green, current = amber, pending =
 * muted. Hover a branch to see what it covers and whether it's left to do.
 * Mirrors the mobile LearningTreeView, reimagined for the web.
 */
const ROOT_W = 150;
const ROOT_H = 66;
const SEC_W = 200;
const SEC_H = 54;
const LEAF_H = 22;
const LEAF_GAP = 6;
const ROW_GAP = 26;
const COL_GAP = 68;
const PAD = 24;
const MAX_LEAVES = 3;

export function LearningTreeGraph({
  title,
  sections,
  completed,
  current,
  words = [],
  onSelect,
}: {
  title: string;
  sections: StudySection[];
  completed: Set<number>;
  current?: number;
  words?: WordChallenge[];
  onSelect?: (index: number) => void;
}) {
  const [hover, setHover] = React.useState<number | null>(null);
  const ordered = React.useMemo(
    () => [...sections].sort((a, b) => a.order - b.order),
    [sections],
  );

  const terms = React.useMemo(
    () => words.map((w) => w.word).filter((w) => w && w.length >= 3),
    [words],
  );

  if (ordered.length === 0) {
    return <p className="text-sm text-muted-foreground">No topics to map yet.</p>;
  }

  // Leaves per section: key terms that appear in the section's text.
  const leaves = ordered.map((s) => {
    const up = (s.content || "").toLowerCase();
    return terms.filter((t) => up.includes(t.toLowerCase())).slice(0, MAX_LEAVES);
  });

  const rowHeights = leaves.map((ls) => {
    const block = ls.length ? ls.length * LEAF_H + (ls.length - 1) * LEAF_GAP : 0;
    return Math.max(SEC_H, block);
  });
  const tops: number[] = [];
  let acc = PAD;
  rowHeights.forEach((h, i) => {
    tops.push(acc);
    acc += h + (i < rowHeights.length - 1 ? ROW_GAP : 0);
  });
  const contentH = acc + PAD;
  const hasLeaves = leaves.some((l) => l.length > 0);

  const rootRight = PAD + ROOT_W;
  const secX = rootRight + COL_GAP;
  const secRight = secX + SEC_W;
  const leafX = secRight + COL_GAP;
  const canvasW = hasLeaves ? leafX + 140 + PAD : secRight + PAD;
  const canvasH = Math.max(contentH, PAD * 2 + ROOT_H);
  const rootY = canvasH / 2;

  const secCenter = (i: number) => tops[i] + rowHeights[i] / 2;

  const done = completed.size;
  const pct = Math.round((done / ordered.length) * 100);

  function curve(x1: number, y1: number, x2: number, y2: number) {
    const mx = (x1 + x2) / 2;
    return `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
  }

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Your learning tree</span>
          <span className="text-muted-foreground">
            {done} of {ordered.length} explored
          </span>
        </div>
        <Progress className="mt-2" value={pct} />
      </div>

      <div className="overflow-x-auto rounded-xl border bg-muted/20 p-2">
        <div className="relative" style={{ width: canvasW, height: canvasH }}>
          {/* Connectors */}
          <svg
            className="absolute inset-0"
            width={canvasW}
            height={canvasH}
            fill="none"
          >
            {ordered.map((_, i) => {
              const isDone = completed.has(i);
              return (
                <path
                  key={`b${i}`}
                  d={curve(rootRight, rootY, secX, secCenter(i))}
                  className={isDone ? "stroke-green-500/60" : "stroke-border"}
                  strokeWidth={2}
                />
              );
            })}
            {ordered.map((_, i) =>
              leaves[i].map((_, j) => {
                const n = leaves[i].length;
                const block = n * LEAF_H + (n - 1) * LEAF_GAP;
                const startY = secCenter(i) - block / 2;
                const ly = startY + j * (LEAF_H + LEAF_GAP) + LEAF_H / 2;
                return (
                  <path
                    key={`l${i}-${j}`}
                    d={curve(secRight, secCenter(i), leafX, ly)}
                    className="stroke-border"
                    strokeWidth={1.5}
                  />
                );
              }),
            )}
          </svg>

          {/* Root / trunk */}
          <div
            className="absolute flex flex-col items-center justify-center rounded-2xl border-2 border-primary bg-primary/10 px-3 text-center"
            style={{ left: PAD, top: rootY - ROOT_H / 2, width: ROOT_W, height: ROOT_H }}
          >
            <span className="line-clamp-2 text-xs font-semibold leading-tight">
              {title}
            </span>
            <span className="mt-0.5 text-[10px] text-muted-foreground">
              {ordered.length} topics
            </span>
          </div>

          {/* Section branches */}
          {ordered.map((s, i) => {
            const isDone = completed.has(i);
            const isCurrent = current === i;
            return (
              <button
                key={i}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover((h) => (h === i ? null : h))}
                onClick={() => onSelect?.(i)}
                className={cn(
                  "absolute flex items-center gap-2 rounded-xl border-2 px-3 text-left text-sm transition-colors",
                  isDone && "border-green-600 bg-green-500/10",
                  isCurrent && "border-amber-500 bg-amber-100/60 dark:bg-amber-500/10",
                  !isDone && !isCurrent && "border-border bg-card hover:bg-accent",
                )}
                style={{ left: secX, top: secCenter(i) - SEC_H / 2, width: SEC_W, height: SEC_H }}
              >
                <span
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold",
                    isDone && "bg-green-500 text-white",
                    isCurrent && "bg-amber-400 text-amber-950",
                    !isDone && !isCurrent && "bg-secondary text-muted-foreground",
                  )}
                >
                  {isDone ? <Check className="h-3.5 w-3.5" /> : i + 1}
                </span>
                <span className="line-clamp-2 font-medium leading-tight">
                  {s.title}
                </span>
              </button>
            );
          })}

          {/* Leaves (key terms) */}
          {ordered.map((_, i) =>
            leaves[i].map((leaf, j) => {
              const n = leaves[i].length;
              const block = n * LEAF_H + (n - 1) * LEAF_GAP;
              const startY = secCenter(i) - block / 2;
              const ly = startY + j * (LEAF_H + LEAF_GAP);
              return (
                <span
                  key={`leaf${i}-${j}`}
                  className="absolute truncate rounded-full border bg-card px-2 text-[11px] text-muted-foreground"
                  style={{ left: leafX, top: ly, height: LEAF_H, lineHeight: `${LEAF_H - 2}px`, maxWidth: 140 }}
                  title={leaf}
                >
                  {leaf}
                </span>
              );
            }),
          )}

          {/* Hover detail card */}
          {hover !== null && (
            <div
              className="pointer-events-none absolute z-20 w-56 rounded-xl border bg-popover p-3 text-xs shadow-lg"
              style={{
                left: Math.min(secX + SEC_W + 12, canvasW - 230),
                top: Math.max(8, secCenter(hover) - 40),
              }}
            >
              <div className="mb-1 flex items-center gap-2 font-semibold">
                {ordered[hover].title}
              </div>
              <div className="mb-1.5">
                {completed.has(hover) ? (
                  <span className="text-green-600">✓ Explored</span>
                ) : current === hover ? (
                  <span className="text-amber-600">● Up next</span>
                ) : (
                  <span className="text-muted-foreground">Still to do</span>
                )}
              </div>
              <p className="line-clamp-3 text-muted-foreground">
                {(ordered[hover].content || "").replace(/[#*=_`>-]/g, "").slice(0, 140)}…
              </p>
            </div>
          )}
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Tip: hover a branch to preview it; click to jump in. Green = explored,
        amber = up next.
      </p>
    </div>
  );
}
