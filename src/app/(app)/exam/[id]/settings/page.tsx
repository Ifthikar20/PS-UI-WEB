"use client";

import * as React from "react";
import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import { useApi } from "@/lib/use-api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { ExamPlan } from "@/lib/types";

const FREQS = [
  { v: 0.5, label: "Light" },
  { v: 1, label: "Normal" },
  { v: 1.5, label: "More" },
  { v: 2, label: "Intense" },
];

export default function ExamSettingsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const plan = useApi<ExamPlan>(`examplans/${id}/`);

  const [freq, setFreq] = React.useState(1);
  const [excluded, setExcluded] = React.useState<string[]>([]);
  const [saving, setSaving] = React.useState(false);
  const [msg, setMsg] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (plan.data) {
      setFreq(plan.data.frequencyMultiplier ?? 1);
      setExcluded(plan.data.excludedTopics ?? []);
    }
  }, [plan.data]);

  if (plan.loading || !plan.data) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  const topics = plan.data.topics ?? [];

  function toggleTopic(t: string) {
    setExcluded((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t],
    );
  }

  async function save() {
    setSaving(true);
    setMsg(null);
    try {
      await api.patch(`examplans/${id}/settings/`, {
        frequencyMultiplier: freq,
        excludedTopics: excluded,
      });
      setMsg("Saved — future days updated.");
    } catch {
      setMsg("Couldn't save.");
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!confirm("Delete this exam plan? This can't be undone.")) return;
    try {
      await api.del(`examplans/${id}/`);
      router.push("/exam");
    } catch {
      setMsg("Couldn't delete.");
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Button variant="ghost" size="sm" asChild className="-ml-2 w-fit">
        <Link href={`/exam/${id}`}>
          <ArrowLeft className="h-4 w-4" /> Plan
        </Link>
      </Button>

      <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
        Plan settings
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>Question frequency</CardTitle>
          <CardDescription>
            How many questions per day, relative to your original choice.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-2">
            {FREQS.map((f) => (
              <button
                key={f.v}
                onClick={() => setFreq(f.v)}
                className={cn(
                  "rounded-lg border py-3 text-sm transition-colors hover:bg-accent",
                  freq === f.v && "border-primary bg-accent font-medium",
                )}
              >
                <div>{f.label}</div>
                <div className="text-xs text-muted-foreground">{f.v}×</div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {topics.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Topics</CardTitle>
            <CardDescription>
              Tap to exclude a topic from future days.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {topics.map((t) => {
                const off = excluded.includes(t);
                return (
                  <button
                    key={t}
                    onClick={() => toggleTopic(t)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-sm transition-colors",
                      off
                        ? "border-dashed text-muted-foreground line-through"
                        : "border-primary bg-accent",
                    )}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center gap-3">
        <Button onClick={save} disabled={saving}>
          {saving && <Loader2 className="h-4 w-4 animate-spin" />} Save changes
        </Button>
        {msg && <span className="text-sm text-muted-foreground">{msg}</span>}
      </div>

      <Card className="border-destructive/30">
        <CardContent className="flex items-center justify-between p-5">
          <div>
            <div className="font-medium">Delete plan</div>
            <div className="text-sm text-muted-foreground">
              Removes this plan and its schedule.
            </div>
          </div>
          <Button variant="outline" className="text-destructive" onClick={remove}>
            <Trash2 className="h-4 w-4" /> Delete
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
