"use client";

import * as React from "react";
import { DoodleClock, DoodleTarget, DoodleCheck } from "@/components/doodles";
import { useApi } from "@/lib/use-api";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { HistoryPoint, ProgressAnalytics } from "@/lib/types";

function fmtDuration(seconds: number) {
  const m = Math.round(seconds / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  return `${h}h ${m % 60}m`;
}

/** Professional activity board: study time, accuracy, completion + daily chart. */
export function ActivityOverview() {
  const history = useApi<{ results: HistoryPoint[] }>(
    "rewards/history/?days=14",
  );
  const progress = useApi<ProgressAnalytics>("progress/me/");

  const points = history.data?.results ?? [];
  const sets = progress.data?.studySets ?? [];

  const totalSeconds =
    progress.data?.secondsSpent ??
    sets.reduce((a, s) => a + (s.secondsSpent || 0), 0);
  const sectionsCompleted =
    progress.data?.sectionsCompleted ??
    sets.reduce((a, s) => a + (s.sectionsCompleted || 0), 0);
  const scored = sets.filter((s) => s.avgScorePct != null);
  const avgAccuracy = scored.length
    ? Math.round(
        scored.reduce((a, s) => a + (s.avgScorePct || 0), 0) / scored.length,
      )
    : null;

  const loading = history.loading || progress.loading;

  return (
    <section>
      <h2 className="mb-4 text-lg font-semibold">Activity</h2>

      <div className="grid gap-4 lg:grid-cols-3">
        <Stat
          icon={<DoodleClock className="h-7 w-7" />}
          label="Time studied"
          value={loading ? "—" : fmtDuration(totalSeconds)}
          hint="last 2 weeks tracked"
        />
        <Stat
          icon={<DoodleCheck className="h-7 w-7" />}
          label="Sections completed"
          value={loading ? "—" : String(sectionsCompleted)}
        />
        <Stat
          icon={<DoodleTarget className="h-7 w-7" />}
          label="Avg accuracy"
          value={loading ? "—" : avgAccuracy == null ? "—" : `${avgAccuracy}%`}
          accent
        />
      </div>

      <Card className="mt-4">
        <CardContent className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-medium">Daily activity</span>
            <a
              href="/activity"
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Full activity →
            </a>
          </div>
          {loading ? (
            <Skeleton className="h-32 w-full" />
          ) : (
            <BarChart points={points} />
          )}
        </CardContent>
      </Card>
    </section>
  );
}

function Stat({
  icon,
  label,
  value,
  hint,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint?: string;
  accent?: boolean;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${
            accent ? "bg-accent2/15 text-accent2" : "bg-secondary"
          }`}
        >
          {icon}
        </div>
        <div>
          <div className="text-sm text-muted-foreground">{label}</div>
          <div className="text-xl font-bold">{value}</div>
          {hint && <div className="text-xs text-muted-foreground">{hint}</div>}
        </div>
      </CardContent>
    </Card>
  );
}

function BarChart({ points }: { points: HistoryPoint[] }) {
  if (points.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No activity yet — study a little to see your trend here.
      </p>
    );
  }
  const max = Math.max(1, ...points.map((p) => p.points));
  return (
    <div className="flex h-36 items-end gap-1.5">
      {points.map((p, i) => {
        const h = (p.points / max) * 100;
        const day = new Date(p.ymd + "T00:00:00").toLocaleDateString(undefined, {
          weekday: "narrow",
        });
        return (
          <div key={i} className="group flex flex-1 flex-col items-center gap-1.5">
            <div className="flex h-full w-full items-end">
              <div
                className="w-full rounded-md bg-primary/80 transition-all group-hover:bg-primary"
                style={{ height: `${Math.max(h, 2)}%` }}
                title={`${p.points} pts · ${p.count} activities`}
              />
            </div>
            <span className="text-[10px] text-muted-foreground">{day}</span>
          </div>
        );
      })}
    </div>
  );
}
