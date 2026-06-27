"use client";

import * as React from "react";
import { Check, X, RotateCcw } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { QuizQuestion } from "@/lib/types";

export function Quiz({
  questions,
  studySetId,
  autoReport = true,
  onComplete,
}: {
  questions: QuizQuestion[];
  studySetId: string;
  /** When false, the quiz reports nothing itself (caller handles rewards). */
  autoReport?: boolean;
  /** Called once on finish with the tally and which question ids were missed. */
  onComplete?: (r: { correct: number; total: number; wrongIds: string[] }) => void;
}) {
  const [index, setIndex] = React.useState(0);
  const [selected, setSelected] = React.useState<number | null>(null);
  const [correct, setCorrect] = React.useState(0);
  const [done, setDone] = React.useState(false);
  const wrongIds = React.useRef<string[]>([]);

  const q = questions[index];
  const total = questions.length;

  if (!total) {
    return (
      <p className="text-sm text-muted-foreground">
        No quiz questions for this study set yet.
      </p>
    );
  }

  function choose(i: number) {
    if (selected !== null) return;
    setSelected(i);
    if (i === q.correctIndex) setCorrect((c) => c + 1);
    else if (q.id) wrongIds.current.push(q.id);
  }

  function next() {
    if (index + 1 >= total) {
      setDone(true);
      if (autoReport) {
        // Award completion server-side (server recomputes points).
        api
          .post("rewards/activity/", {
            // Backend scores "Finished a quiz" on context.score (capped at 10).
            reason: "Finished a quiz",
            context: { studySetId, score: correct, total },
          })
          .catch(() => {});
        // Record accuracy for the analytics board (avg score %).
        api
          .post("progress/complete/", {
            studySetId,
            sectionIndex: 0,
            sectionTitle: "Quiz",
            correct,
            total,
          })
          .catch(() => {});
      }
      onComplete?.({ correct, total, wrongIds: wrongIds.current });
      return;
    }
    setIndex((n) => n + 1);
    setSelected(null);
  }

  function restart() {
    setIndex(0);
    setSelected(null);
    setCorrect(0);
    setDone(false);
  }

  if (done) {
    const pct = Math.round((correct / total) * 100);
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
          <div className="text-4xl font-bold">{pct}%</div>
          <p className="text-muted-foreground">
            You got {correct} of {total} correct.
          </p>
          <Button onClick={restart} variant="outline">
            <RotateCcw className="h-4 w-4" /> Try again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>
            Question {index + 1} of {total}
          </span>
          <span>{correct} correct</span>
        </div>
        <Progress value={Math.round((index / total) * 100)} />
      </div>

      <Card>
        <CardContent className="space-y-5 p-6">
          <h3 className="text-lg font-semibold leading-snug">{q.prompt}</h3>
          <div className="grid gap-3">
            {q.choices.map((choice, i) => {
              const isCorrect = i === q.correctIndex;
              const isPicked = i === selected;
              const reveal = selected !== null;
              return (
                <button
                  key={i}
                  onClick={() => choose(i)}
                  disabled={reveal}
                  className={cn(
                    "flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition-colors",
                    !reveal && "hover:bg-secondary/60",
                    reveal && isCorrect && "border-green-500 bg-green-500/10",
                    reveal &&
                      isPicked &&
                      !isCorrect &&
                      "border-destructive bg-destructive/10",
                  )}
                >
                  <span>{choice}</span>
                  {reveal && isCorrect && (
                    <Check className="h-4 w-4 text-green-600" />
                  )}
                  {reveal && isPicked && !isCorrect && (
                    <X className="h-4 w-4 text-destructive" />
                  )}
                </button>
              );
            })}
          </div>

          {selected !== null && q.explanation && (
            <p className="rounded-lg bg-secondary p-3 text-sm text-muted-foreground">
              {q.explanation}
            </p>
          )}

          {selected !== null && (
            <Button onClick={next} className="w-full">
              {index + 1 >= total ? "See results" : "Next question"}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
