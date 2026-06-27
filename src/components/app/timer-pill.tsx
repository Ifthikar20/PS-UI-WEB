"use client";

import { Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFocusTimer, formatClock } from "./focus-timer-provider";

/**
 * Compact, always-visible focus-timer indicator in the top bar. Shows the live
 * countdown and state (running / paused-idle / break) so the dynamic timer
 * follows you across the app, and lets you pause/resume from anywhere.
 */
export function TimerPill() {
  const t = useFocusTimer();

  const dot = !t.running
    ? "bg-muted-foreground"
    : t.idle
      ? "bg-amber-500 animate-pulse"
      : t.mode === "break"
        ? "bg-accent2"
        : "bg-green-500";

  return (
    <button
      onClick={() => (t.running ? t.pause() : t.start())}
      title={
        t.idle && t.pauseReason
          ? t.pauseReason
          : t.running
            ? "Pause focus timer"
            : "Resume focus timer"
      }
      className="hidden items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent sm:inline-flex"
    >
      <span className={cn("h-2 w-2 rounded-full", dot)} />
      <span className="tabular-nums">{formatClock(t.secondsLeft)}</span>
      {t.running ? (
        <Pause className="h-3.5 w-3.5 text-muted-foreground" />
      ) : (
        <Play className="h-3.5 w-3.5 text-muted-foreground" />
      )}
    </button>
  );
}
