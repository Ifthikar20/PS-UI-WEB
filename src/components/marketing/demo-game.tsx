"use client";

import * as React from "react";
import { Play, RotateCcw } from "lucide-react";
import { gameBundleUrl } from "@/lib/games";
import { BirdGlyph } from "./glyphs";

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
 * The landing page's live demo: the real Flappy Pip bundle — the exact file
 * the app and the mobile WebView run — behind a quiet, modern player card.
 * The iframe mounts only after the visitor presses play, so the page stays
 * light until they opt in.
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
      <div className="overflow-hidden rounded-3xl border bg-card shadow-2xl shadow-black/[0.08] dark:shadow-black/40">
        {/* player header */}
        <div className="flex items-center justify-between border-b px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent-2/10">
              <BirdGlyph className="h-5 w-5 text-accent-2" />
            </span>
            <div>
              <div className="text-sm font-semibold leading-none">Flappy Pip</div>
              <div className="mt-0.5 text-[11px] text-muted-foreground">
                Live demo · the real in-app game
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full border px-3 py-1 text-xs font-semibold tabular-nums">
              Score {score}
            </span>
            {on && (
              <button
                onClick={() => {
                  setOn(false);
                  setScore(0);
                  requestAnimationFrame(() => setOn(true));
                }}
                aria-label="Restart demo"
                className="flex h-7 w-7 items-center justify-center rounded-full border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* screen */}
        <div className="relative aspect-[16/10] w-full bg-zinc-950">
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
              className="group absolute inset-0 flex flex-col items-center justify-center gap-5 bg-[radial-gradient(70%_70%_at_50%_35%,hsl(var(--primary)/0.3),transparent)]"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-zinc-900 shadow-xl transition-transform duration-300 group-hover:scale-110">
                <Play className="h-6 w-6 fill-current pl-0.5" />
              </span>
              <span className="text-sm font-medium text-white/80">
                Play the demo — no account needed
              </span>
            </button>
          )}
        </div>

        {/* footer strip */}
        <div className="flex items-center justify-between border-t px-5 py-3 text-xs text-muted-foreground">
          <span>Space or tap to flap · crash and a question revives you</span>
          <span className="hidden sm:block">In PlayStudy, the questions are yours</span>
        </div>
      </div>
    </div>
  );
}
