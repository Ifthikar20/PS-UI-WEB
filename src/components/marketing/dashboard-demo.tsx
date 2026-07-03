"use client";

import * as React from "react";
import {
  Star,
  Flame,
  Zap,
  Check,
  Share2,
  Trophy,
  ArrowRight,
  Sparkles,
  Eye,
} from "lucide-react";
import { Pip } from "@/components/pip";
import { CertificateSeal } from "@/components/rewards/seal";
import { cn } from "@/lib/utils";

/**
 * Interactive "commercial" that lives inside the landing page's browser mock.
 * Instead of a dead screenshot, it plays the whole PlayStudy loop as a series
 * of scenes the visitor can watch or click through:
 *
 *   Study  →  Play  →  Rewards  →  Share  →  Someone's watching
 *
 * Self-advancing (pauses on hover), fully self-contained (no network), and
 * theme-aware — it's an ad for the product, built from the product's own
 * design language.
 */

const SCENES = [
  { key: "study", label: "Study" },
  { key: "play", label: "Play" },
  { key: "reward", label: "Rewards" },
  { key: "share", label: "Share" },
  { key: "watch", label: "Cheer on" },
] as const;

const SCENE_MS = 3600;

export function DashboardDemo() {
  const [active, setActive] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  // Auto-advance with a visible progress bar; pause on hover/focus.
  React.useEffect(() => {
    if (paused) return;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / SCENE_MS);
      setProgress(t);
      if (t >= 1) {
        setActive((a) => (a + 1) % SCENES.length);
        setProgress(0);
      } else {
        raf = requestAnimationFrame(tick);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, paused]);

  function jump(i: number) {
    setActive(i);
    setProgress(0);
  }

  return (
    <div
      className="overflow-hidden rounded-2xl border bg-card shadow-2xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* browser chrome */}
      <div className="flex items-center gap-2 border-b bg-muted/60 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
        <span className="ml-3 flex-1 truncate rounded-md bg-background px-3 py-1 text-[11px] text-muted-foreground">
          playstudy.ai/dashboard
        </span>
        <span className="hidden items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary sm:inline-flex">
          <Sparkles className="h-3 w-3" /> Live demo
        </span>
      </div>

      {/* step rail */}
      <div className="flex items-center gap-1 border-b bg-background/60 px-3 py-2">
        {SCENES.map((s, i) => (
          <button
            key={s.key}
            onClick={() => jump(i)}
            className={cn(
              "relative flex-1 overflow-hidden rounded-md px-2 py-1 text-[11px] font-medium transition-colors sm:text-xs",
              i === active
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:bg-secondary/60",
            )}
          >
            <span className="relative z-10 flex items-center justify-center gap-1">
              <span
                className={cn(
                  "flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold",
                  i === active
                    ? "bg-primary text-primary-foreground"
                    : i < active
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground",
                )}
              >
                {i < active ? <Check className="h-2.5 w-2.5" /> : i + 1}
              </span>
              <span className="hidden sm:inline">{s.label}</span>
            </span>
            {i === active && (
              <span
                className="absolute inset-x-0 bottom-0 h-0.5 bg-primary"
                style={{ width: `${progress * 100}%` }}
              />
            )}
          </button>
        ))}
      </div>

      {/* stage */}
      <div className="relative aspect-[16/11] w-full overflow-hidden bg-gradient-to-b from-background to-secondary/30">
        {SCENES.map((s, i) => (
          <div
            key={s.key}
            className={cn(
              "absolute inset-0 transition-all duration-500",
              i === active
                ? "translate-x-0 opacity-100"
                : "pointer-events-none translate-x-4 opacity-0",
            )}
          >
            <Scene which={s.key} active={i === active} />
          </div>
        ))}
      </div>
    </div>
  );
}

function Scene({
  which,
  active,
}: {
  which: (typeof SCENES)[number]["key"];
  active: boolean;
}) {
  switch (which) {
    case "study":
      return <StudyScene active={active} />;
    case "play":
      return <PlayScene active={active} />;
    case "reward":
      return <RewardScene active={active} />;
    case "share":
      return <ShareScene active={active} />;
    case "watch":
      return <WatchScene active={active} />;
  }
}

