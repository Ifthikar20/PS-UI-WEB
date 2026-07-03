"use client";

import * as React from "react";
import Link from "next/link";
import { Trophy, Play } from "lucide-react";
import { readBestScore } from "@/components/games/game-host";
import { GamePoster } from "@/components/games/posters";
import { GameControls } from "@/components/games/controls";
import { cn } from "@/lib/utils";
import type { GameManifestEntry } from "@/lib/types";

/**
 * Arcade tile: custom poster art + what the game practices + your best score.
 * Framed as a practice station on a learning platform — the poster is a
 * truthful preview of play (drawn from the game's own canvas art), and the
 * meta row says what you'll practice and the score to beat.
 */
export function GameCard({
  game,
  index = 0,
  studySetId,
  showControls = true,
}: {
  game: GameManifestEntry;
  index?: number;
  studySetId?: string;
  showControls?: boolean;
}) {
  const href = studySetId
    ? `/games/${game.slug}?set=${studySetId}`
    : `/games/${game.slug}`;

  // Personal best is device-local; read after mount to stay SSR-safe.
  const [best, setBest] = React.useState(0);
  React.useEffect(() => {
    setBest(readBestScore(game.key, studySetId));
  }, [game.key, studySetId]);

  return (
    <Link href={href} className="group block">
      <div className="overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-200 group-hover:-translate-y-1 group-hover:border-primary/40 group-hover:shadow-lg">
        {/* poster cover */}
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <div className="h-full w-full transition-transform duration-300 group-hover:scale-[1.04]">
            <GamePoster slug={game.slug} coverColors={game.coverColors} />
          </div>
          {/* scanlines keep the retro-cabinet feel */}
          <div
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, rgba(0,0,0,.25) 0px, rgba(0,0,0,.25) 1px, transparent 1px, transparent 3px)",
            }}
          />
          {/* vignette */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_0%,transparent_60%,rgba(0,0,0,.25))]" />
          {/* hover play affordance */}
          <div className="absolute inset-x-0 bottom-2 flex justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
              <Play className="h-3 w-3 fill-current" /> Play
            </span>
          </div>
          {game.difficulty && (
            <span className="absolute right-2 top-2 rounded-full bg-black/45 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur">
              {game.difficulty}
            </span>
          )}
          {best > 0 && (
            <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/45 px-2 py-0.5 text-[10px] font-bold text-amber-300 backdrop-blur">
              <Trophy className="h-3 w-3" /> {best}
            </span>
          )}
        </div>

        {/* meta */}
        <div className="space-y-2 p-3">
          <div>
            <div className="truncate font-semibold leading-tight">{game.name}</div>
            {game.description && (
              <div className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-muted-foreground">
                {game.description}
              </div>
            )}
          </div>
          {showControls && (
            <div className="border-t pt-2">
              <GameControls slug={game.slug} compact className={cn("gap-x-2")} />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
