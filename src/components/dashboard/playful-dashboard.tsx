"use client";

import Link from "next/link";
import { Plus, FileText, Sparkles } from "lucide-react";
import { DoodleStar, DoodleFlame } from "@/components/doodles";
import { useSession } from "@/components/app/session-provider";
import { asList } from "@/lib/use-api";
import type { GameManifestEntry } from "@/lib/types";
import { Pip } from "@/components/pip";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StudySetCard } from "@/components/app/study-set-card";
import { GameCard } from "@/components/app/game-card";
import { EmptyState } from "@/components/app/empty-state";
import { ExamReminder } from "@/components/exam/exam-reminder";
import {
  useDashboardData,
  greeting,
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
      <Card className="brand-wash overflow-hidden border-2">
        <CardContent className="flex flex-col items-center gap-6 p-8 text-center sm:flex-row sm:text-left">
          <span className="rounded-[2rem] bg-background/70 p-3 shadow-sm">
            <Pip size={84} />
          </span>
          <div className="flex-1">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              {greeting(me?.user.name)}
            </h1>
            <p className="mt-1 text-muted-foreground">
              Ready to learn something new today?
            </p>
          </div>
          <Button size="lg" asChild>
            <Link href="/study/new">
              <Plus className="h-5 w-5" /> New study set
            </Link>
          </Button>
        </CardContent>
      </Card>

      <ExamReminder />

      {/* Colorful stat cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-none bg-pastel-lime text-black">
          <CardContent className="flex items-center gap-4 p-6">
            <DoodleStar className="h-10 w-10" />
            <div>
              <div className="text-sm">Points</div>
              <div className="text-2xl font-extrabold">
                {rewards ? rewards.points.toLocaleString() : "—"}
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
                {rewards?.streak ?? 0} day{(rewards?.streak ?? 0) === 1 ? "" : "s"}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none bg-pastel-sky text-black">
          <CardContent className="flex items-center gap-4 p-6">
            <Sparkles className="h-8 w-8" />
            <div>
              <div className="text-sm">Rank</div>
              <div className="text-2xl font-extrabold">
                {rewards ? rewards.rank.name : "—"}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {rewards?.nextRank && (
        <Card className="border-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between text-sm font-semibold">
              <span>{rewards.rank.name}</span>
              <span className="text-muted-foreground">{rewards.nextRank.name}</span>
            </div>
            <Progress
              className="mt-3 h-3"
              value={Math.round((rewards.rankProgress || 0) * 100)}
            />
            <p className="mt-2 text-sm text-muted-foreground">
              {rewards.pointsToNextRank.toLocaleString()} points to{" "}
              {rewards.nextRank.name}
            </p>
          </CardContent>
        </Card>
      )}

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
