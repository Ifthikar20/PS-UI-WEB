"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { LearningTree } from "@/components/study/learning-tree";
import type { StudySet } from "@/lib/types";

/** Dashboard section: the learning tree for the most recent study set. */
export function DashboardLearningPath({ set }: { set: StudySet }) {
  const router = useRouter();
  const sections = React.useMemo(
    () => [...(set.sections ?? [])].sort((a, b) => a.order - b.order),
    [set],
  );

  const [done, setDone] = React.useState<Set<number>>(new Set());
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(`ps_progress_${set.id}`);
      if (raw) setDone(new Set(JSON.parse(raw)));
    } catch {
      /* ignore */
    }
  }, [set.id]);

  const current = React.useMemo(() => {
    for (let i = 0; i < sections.length; i++) if (!done.has(i)) return i;
    return undefined;
  }, [done, sections.length]);

  if (sections.length === 0) return null;

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Continue your path</h2>
        <span className="text-sm text-muted-foreground">{set.title}</span>
      </div>
      <Card>
        <CardContent className="p-6">
          <LearningTree
            sections={sections}
            completed={done}
            current={current}
            onSelect={() => router.push(`/study/${set.id}`)}
          />
        </CardContent>
      </Card>
    </section>
  );
}
