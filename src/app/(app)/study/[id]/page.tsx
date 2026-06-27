"use client";

import * as React from "react";
import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Gamepad2, Check } from "lucide-react";
import { useApi } from "@/lib/use-api";
import { api } from "@/lib/api";
import { useStudyHeartbeat } from "@/lib/use-heartbeat";
import { useSyncedReading, FONT_CLASS, SIZE_CLASS } from "@/lib/reading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Quiz } from "@/components/study/quiz";
import { NotesReader } from "@/components/study/notes-reader";
import { ReaderToolbar } from "@/components/study/reader-toolbar";
import { LearningTreeGraph } from "@/components/study/learning-tree-graph";
import type { StudySet, StudySection } from "@/lib/types";

function useProgress(id: string, count: number) {
  const key = `ps_progress_${id}`;
  const [done, setDone] = React.useState<Set<number>>(new Set());
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setDone(new Set(JSON.parse(raw)));
    } catch {
      /* ignore */
    }
  }, [key]);
  const toggle = React.useCallback(
    (i: number) => {
      setDone((prev) => {
        const next = new Set(prev);
        if (next.has(i)) next.delete(i);
        else next.add(i);
        localStorage.setItem(key, JSON.stringify([...next]));
        return next;
      });
    },
    [key],
  );
  const current = React.useMemo(() => {
    for (let i = 0; i < count; i++) if (!done.has(i)) return i;
    return undefined;
  }, [done, count]);
  return { done, toggle, current };
}

export default function StudySetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: set, loading, error } = useApi<StudySet>(`studysets/${id}/`);
  const reading = useSyncedReading();

  const sections: StudySection[] = React.useMemo(
    () => [...(set?.sections ?? [])].sort((a, b) => a.order - b.order),
    [set],
  );
  const { done, toggle, current } = useProgress(id, sections.length);

  // Track active reading time (server-side, synced with mobile analytics).
  useStudyHeartbeat(set?.id, current ?? 0, sections[current ?? 0]?.title ?? "");

  // Mark a section complete locally AND record it server-side for analytics.
  const markSection = React.useCallback(
    (i: number) => {
      const willComplete = !done.has(i);
      toggle(i);
      if (willComplete && set) {
        api
          .post("progress/complete/", {
            studySetId: set.id,
            sectionIndex: i,
            sectionTitle: sections[i]?.title ?? "",
            correct: 0,
            total: 0,
          })
          .catch(() => {});
      }
    },
    [done, toggle, set, sections],
  );

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }
  if (error || !set) {
    return (
      <div className="mx-auto max-w-3xl">
        <p className="text-sm text-destructive">{error ?? "Not found."}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Button variant="ghost" size="sm" asChild className="-ml-2 w-fit">
        <Link href="/library">
          <ArrowLeft className="h-4 w-4" /> Library
        </Link>
      </Button>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {set.title}
          </h1>
          <div className="mt-2 flex flex-wrap gap-2">
            {set.topics?.slice(0, 4).map((t) => (
              <Badge key={t} variant="secondary">
                {t}
              </Badge>
            ))}
          </div>
        </div>
        <Button asChild variant="outline">
          <Link href={`/games?set=${set.id}`}>
            <Gamepad2 className="h-4 w-4" /> Play with this set
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="read">
        <TabsList>
          <TabsTrigger value="read">Read</TabsTrigger>
          <TabsTrigger value="path">Path</TabsTrigger>
          <TabsTrigger value="quiz">Quiz ({set.quiz?.length ?? 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="read" className="space-y-4">
          <ReaderToolbar {...reading} />

          {set.summary && (
            <Card>
              <CardContent className="p-6">
                <h2 className="mb-2 font-semibold">Summary</h2>
                <NotesReader
                  content={set.summary}
                  storageKey={`${id}:summary`}
                  className={cn(
                    FONT_CLASS[reading.font],
                    SIZE_CLASS[reading.size],
                    "text-foreground/90",
                  )}
                />
              </CardContent>
            </Card>
          )}

          {sections.map((section, i) => {
            const isDone = done.has(i);
            return (
              <Card key={i} className={cn(isDone && "border-green-500/40")}>
                <CardContent className="p-6">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h2 className="text-lg font-semibold">{section.title}</h2>
                    <Button
                      size="sm"
                      variant={isDone ? "secondary" : "ghost"}
                      onClick={() => markSection(i)}
                      className={cn(
                        "text-muted-foreground",
                        isDone && "text-green-600",
                      )}
                    >
                      <Check className="h-4 w-4" />
                      {isDone ? "Reviewed" : "Got it"}
                    </Button>
                  </div>
                  <NotesReader
                    content={section.content}
                    storageKey={`${id}:s${i}`}
                    className={cn(
                      FONT_CLASS[reading.font],
                      SIZE_CLASS[reading.size],
                      "text-foreground/90",
                    )}
                  />
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="path">
          <Card>
            <CardContent className="p-6">
              <LearningTreeGraph
                title={set.title}
                sections={sections}
                completed={done}
                current={current}
                words={set.wordGame ?? []}
                onSelect={markSection}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quiz">
          <Quiz questions={set.quiz ?? []} studySetId={set.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
