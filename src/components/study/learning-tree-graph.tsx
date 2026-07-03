"use client";

import * as React from "react";
import { Check, ChevronRight, CircleDot } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import type { StudySection } from "@/lib/types";

/**
 * A hierarchical learning tree: the study set breaks down into topics, their
 * subtopics, and sub-subtopics (from each section's `level`), with the finer
 * points under each pulled from its markdown headings. Every node shows its
 * completion state — a green check the moment you finish it — so the tree
 * doubles as a map of everything you've learned so far.
 *
 * Done = green check, current = amber dot, pending = muted. Click any node to
 * jump straight to that section in the reader.
 */

type TreeNode = {
  index: number; // position in the flat sections array (for completion + jump)
  title: string;
  level: number; // 0 topic, 1 subtopic, 2 sub-subtopic
  points: string[]; // finer headings inside the section (read-only leaves)
  children: TreeNode[];
};

/** Pull ## / ### headings out of a section's markdown as its finer points. */
function subPoints(content: string): string[] {
  const out: string[] = [];
  for (const line of (content || "").split("\n")) {
    const m = /^(#{2,4})\s+(.+)$/.exec(line.trim());
    if (m) out.push(m[2].trim());
  }
  return out.slice(0, 4);
}

/** Build the topic/subtopic/sub-subtopic tree from the flat, ordered sections. */
function buildTree(sections: StudySection[]): TreeNode[] {
  const nodes: TreeNode[] = sections.map((s, index) => ({
    index,
    title: s.title,
    level: Math.max(0, Math.min(2, s.level ?? 0)),
    points: subPoints(s.content),
    children: [],
  }));

  const roots: TreeNode[] = [];
  const stack: TreeNode[] = []; // last-seen node at each depth
  for (const n of nodes) {
    while (stack.length && stack[stack.length - 1].level >= n.level) stack.pop();
    if (stack.length) stack[stack.length - 1].children.push(n);
    else roots.push(n);
    stack.push(n);
  }
  return roots;
}

export function LearningTreeGraph({
  title,
  sections,
  completed,
  current,
  onSelect,
}: {
  title: string;
  sections: StudySection[];
  completed: Set<number>;
  current?: number;
  onSelect?: (index: number) => void;
  /** Accepted for API compatibility; key terms now come from section headings. */
  words?: unknown;
}) {
  const ordered = React.useMemo(
    () => [...sections].sort((a, b) => a.order - b.order),
    [sections],
  );
  const tree = React.useMemo(() => buildTree(ordered), [ordered]);

  if (ordered.length === 0) {
    return <p className="text-sm text-muted-foreground">No topics to map yet.</p>;
  }

  const done = ordered.filter((_, i) => completed.has(i)).length;
  const pct = Math.round((done / ordered.length) * 100);
  const topics = tree.length;

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Your learning tree</span>
          <span className="text-muted-foreground">
            {done} of {ordered.length} learned
          </span>
        </div>
        <Progress className="mt-2" value={pct} />
        <p className="mt-1.5 text-xs text-muted-foreground">
          {title} · {topics} topic{topics === 1 ? "" : "s"} broken into
          subtopics — a ✓ appears as you finish each.
        </p>
      </div>

      <div className="rounded-xl border bg-muted/20 p-2 sm:p-3">
        <ul className="space-y-1">
          {tree.map((node) => (
            <TreeRow
              key={node.index}
              node={node}
              depth={0}
              completed={completed}
              current={current}
              onSelect={onSelect}
            />
          ))}
        </ul>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-green-500 text-white">
            <Check className="h-2.5 w-2.5" />
          </span>
          Learned
        </span>
        <span className="inline-flex items-center gap-1">
          <CircleDot className="h-3.5 w-3.5 text-amber-500" /> Up next
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="h-3.5 w-3.5 rounded-full border" /> To do
        </span>
      </div>
    </div>
  );
}

const LEVEL_DOT = ["bg-primary", "bg-primary/60", "bg-primary/40"];

function TreeRow({
  node,
  depth,
  completed,
  current,
  onSelect,
}: {
  node: TreeNode;
  depth: number;
  completed: Set<number>;
  current?: number;
  onSelect?: (index: number) => void;
}) {
  const isDone = completed.has(node.index);
  const isCurrent = current === node.index;
  // A parent counts as "done" visually only if it and all descendants are done.
  return (
    <li>
      <div
        className="flex items-stretch"
        style={{ paddingLeft: depth * 18 }}
      >
        {/* connector rail for nested levels */}
        {depth > 0 && (
          <span
            aria-hidden
            className="mr-1.5 mt-3 h-px w-3 shrink-0 self-start bg-border"
          />
        )}
        <button
          onClick={() => onSelect?.(node.index)}
          className={cn(
            "group flex w-full items-center gap-2 rounded-lg border px-2.5 py-2 text-left transition-colors",
            isDone && "border-green-500/50 bg-green-500/5",
            isCurrent && !isDone && "border-amber-500/60 bg-amber-100/40 dark:bg-amber-500/10",
            !isDone && !isCurrent && "border-border bg-card hover:bg-accent",
          )}
        >
          {/* state badge */}
          <span
            className={cn(
              "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
              isDone && "bg-green-500 text-white",
              isCurrent && !isDone && "bg-amber-400 text-amber-950",
              !isDone && !isCurrent && "bg-secondary text-muted-foreground",
            )}
          >
            {isDone ? (
              <Check className="h-3 w-3" />
            ) : isCurrent ? (
              <CircleDot className="h-3 w-3" />
            ) : (
              <span className={cn("h-1.5 w-1.5 rounded-full", LEVEL_DOT[node.level] ?? "bg-primary/40")} />
            )}
          </span>

          <span className="min-w-0 flex-1">
            <span
              className={cn(
                "flex items-center gap-1.5 truncate font-medium",
                node.level === 0 ? "text-sm" : "text-[13px]",
                node.level === 2 && "text-muted-foreground",
              )}
            >
              {node.level > 0 && (
                <span className="text-[9px] font-normal uppercase tracking-wide text-muted-foreground">
                  {node.level === 1 ? "sub" : "detail"}
                </span>
              )}
              {node.title}
            </span>
            {/* finer points from the section's own headings */}
            {node.points.length > 0 && (
              <span className="mt-1 flex flex-wrap gap-1">
                {node.points.map((p) => (
                  <span
                    key={p}
                    className="rounded-full bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground"
                  >
                    {p}
                  </span>
                ))}
              </span>
            )}
          </span>

          {isDone ? (
            <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wide text-green-600">
              Done
            </span>
          ) : (
            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
          )}
        </button>
      </div>

      {node.children.length > 0 && (
        <ul className="mt-1 space-y-1">
          {node.children.map((c) => (
            <TreeRow
              key={c.index}
              node={c}
              depth={depth + 1}
              completed={completed}
              current={current}
              onSelect={onSelect}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
