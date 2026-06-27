"use client";

import * as React from "react";
import { api } from "@/lib/api";
import { gameBundleUrl, payloadFromStudySet } from "@/lib/games";
import type { GameManifestEntry, StudySet } from "@/lib/types";

/**
 * Web game host — the browser counterpart of the mobile app's iframe host
 * (lib/features/games/host/game_host_view_web.dart). It embeds the same HTML
 * game bundle in a sandboxed iframe and speaks the identical PlayStudy SDK
 * postMessage contract, so games run unchanged across mobile and web.
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

  // Start a backend game session once on mount.
  React.useEffect(() => {
    let cancelled = false;
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
  }, [game.key, studySet?.id]);

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
  }, [game.key, game.version, injectInit]);

  return (
    <div className="relative">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Score: <span className="font-semibold text-foreground">{score}</span>
        </div>
        {status === "over" && (
          <span className="text-sm font-semibold">Game over 🎉</span>
        )}
      </div>
      <div className="h-[78vh] min-h-[560px] w-full overflow-hidden rounded-2xl border bg-black">
        <iframe
          ref={iframeRef}
          src={src}
          title={game.name}
          className="h-full w-full"
          sandbox="allow-scripts allow-pointer-lock"
          allow="autoplay; fullscreen; gamepad"
          onLoad={injectInit}
        />
      </div>
    </div>
  );
}
