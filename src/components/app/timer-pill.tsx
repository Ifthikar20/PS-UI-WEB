"use client";

import * as React from "react";
import { Play, Pause, RotateCcw, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useFocusTimer, formatClock } from "./focus-timer-provider";

/**
 * The topbar focus timer: a live pill plus a popover where the session is
 * actually driven — set ANY duration (no fixed presets), then start, pause,
 * or reset from anywhere in the app. The countdown itself is activity-aware
 * (auto-pauses when you drift, resumes on interaction) and completed sessions
 * are recorded as study activity.
 */
export function TimerPill() {
  const t = useFocusTimer();
  const [open, setOpen] = React.useState(false);
  const [draft, setDraft] = React.useState<string>("");
  const wrapRef = React.useRef<HTMLDivElement>(null);

  // Close on outside click / escape.
  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const dot = !t.running
    ? "bg-muted-foreground"
    : t.idle
      ? "bg-amber-500 animate-pulse"
      : t.mode === "break"
        ? "bg-accent2"
        : "bg-green-500";

  function applyDraft() {
    const m = parseInt(draft, 10);
    if (!Number.isNaN(m) && m > 0) t.setMinutes(m);
    setDraft("");
  }

  return (
    <div ref={wrapRef} className="relative hidden sm:block">
      <button
        onClick={() => setOpen((o) => !o)}
        title={t.idle && t.pauseReason ? t.pauseReason : "Study session timer"}
        className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent"
      >
        <span className={cn("h-2 w-2 rounded-full", dot)} />
        <span className="tabular-nums">{formatClock(t.secondsLeft)}</span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-72 rounded-2xl border bg-card p-4 shadow-xl">
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-semibold">
              {t.mode === "break" ? "Break" : "Study session"}
            </span>
            <span className="text-xs text-muted-foreground">
              {t.running ? (t.idle ? "paused — idle" : "running") : "ready"}
            </span>
          </div>

          <div className="mt-3 text-center text-4xl font-bold tabular-nums tracking-tight">
            {formatClock(t.secondsLeft)}
          </div>
          {t.idle && t.pauseReason && (
            <p className="mt-1.5 text-center text-xs text-amber-600 dark:text-amber-400">
              {t.pauseReason}
            </p>
          )}
          {t.breakSuggested && (
            <p className="mt-1.5 text-center text-xs text-muted-foreground">
              You&apos;ve been at it a while — consider a break.
            </p>
          )}

          {/* custom duration — any number of minutes */}
          <div className="mt-4">
            <label className="text-xs font-medium text-muted-foreground">
              Session length (minutes)
            </label>
            <div className="mt-1.5 flex gap-2">
              <input
                type="number"
                min={1}
                max={180}
                inputMode="numeric"
                placeholder={String(t.minutes)}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onBlur={applyDraft}
                onKeyDown={(e) => e.key === "Enter" && applyDraft()}
                disabled={t.running}
                className="h-9 w-full rounded-lg border bg-background px-3 text-sm tabular-nums outline-none ring-primary/40 focus:ring-2 disabled:opacity-50"
              />
              <span className="flex items-center text-xs text-muted-foreground">
                current {t.minutes}m
              </span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
            <Button
              size="sm"
              onClick={() => (t.running ? t.pause() : t.start())}
              className="w-full"
            >
              {t.running ? (
                <>
                  <Pause className="h-4 w-4" /> Pause
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" /> Start session
                </>
              )}
            </Button>
            <Button size="sm" variant="outline" onClick={t.reset} title="Reset">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          <p className="mt-3 text-[11px] leading-snug text-muted-foreground">
            Pauses itself when you go idle and resumes when you&apos;re back.
            Reading and quizzes are tracked automatically either way — see{" "}
            <a href="/activity" className="underline underline-offset-2 hover:text-foreground">
              Activity
            </a>
            .
          </p>
        </div>
      )}
    </div>
  );
}
