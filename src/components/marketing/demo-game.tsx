"use client";

import * as React from "react";
import { Play, RotateCcw } from "lucide-react";
import { gameBundleUrl } from "@/lib/games";

const GAMES_BASE_URL =
  process.env.NEXT_PUBLIC_GAMES_BASE_URL ?? "http://localhost:8000";

/** A tiny general-knowledge set so the demo's answer-to-revive works. */
const DEMO_QUIZ = [
  {
    prompt: "What does a plant need for photosynthesis?",
    choices: ["Sunlight, water & CO₂", "Only soil", "Moonlight", "Pure oxygen"],
    correctIndex: 0,
  },
  {
    prompt: "7 × 8 = ?",
    choices: ["54", "56", "63", "48"],
    correctIndex: 1,
  },
  {
    prompt: "Which planet is closest to the sun?",
    choices: ["Venus", "Earth", "Mercury", "Mars"],
    correctIndex: 2,
  },
  {
    prompt: "H₂O is better known as…",
    choices: ["Salt", "Hydrogen", "Sugar", "Water"],
    correctIndex: 3,
  },
];

/**
 * The landing page's playable demo: the real Flappy Pip bundle — the exact
 * file the app and the mobile WebView run — embedded in an arcade-cabinet
 * frame with a sample question set. Mounted only after "Insert coin" so the
 * landing stays light until the visitor opts in.
 */
export function DemoGame() {
  const [on, setOn] = React.useState(false);
  const [score, setScore] = React.useState(0);
  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  const src = React.useMemo(
    () =>
      gameBundleUrl({ slug: "flappy", version: "1" }, GAMES_BASE_URL, {
        quiz: DEMO_QUIZ,
      }),
    [],
  );

  // Listen for score events from the demo bundle (same SDK contract as the app).
  React.useEffect(() => {
    if (!on) return;
    function onMessage(ev: MessageEvent) {
      if (ev.source !== iframeRef.current?.contentWindow) return;
      let data: any = ev.data;
      if (typeof data === "string") {
        try {
          data = JSON.parse(data);
        } catch {
          return;
        }
      }
      if (data?.type === "score" || data?.type === "gameover") {
        setScore(Number(data.score) || 0);
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [on]);

  return (
    <div className="mx-auto w-full max-w-3xl">
      {/* cabinet */}
      <div className="rounded-[28px] bg-zinc-900 p-3 shadow-2xl ring-1 ring-black/40 dark:bg-zinc-800">
        {/* marquee strip */}
        <div className="mb-3 flex items-center justify-between rounded-2xl bg-gradient-to-r from-primary/80 via-primary to-accent-2/80 px-5 py-2.5">
          <span className="text-sm font-black uppercase tracking-widest text-white">
            🐤 Flappy Pip
          </span>
          <span className="rounded-full bg-black/30 px-3 py-0.5 text-xs font-bold tabular-nums text-white">
            Score {score}
          </span>
        </div>
        {/* screen */}
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-black">
          {on ? (
            <iframe
              ref={iframeRef}
              src={src}
              title="Flappy Pip demo"
              className="h-full w-full"
              sandbox="allow-scripts allow-pointer-lock"
              allow="autoplay"
            />
          ) : (
            <button
              onClick={() => setOn(true)}
              className="group absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[radial-gradient(80%_80%_at_50%_30%,rgba(107,92,231,.35),transparent)]"
            >
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/40 transition-transform group-hover:scale-110">
                <Play className="h-9 w-9 fill-current pl-1" />
              </span>
              <span className="animate-pulse text-sm font-black uppercase tracking-[0.3em] text-white">
                Insert coin — play free
              </span>
              <span className="max-w-xs text-center text-xs text-white/60">
                Tap or press Space to flap. Crash? Answer a question to revive —
                that&apos;s the whole idea.
              </span>
            </button>
          )}
        </div>
        {/* control deck */}
        <div className="mt-3 flex items-center justify-between rounded-2xl bg-zinc-800 px-5 py-3 dark:bg-zinc-700/60">
          <div className="flex items-center gap-2">
            <span className="h-8 w-8 rounded-full bg-accent-2 shadow-inner" />
            <span className="h-8 w-8 rounded-full bg-primary shadow-inner" />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
            Space / tap to flap · answers revive you
          </span>
          {on ? (
            <button
              onClick={() => {
                setOn(false);
                setScore(0);
                requestAnimationFrame(() => setOn(true));
              }}
              className="inline-flex items-center gap-1.5 rounded-full bg-zinc-700 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-zinc-600 dark:bg-zinc-600"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset
            </button>
          ) : (
            <span className="h-7 w-14 rounded-md bg-zinc-700 dark:bg-zinc-600" />
          )}
        </div>
      </div>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        This is the real in-app game — in PlayStudy the questions come from
        <em> your</em> notes.
      </p>
    </div>
  );
}
