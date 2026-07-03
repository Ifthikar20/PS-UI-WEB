"use client";

import {
  DoodleStar,
  DoodleFlame,
  DoodleTrophy,
  DoodleClock,
  DoodleBook,
  DoodleTarget,
  DoodleSpark,
  DoodleCheck,
} from "@/components/doodles";
import { cn } from "@/lib/utils";
import type { CredStats } from "./certificates";

type BadgeDef = {
  id: string;
  name: string;
  how: string;
  Icon: React.ComponentType<{ className?: string }>;
  earned: (s: CredStats) => boolean;
};

const BADGES: BadgeDef[] = [
  { id: "first", name: "First Steps", how: "Earn your first points", Icon: DoodleStar, earned: (s) => s.points >= 1 },
  { id: "warmup", name: "Warm-Up", how: "3-day streak", Icon: DoodleFlame, earned: (s) => s.streak >= 3 },
  { id: "week", name: "Week Warrior", how: "7-day streak", Icon: DoodleTrophy, earned: (s) => s.streak >= 7 },
  { id: "unstoppable", name: "Unstoppable", how: "30-day streak", Icon: DoodleClock, earned: (s) => s.streak >= 30 },
  { id: "bookworm", name: "Bookworm", how: "Create 3 study sets", Icon: DoodleBook, earned: (s) => s.studySets >= 3 },
  { id: "sharpshooter", name: "Sharpshooter", how: "Finish an exam plan", Icon: DoodleTarget, earned: (s) => s.examsCompleted >= 1 },
  { id: "collector", name: "Collector", how: "Earn 500 points", Icon: DoodleSpark, earned: (s) => s.points >= 500 },
  { id: "master", name: "Master", how: "Earn 1,500 points", Icon: DoodleCheck, earned: (s) => s.points >= 1500 },
];

export function BadgeGrid({ stats }: { stats: CredStats }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {BADGES.map((b) => {
        const earned = b.earned(stats);
        return (
          <div
            key={b.id}
            className={cn(
              "flex flex-col items-center rounded-xl border p-4 text-center",
              earned ? "bg-card" : "border-dashed opacity-50",
            )}
            title={b.how}
          >
            <span
              className={cn(
                "flex h-14 w-14 items-center justify-center rounded-full",
                earned ? "bg-secondary ring-2 ring-primary/40" : "bg-secondary/50",
              )}
            >
              <b.Icon className={cn("h-9 w-9", !earned && "grayscale")} />
            </span>
            <span className="mt-2 text-sm font-medium">{b.name}</span>
            <span className="mt-0.5 text-[11px] text-muted-foreground">
              {b.how}
            </span>
          </div>
        );
      })}
    </div>
  );
}
