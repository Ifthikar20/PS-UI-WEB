"use client";

import * as React from "react";
import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { api } from "@/lib/api";
import { useApi } from "@/lib/use-api";
import { useSyncedReading, FONT_CLASS, SIZE_CLASS } from "@/lib/reading";
import { useStudyHeartbeat } from "@/lib/use-heartbeat";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Markdown } from "@/components/study/markdown";
import { ReaderToolbar } from "@/components/study/reader-toolbar";
import { Quiz } from "@/components/study/quiz";
import type { ExamToday, ExamPlan, QuizQuestion } from "@/lib/types";

export default function ExamTodayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const today = useApi<ExamToday>(`examplans/${id}/today/`);
  const plan = useApi<ExamPlan>(`examplans/${id}/`);
  const reading = useSyncedReading();
  const [phase, setPhase] = React.useState<"read" | "quiz">("read");

  // Track active reading time against the plan's material.
  useStudyHeartbeat(
    plan.data?.materialId,
    today.data?.dayIndex ?? 0,
    today.data?.section.title ?? "",
  );

  if (today.loading) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }
  if (!today.data) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <Button variant="ghost" size="sm" asChild className="-ml-2 w-fit">
          <Link href={`/exam/${id}`}>
            <ArrowLeft className="h-4 w-4" /> Plan
          </Link>
        </Button>
        <p className="text-muted-foreground">No session scheduled for today.</p>
      </div>
    );
  }

  const t = today.data;
  const questions: QuizQuestion[] = [...t.reviewQuestions, ...t.questions];

  async function submit(r: { correct: number; total: number; wrongIds: string[] }) {
    const allIds = questions.map((q) => q.id);
    const correctIds = allIds.filter((qid) => !r.wrongIds.includes(qid));
    try {
      await api.post(`examplans/${id}/sessions/`, {
        day: t.date,
        correct: r.correct,
        total: r.total,
        wrongQuestionIds: r.wrongIds,
        correctQuestionIds: correctIds,
      });
    } catch {
      /* best-effort; the recap still shows */
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Button variant="ghost" size="sm" asChild className="-ml-2 w-fit">
        <Link href={`/exam/${id}`}>
          <ArrowLeft className="h-4 w-4" /> Plan
        </Link>
      </Button>

      <div>
        <div className="text-sm text-muted-foreground">Today · {t.date}</div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          {t.section.title}
        </h1>
      </div>

      {phase === "read" ? (
        <>
          <ReaderToolbar {...reading} />
          <Card>
            <CardContent className="p-6">
              <Markdown
                content={t.section.content}
                className={cn(
                  FONT_CLASS[reading.font],
                  SIZE_CLASS[reading.size],
                  "text-foreground/90",
                )}
              />
              {t.section.example && (
                <p className="mt-4 rounded-lg bg-secondary p-3 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Example: </span>
                  {t.section.example}
                </p>
              )}
            </CardContent>
          </Card>
          <Button size="lg" className="w-full" onClick={() => setPhase("quiz")}>
            I&apos;ve read it — start questions
            {questions.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {questions.length}
              </Badge>
            )}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </>
      ) : (
        <>
          {t.reviewQuestions.length > 0 && (
            <p className="rounded-lg bg-accent2/15 px-3 py-2 text-sm">
              Includes <strong>{t.reviewQuestions.length}</strong> review question
              {t.reviewQuestions.length === 1 ? "" : "s"} you missed before.
            </p>
          )}
          <Quiz
            questions={questions}
            studySetId={plan.data?.materialId ?? ""}
            autoReport={false}
            onComplete={submit}
          />
          <Button variant="outline" className="w-full" onClick={() => router.push(`/exam/${id}`)}>
            Back to plan
          </Button>
        </>
      )}
    </div>
  );
}