function SceneShell({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col p-4 sm:p-6">
      <div className="mb-3">
        <div className="text-[10px] font-semibold uppercase tracking-wide text-primary sm:text-xs">
          {eyebrow}
        </div>
        <h3 className="text-sm font-bold sm:text-lg">{title}</h3>
      </div>
      <div className="min-h-0 flex-1">{children}</div>
    </div>
  );
}

/* 1 ─ Study content, one click from becoming a game. */
function StudyScene({ active }: { active: boolean }) {
  const sections = ["Cell structure", "Membrane transport", "Mitochondria"];
  return (
    <SceneShell eyebrow="Your notes" title="Cell Biology — Chapter 4">
      <div className="grid h-full grid-rows-[1fr_auto] gap-3">
        <div className="space-y-2 overflow-hidden">
          {sections.map((t, i) => (
            <div
              key={t}
              className="flex items-center gap-2 rounded-lg border bg-background/70 p-2.5"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-secondary text-[10px] font-bold">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-medium">{t}</div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-primary/50"
                    style={{ width: `${70 - i * 18}%` }}
                  />
                </div>
              </div>
              {i === 0 && (
                <span className="rounded bg-yellow-300/60 px-1.5 py-0.5 text-[9px] font-medium text-yellow-900">
                  highlighted
                </span>
              )}
            </div>
          ))}
        </div>
        <button
          className={cn(
            "flex items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-xs font-bold text-primary-foreground transition-transform sm:text-sm",
            active && "animate-pulse-dot",
          )}
        >
          <Zap className="h-4 w-4" /> Turn this into a game
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </SceneShell>
  );
}

