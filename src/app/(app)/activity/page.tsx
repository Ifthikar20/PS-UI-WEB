"use client";

import * as React from "react";
import Link from "next/link";
import { BookOpen, ListChecks, Timer } from "lucide-react";
import { useApi } from "@/lib/use-api";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import {
  DoodleClock,
  DoodleTarget,
  DoodleCheck,
  DoodleSpark,
} from "@/components/doodles";
import { cn } from "@/lib/utils";
import type { ActivityAnalytics, ProgressAnalytics } from "@/lib/types";

/**
 * Activity — every interaction with the platform in one graphical board.
 * All numbers derive from the timestamped StudyEvent log the backend keeps
 * automatically (reading heartbeats, section completions, quiz results), so
 * activity is captured even when no session was explicitly started.
 */

const RANGES = [7, 14, 30, 60] as const;

function fmtMin(seconds: number) {
  const m = Math.round(seconds / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  return `${h}h ${m % 60}m`;
}

export default function ActivityPage() {
  const [days, setDays] = React.useState<number>(30);
  const activity = useApi<ActivityAnalytics>(`progress/activity/?days=${days}`);
  const progress = useApi<ProgressAnalytics>("progress/me/");
  const a = activity.data;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Activity</h1>
          <p className="mt-1 text-muted-foreground">
            Everything you&apos;ve done on the platform — tracked automatically,
            even without starting a session.
          </p>
        </div>
        <div className="flex rounded-full border p-0.5">
          {RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setDays(r)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                days === r
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {r}d
            </button>
          ))}
        </div>
      </div>

      {/* headline stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          icon={<DoodleClock className="h-8 w-8" />}
          label="Time studied"
          value={a ? fmtMin(a.totals.seconds) : "—"}
          hint={a ? `${a.totals.activeDays} active days` : undefined}
        />
        <Stat
          icon={<DoodleSpark className="h-8 w-8" />}
          label="Avg per active day"
          value={a ? fmtMin(a.totals.avgSecondsPerActiveDay) : "—"}
          hint="your personal baseline"
        />
        <Stat
          icon={<DoodleTarget className="h-8 w-8" />}
          label="Answer accuracy"
          value={
            a
              ? a.totals.accuracyPct == null
                ? "—"
                : `${a.totals.accuracyPct}%`
              : "—"
          }
          hint={a ? `${a.totals.answered} answered` : undefined}
        />
        <Stat
          icon={<DoodleCheck className="h-8 w-8" />}
          label="Sections & quizzes"
          value={a ? String(a.totals.sectionsCompleted) : "—"}
          hint="completed"
        />
      </div>

      {/* daily study time + average line */}
      <Card>
        <CardContent className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Daily study time</div>
              <div className="text-xs text-muted-foreground">
                dashed line = your average on active days
              </div>
            </div>
            <span className="text-xs text-muted-foreground">last {days} days</span>
          </div>
          {activity.loading ? (
            <Skeleton className="h-44 w-full" />
          ) : (
            <TimeChart data={a} />
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* when you study */}
        <Card>
          <CardContent className="p-6">
            <div className="mb-1 text-sm font-medium">When you study</div>
            <div className="mb-4 text-xs text-muted-foreground">
              share of study time by phase of day
            </div>
            {activity.loading ? (
              <Skeleton className="h-40 w-full" />
            ) : (
              <PhaseBars hourly={a?.hourlySeconds ?? []} />
            )}
          </CardContent>
        </Card>

        {/* accuracy trend */}
        <Card>
          <CardContent className="p-6">
            <div className="mb-1 text-sm font-medium">Accuracy trend</div>
            <div className="mb-4 text-xs text-muted-foreground">
              daily quiz accuracy across the range
            </div>
            {activity.loading ? (
              <Skeleton className="h-40 w-full" />
            ) : (
              <AccuracyChart data={a} />
            )}
          </CardContent>
        </Card>
      </div>

      {/* per-set progress */}
      <Card>
        <CardContent className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm font-medium">Where the time went</div>
            <Link href="/library" className="text-xs text-muted-foreground hover:text-foreground">
              Library →
            </Link>
          </div>
          {progress.loading ? (
            <Skeleton className="h-24 w-full" />
          ) : (
            <SetTable sets={progress.data?.studySets ?? []} />
          )}
        </CardContent>
      </Card>

      {/* raw interaction log */}
      <Card>
        <CardContent className="p-6">
          <div className="mb-4 text-sm font-medium">Recent interactions</div>
          {activity.loading ? (
            <Skeleton className="h-24 w-full" />
          ) : (
            <RecentFeed items={a?.recent ?? []} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary">
          {icon}
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm text-muted-foreground">{label}</div>
          <div className="text-xl font-bold">{value}</div>
          {hint && <div className="truncate text-xs text-muted-foreground">{hint}</div>}
        </div>
      </CardContent>
    </Card>
  );
}

/** Daily minutes bars with a dashed personal-average reference line. */
function TimeChart({ data }: { data: ActivityAnalytics | null }) {
  const daily = data?.daily ?? [];
  const avg = data?.totals.avgSecondsPerActiveDay ?? 0;
  if (!daily.some((d) => d.seconds > 0)) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        No study time recorded in this range yet — open a study set and read a
        little; tracking is automatic.
      </p>
    );
  }
  const max = Math.max(...daily.map((d) => d.seconds), avg) * 1.1;
  const avgPct = (avg / max) * 100;
  const showLabelEvery = daily.length > 20 ? 5 : daily.length > 10 ? 3 : 1;

  return (
    <div>
      {/* bars */}
      <div className="relative">
        {avg > 0 && (
          <div
            className="pointer-events-none absolute inset-x-0 z-10 border-t-2 border-dashed border-accent-2/80"
            style={{ bottom: `${avgPct}%` }}
          />
        )}
        <div className="flex h-40 items-end gap-[3px]">
          {daily.map((d) => {
            const h = (d.seconds / max) * 100;
            return (
              <div key={d.date} className="flex h-full flex-1 items-end">
                <div
                  className={cn(
                    "w-full rounded-t-md transition-colors",
                    d.seconds > 0
                      ? "bg-primary/75 hover:bg-primary"
                      : "bg-secondary",
                  )}
                  style={{ height: `${Math.max(h, 2)}%` }}
                  title={`${d.date}: ${fmtMin(d.seconds)}${d.total ? ` · ${Math.round((100 * d.correct) / d.total)}% accuracy` : ""}`}
                />
              </div>
            );
          })}
        </div>
      </div>
      {/* date labels */}
      <div className="mt-1.5 flex gap-[3px]">
        {daily.map((d, i) => (
          <span key={d.date} className="flex-1 text-center text-[9px] text-muted-foreground">
            {i % showLabelEvery === 0
              ? new Date(d.date + "T00:00:00").toLocaleDateString(undefined, {
                  month: "numeric",
                  day: "numeric",
                })
              : ""}
          </span>
        ))}
      </div>
      {avg > 0 && (
        <div className="mt-2 text-right text-xs text-muted-foreground">
          <span className="mr-1.5 inline-block w-5 border-t-2 border-dashed border-accent-2/80 align-middle" />
          avg {fmtMin(avg)} / active day
        </div>
      )}
    </div>
  );
}

