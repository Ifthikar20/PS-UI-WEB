"use client";

import * as React from "react";
import { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useApi } from "@/lib/use-api";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { DoodleClock, DoodleCheck, DoodleStar, DoodleFlame } from "@/components/doodles";

/** Per-learner progress board for supervisors (the guardian analytics view). */

type Board = {
  student: { id: string; name: string; email: string };
  totals: {
    secondsSpent: number;
    sectionsCompleted: number;
    sectionsTotal: number;
    completionPct: number;
    points: number;
    streak: number;
    studySets: number;
  };
  studySets: {
    id: string;
    title: string;
    sectionsTotal: number;
    sectionsCompleted: number;
    secondsSpent: number;
    avgScorePct: number | null;
  }[];
};

function fmtMin(seconds: number) {
  const m = Math.round(seconds / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  return `${h}h ${m % 60}m`;
}

export default function SuperviseStudentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const board = useApi<Board>(`guardian/children/${id}/`);
  const b = board.data;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link
        href="/supervise"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Supervise
      </Link>

      {board.loading ? (
        <Skeleton className="h-56 w-full" />
      ) : !b ? (
        <p className="text-sm text-destructive">
          You aren&apos;t linked to this learner.
        </p>
      ) : (
        <>
          <div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              {b.student.name}
            </h1>
            <p className="mt-1 text-muted-foreground">{b.student.email}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat icon={<DoodleClock className="h-7 w-7" />} label="Time studied" value={fmtMin(b.totals.secondsSpent)} />
            <Stat
              icon={<DoodleCheck className="h-7 w-7" />}
              label="Sections"
              value={`${b.totals.sectionsCompleted}/${b.totals.sectionsTotal}`}
            />
            <Stat icon={<DoodleStar className="h-7 w-7" />} label="Points" value={String(b.totals.points)} />
            <Stat icon={<DoodleFlame className="h-7 w-7" />} label="Streak" value={`${b.totals.streak} d`} />
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="mb-4 text-sm font-medium">Study sets</div>
              {b.studySets.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  Nothing in their library yet — push them a set from the
                  Supervise page.
                </p>
              ) : (
                <div className="space-y-4">
                  {b.studySets.map((s) => {
                    const pct = s.sectionsTotal
                      ? Math.round((100 * s.sectionsCompleted) / s.sectionsTotal)
                      : 0;
                    return (
                      <div key={s.id} className="rounded-xl border p-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-medium">{s.title}</span>
                          <span className="text-xs tabular-nums text-muted-foreground">
                            {fmtMin(s.secondsSpent)} · {s.sectionsCompleted}/
                            {s.sectionsTotal} sections
                            {s.avgScorePct != null ? ` · ${s.avgScorePct}% accuracy` : ""}
                          </span>
                        </div>
                        <Progress className="mt-2.5 h-1.5" value={pct} />
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3.5 p-5">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary">
          {icon}
        </div>
        <div>
          <div className="text-sm text-muted-foreground">{label}</div>
          <div className="text-xl font-bold">{value}</div>
        </div>
      </CardContent>
    </Card>
  );
}
