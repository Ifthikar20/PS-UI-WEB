"use client";

import * as React from "react";
import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarClock,
  Settings,
  Play,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";
import { api } from "@/lib/api";
import { useApi } from "@/lib/use-api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { LearningTree } from "@/components/study/learning-tree";
import { daysUntil, completedDays } from "@/lib/exam";
import type { ExamPlan, ExamToday, ExamDaySummary, StudySection } from "@/lib/types";

type Schedule = { days: ExamDaySummary[] };

export default function ExamDashboardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const plan = useApi<ExamPlan>(`examplans/${id}/`);
  const today = useApi<ExamToday>(`examplans/${id}/today/`);
  const [schedule, setSchedule] = React.useState<Schedule | null>(null);

  React.useEffect(() => {
    api.get<Schedule>(`examplans/${id}/schedule/`).then(setSchedule).catch(() => {});
  }, [id]);

  React.useEffect(() => {
    if (plan.data && (plan.data.status === "draft" || plan.data.status === "proposed")) {
      router.replace(`/exam/${id}/review`);
    }
  }, [plan.data, id, router]);

  if (plan.loading || !plan.data) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  const p = plan.data;
  const left = daysUntil(p.examDate);
  const total = p.progress?.totalDays ?? schedule?.days.length ?? 0;
  const done = completedDays(p);
  const t = today.data;
  const sessionDone = Boolean(t?.result?.completed);
  const reviewCount = t?.reviewQuestions?.length ?? 0;

  const treeSections: StudySection[] = (schedule?.days ?? []).map((d) => ({
    title: `Day ${d.dayIndex + 1} · ${d.sectionTitle}`,
    content: "",
    order: d.dayIndex,
  }));
  const completedIdx = new Set(
    (schedule?.days ?? [])
      .map((d, i) => (p.results?.[d.ymd]?.completed ? i : -1))
      .filter((i) => i >= 0),
  );
  const current = (schedule?.days ?? []).findIndex(
    (d) => !p.results?.[d.ymd]?.completed,
  );

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild className="-ml-2 w-fit">
          <Link href="/exam">
            <ArrowLeft className="h-4 w-4" /> Exam prep
          </Link>
        </Button>
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/exam/${id}/settings`} aria-label="Plan settings">
            <Settings className="h-5 w-5" />
          </Link>
        </Button>
      </div>

      {/* Countdown hero */}
      <Card className="brand-wash border-2">
        <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{p.examTitle}</h1>
            <p className="text-sm text-muted-foreground">{p.materialTitle}</p>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-background/70 px-4 py-2">
            <CalendarClock className="h-5 w-5 text-primary" />
            <div>
              <div className="text-xl font-bold">
                {left >= 0 ? left : 0}
                <span className="ml-1 text-sm font-normal text-muted-foreground">
                  days left
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress */}
      {total > 0 && (
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Plan progress</span>
              <span className="text-muted-foreground">
                {done} / {total} days
              </span>
            </div>
            <Progress className="mt-2" value={Math.round((done / total) * 100)} />
          </CardContent>
        </Card>
      )}

      {/* Today */}
      {t && (
        <Card className={sessionDone ? "border-green-500/40" : "border-primary/40"}>
          <CardContent className="p-6">
            <div className="mb-1 flex items-center gap-2 text-sm font-medium text-muted-foreground">
              Today · {t.section.title}
            </div>
            {sessionDone ? (
              <>
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <CheckCircle2 className="h-5 w-5 text-green-600" /> Done for today
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  You scored {t.result?.correct}/{t.result?.total}. Come back
                  tomorrow for the next section.
                </p>
                <Button variant="outline" className="mt-4" asChild>
                  <Link href={`/exam/${id}/today`}>
                    <RotateCcw className="h-4 w-4" /> Review again
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <div className="text-lg font-semibold">
                  {t.questions.length} questions
                  {reviewCount > 0 && (
                    <Badge variant="muted" className="ml-2">
                      +{reviewCount} review
                    </Badge>
                  )}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Read the section, then answer to keep your streak going.
                </p>
                <Button className="mt-4" asChild>
                  <Link href={`/exam/${id}/today`}>
                    <Play className="h-4 w-4" /> Start today&apos;s session
                  </Link>
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Schedule map */}
      {treeSections.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <LearningTree
              sections={treeSections}
              completed={completedIdx}
              current={current >= 0 ? current : undefined}
              onSelect={() => router.push(`/exam/${id}/today`)}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