const PHASES: { label: string; hint: string; from: number; to: number }[] = [
  { label: "Morning", hint: "5–12", from: 5, to: 12 },
  { label: "Afternoon", hint: "12–17", from: 12, to: 17 },
  { label: "Evening", hint: "17–22", from: 17, to: 22 },
  { label: "Night", hint: "22–5", from: 22, to: 29 }, // wraps past midnight
];

/** Share of study time by phase of day, from the hourly histogram. */
function PhaseBars({ hourly }: { hourly: number[] }) {
  const total = hourly.reduce((a, b) => a + b, 0);
  if (!total) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        Not enough data yet.
      </p>
    );
  }
  const rows = PHASES.map((p) => {
    let s = 0;
    for (let h = p.from; h < p.to; h++) s += hourly[h % 24] ?? 0;
    return { ...p, seconds: s, pct: Math.round((100 * s) / total) };
  });
  const top = rows.reduce((a, b) => (b.seconds > a.seconds ? b : a), rows[0]);

  return (
    <div className="space-y-3.5">
      {rows.map((r) => (
        <div key={r.label}>
          <div className="mb-1 flex items-baseline justify-between text-sm">
            <span className={cn("font-medium", r === top && "text-primary")}>
              {r.label}
              <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                {r.hint}
              </span>
            </span>
            <span className="text-xs tabular-nums text-muted-foreground">
              {fmtMin(r.seconds)} · {r.pct}%
            </span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-secondary">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                r === top ? "bg-primary" : "bg-primary/40",
              )}
              style={{ width: `${Math.max(r.pct, 2)}%` }}
            />
          </div>
        </div>
      ))}
      <p className="pt-1 text-xs text-muted-foreground">
        You study most in the <span className="font-medium text-foreground">{top.label.toLowerCase()}</span>.
      </p>
    </div>
  );
}

