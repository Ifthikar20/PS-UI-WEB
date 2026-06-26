"use client";

import Link from "next/link";
import { Plus, FileText, ArrowRight, Trophy, Flame, Star } from "lucide-react";
import { useSession } from "@/components/app/session-provider";
import { useApi } from "@/lib/use-api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { StudySetCard } from "@/components/app/study-set-card";
import { GameCard } from "@/components/app/game-card";
import { EmptyState } from "@/components/app/empty-state";
import type { Paginated, StudySet, GameManifestEntry } from "@/lib/types";

export default function DashboardPage() {
  const { me } = useSession();
  const sets = useApi<Paginated<StudySet>>("studysets/");
  const games = useApi<Paginated<GameManifestEntry>>("games/");

  const firstName = me?.user.name?.split(" ")[0] || "there";
  const rewards = me?.rewards;
  const recent = sets.data?.results?.slice(0, 4) ?? [];
  const gameList = games.data?.results?.slice(0, 5) ?? [];

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Greeting */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Hi {firstName} 👋
          </h1>
          <p className="mt-1 text-muted-foreground">
            Ready to turn something new into a study set?
          </p>
        </div>
        <Button asChild>
          <Link href="/study/new">
            <Plus className="h-4 w-4" /> New study set
          </Link>
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={<Star className="h-5 w-5" />}
          label="Points"
          value={rewards ? rewards.points.toLocaleString() : "—"}
        />
        <StatCard
          icon={<Flame className="h-5 w-5" />}
          label="Day streak"
          value={rewards ? String(rewards.streak) : "—"}
        />
        <StatCard
          icon={<Trophy className="h-5 w-5" />}
          label="Rank"
          value={rewards ? `${rewards.rank.emoji} ${rewards.rank.name}` : "—"}
        />
      </div>

      {/* Rank progress */}
      {rewards && rewards.nextRank && (
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

      {/* Recent study sets */}
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

      {/* Games */}
      <section>
        <SectionHeader title="Play & learn" href="/games" cta="All games" />
        {games.loading ? (
          <CardGridSkeleton />
        ) : gameList.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No games available right now.
          </p>
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

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary">
          {icon}
        </div>
        <div>
          <div className="text-sm text-muted-foreground">{label}</div>
          <div className="text-xl font-bold">{value}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function SectionHeader({
  title,
  href,
  cta,
}: {
  title: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-lg font-semibold">{title}</h2>
      <Link
        href={href}
        className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        {cta} <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

function CardGridSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-44 w-full" />
      ))}
    </div>
  );
}
