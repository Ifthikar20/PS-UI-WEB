import Link from "next/link";
import { Gamepad2 } from "lucide-react";
import { coverGradient } from "@/lib/games";
import { GameControls } from "@/components/games/controls";
import { cn } from "@/lib/utils";
import type { GameManifestEntry } from "@/lib/types";

/** Retro arcade tile: CRT-style cover + title + the game's control scheme. */
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

  return (
    <Link href={href} className="group block">
      <div className="overflow-hidden rounded-2xl border bg-card shadow-sm transition-all group-hover:-translate-y-0.5 group-hover:shadow-md">
        {/* CRT cover */}
        <div
          className="relative aspect-[4/3] w-full"
          style={{ backgroundImage: coverGradient(game.coverColors) }}
        >
          {/* scanlines */}
          <div
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, rgba(0,0,0,.25) 0px, rgba(0,0,0,.25) 1px, transparent 1px, transparent 3px)",
            }}
          />
          {/* vignette */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_0%,transparent_55%,rgba(0,0,0,.28))]" />
          {/* emoji / glyph */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl drop-shadow-[0_2px_6px_rgba(0,0,0,.35)]">
              {game.emoji ?? <Gamepad2 className="h-9 w-9 text-white" />}
            </span>
          </div>
          {game.difficulty && (
            <span className="absolute right-2 top-2 rounded-full bg-black/45 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur">
              {game.difficulty}
            </span>
          )}
        </div>

        {/* meta */}
        <div className="space-y-2 p-3">
          <div>
            <div className="truncate font-semibold leading-tight">{game.name}</div>
            <div className="text-[11px] text-muted-foreground">PlayStudy Arcade</div>
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
