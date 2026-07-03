"use client";

import Link from "next/link";
import { FileText, Plus } from "lucide-react";
import { useApi, asList } from "@/lib/use-api";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AssignedRail } from "@/components/app/assigned-rail";
import { Skeleton } from "@/components/ui/skeleton";
import { StudySetCard } from "@/components/app/study-set-card";
import { GameCard } from "@/components/app/game-card";
import { EmptyState } from "@/components/app/empty-state";
import type { Paginated, StudySet, GameManifestEntry } from "@/lib/types";

export default function LibraryPage() {
  const sets = useApi<Paginated<StudySet>>("studysets/");
  const games = useApi<GameManifestEntry[]>("games/");
  const setList = sets.data?.results ?? [];
  const gameList = asList<GameManifestEntry>(games.data);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Library
        </h1>
        <Button asChild>
          <Link href="/study/new">
            <Plus className="h-4 w-4" /> New study set
          </Link>
        </Button>
      </div>

      <AssignedRail />

      <Tabs defaultValue="sets">
        <TabsList>
          <TabsTrigger value="sets">Study sets</TabsTrigger>
          <TabsTrigger value="games">Games</TabsTrigger>
        </TabsList>

        <TabsContent value="sets">
          {sets.loading ? (
            <Grid>
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-44 w-full" />
              ))}
            </Grid>
          ) : setList.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="Your library is empty"
              description="Create a study set to see it here."
              action={
                <Button asChild>
                  <Link href="/study/new">
                    <Plus className="h-4 w-4" /> Create study set
                  </Link>
                </Button>
              }
            />
          ) : (
            <Grid>
              {setList.map((s, i) => (
                <StudySetCard key={s.id} set={s} index={i} />
              ))}
            </Grid>
          )}
        </TabsContent>

        <TabsContent value="games">
          {games.loading ? (
            <Grid>
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[4/3] w-full" />
              ))}
            </Grid>
          ) : (
            <Grid>
              {gameList.map((g, i) => (
                <GameCard key={g.key} game={g} index={i} />
              ))}
            </Grid>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {children}
    </div>
  );
}
