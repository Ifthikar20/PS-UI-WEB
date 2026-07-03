"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Inbox } from "lucide-react";
import { api } from "@/lib/api";
import { useApi } from "@/lib/use-api";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Assignment } from "@/lib/types";

/**
 * "Assigned to you" — content a supervisor pushed to this learner. Clicking
 * through marks the assignment opened (so the supervisor sees it) and lands
 * on the normal study page, where reading, games, and quizzes all work.
 */
export function AssignedRail() {
  const router = useRouter();
  const assignments = useApi<{ results: Assignment[] }>("assignments/");
  const items = assignments.data?.results ?? [];
  if (!items.length) return null;

  async function open(a: Assignment) {
    if (!a.openedAt) {
      await api.post(`assignments/${a.id}/opened/`).catch(() => {});
    }
    router.push(`/study/${a.studySetId}`);
  }

  return (
    <section>
      <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
        <Inbox className="h-5 w-5 text-primary" /> Assigned to you
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((a) => {
          const pct = a.sectionsTotal
            ? Math.round((100 * a.sectionsCompleted) / a.sectionsTotal)
            : 0;
          return (
            <Card
              key={a.id}
              onClick={() => open(a)}
              className="cursor-pointer transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate font-medium">{a.title}</span>
                  {!a.openedAt && (
                    <span className="shrink-0 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
                      NEW
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  From {a.supervisor?.name ?? "your supervisor"}
                  {a.note ? ` — “${a.note}”` : ""}
                </p>
                <Progress className="mt-2.5 h-1.5" value={pct} />
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
