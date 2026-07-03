"use client";

import * as React from "react";
import Link from "next/link";
import { RotateCcw, Gamepad2, BookOpen, Trophy, Star, Zap } from "lucide-react";
import { api } from "@/lib/api";
import { gameBundleUrl, payloadFromStudySet } from "@/lib/games";
import { GamePoster } from "@/components/games/posters";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { GameManifestEntry, StudySet } from "@/lib/types";

/** Local best-score store, per game + study set (a personal challenge target). */
export function bestScoreKey(gameKey: string, setId?: string | null) {
  return `ps_best:${gameKey}:${setId ?? "any"}`;
}
export function readBestScore(gameKey: string, setId?: string | null): number {
  try {
    return Number(localStorage.getItem(bestScoreKey(gameKey, setId))) || 0;
  } catch {
    return 0;
  }
}

/**
 * Web game host — the browser counterpart of the mobile app's iframe host
 * (lib/features/games/host/game_host_view_web.dart). It embeds the same HTML
 * game bundle in a sandboxed iframe and speaks the identical PlayStudy SDK
 * postMessage contract, so games run unchanged across mobile and web.
 *
 * On top of the raw bundle it adds the platform's session loop: rounds, a
 * personal-best target, and a game-over summary with a clear "next round"
 * progression — so playing feels like practice on a learning platform, not a
 * dead end at "game over".
 *
 * Security posture (the bundle is remote code):
 *   • sandbox="allow-scripts allow-pointer-lock" — no same-origin, no top nav.
 *   • inbound messages accepted only from this iframe's contentWindow.
 *   • init payload posted to the bundle's exact origin (never "*").
 */
