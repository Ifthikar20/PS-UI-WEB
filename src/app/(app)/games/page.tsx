"use client";

import { Gamepad2 } from "lucide-react";
import { useApi, asList } from "@/lib/use-api";
import { GameCard } from "@/components/app/game-card";
import { EmptyState } from "@/components/app/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import type { GameManifestEntry } from "@/lib/types";

export default function GamesPage() {
  const games = useApi<GameManifestEntry[]>("games/");
  const list = asList<GameManifestEntry>(games.data);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Games</h1>
        <p className="mt-1 text-muted-foreground">
          Pick a game — launch it with a study set to play with your own
          questions.
        </p>
      </div>

      {games.loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[4/3] w-full" />
          ))}
        </div>
      ) : list.length === 0 ? (
        <EmptyState
          icon={Gamepad2}
          title="No games available"
          description="Games will appear here once they're enabled for your account."
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {list.map((g, i) => (
            <GameCard key={g.key} game={g} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
