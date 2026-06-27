"use client";

import Link from "next/link";
import { Plus, FileText, Trophy, Flame, Star, ChevronRight } from "lucide-react";
import { useSession } from "@/components/app/session-provider";
import { useApi, asList } from "@/lib/use-api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/app/empty-state";
import { GameCard } from "@/components/app/game-card";
import { ActivityOverview } from "@/components/charts/activity-overview";
import { ExamReminder } from "@/components/exam/exam-reminder";
import {
  useDashboardData,
  greeting,
  SectionHeader,
  CardGridSkeleton,
} from "./shared";
import type { Paginated, ExamPlan, GameManifestEntry } from "@/lib/types";

/** University & above flavor: refined, dense, professional. */
export function ProDashboard() {
  const { me } = useSession();
  const { sets, games } = useDashboardData();
  const exams = useApi<Paginated<ExamPlan>>("examplans/");
  const rewards = me?.rewards;
  const recent = sets.data?.results?.slice(0, 6) ?? [];
  const gameList = asList<GameManifestEntry>(games.data).slice(0, 4);
  const nextExam = exams.data?.results?.[0];

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center justify-between border-b pb-5">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            {greeting(me?.user.name)}
          </h1>
          <p className="text-sm text-muted-foreground">
            Your study overview at a glance.
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/study/new">
            <Plus className="h-4 w-4" /> New study set
          </Link>
        </Button>
      </div>

      <ExamReminder />

      {/* Compact metric row */}
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-4">
        <Metric icon={<Star className="h-4 w-4" />} label="Points" value={rewards ? rewards.points.toLocaleString() : "—"} />
        <Metric icon={<Flame className="h-4 w-4" />} label="Streak" value={rewards ? `${rewards.streak} d` : "—"} />
        <Metric icon={<Trophy className="h-4 w-4" />} label="Rank" value={rewards?.rank.name ?? "—"} />
        <Metric icon={<FileText className="h-4 w-4" />} label="Study sets" value={String(sets.data?.count ?? 0)} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Continue studying — list view */}
        <div className="lg:col-span-2">
          <SectionHeader title="Continue studying" href="/library" cta="Library" />
          {sets.loading ? (
            <CardGridSkeleton count={3} />
          ) : recent.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No study sets yet"
              description="Create your first study set to get started."
              action={
                <Button asChild>
                  <Link href="/study/new">
                    <Plus className="h-4 w-4" /> Create study set
                  </Link>
                </Button>
              }
            />
          ) : (
            <Card>
              <CardContent className="divide-y p-0">
                {recent.map((s) => (
                  <Link
                    key={s.id}
                    href={`/study/${s.id}`}
                    className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-accent"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-medium">{s.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {s.sections?.length ?? 0} sections ·{" "}
                          {s.quiz?.length ?? 0} questions
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Side column: rank + next exam */}
        <div className="space-y-6">
          {rewards?.nextRank && (
            <Card>
              <CardContent className="p-5">
                <div className="text-sm font-medium">Progress to next rank</div>
                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{rewards.rank.name}</span>
                  <span>{rewards.nextRank.name}</span>
                </div>
                <Progress
                  className="mt-2"
                  value={Math.round((rewards.rankProgress || 0) * 100)}
                />
                <p className="mt-2 text-xs text-muted-foreground">
                  {rewards.pointsToNextRank.toLocaleString()} points to go
                </p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="p-5">
              <div className="mb-3 flex items-center justify-between">
                <div className="text-sm font-medium">Next exam</div>
                <Link href="/exam" className="text-xs text-muted-foreground hover:text-foreground">
                  Plans
                </Link>
              </div>
              {nextExam ? (
                <div>
                  <div className="font-semibold">{nextExam.examTitle}</div>
                  <div className="text-xs text-muted-foreground">
                    {nextExam.materialTitle}
                  </div>
                  <Badge variant="secondary" className="mt-2">
                    {nextExam.examDate}
                  </Badge>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No exam plans yet.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <ActivityOverview />

      <section>
        <SectionHeader title="Practice with games" href="/games" cta="All games" />
        {games.loading ? (
          <CardGridSkeleton />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {gameList.map((g, i) => (
              <GameCard key={g.key} game={g} index={i} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Metric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-card p-5">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {icon} {label}
      </div>
      <div className="mt-1 text-lg font-semibold">{value}</div>
    </div>
  );
}