export function GameHost({
  game,
  studySet,
  gamesBaseUrl,
}: {
  game: GameManifestEntry;
  studySet: StudySet | null;
  gamesBaseUrl: string;
}) {
  const iframeRef = React.useRef<HTMLIFrameElement>(null);
  const sessionId = React.useRef<string | null>(null);
  const payload = React.useMemo(
    () => payloadFromStudySet(studySet),
    [studySet],
  );
  const src = React.useMemo(
    () => gameBundleUrl(game, gamesBaseUrl, payload),
    [game, gamesBaseUrl, payload],
  );
  const origin = React.useMemo(() => {
    try {
      return new URL(src).origin;
    } catch {
      return "*";
    }
  }, [src]);

  const [score, setScore] = React.useState(0);
  const [status, setStatus] = React.useState<"loading" | "playing" | "over">(
    "loading",
  );
  const [round, setRound] = React.useState(1);
  const [best, setBest] = React.useState(0);
  const [newBest, setNewBest] = React.useState(false);
  const [pulse, setPulse] = React.useState(false);

  // Load the local personal best once the set is known.
  React.useEffect(() => {
    setBest(readBestScore(game.key, studySet?.id));
  }, [game.key, studySet?.id]);

  // Start a backend game session per round.
  React.useEffect(() => {
    let cancelled = false;
    sessionId.current = null;
    api
      .post<{ id: string }>("games/sessions/", {
        gameKey: game.key,
        studySetId: studySet?.id,
      })
      .then((s) => {
        if (!cancelled) sessionId.current = s.id;
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [game.key, studySet?.id, round]);

  const injectInit = React.useCallback(() => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ type: "init", payload }),
      origin,
    );
  }, [payload, origin]);

  // Bridge messages from the game bundle.
  React.useEffect(() => {
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
      if (!data || typeof data !== "object") return;

      switch (data.type) {
        case "ready":
          injectInit();
          setStatus("playing");
          break;
        case "score": {
          const n = Number(data.score) || 0;
          setScore(n);
          setPulse(true);
          setTimeout(() => setPulse(false), 250);
          if (sessionId.current) {
            api.patch(`games/sessions/${sessionId.current}/`, { score: n }).catch(() => {});
          }
          break;
        }
        case "reward":
          // The SDK reward reason is free-text; map it to a valid client-
          // reportable reason (the server recomputes and caps the points).
          api
            .post("rewards/activity/", {
              reason: "Super Dash checkpoint",
              context: { gameKey: game.key, reason: String(data.reason ?? "") },
            })
            .catch(() => {});
          break;
        case "gameover": {
          const n = Number(data.score) || 0;
          setScore(n);
          setStatus("over");
          setBest((prev) => {
            const isBest = n > prev;
            setNewBest(isBest);
            if (isBest) {
              try {
                localStorage.setItem(bestScoreKey(game.key, studySet?.id), String(n));
              } catch {
                /* ignore */
              }
              return n;
            }
            return prev;
          });
          if (sessionId.current) {
            api
              .post(`games/sessions/${sessionId.current}/complete/`, { score: n })
              .catch(() => {});
          }
          break;
        }
        case "error":
          api
            .post("games/telemetry/", {
              gameKey: game.key,
              version: game.version,
              kind: "error",
              message: String(data.message ?? ""),
            })
            .catch(() => {});
          break;
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [game.key, game.version, injectInit, studySet?.id]);

  // Next round: remount the iframe (fresh run), keep the best-score target.
  const nextRound = React.useCallback(() => {
    setScore(0);
    setNewBest(false);
    setStatus("loading");
    setRound((r) => r + 1);
  }, []);

  return (
    <div className="relative">
      {/* Session bar: round, live score, personal best */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-sm font-semibold">
          <Zap className="h-4 w-4 text-accent-2" /> Round {round}
        </span>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-sm font-semibold transition-transform",
            pulse && "scale-110",
          )}
        >
          <Star className="h-4 w-4 text-yellow-500" /> {score}
        </span>
        {best > 0 && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-sm font-semibold text-muted-foreground">
            <Trophy className="h-4 w-4 text-accent-2" /> Best {best}
          </span>
        )}
        {best > 0 && status === "playing" && score <= best && (
          <span className="text-sm text-muted-foreground">
            {best - score + 1} to beat your best
          </span>
        )}
      </div>

      <div className="relative h-[78vh] min-h-[560px] w-full overflow-hidden rounded-2xl border bg-black">
        <iframe
          key={round}
          ref={iframeRef}
          src={src}
          title={game.name}
          className="h-full w-full"
          sandbox="allow-scripts allow-pointer-lock"
          allow="autoplay; fullscreen; gamepad"
          onLoad={injectInit}
        />

        {/* Round summary — the platform loop: score → challenge → next round */}
        {status === "over" && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-3xl border bg-card p-8 text-center shadow-2xl">
              {newBest ? (
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-2/10">
                  <Trophy className="h-8 w-8 text-accent-2" />
                </div>
              ) : (
                <div className="mx-auto mb-3 h-16 w-24 overflow-hidden rounded-xl border">
                  <GamePoster slug={game.slug} coverColors={game.coverColors} />
                </div>
              )}
              <h2 className="text-xl font-bold">
                {newBest ? "New personal best!" : `Round ${round} complete`}
              </h2>
              <div className="mt-4 flex items-center justify-center gap-6">
                <div>
                  <div className="text-4xl font-extrabold tabular-nums">{score}</div>
                  <div className="mt-0.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Score
                  </div>
                </div>
                <div className="h-10 w-px bg-border" />
                <div>
                  <div className="text-4xl font-extrabold tabular-nums text-muted-foreground">
                    {best}
                  </div>
                  <div className="mt-0.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Best
                  </div>
                </div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                {newBest
                  ? "You raised the bar — can you defend it?"
                  : best > score
                    ? `${best - score + 1} more to beat your best.`
                    : "Every round makes the material stick a little more."}
              </p>
              <div className="mt-6 space-y-2">
                <Button size="lg" className="w-full text-base" onClick={nextRound}>
                  <RotateCcw className="h-5 w-5" /> Next round
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" asChild>
                    <Link href="/games">
                      <Gamepad2 className="h-4 w-4" /> Switch game
                    </Link>
                  </Button>
                  <Button variant="outline" asChild disabled={!studySet}>
                    <Link href={studySet ? `/study/${studySet.id}` : "/library"}>
                      <BookOpen className="h-4 w-4" /> Review notes
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
