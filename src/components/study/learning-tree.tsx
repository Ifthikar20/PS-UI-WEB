"use client";

import { Check, Circle, Dot } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import type { StudySection } from "@/lib/types";

/**
 * Learning tree — a vertical roadmap of a study set's sections, mirroring the
 * mobile LearningTreeView. Done = green, current = amber, upcoming = muted.
 * Shows at a glance how much is complete and what's left.
 */
export function LearningTree({
  sections,
  completed,
  current,
  onSelect,
}: {
  sections: StudySection[];
  completed: Set<number>;
  current?: number;
  onSelect?: (index: number) => void;
}) {
  const ordered = [...sections].sort((a, b) => a.order - b.order);
  const total = ordered.length;
  const doneCount = completed.size;
  const pct = total ? Math.round((doneCount / total) * 100) : 0;

  if (total === 0) {
    return (
      <p className="text-sm text-muted-foreground">No topics to map yet.</p>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Your learning path</span>
          <span className="text-muted-foreground">
            {doneCount} of {total} complete
          </span>
        </div>
        <Progress className="mt-2" value={pct} />
      </div>

      <ol className="relative space-y-1">
        {ordered.map((section, i) => {
          const isDone = completed.has(i);
          const isCurrent = current === i;
          const state = isDone ? "done" : isCurrent ? "current" : "todo";
          return (
            <li key={i} className="relative flex gap-4">
              {/* Connector line */}
              {i < total - 1 && (
                <span
                  className={cn(
                    "absolute left-[15px] top-8 h-[calc(100%-1rem)] w-0.5",
                    isDone ? "bg-green-500/60" : "bg-border",
                  )}
                />
              )}
              {/* Node */}
              <span
                className={cn(
                  "z-10 mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2",
                  state === "done" &&
                    "border-green-600 bg-green-500 text-white",
                  state === "current" &&
                    "border-amber-500 bg-amber-100 text-amber-700",
                  state === "todo" &&
                    "border-border bg-card text-muted-foreground",
                )}
              >
                {state === "done" ? (
                  <Check className="h-4 w-4" />
                ) : state === "current" ? (
                  <Dot className="h-6 w-6" />
                ) : (
                  <Circle className="h-3 w-3" />
                )}
              </span>
              {/* Card */}
              <button
                onClick={() => onSelect?.(i)}
                className={cn(
                  "mb-2 flex-1 rounded-xl border p-3 text-left transition-colors hover:bg-accent",
                  isCurrent && "border-amber-400/60 bg-amber-50/50 dark:bg-amber-500/5",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">{section.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {isDone ? "Done" : isCurrent ? "In progress" : `Step ${i + 1}`}
                  </span>
                </div>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
