"use client";

import Link from "next/link";
import { CalendarCheck, Plus, FileText, ChevronRight } from "lucide-react";
import { useApi } from "@/lib/use-api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/app/empty-state";
import { Button } from "@/components/ui/button";
import { daysUntil, completedDays } from "@/lib/exam";
import type { Paginated, ExamPlan } from "@/lib/types";

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
  return (
    <Link href={href}>
      <Card className={amber ? "border-amber-400/60" : muted ? "opacity-70" : ""}>
        <CardContent className="flex items-center justify-between gap-4 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <div className="font-semibold">{plan.examTitle}</div>
              <div className="text-sm text-muted-foreground">
                {plan.materialTitle}
              </div>
              {total > 0 && plan.status === "active" && (
                <Progress
                  className="mt-2 h-1.5 w-40"
                  value={Math.round((done / total) * 100)}
                />
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {plan.status === "proposed" || plan.status === "draft" ? (
              <Badge className="bg-amber-500 text-white">Review</Badge>
            ) : plan.status === "completed" ? (
              <Badge variant="secondary">Done</Badge>
            ) : (
              <Badge variant="secondary">
                {left >= 0 ? `${left} days left` : "Past"}
              </Badge>
            )}
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
