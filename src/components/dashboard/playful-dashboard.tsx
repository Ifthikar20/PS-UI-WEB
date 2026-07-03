"use client";

import Link from "next/link";
import { Plus, FileText, Sparkles } from "lucide-react";
import { DoodleStar, DoodleFlame } from "@/components/doodles";
import { useSession } from "@/components/app/session-provider";
import { asList } from "@/lib/use-api";
import type { GameManifestEntry } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StudySetCard } from "@/components/app/study-set-card";
import { GameCard } from "@/components/app/game-card";
import { EmptyState } from "@/components/app/empty-state";
import { ExamReminder } from "@/components/exam/exam-reminder";
import {
  useDashboardData,
  DashboardHero,
  CountUp,
  SectionHeader,
  CardGridSkeleton,
} from "./shared";

/** School & younger flavor: vivid, colorful, game-first. */
export function PlayfulDashboard() {
  const { me } = useSession();
  const { sets, games } = useDashboardData();
  const rewards = me?.rewards;
  const recent = sets.data?.results?.slice(0, 4) ?? [];
  const gameList = asList<GameManifestEntry>(games.data).slice(0, 6);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Big friendly hero with Pip */}
      <DashboardHero name={me?.user.name} big />

      <ExamReminder />

      {/* Colorful stat cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-none bg-pastel-lime text-black">
          <CardContent className="flex items-center gap-4 p-6">
            <DoodleStar className="h-10 w-10" />
            <div>
              <div className="text-sm">Points</div>
              <div className="text-2xl font-extrabold">
                {rewards ? <CountUp value={rewards.points} /> : "—"}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none bg-pastel-peach text-black">
          <CardContent className="flex items-center gap-4 p-6">
            <DoodleFlame className="h-10 w-10" />
            <div>
              <div className="text-sm">Streak</div>
              <div className="text-2xl font-extrabold">
                {rewards ? <CountUp value={rewards.streak} /> : "—"}
                {" day"}
                {(rewards?.streak ?? 0) === 1 ? "" : "s"}
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Rank + progress-to-next in one card, not a whole extra row */}
        <Card className="border-none bg-pastel-sky text-black">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Sparkles className="h-8 w-8" />
              <div className="min-w-0 flex-1">
                <div className="text-sm">Rank</div>
                <div className="truncate text-2xl font-extrabold">
                  {rewards ? rewards.rank.name : "—"}
                </div>
              </div>
            </div>
            {rewards?.nextRank && (
              <>
                <Progress
                  className="mt-3 h-2 bg-black/10"
                  value={Math.round((rewards.rankProgress || 0) * 100)}
                />
                <p className="mt-1.5 text-xs text-black/60">
                  {rewards.pointsToNextRank.toLocaleString()} pts to{" "}
                  {rewards.nextRank.name}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Games front and center */}
      <section>
        <SectionHeader title="Games" href="/games" cta="All games" />
        {games.loading ? (
          <CardGridSkeleton />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {gameList.map((g, i) => (
              <GameCard key={g.key} game={g} index={i} />
            ))}
          </div>
        )}
      </section>

      <section>
        <SectionHeader title="Your study sets" href="/library" cta="View all" />
        {sets.loading ? (
          <CardGridSkeleton />
        ) : recent.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No study sets yet"
            description="Make your first one — it only takes a few seconds!"
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
    </div>
  );
}
