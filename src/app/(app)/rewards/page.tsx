"use client";

import { Flame, Star } from "lucide-react";
import { useSession } from "@/components/app/session-provider";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ActivityOverview } from "@/components/charts/activity-overview";
import { cn } from "@/lib/utils";

// Rank ladder mirrored from the mobile app (lib/core/rewards/rewards_bloc.dart).
const RANKS = [
  { name: "Novice", emoji: "🌱", threshold: 0 },
  { name: "Explorer", emoji: "🧭", threshold: 100 },
  { name: "Scholar", emoji: "📖", threshold: 300 },
  { name: "Strategist", emoji: "🧠", threshold: 600 },
  { name: "Sage", emoji: "📚", threshold: 1000 },
  { name: "Master", emoji: "🎓", threshold: 1500 },
  { name: "Legend", emoji: "🏆", threshold: 2200 },
];

export default function RewardsPage() {
  const { me } = useSession();
  const r = me?.rewards;
  const points = r?.points ?? 0;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Rewards
        </h1>
        <p className="mt-1 text-muted-foreground">
          Keep your streak alive and climb the ranks.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
              <Star className="h-6 w-6" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Total points</div>
              <div className="text-2xl font-bold">
                {points.toLocaleString()}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
              <Flame className="h-6 w-6" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Day streak</div>
              <div className="text-2xl font-bold">{r?.streak ?? 0}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <ActivityOverview />

      {r?.nextRank && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">
                {r.rank.emoji} {r.rank.name}
              </span>
              <span className="text-muted-foreground">
                {r.pointsToNextRank.toLocaleString()} to {r.nextRank.emoji}{" "}
                {r.nextRank.name}
              </span>
            </div>
            <Progress
              className="mt-3"
              value={Math.round((r.rankProgress || 0) * 100)}
            />
          </CardContent>
        </Card>
      )}

      <div>
        <h2 className="mb-3 text-lg font-semibold">All ranks</h2>
        <div className="space-y-2">
          {RANKS.map((rank) => {
            const reached = points >= rank.threshold;
            const current = r?.rank.name === rank.name;
            return (
              <div
                key={rank.name}
                className={cn(
                  "flex items-center justify-between rounded-xl border p-4",
                  current && "border-primary",
                  !reached && "opacity-60",
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{rank.emoji}</span>
                  <span className="font-medium">{rank.name}</span>
                  {current && <span className="text-xs text-muted-foreground">Current</span>}
                </div>
                <span className="text-sm text-muted-foreground">
                  {rank.threshold.toLocaleString()} pts
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
