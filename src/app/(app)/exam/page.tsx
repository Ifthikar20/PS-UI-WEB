"use client";

import Link from "next/link";
import {
  CalendarCheck,
  Plus,
  FileText,
  ChevronRight,
  BookOpen,
  ListChecks,
  Bell,
} from "lucide-react";
import { useApi } from "@/lib/use-api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/app/empty-state";
import { Button } from "@/components/ui/button";
import { ReadinessRing } from "@/components/exam/readiness-ring";
import { daysUntil, completedDays, readiness, urgency } from "@/lib/exam";
import { cn } from "@/lib/utils";
import type { Paginated, ExamPlan } from "@/lib/types";

const DAYS_LEFT_CHIP = {
  past: "bg-muted text-muted-foreground",
  today: "bg-red-500 text-white",
  soon: "bg-orange-500 text-white",
  close: "bg-amber-400 text-black",
  calm: "bg-secondary text-foreground",
} as const;

export default function ExamPrepPage() {
  const plans = useApi<Paginated<ExamPlan>>("examplans/");
  const all = plans.data?.results ?? [];
  const needsApproval = all.filter(
    (p) => p.status === "draft" || p.status === "proposed",
  );
  const active = all.filter((p) => p.status === "active");
  const done = all.filter((p) => p.status === "completed");

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Exam prep
          </h1>
          <p className="mt-1 text-muted-foreground">
            Set an exam date and we&apos;ll build a daily study plan.
          </p>
        </div>
        <Button asChild>
          <Link href="/exam/new">
            <Plus className="h-4 w-4" /> New exam plan
          </Link>
        </Button>
      </div>

      {plans.loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : all.length === 0 ? (
        <div className="space-y-6">
          {/* "How it works" so first-timers understand the value */}
          <Card className="brand-wash">
            <CardContent className="grid gap-4 p-6 sm:grid-cols-3">
              <HowStep
                icon={BookOpen}
                title="A section a day"
                body="We spread your material across the days until your exam."
              />
              <HowStep
                icon={ListChecks}
                title="Quiz + spaced review"
                body="Short daily quizzes, and missed questions resurface until they stick."
              />
              <HowStep
                icon={Bell}
                title="Reminders that reach you"
                body="Get an email when each session is ready and as the exam nears."
              />
            </CardContent>
          </Card>
          <EmptyState
            icon={CalendarCheck}
            title="No exam plans yet"
            description="Create a study set first, then build an exam plan from it for a daily schedule."
            action={
              <Button asChild>
                <Link href="/exam/new">
                  <Plus className="h-4 w-4" /> Create exam plan
                </Link>
              </Button>
            }
          />
        </div>
      ) : (
        <>
          {needsApproval.length > 0 && (
            <Group title="Needs approval">
              {needsApproval.map((p) => (
                <PlanRow key={p.id} plan={p} href={`/exam/${p.id}/review`} amber />
              ))}
            </Group>
          )}
          {active.length > 0 && (
            <Group title="Active plans">
              {active.map((p) => (
                <PlanRow key={p.id} plan={p} href={`/exam/${p.id}`} />
              ))}
            </Group>
          )}
          {done.length > 0 && (
            <Group title="Completed">
              {done.map((p) => (
                <PlanRow key={p.id} plan={p} href={`/exam/${p.id}`} muted />
              ))}
            </Group>
          )}
        </>
      )}
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function HowStep({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </span>
        <span className="text-sm font-semibold">{title}</span>
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}

function PlanRow({
  plan,
  href,
  amber,
  muted,
}: {
  plan: ExamPlan;
  href: string;
  amber?: boolean;
  muted?: boolean;
}) {
  const left = daysUntil(plan.examDate);
  const total = plan.progress?.totalDays ?? 0;
  const done = completedDays(plan);
  const ready = readiness(plan);
  const isActive = plan.status === "active";
  return (
    <Link href={href}>
      <Card
        className={cn(
          "transition-shadow hover:shadow-sm",
          amber && "border-amber-400/60",
          muted && "opacity-70",
        )}
      >
        <CardContent className="flex items-center justify-between gap-4 p-5">
          <div className="flex min-w-0 items-center gap-3">
            {isActive ? (
              <ReadinessRing pct={ready} size={52} stroke={6} />
            ) : (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary">
                <FileText className="h-5 w-5" />
              </div>
            )}
            <div className="min-w-0">
              <div className="truncate font-semibold">{plan.examTitle}</div>
              <div className="truncate text-sm text-muted-foreground">
                {plan.materialTitle}
              </div>
              {total > 0 && isActive && (
                <div className="mt-2 flex items-center gap-2">
                  <Progress
                    className="h-1.5 w-32"
                    value={Math.round((done / total) * 100)}
                  />
                  <span className="text-xs text-muted-foreground">
                    {done}/{total} days
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            {plan.status === "proposed" || plan.status === "draft" ? (
              <Badge className="bg-amber-500 text-white">Review</Badge>
            ) : plan.status === "completed" ? (
              <Badge variant="secondary">Done</Badge>
            ) : (
              <Badge className={DAYS_LEFT_CHIP[urgency(left)]}>
                {left > 0
                  ? `${left} ${left === 1 ? "day" : "days"} left`
                  : left === 0
                    ? "Today!"
                    : "Past"}
              </Badge>
            )}
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
