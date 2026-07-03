"use client";

import * as React from "react";
import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Settings,
  Play,
  CheckCircle2,
  RotateCcw,
  BookOpen,
  ListChecks,
  Repeat,
  Bell,
  BellOff,
  Flame,
} from "lucide-react";
import { api } from "@/lib/api";
import { useApi } from "@/lib/use-api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { LearningTree } from "@/components/study/learning-tree";
import { ReadinessRing } from "@/components/exam/readiness-ring";
import {
  daysUntil,
  completedDays,
  readiness,
  readinessLabel,
  urgency,
  type Urgency,
} from "@/lib/exam";
import { cn } from "@/lib/utils";
import type { ExamPlan, ExamToday, ExamDaySummary, StudySection } from "@/lib/types";

type Schedule = { days: ExamDaySummary[] };

/** Countdown styling per urgency bucket. */
const URGENCY: Record<Urgency, { ring: string; chip: string; text: string; note: string }> = {
  past: {
    ring: "border-muted",
    chip: "bg-muted text-muted-foreground",
    text: "text-muted-foreground",
    note: "Exam date has passed",
  },
  today: {
    ring: "border-red-500/60",
    chip: "bg-red-500 text-white",
    text: "text-red-600 dark:text-red-400",
    note: "Exam is today — final review!",
  },
  soon: {
    ring: "border-orange-500/60",
    chip: "bg-orange-500 text-white",
    text: "text-orange-600 dark:text-orange-400",
    note: "Crunch time — stay consistent",
  },
  close: {
    ring: "border-amber-400/60",
    chip: "bg-amber-400 text-black",
    text: "text-amber-600 dark:text-amber-400",
    note: "One week to go — keep the streak",
  },
  calm: {
    ring: "border-primary/40",
    chip: "bg-secondary text-foreground",
    text: "text-foreground",
    note: "Plenty of time — a little each day",
  },
};

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
  const u = URGENCY[urgency(left)];
  const total = p.progress?.totalDays ?? schedule?.days.length ?? 0;
  const done = completedDays(p);
  const ready = readiness(p);
  const pctDays = total > 0 ? Math.round((done / total) * 100) : 0;
  const t = today.data;
  const sessionDone = Boolean(t?.result?.completed);
  const reviewCount = t?.reviewQuestions?.length ?? 0;
  const questionCount = t?.questions?.length ?? 0;
  const isNew = done === 0;

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
        <div className="flex items-center gap-1">
          <Badge
            variant="outline"
            className="gap-1.5 font-normal text-muted-foreground"
          >
            {p.emailReminders ? (
              <>
                <Bell className="h-3.5 w-3.5" /> Reminders on
              </>
            ) : (
              <>
                <BellOff className="h-3.5 w-3.5" /> Reminders off
              </>
            )}
          </Badge>
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/exam/${id}/settings`} aria-label="Plan settings">
              <Settings className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Hero: countdown + readiness at a glance */}
      <Card className={cn("border-2", u.ring)}>
        <CardContent className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center">
          <div className="flex-1">
            <h1 className="text-2xl font-bold tracking-tight">{p.examTitle}</h1>
            <p className="text-sm text-muted-foreground">{p.materialTitle}</p>
            <div className="mt-4 flex items-baseline gap-2">
              <span className={cn("text-4xl font-extrabold tabular-nums", u.text)}>
                {left >= 0 ? left : 0}
              </span>
              <span className="text-sm text-muted-foreground">
                {left === 1 ? "day" : "days"} until exam
              </span>
            </div>
            <p className={cn("mt-1 text-sm font-medium", u.text)}>{u.note}</p>
          </div>
          <div className="flex flex-col items-center gap-2 sm:pl-6 sm:border-l">
            <ReadinessRing pct={ready} label="ready" />
            <span className="text-sm font-medium">{readinessLabel(ready)}</span>
          </div>
        </CardContent>
      </Card>

      {/* First-run explainer: how a plan actually works */}
      {isNew && (
        <Card className="brand-wash">
          <CardContent className="p-5">
            <div className="mb-3 text-sm font-semibold">How your plan works</div>
            <div className="grid gap-3 sm:grid-cols-3">
              <Step
                icon={BookOpen}
                title="Read a section"
                body="Each day we hand you one focused section of your material."
              />
              <Step
                icon={ListChecks}
                title="Answer questions"
                body="A short quiz locks it in and tracks your accuracy."
              />
              <Step
                icon={Repeat}
                title="We resurface misses"
                body="Questions you get wrong come back on a smart schedule until they stick."
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Today — the single clear next action */}
      {t && (
        <Card className={sessionDone ? "border-green-500/40" : "border-primary/50 shadow-sm"}>
          <CardContent className="p-6">
            <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {sessionDone ? "Today — complete" : "Today's session"}
            </div>
            <h2 className="text-lg font-semibold">{t.section.title}</h2>

            {sessionDone ? (
              <>
                <div className="mt-2 flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-medium">
                    Nice — {t.result?.correct}/{t.result?.total} correct
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  You&apos;re done for today. Come back tomorrow for the next
                  section — we&apos;ll email you when it&apos;s ready.
                </p>
                <Button variant="outline" className="mt-4" asChild>
                  <Link href={`/exam/${id}/today`}>
                    <RotateCcw className="h-4 w-4" /> Review again
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <p className="mt-1 text-sm text-muted-foreground">
                  Read the section, then answer{" "}
                  <strong className="text-foreground">{questionCount} question{questionCount === 1 ? "" : "s"}</strong>
                  {reviewCount > 0 && (
                    <>
                      {" "}
                      plus{" "}
                      <strong className="text-foreground">{reviewCount} review</strong>{" "}
                      question{reviewCount === 1 ? "" : "s"} you missed before
                    </>
                  )}
                  . Takes about 5–10 minutes.
                </p>
                <Button size="lg" className="mt-4 w-full sm:w-auto" asChild>
                  <Link href={`/exam/${id}/today`}>
                    <Play className="h-4 w-4" /> Start today&apos;s session
                  </Link>
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Progress stats */}
      {total > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Days completed</span>
                <span className="text-muted-foreground">
                  {done} / {total}
                </span>
              </div>
              <Progress className="mt-2" value={pctDays} />
              <p className="mt-2 text-xs text-muted-foreground">
                {pctDays}% of your plan finished
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-5">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
                <Flame className="h-6 w-6" />
              </span>
              <div>
                <div className="text-2xl font-bold leading-none">
                  {ready === null ? "—" : `${ready}%`}
                </div>
                <div className="text-sm text-muted-foreground">
                  Answer accuracy so far
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Schedule map */}
      {treeSections.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="mb-4 text-sm font-semibold">Your study schedule</div>
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

function Step({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-xl bg-background/70 p-3">
      <div className="mb-1.5 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </span>
        <span className="text-sm font-medium">{title}</span>
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}
