"use client";

import * as React from "react";
import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Gamepad2 } from "lucide-react";
import { useApi } from "@/lib/use-api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Quiz } from "@/components/study/quiz";
import type { StudySet } from "@/lib/types";

export default function StudySetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: set, loading, error } = useApi<StudySet>(`studysets/${id}/`);

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
    <div className="mx-auto max-w-3xl space-y-6">
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
          <TabsTrigger value="quiz">Quiz ({set.quiz?.length ?? 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="read" className="space-y-4">
          {set.summary && (
            <Card>
              <CardContent className="p-6">
                <h2 className="mb-2 font-semibold">Summary</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {set.summary}
                </p>
              </CardContent>
            </Card>
          )}
          {[...(set.sections ?? [])]
            .sort((a, b) => a.order - b.order)
            .map((section, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <h2 className="mb-3 text-lg font-semibold">
                    {section.title}
                  </h2>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                    {section.content}
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="quiz">
          <Quiz questions={set.quiz ?? []} studySetId={set.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