/* 2 ─ The material, now a game — live score climbing. */
function PlayScene({ active }: { active: boolean }) {
  const target = 90;
  const [score, setScore] = React.useState(0);
  const [picked, setPicked] = React.useState(false);

  React.useEffect(() => {
    if (!active) {
      setScore(0);
      setPicked(false);
      return;
    }
    const p = setTimeout(() => setPicked(true), 900);
    const start = performance.now();
    let raf = 0;
    const run = (now: number) => {
      const t = Math.min(1, (now - start) / 1600);
      setScore(Math.round(target * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(run);
    };
    const s = setTimeout(() => {
      raf = requestAnimationFrame(run);
    }, 900);
    return () => {
      clearTimeout(p);
      clearTimeout(s);
      cancelAnimationFrame(raf);
    };
  }, [active]);

  const choices = ["Ribosomes", "Mitochondria", "Nucleus", "Golgi body"];
  return (
    <SceneShell eyebrow="Quiz Rush" title="Play the material">
      <div className="flex h-full flex-col">
        <div className="mb-2 flex items-center justify-between">
          <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold">
            <Zap className="h-3 w-3 text-accent-2" /> Round 1
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5 text-xs font-bold tabular-nums">
            <Star className="h-3.5 w-3.5 text-yellow-500" /> {score}
          </span>
        </div>
        <div className="rounded-xl border bg-background/70 p-3">
          <div className="text-xs font-semibold sm:text-sm">
            Which organelle powers the cell?
          </div>
          <div className="mt-2 grid grid-cols-2 gap-1.5">
            {choices.map((c) => {
              const correct = c === "Mitochondria";
              return (
                <div
                  key={c}
                  className={cn(
                    "rounded-lg border px-2 py-1.5 text-[11px] transition-colors sm:text-xs",
                    picked && correct
                      ? "border-green-500 bg-green-500/10 font-semibold text-green-700 dark:text-green-400"
                      : "bg-background",
                  )}
                >
                  {c}
                  {picked && correct && (
                    <Check className="ml-1 inline h-3 w-3" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div className="mt-auto pt-3 text-center text-[10px] text-muted-foreground sm:text-xs">
          Same notes. Six games. Every replay makes it stick.
        </div>
      </div>
    </SceneShell>
  );
}

/* 3 ─ Score becomes points; a badge unlocks. */
function RewardScene({ active }: { active: boolean }) {
  return (
    <SceneShell eyebrow="You earned it" title="Score → points → rank">
      <div className="grid h-full grid-rows-[auto_1fr] gap-3">
        <div className="grid grid-cols-3 gap-2">
          <Stat icon={<Star className="h-4 w-4 text-yellow-500" />} label="This run" value="+27" />
          <Stat icon={<Flame className="h-4 w-4 text-accent-2" />} label="Streak" value="7d" />
          <Stat icon={<Trophy className="h-4 w-4 text-primary" />} label="Rank" value="Scholar" />
        </div>
        <div className="rounded-xl border bg-background/70 p-3">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-medium">Explorer</span>
            <span className="text-muted-foreground">Scholar</span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-secondary">
            <div
              className={cn(
                "h-full rounded-full bg-primary transition-[width] duration-1000 ease-out",
                active ? "w-[86%]" : "w-[40%]",
              )}
            />
          </div>
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-accent-2/10 p-2">
            <span
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full bg-background transition-transform",
                active && "animate-pop",
              )}
            >
              <CertificateSeal className="h-7 w-7 text-orange-500" />
            </span>
            <div>
              <div className="text-[11px] font-bold">Badge unlocked</div>
              <div className="text-[10px] text-muted-foreground">
                Week Warrior · 7-day streak
              </div>
            </div>
            <span className="ml-auto rounded-full bg-green-500/15 px-2 py-0.5 text-[9px] font-bold uppercase text-green-600">
              New
            </span>
          </div>
        </div>
      </div>
    </SceneShell>
  );
}

/* 4 ─ A shareable progress card. */
function ShareScene({ active }: { active: boolean }) {
  return (
    <SceneShell eyebrow="Show it off" title="Share your progress">
      <div className="flex h-full flex-col items-center justify-center gap-3">
        <div
          className={cn(
            "w-full max-w-[16rem] rounded-2xl border-2 bg-gradient-to-br from-primary/10 to-accent-2/10 p-4 text-center transition-all duration-500",
            active ? "scale-100 opacity-100" : "scale-95 opacity-0",
          )}
        >
          <div className="flex items-center justify-center gap-1.5">
            <Pip size={22} />
            <span className="text-xs font-bold">PlayStudy</span>
          </div>
          <div className="mt-2 flex items-center justify-center gap-3">
            <CertificateSeal className="h-12 w-10 text-violet-500" />
            <div className="text-left">
              <div className="text-lg font-extrabold leading-none">Scholar</div>
              <div className="text-[10px] text-muted-foreground">Alex R.</div>
            </div>
          </div>
          <div className="mt-3 flex justify-center gap-3 text-[10px]">
            <span className="inline-flex items-center gap-1 font-semibold">
              <Star className="h-3 w-3 text-yellow-500" /> 640 pts
            </span>
            <span className="inline-flex items-center gap-1 font-semibold">
              <Flame className="h-3 w-3 text-accent-2" /> 7-day streak
            </span>
          </div>
        </div>
        <button className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background">
          <Share2 className="h-3.5 w-3.5" /> Share progress
        </button>
        <div className="text-[10px] text-muted-foreground">
          A public card friends and classmates can see — no login needed.
        </div>
      </div>
    </SceneShell>
  );
}

/* 5 ─ A parent/teacher watching over the shoulder. */
function WatchScene({ active }: { active: boolean }) {
  const students = [
    { name: "Alex R.", pct: 86, acc: "92%" },
    { name: "Sam T.", pct: 61, acc: "78%" },
  ];
  return (
    <SceneShell eyebrow="For parents & teachers" title="Someone's cheering you on">
      <div className="flex h-full flex-col gap-2">
        <div className="inline-flex w-fit items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-[10px] font-medium">
          <Eye className="h-3 w-3 text-primary" /> Supervisor view
        </div>
        {students.map((s, i) => (
          <div
            key={s.name}
            className="flex items-center gap-3 rounded-xl border bg-background/70 p-2.5"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
              {s.name[0]}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">{s.name}</span>
                <span className="text-[10px] text-muted-foreground">
                  {s.acc} accuracy
                </span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary transition-[width] duration-1000 ease-out"
                  style={{ width: active ? `${s.pct}%` : "0%" }}
                />
              </div>
            </div>
            {i === 0 && (
              <span className="rounded-full bg-green-500/15 px-2 py-0.5 text-[9px] font-bold text-green-600">
                on track
              </span>
            )}
          </div>
        ))}
        <div className="mt-auto rounded-lg bg-secondary/60 p-2 text-center text-[10px] text-muted-foreground">
          Assign content, watch progress, celebrate the wins together.
        </div>
      </div>
    </SceneShell>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border bg-background/70 p-2.5 text-center">
      <div className="flex items-center justify-center">{icon}</div>
      <div className="mt-1 text-sm font-extrabold leading-none">{value}</div>
      <div className="mt-0.5 text-[9px] uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
    </div>
  );
}
