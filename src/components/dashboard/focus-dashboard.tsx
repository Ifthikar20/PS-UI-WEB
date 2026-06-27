"use client";

import Link from "next/link";
import { Plus, FileText, Trophy, Flame, Star } from "lucide-react";
import { useSession } from "@/components/app/session-provider";
import { asList } from "@/lib/use-api";
import type { GameManifestEntry } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StudySetCard } from "@/components/app/study-set-card";
import { GameCard } from "@/components/app/game-card";
import { EmptyState } from "@/components/app/empty-state";
import { StudyTimer } from "./study-timer";
import { DashboardLearningPath } from "./learning-path";
import {
  useDashboardData,
  greeting,
  SectionHeader,
  StatTile,
  CardGridSkeleton,
} from "./shared";

/** College / pink (rose) flavor: clean, stat-forward, study timer on top. */
export function FocusDashboard() {
  const { me } = useSession();
  const { sets, games } = useDashboardData();
  const rewards = me?.rewards;
  const recent = sets.data?.results?.slice(0, 4) ?? [];
  const gameList = asList<GameManifestEntry>(games.data).slice(0, 5);
  const pathSet = sets.data?.results?.find(
    (s) => s.status === "ready" && (s.sections?.length ?? 0) > 0,
  );

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {greeting(me?.user.name)}
          </h1>
          <p className="mt-1 text-muted-foreground">
            Stay focused — a little every day goes a long way.
          </p>
        </div>
        <Button asChild>
          <Link href="/study/new">
            <Plus className="h-4 w-4" /> New study set
          </Link>
        </Button>
      </div>

      {/* Study timer pinned to the top */}
      <StudyTimer />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatTile
          icon={<Star className="h-5 w-5" />}
          label="Points"
          value={rewards ? rewards.points.toLocaleString() : "—"}
        />
        <StatTile
          icon={<Flame className="h-5 w-5" />}
          label="Day streak"
          value={rewards ? String(rewards.streak) : "—"}
        />
        <StatTile
          icon={<Trophy className="h-5 w-5" />}
          label="Rank"
          value={rewards ? `${rewards.rank.emoji} ${rewards.rank.name}` : "—"}
        />
      </div>

      {rewards?.nextRank && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">
                {rewards.rank.emoji} {rewards.rank.name}
              </span>
              <span className="text-muted-foreground">
                {rewards.pointsToNextRank.toLocaleString()} pts to{" "}
                {rewards.nextRank.emoji} {rewards.nextRank.name}
              </span>
            </div>
            <Progress
              className="mt-3"
              value={Math.round((rewards.rankProgress || 0) * 100)}
            />
          </CardContent>
        </Card>
      )}

      {pathSet && <DashboardLearningPath set={pathSet} />}

      <section>
        <SectionHeader title="Recent study sets" href="/library" cta="View all" />
        {sets.loading ? (
          <CardGridSkeleton />
        ) : recent.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No study sets yet"
            description="Create your first study set from a link, file, or your notes."
            action={
              <Button asChild>
                <Link href="/study/new">
                  <Plus className="h-4 w-4" /> Create study set
                </Link>
              </Button>
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {recent.map((s, i) => (
              <StudySetCard key={s.id} set={s} index={i} />
            ))}
          </div>
        )}
      </section>

      <section>
        <SectionHeader title="Play & learn" href="/games" cta="All games" />
        {games.loading ? (
          <CardGridSkeleton />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {gameList.map((g, i) => (
              <GameCard key={g.key} game={g} index={i} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
