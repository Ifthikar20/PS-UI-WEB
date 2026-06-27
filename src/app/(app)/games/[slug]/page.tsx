"use client";

import * as React from "react";
import { use } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { api } from "@/lib/api";
import { asList } from "@/lib/use-api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { GameHost } from "@/components/games/game-host";
import { GameControls } from "@/components/games/controls";
import type { GameManifestEntry, StudySet, Paginated } from "@/lib/types";

const GAMES_BASE_URL =
  process.env.NEXT_PUBLIC_GAMES_BASE_URL ?? "http://localhost:8000";

export default function GameDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const search = useSearchParams();
  const setId = search.get("set");

  const [game, setGame] = React.useState<GameManifestEntry | null>(null);
  const [studySet, setStudySet] = React.useState<StudySet | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const manifest = await api.get<GameManifestEntry[]>("games/");
        const found =
          asList<GameManifestEntry>(manifest).find((g) => g.slug === slug) ?? null;
        if (cancelled) return;
        if (!found) {
          setError("Game not found.");
          setLoading(false);
          return;
        }
        setGame(found);
        // Load the chosen study set, or fall back to the most recent ready
        // one so the game always launches with real questions to play.
        try {
          let set: StudySet | null = null;
          if (setId) {
            set = await api.get<StudySet>(`studysets/${setId}/`);
          } else {
            const sets = await api.get<Paginated<StudySet>>(
              "studysets/?status=ready",
            );
            const ready = (sets.results ?? []).find(
              (s) => s.status === "ready" && (s.quiz?.length || s.wordGame?.length),
            );
            if (ready) set = await api.get<StudySet>(`studysets/${ready.id}/`);
          }
          if (!cancelled && set) setStudySet(set);
        } catch {
          /* play without a study set */
        }
      } catch {
        if (!cancelled) setError("Failed to load game.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug, setId]);

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <Button variant="ghost" size="sm" asChild className="-ml-2 w-fit">
        <Link href="/games">
          <ArrowLeft className="h-4 w-4" /> Back to games
        </Link>
      </Button>

      {loading ? (
        <Skeleton className="h-[78vh] min-h-[560px] w-full" />
      ) : error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : game ? (
        <>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{game.name}</h1>
            {studySet && (
              <p className="text-sm text-muted-foreground">
                Playing with “{studySet.title}”
              </p>
            )}
          </div>
          <GameHost
            game={game}
            studySet={studySet}
            gamesBaseUrl={GAMES_BASE_URL}
          />
          {/* Per-game controls */}
          <div className="rounded-xl border bg-card p-4">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Controls
            </div>
            <GameControls slug={game.slug} />
          </div>
        </>
      ) : null}
    </div>
  );
}
