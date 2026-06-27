"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, FileText, Check } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { useApi } from "@/lib/use-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { daysUntil } from "@/lib/exam";
import type { Paginated, StudySet, ExamPlan } from "@/lib/types";

const FREQS = [3, 5, 10, 15];

function tomorrow() {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toISOString().slice(0, 10);
}
function minDate() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

export default function NewExamPlanPage() {
  const router = useRouter();
  const sets = useApi<Paginated<StudySet>>("studysets/?status=ready");
  const ready = (sets.data?.results ?? []).filter((s) => s.status === "ready");

  const [materialId, setMaterialId] = React.useState<string>("");
  const [title, setTitle] = React.useState("");
  const [date, setDate] = React.useState(tomorrow());
  const [qpd, setQpd] = React.useState(5);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const chosen = ready.find((s) => s.id === materialId);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!materialId) return;
    setError(null);
    setBusy(true);
    try {
      const plan = await api.post<ExamPlan>("examplans/", {
        materialId,
        examTitle: title || `${chosen?.title ?? "Exam"} prep`,
        examDate: date,
        questionsPerDay: qpd,
        topics: chosen?.topics ?? [],
        startAsDraft: true,
      });
      await api.post(`examplans/${plan.id}/generate/`, {});
      router.push(`/exam/${plan.id}/review`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't create the plan.");
      setBusy(false);
    }
  }

  if (busy) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center justify-center py-24 text-center">
        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
        <h2 className="mt-6 text-xl font-semibold">Building your study guide</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Scheduling sections and questions across the days until your exam…
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Button variant="ghost" size="sm" asChild className="-ml-2 w-fit">
        <Link href="/exam">
          <ArrowLeft className="h-4 w-4" /> Exam prep
        </Link>
      </Button>

      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          New exam plan
        </h1>
        <p className="mt-1 text-muted-foreground">
          We&apos;ll generate a daily guide you can review before starting.
        </p>
      </div>

      <form onSubmit={submit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Study material</CardTitle>
          </CardHeader>
          <CardContent>
            {sets.loading ? (
              <Skeleton className="h-24 w-full" />
            ) : ready.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No ready study sets yet.{" "}
                <Link href="/study/new" className="text-primary underline">
                  Create one first
                </Link>
                .
              </p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {ready.map((s) => (
                  <button
                    type="button"
                    key={s.id}
                    onClick={() => setMaterialId(s.id)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border p-4 text-left transition-colors hover:bg-accent",
                      materialId === s.id && "border-primary ring-1 ring-primary",
                    )}
                  >
                    <FileText className="h-5 w-5 shrink-0 text-muted-foreground" />
                    <span className="flex-1 truncate font-medium">{s.title}</span>
                    {materialId === s.id && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Exam name</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Biology Final"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Exam date</Label>
              <Input
                id="date"
                type="date"
                min={minDate()}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                {daysUntil(date)} days to prepare.
              </p>
            </div>
            <div className="space-y-2">
              <Label>Questions per day</Label>
              <div className="flex gap-2">
                {FREQS.map((n) => (
                  <button
                    type="button"
                    key={n}
                    onClick={() => setQpd(n)}
                    className={cn(
                      "flex-1 rounded-lg border py-2 text-sm transition-colors hover:bg-accent",
                      qpd === n && "border-primary bg-accent font-medium",
                    )}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {error && (
          <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        <Button type="submit" size="lg" className="w-full" disabled={!materialId}>
          Generate study guide
        </Button>
      </form>
    </div>
  );
}
