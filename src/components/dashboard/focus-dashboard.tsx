"use client";

import Link from "next/link";
import { Plus, FileText } from "lucide-react";
import { DoodleStar, DoodleFlame, DoodleTrophy } from "@/components/doodles";
import { useSession } from "@/components/app/session-provider";
import { asList } from "@/lib/use-api";
import type { GameManifestEntry } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StudySetCard } from "@/components/app/study-set-card";
import { GameCard } from "@/components/app/game-card";
import { EmptyState } from "@/components/app/empty-state";
import { StudyTimer } from "./study-timer";
import { DashboardLearningPath } from "./learning-path";
import { ActivityOverview } from "@/components/charts/activity-overview";
import { ExamReminder } from "@/components/exam/exam-reminder";
import {
  useDashboardData,
  DashboardHero,
  CountUp,
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
      <DashboardHero name={me?.user.name} />

      <ExamReminder />

      {/* Study timer pinned to the top */}
      <StudyTimer />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatTile
          icon={<DoodleStar className="h-7 w-7" />}
          label="Points"
          value={rewards ? <CountUp value={rewards.points} /> : "—"}
        />
        <StatTile
          icon={<DoodleFlame className="h-7 w-7" />}
          label="Day streak"
          value={rewards ? <CountUp value={rewards.streak} /> : "—"}
        />
        {/* Rank + progress-to-next live in one tile, not a whole row */}
        <StatTile
          icon={<DoodleTrophy className="h-7 w-7" />}
          label="Rank"
          value={rewards ? rewards.rank.name : "—"}
          sub={
            rewards?.nextRank ? (
              <>
                <Progress
                  className="h-1.5"
                  value={Math.round((rewards.rankProgress || 0) * 100)}
                />
                <div className="mt-1 text-xs text-muted-foreground">
                  {rewards.pointsToNextRank.toLocaleString()} pts to{" "}
                  {rewards.nextRank.name}
                </div>
              </>
            ) : undefined
          }
        />
      </div>

      <ActivityOverview />

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
