import Link from "next/link";
import { Gamepad2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { GameManifestEntry } from "@/lib/types";

const TONES = [
  "bg-pastel-lime",
  "bg-pastel-sky",
  "bg-pastel-peach",
  "bg-pastel-lavender",
  "bg-pastel-mint",
];

export function GameCard({
  game,
  index = 0,
  studySetId,
}: {
  game: GameManifestEntry;
  index?: number;
  studySetId?: string;
}) {
  const tone = TONES[index % TONES.length];
  const href = studySetId
    ? `/games/${game.slug}?set=${studySetId}`
    : `/games/${game.slug}`;
  return (
    <Link href={href} className="group block">
      <Card
        className={`flex aspect-[4/3] flex-col justify-between ${tone} border-none p-4 text-black transition-transform group-hover:-translate-y-0.5`}
      >
        <div className="text-2xl">{game.emoji ?? <Gamepad2 className="h-6 w-6" />}</div>
        <div>
          <div className="font-semibold leading-tight">{game.name}</div>
          {game.difficulty && (
            <div className="text-xs capitalize text-black/60">
              {game.difficulty}
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}
