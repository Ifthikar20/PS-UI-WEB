"use client";

import * as React from "react";
import Link from "next/link";
import { CalendarClock, X } from "lucide-react";
import { useApi } from "@/lib/use-api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { ExamReminder as Reminder } from "@/lib/types";

/** Dashboard nudge: unfinished exam sessions / due spaced-repetition reviews. */
export function ExamReminder() {
  const { data } = useApi<{ results: Reminder[] }>("examplans/reminders/today/");
  const [dismissed, setDismissed] = React.useState<Set<string>>(new Set());

  React.useEffect(() => {
    const next = new Set<string>();
    (data?.results ?? []).forEach((r) => {
      if (localStorage.getItem(`ps_exam_reminder_${r.planId}_${r.ymd}`)) {
        next.add(r.planId);
      }
    });
    setDismissed(next);
  }, [data]);

  const items = (data?.results ?? []).filter((r) => !dismissed.has(r.planId));
  if (items.length === 0) return null;

  function dismiss(r: Reminder) {
    localStorage.setItem(`ps_exam_reminder_${r.planId}_${r.ymd}`, "1");
    setDismissed((prev) => new Set(prev).add(r.planId));
  }

  return (
    <div className="space-y-3">
      {items.map((r) => (
        <Card key={r.planId} className="border-primary/40 brand-wash">
          <CardContent className="flex items-center gap-4 p-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-background/70">
              <CalendarClock className="h-5 w-5 text-primary" />
            </span>
            <div className="flex-1">
              <div className="font-semibold">{r.planTitle}</div>
              <div className="text-sm text-muted-foreground">
                {r.sessionDone
                  ? `${r.dueReview} review question${r.dueReview === 1 ? "" : "s"} due`
                  : "Today's session is waiting"}
                {r.daysLeft >= 0 ? ` · ${r.daysLeft} days to exam` : ""}
              </div>
            </div>
            <Button size="sm" asChild>
              <Link href={`/exam/${r.planId}/today`}>Study now</Link>
            </Button>
            <Button
              size="icon"
              variant="ghost"
              aria-label="Dismiss"
              onClick={() => dismiss(r)}
            >
              <X className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
