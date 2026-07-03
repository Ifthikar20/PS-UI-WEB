"use client";

import * as React from "react";
import { Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  NotesGlyph,
  CardsGlyph,
  BirdGlyph,
  SyncGlyph,
} from "./glyphs";

/**
 * The "product film" — a chaptered, auto-flowing animation that plays like a
 * short product video, built entirely from DOM/SVG so it stays crisp, light,
 * and theme-aware. Interactive like a player: chapters are clickable, a
 * segmented progress bar shows where you are, and hover (or the button)
 * pauses playback.
 */

const CHAPTERS = [
  { key: "capture", label: "Capture", title: "Paste anything", Icon: NotesGlyph },
  { key: "build", label: "Build", title: "It becomes a study set", Icon: CardsGlyph },
  { key: "play", label: "Play", title: "Then you play it", Icon: BirdGlyph },
  { key: "sync", label: "Sync", title: "Everywhere, instantly", Icon: SyncGlyph },
] as const;

const CHAPTER_MS = 5200;

export function ProductFilm() {
  const [scene, setScene] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const [cycle, setCycle] = React.useState(0); // remounts scene content to replay its animations
  const [score, setScore] = React.useState(0);

  // Auto-advance chapters while playing.
  React.useEffect(() => {
    if (paused) return;
    const id = setTimeout(() => {
      setScene((s) => (s + 1) % CHAPTERS.length);
      setCycle((c) => c + 1);
    }, CHAPTER_MS);
    return () => clearTimeout(id);
  }, [scene, paused, cycle]);

  // Score ticker during the "play" chapter.
  React.useEffect(() => {
    if (scene !== 2 || paused) return;
    setScore(0);
    const id = setInterval(() => setScore((n) => n + 1), 450);
    return () => clearInterval(id);
  }, [scene, paused, cycle]);

  function jump(i: number) {
    setScene(i);
    setCycle((c) => c + 1);
  }

  return (
    <div
      className="mx-auto w-full max-w-4xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* screen */}
      <div className="relative overflow-hidden rounded-3xl border bg-card shadow-2xl shadow-black/[0.08] dark:shadow-black/40">
        {/* window chrome */}
        <div className="flex items-center justify-between border-b px-5 py-3">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-border" />
            <span className="h-2.5 w-2.5 rounded-full bg-border" />
            <span className="h-2.5 w-2.5 rounded-full bg-border" />
          </div>
          <div className="text-xs font-medium text-muted-foreground">
            {CHAPTERS[scene].title}
          </div>
          <button
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? "Play" : "Pause"}
            className="flex h-7 w-7 items-center justify-center rounded-full border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            {paused ? (
              <Play className="h-3.5 w-3.5 fill-current pl-px" />
            ) : (
              <Pause className="h-3.5 w-3.5" />
            )}
          </button>
        </div>

        {/* stage */}
        <div className="relative aspect-[16/9] sm:aspect-[2/1]" key={cycle}>
          {/* Chapter 1 — Capture: note lines type in */}
          <Stage active={scene === 0}>
            <div className="w-full max-w-md space-y-4 px-8">
              <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Biology — Chapter 4.docx
              </div>
              {[92, 100, 78, 96, 62].map((w, i) => (
                <div key={i} className="h-3 overflow-hidden rounded-full bg-secondary">
                  <div
                    style={{
                      maxWidth: `${w}%`,
                      animationDelay: `${i * 0.28}s`,
                    }}
                    className="h-full animate-type-in rounded-full bg-foreground/15"
                  />
                </div>
              ))}
              <div className="flex items-center gap-2 pt-1 text-sm text-muted-foreground">
                <span className="inline-block h-4 w-0.5 animate-pulse bg-primary" />
                dropping in your notes…
              </div>
            </div>
          </Stage>

          {/* Chapter 2 — Build: sections + questions pop into place */}
          <Stage active={scene === 1}>
            <div className="grid w-full max-w-lg grid-cols-2 gap-3 px-8">
              {["The cell membrane", "Osmosis & diffusion", "Organelles", "Cell division"].map(
                (t, i) => (
                  <div
                    key={t}
                    style={{ animationDelay: `${i * 0.18}s` }}
                    className="animate-pop rounded-2xl border bg-background p-4"
                  >
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                      Section {i + 1}
                    </div>
                    <div className="mt-1 text-sm font-semibold leading-snug">{t}</div>
                    <div className="mt-2.5 flex gap-1.5">
                      {[0, 1, 2].map((q) => (
                        <span
                          key={q}
                          style={{ animationDelay: `${0.5 + i * 0.18 + q * 0.1}s` }}
                          className="animate-pop rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                        >
                          Q{q + 1}
                        </span>
                      ))}
                    </div>
                  </div>
                ),
              )}
            </div>
          </Stage>

          {/* Chapter 3 — Play: mini side-scroller with live score */}
          <Stage active={scene === 2}>
            <div className="relative h-full w-full overflow-hidden bg-gradient-to-b from-primary/10 to-transparent">
              {/* scrolling pipes */}
              <div className="absolute inset-y-0 left-0 flex w-[200%] animate-scroll-x items-end gap-40 pl-64">
                {[38, 62, 30, 70, 45, 58].map((h, i) => (
                  <div key={i} className="flex h-full w-14 flex-col justify-between py-6">
                    <div
                      className="w-full rounded-b-xl bg-primary/25"
                      style={{ height: `${88 - h - 26}%` }}
                    />
                    <div
                      className="w-full rounded-t-xl bg-primary/25"
                      style={{ height: `${h}%` }}
                    />
                  </div>
                ))}
              </div>
              {/* bird */}
              <div className="absolute left-[26%] top-1/2 -translate-y-1/2">
                <BirdGlyph className="h-14 w-14 animate-bob text-accent-2" />
              </div>
              {/* score + question chip */}
              <div className="absolute left-1/2 top-5 -translate-x-1/2 rounded-full border bg-background/80 px-4 py-1 text-sm font-bold tabular-nums backdrop-blur">
                {score}
              </div>
              <div className="absolute bottom-5 left-1/2 w-max max-w-[80%] -translate-x-1/2 animate-pop rounded-2xl border bg-background/90 px-4 py-2.5 text-xs font-medium shadow-lg backdrop-blur [animation-delay:2.2s]">
                Crash? <span className="text-primary">“What moves water across a membrane?”</span> — answer to revive
              </div>
            </div>
          </Stage>

          {/* Chapter 4 — Sync: score flows from laptop to phone */}
          <Stage active={scene === 3}>
            <div className="flex items-center gap-6 px-8 sm:gap-10">
              {/* laptop */}
              <div className="animate-pop rounded-2xl border bg-background p-4 shadow-sm">
                <div className="h-20 w-32 rounded-lg bg-secondary p-2.5 sm:h-24 sm:w-40">
                  <div className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Web · today
                  </div>
                  <div className="mt-1 text-xl font-extrabold tabular-nums">+{Math.max(score, 12)} pts</div>
                  <div className="mt-1.5 h-1.5 w-3/4 rounded-full bg-primary/30">
                    <div className="h-full w-2/3 rounded-full bg-primary" />
                  </div>
                </div>
              </div>
              {/* flowing link */}
              <svg viewBox="0 0 120 40" className="h-10 w-24 shrink-0 text-primary sm:w-32" fill="none" aria-hidden>
                <path
                  d="M4 20 C 34 4, 86 36, 116 20"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="4 8"
                  className="animate-dash-flow"
                />
              </svg>
              {/* phone */}
              <div className="animate-pop rounded-[20px] border bg-background p-2 shadow-sm [animation-delay:0.25s]">
                <div className="h-28 w-16 rounded-xl bg-secondary p-2 sm:h-32 sm:w-[4.5rem]">
                  <div className="text-[8px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Phone
                  </div>
                  <div className="mt-1 text-sm font-extrabold tabular-nums">+{Math.max(score, 12)}</div>
                  <div className="mt-1 text-[8px] text-muted-foreground">already there</div>
                  <div className="mt-2 h-1 w-full rounded-full bg-primary/30">
                    <div className="h-full w-2/3 rounded-full bg-primary" />
                  </div>
                </div>
              </div>
            </div>
          </Stage>
        </div>

        {/* player bar */}
        <div className="border-t px-5 py-4">
          <div className="grid grid-cols-4 gap-2">
            {CHAPTERS.map((c, i) => (
              <button key={c.key} onClick={() => jump(i)} className="group text-left">
                <div className="h-1 overflow-hidden rounded-full bg-secondary">
                  <div
                    className={cn(
                      "h-full rounded-full bg-foreground",
                      i < scene && "w-full",
                      i > scene && "w-0",
                    )}
                    style={
                      i === scene
                        ? {
                            animation: `type-in ${CHAPTER_MS}ms linear both`,
                            animationPlayState: paused ? "paused" : "running",
                          }
                        : undefined
                    }
                  />
                </div>
                <div
                  className={cn(
                    "mt-2 flex items-center gap-1.5 text-xs font-medium transition-colors",
                    i === scene
                      ? "text-foreground"
                      : "text-muted-foreground group-hover:text-foreground",
                  )}
                >
                  <c.Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{c.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Stage({ active, children }: { active: boolean; children: React.ReactNode }) {
  return (
    <div
      aria-hidden={!active}
      className={cn(
        "absolute inset-0 flex items-center justify-center transition-all duration-500",
        active ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0",
      )}
    >
      {children}
    </div>
  );
}
