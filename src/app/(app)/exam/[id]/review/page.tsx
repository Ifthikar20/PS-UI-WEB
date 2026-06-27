"use client";

import * as React from "react";
import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, RefreshCw, Loader2, BookOpen } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { daysUntil } from "@/lib/exam";
import type { ExamDaySummary } from "@/lib/types";

type Schedule = {
  status: string;
  examTitle: string;
  examDate: string;
  materialTitle: string;
  days: ExamDaySummary[];
};

export default function ReviewPlanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [data, setData] = React.useState<Schedule | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [working, setWorking] = React.useState<"approve" | "regen" | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    try {
      const s = await api.get<Schedule>(`examplans/${id}/schedule/`);
      if (s.status === "active" || s.status === "completed") {
        router.replace(`/exam/${id}`);
        return;
      }
      setData(s);
    } catch {
      setError("Couldn't load the plan.");
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  React.useEffect(() => {
    load();
  }, [load]);

  async function regenerate() {
    setWorking("regen");
    setError(null);
    try {
      await api.post(`examplans/${id}/generate/`, {});
      await load();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Regeneration failed.");
    } finally {
      setWorking(null);
    }
  }

  async function approve() {
    setWorking("approve");
    setError(null);
    try {
      await api.post(`examplans/${id}/approve/`, {});
      router.push(`/exam/${id}`);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Approval failed.");
      setWorking(null);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-72 w-full" />
      </div>
    );
  }
  if (error && !data) {
    return <p className="mx-auto max-w-3xl text-sm text-destructive">{error}</p>;
  }
  if (!data) return null;

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-24">
      <Button variant="ghost" size="sm" asChild className="-ml-2 w-fit">
        <Link href="/exam">
          <ArrowLeft className="h-4 w-4" /> Exam prep
        </Link>
      </Button>

      <div>
        <Badge className="mb-2 bg-amber-500 text-white">Review your guide</Badge>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          {data.examTitle}
        </h1>
        <p className="mt-1 text-muted-foreground">
          {data.materialTitle} · {data.days.length} study days ·{" "}
          {daysUntil(data.examDate)} days until exam
        </p>
      </div>

      <div className="space-y-2">
        {data.days.map((d) => (
          <Card key={d.ymd}>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-sm font-semibold">
                {d.dayIndex + 1}
              </div>
              <div className="flex-1">
                <div className="font-medium">
                  {d.sectionTitle || `Day ${d.dayIndex + 1}`}
                </div>
                <div className="text-xs text-muted-foreground">{d.ymd}</div>
              </div>
              <Badge variant="muted" className="gap-1">
                <BookOpen className="h-3 w-3" />
                {d.questionCount} Qs
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      {/* Sticky approve bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/95 p-4 backdrop-blur lg:left-64">
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          <Button
            variant="outline"
            onClick={regenerate}
            disabled={working !== null}
          >
            {working === "regen" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Regenerate
          </Button>
          <Button className="flex-1" onClick={approve} disabled={working !== null}>
            {working === "approve" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Check className="h-4 w-4" />
            )}
            Approve &amp; activate
          </Button>
        </div>
      </div>
    </div>
  );
}
