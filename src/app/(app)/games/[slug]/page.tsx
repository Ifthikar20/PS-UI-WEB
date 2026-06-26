"use client";

import * as React from "react";
import { use } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { GameHost } from "@/components/games/game-host";
import type { Paginated, GameManifestEntry, StudySet } from "@/lib/types";

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
        const manifest = await api.get<Paginated<GameManifestEntry>>("games/");
        const found =
          manifest.results.find((g) => g.slug === slug) ?? null;
        if (cancelled) return;
        if (!found) {
          setError("Game not found.");
          setLoading(false);
          return;
        }
        setGame(found);
        if (setId) {
          try {
            const set = await api.get<StudySet>(`studysets/${setId}/`);
            if (!cancelled) setStudySet(set);
          } catch {
            /* play without a study set */
          }
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
    <div className="mx-auto max-w-3xl space-y-4">
      <Button variant="ghost" size="sm" asChild className="-ml-2 w-fit">
        <Link href="/games">
          <ArrowLeft className="h-4 w-4" /> Back to games
        </Link>
      </Button>

      {loading ? (
        <Skeleton className="aspect-video w-full" />
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
        </>
      ) : null}
    </div>
  );
}