/** Daily accuracy line (only days that had answered questions). */
function AccuracyChart({ data }: { data: ActivityAnalytics | null }) {
  const pts = (data?.daily ?? [])
    .map((d, i) => ({
      i,
      pct: d.total > 0 ? (100 * d.correct) / d.total : null,
      date: d.date,
    }))
    .filter((p): p is { i: number; pct: number; date: string } => p.pct != null);
  if (pts.length < 2) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        Answer a few quizzes to see your accuracy trend.
      </p>
    );
  }
  const n = (data?.daily.length ?? 1) - 1;
  const W = 100;
  const H = 40;
  const x = (i: number) => (i / Math.max(1, n)) * W;
  const y = (pct: number) => H - (pct / 100) * (H - 4) - 2;
  const path = pts
    .map((p, idx) => `${idx === 0 ? "M" : "L"}${x(p.i).toFixed(1)} ${y(p.pct).toFixed(1)}`)
    .join(" ");
  const last = pts[pts.length - 1];

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-40 w-full" preserveAspectRatio="none">
        {[25, 50, 75].map((g) => (
          <line
            key={g}
            x1="0"
            x2={W}
            y1={y(g)}
            y2={y(g)}
            className="stroke-border"
            strokeWidth="0.3"
          />
        ))}
        <path d={path} fill="none" className="stroke-primary" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        {pts.map((p) => (
          <circle key={p.date} cx={x(p.i)} cy={y(p.pct)} r="1.6" className="fill-primary">
            <title>{`${p.date}: ${Math.round(p.pct)}%`}</title>
          </circle>
        ))}
      </svg>
      <div className="mt-1 flex justify-between text-xs text-muted-foreground">
        <span>0–100%</span>
        <span>
          latest <span className="font-medium text-foreground">{Math.round(last.pct)}%</span>
        </span>
      </div>
    </div>
  );
}

function SetTable({ sets }: { sets: NonNullable<ProgressAnalytics["studySets"]> }) {
  const touched = sets.filter((s) => s.secondsSpent > 0 || s.sectionsCompleted > 0);
  if (!touched.length) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        No study sets touched yet.
      </p>
    );
  }
  return (
    <div className="space-y-4">
      {touched.map((s) => {
        const pct = s.sectionsTotal
          ? Math.round((100 * s.sectionsCompleted) / s.sectionsTotal)
          : 0;
        return (
          <Link key={s.id} href={`/study/${s.id}`} className="block rounded-xl border p-4 transition-colors hover:bg-accent">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-medium">{s.title}</span>
              <span className="text-xs tabular-nums text-muted-foreground">
                {fmtMin(s.secondsSpent)} · {s.sectionsCompleted}/{s.sectionsTotal} sections
                {s.avgScorePct != null ? ` · ${s.avgScorePct}% accuracy` : ""}
              </span>
            </div>
            <Progress className="mt-2.5 h-1.5" value={pct} />
          </Link>
        );
      })}
    </div>
  );
}

const KIND_META = {
  heartbeat: { Icon: BookOpen, label: "Read" },
  section: { Icon: ListChecks, label: "Section done" },
  quiz: { Icon: Timer, label: "Quiz" },
} as const;

function RecentFeed({ items }: { items: ActivityAnalytics["recent"] }) {
  if (!items.length) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        Interactions will appear here as you study and play.
      </p>
    );
  }
  return (
    <ul className="divide-y">
      {items.map((e, i) => {
        const m = KIND_META[e.kind] ?? KIND_META.heartbeat;
        const when = new Date(e.createdAt).toLocaleString(undefined, {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        });
        return (
          <li key={i} className="flex items-center gap-3 py-2.5 text-sm">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary">
              <m.Icon className="h-4 w-4 text-muted-foreground" />
            </span>
            <span className="min-w-0 flex-1 truncate">
              <span className="font-medium">{m.label}</span>
              <span className="text-muted-foreground"> · {e.studySetTitle}</span>
            </span>
            <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
              {e.kind === "quiz" && e.total
                ? `${e.correct}/${e.total}`
                : e.seconds
                  ? fmtMin(e.seconds)
                  : ""}
            </span>
            <span className="w-28 shrink-0 text-right text-xs text-muted-foreground">
              {when}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
