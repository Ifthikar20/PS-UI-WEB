"use client";

import * as React from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const PRESETS = [25, 50] as const;
const BREAK_MINUTES = 5;

/**
 * Pomodoro-style study timer pinned to the top of the Focus / Rose dashboards.
 * On finishing a focus block it records a study-session reward server-side.
 */
export function StudyTimer({ className }: { className?: string }) {
  const [minutes, setMinutes] = React.useState<number>(25);
  const [secondsLeft, setSecondsLeft] = React.useState<number>(25 * 60);
  const [running, setRunning] = React.useState(false);
  const [mode, setMode] = React.useState<"focus" | "break">("focus");

  const total = (mode === "focus" ? minutes : BREAK_MINUTES) * 60;

  React.useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(id);
          handleComplete();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  function handleComplete() {
    setRunning(false);
    if (mode === "focus") {
      api
        .post("rewards/activity/", {
          reason: "Study session",
          context: { minutes },
        })
        .catch(() => {});
      setMode("break");
      setSecondsLeft(BREAK_MINUTES * 60);
    } else {
      setMode("focus");
      setSecondsLeft(minutes * 60);
    }
  }

  function selectPreset(m: number) {
    setMinutes(m);
    setMode("focus");
    setSecondsLeft(m * 60);
    setRunning(false);
  }

  function reset() {
    setRunning(false);
    setSecondsLeft(total);
  }

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");
  const pct = total ? ((total - secondsLeft) / total) * 100 : 0;

  // SVG ring geometry
  const R = 52;
  const C = 2 * Math.PI * R;

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="flex flex-col items-center gap-5 p-6 sm:flex-row sm:gap-8">
        <div className="relative h-32 w-32 shrink-0">
          <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
            <circle
              cx="60"
              cy="60"
              r={R}
              fill="none"
              strokeWidth="10"
              className="stroke-secondary"
            />
            <circle
              cx="60"
              cy="60"
              r={R}
              fill="none"
              strokeWidth="10"
              strokeLinecap="round"
              className={mode === "focus" ? "stroke-primary" : "stroke-accent2"}
              strokeDasharray={C}
              strokeDashoffset={C - (pct / 100) * C}
              style={{ transition: "stroke-dashoffset 1s linear" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold tabular-nums">
              {mm}:{ss}
            </span>
            <span className="text-xs uppercase tracking-wide text-muted-foreground">
              {mode}
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col items-center gap-4 sm:items-start">
          <div>
            <h2 className="text-lg font-semibold">Study timer</h2>
            <p className="text-sm text-muted-foreground">
              Focus in blocks, earn points for each session.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {PRESETS.map((p) => (
              <button
                key={p}
                onClick={() => selectPreset(p)}
                className={cn(
                  "rounded-full border px-3 py-1 text-sm transition-colors hover:bg-accent",
                  minutes === p && mode === "focus" && "border-primary bg-accent",
                )}
              >
                {p} min
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => setRunning((r) => !r)}>
              {running ? (
                <>
                  <Pause className="h-4 w-4" /> Pause
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" /> Start
                </>
              )}
            </Button>
            <Button variant="outline" size="icon" onClick={reset} aria-label="Reset">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
