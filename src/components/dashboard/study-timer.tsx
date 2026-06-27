"use client";

import * as React from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Timer,
  ChevronDown,
  Minus,
  Plus,
  Coffee,
  PauseCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useFocusTimer, formatClock } from "@/components/app/focus-timer-provider";

/**
 * Dashboard study-timer panel. The logic lives in FocusTimerProvider; this is
 * the control surface: a custom duration, start/pause, and the dynamic
 * idle-pause + break-suggestion banners.
 */
export function StudyTimer({ className }: { className?: string }) {
  const t = useFocusTimer();
  const [open, setOpen] = React.useState(false);

  const total = (t.mode === "focus" ? t.minutes : 5) * 60;
  const pct = total ? ((total - t.secondsLeft) / total) * 100 : 0;
  const R = 26;
  const C = 2 * Math.PI * R;

  const dotClass = !t.running
    ? "bg-muted-foreground"
    : t.idle
      ? "bg-amber-500 animate-pulse"
      : "bg-green-500";

  return (
    <Card className={cn("overflow-hidden", className)}>
      {/* Slim bar */}
      <div className="flex items-center gap-3 px-4 py-3">
        <span className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
          <Timer className="h-4 w-4" />
          <span className={cn("absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-card", dotClass)} />
        </span>
        <div className="flex flex-1 items-baseline gap-2">
          <span className="text-lg font-bold tabular-nums">
            {formatClock(t.secondsLeft)}
          </span>
          <span className="text-xs uppercase tracking-wide text-muted-foreground">
            {t.mode}
            {t.running && t.idle ? " · paused" : ""}
          </span>
        </div>
        <Button size="sm" onClick={() => (t.running ? t.pause() : t.start())}>
          {t.running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {t.running ? "Pause" : "Start"}
        </Button>
        <Button
          size="icon"
          variant="ghost"
          aria-label="Timer options"
          onClick={() => setOpen((o) => !o)}
        >
          <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
        </Button>
      </div>

      {/* Dynamic banners (always visible when relevant) */}
      {t.running && t.idle && t.pauseReason && (
        <div className="flex items-center gap-2 border-t bg-amber-500/10 px-4 py-2.5 text-sm text-amber-700 dark:text-amber-400">
          <PauseCircle className="h-4 w-4 shrink-0" />
          <span>{t.pauseReason}</span>
        </div>
      )}
      {t.breakSuggested && (
        <div className="flex flex-wrap items-center gap-2 border-t bg-accent2/10 px-4 py-2.5 text-sm">
          <Coffee className="h-4 w-4 shrink-0 text-accent2" />
          <span className="flex-1">
            You&apos;ve been focused a while — take a 5-minute break?
          </span>
          <Button size="sm" onClick={t.startBreak}>
            Take a break
          </Button>
          <Button size="sm" variant="ghost" onClick={t.dismissBreak}>
            Keep going
          </Button>
        </div>
      )}

      {/* Expanded controls */}
      {open && (
        <div className="flex flex-col gap-5 border-t px-4 py-4 sm:flex-row sm:items-center">
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
                className={t.mode === "focus" ? "stroke-primary" : "stroke-accent2"}
                strokeDasharray={C}
                strokeDashoffset={C - (pct / 100) * C}
                style={{ transition: "stroke-dashoffset 1s linear" }}
              />
            </svg>
          </div>

          <div className="flex-1 space-y-3">
            <div>
              <div className="mb-1 text-xs font-medium text-muted-foreground">
                Focus length (minutes)
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  disabled={t.running}
                  onClick={() => t.setMinutes(t.minutes - 5)}
                  aria-label="Less time"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <input
                  type="number"
                  min={1}
                  max={180}
                  value={t.minutes}
                  disabled={t.running}
                  onChange={(e) => t.setMinutes(Number(e.target.value))}
                  className="h-10 w-20 rounded-md border border-input bg-background text-center text-lg font-semibold tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
                />
                <Button
                  size="icon"
                  variant="outline"
                  disabled={t.running}
                  onClick={() => t.setMinutes(t.minutes + 5)}
                  aria-label="More time"
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={t.reset} className="ml-auto">
                  <RotateCcw className="h-4 w-4" /> Reset
                </Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              The timer counts only while you&apos;re active — it pauses itself if
              you stop interacting and resumes when you&apos;re back.
            </p>
          </div>
        </div>
      )}
    </Card>
  );
}
