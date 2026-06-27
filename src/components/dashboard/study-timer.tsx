"use client";

import * as React from "react";
import { Play, Pause, RotateCcw, Timer, ChevronDown } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const PRESETS = [25, 50] as const;
const BREAK_MINUTES = 5;

/**
 * Compact, collapsible Pomodoro study timer pinned to the top of the dashboard.
 * Collapsed: a slim bar (time + start/pause). Expanded: ring + presets + reset.
 * Finishing a focus block records a study-session reward server-side.
 */
export function StudyTimer({ className }: { className?: string }) {
  const [minutes, setMinutes] = React.useState<number>(25);
  const [secondsLeft, setSecondsLeft] = React.useState<number>(25 * 60);
  const [running, setRunning] = React.useState(false);
  const [mode, setMode] = React.useState<"focus" | "break">("focus");
  const [open, setOpen] = React.useState(false);

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
        .post("rewards/activity/", { reason: "Study session", context: { minutes } })
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
  const R = 26;
  const C = 2 * Math.PI * R;

  return (
    <Card className={cn("overflow-hidden", className)}>
      {/* Slim bar — always visible */}
      <div className="flex items-center gap-3 px-4 py-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
          <Timer className="h-4 w-4" />
        </span>
        <div className="flex flex-1 items-baseline gap-2">
          <span className="text-lg font-bold tabular-nums">
            {mm}:{ss}
          </span>
          <span className="text-xs uppercase tracking-wide text-muted-foreground">
            {mode}
          </span>
        </div>
        <Button size="sm" onClick={() => setRunning((r) => !r)}>
          {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {running ? "Pause" : "Start"}
        </Button>
        <Button
          size="icon"
          variant="ghost"
          aria-label="Toggle timer options"
          onClick={() => setOpen((o) => !o)}
        >
          <ChevronDown
            className={cn("h-4 w-4 transition-transform", open && "rotate-180")}
          />
        </Button>
      </div>

      {/* Expanded controls */}
      {open && (
        <div className="flex items-center gap-5 border-t px-4 py-4">
          <div className="relative h-16 w-16 shrink-0">
            <svg viewBox="0 0 64 64" className="h-full w-full -rotate-90">
              <circle cx="32" cy="32" r={R} fill="none" strokeWidth="6" className="stroke-secondary" />
              <circle
                cx="32"
                cy="32"
                r={R}
                fill="none"
                strokeWidth="6"
                strokeLinecap="round"
                className={mode === "focus" ? "stroke-primary" : "stroke-accent2"}
                strokeDasharray={C}
                strokeDashoffset={C - (pct / 100) * C}
                style={{ transition: "stroke-dashoffset 1s linear" }}
              />
            </svg>
          </div>
          <div className="flex flex-1 flex-wrap items-center gap-2">
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
            <Button variant="outline" size="sm" onClick={reset} className="ml-auto">
              <RotateCcw className="h-4 w-4" /> Reset
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
