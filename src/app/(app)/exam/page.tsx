"use client";

import Link from "next/link";
import { CalendarCheck, FileText } from "lucide-react";
import { useApi } from "@/lib/use-api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/app/empty-state";
import { Button } from "@/components/ui/button";
import type { Paginated, ExamPlan } from "@/lib/types";

function daysUntil(dateStr: string) {
  const exam = new Date(dateStr).getTime();
  const now = Date.now();
  return Math.max(0, Math.ceil((exam - now) / (1000 * 60 * 60 * 24)));
}

export default function ExamPrepPage() {
  const plans = useApi<Paginated<ExamPlan>>("examplans/");
  const list = plans.data?.results ?? [];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Exam prep
        </h1>
        <p className="mt-1 text-muted-foreground">
          Set an exam date and study a little every day.
        </p>
      </div>

      {plans.loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : list.length === 0 ? (
        <EmptyState
          icon={CalendarCheck}
          title="No exam plans yet"
          description="Create a study set first, then build an exam plan from it to get a daily schedule."
          action={
            <Button asChild>
              <Link href="/library">
                <FileText className="h-4 w-4" /> Go to library
              </Link>
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {list.map((plan) => {
            const completed = Object.values(plan.results ?? {}).filter(
              (r) => r.completed,
            ).length;
            return (
              <Card key={plan.id}>
                <CardContent className="flex items-center justify-between p-5">
                  <div>
                    <div className="font-semibold">{plan.examTitle}</div>
                    <div className="text-sm text-muted-foreground">
                      {plan.materialTitle} · {plan.questionsPerDay}/day
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {completed} day{completed === 1 ? "" : "s"} completed
                    </div>
                  </div>
                  <Badge variant="secondary">
                    {daysUntil(plan.examDate)} days left
                  </Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
