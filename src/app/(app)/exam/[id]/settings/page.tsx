"use client";

import * as React from "react";
import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Trash2, Bell, Send, Check } from "lucide-react";
import { useSession } from "@/components/app/session-provider";
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
  const { me } = useSession();
  const plan = useApi<ExamPlan>(`examplans/${id}/`);

  const [freq, setFreq] = React.useState(1);
  const [excluded, setExcluded] = React.useState<string[]>([]);
  const [emailReminders, setEmailReminders] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [msg, setMsg] = React.useState<string | null>(null);
  const [testState, setTestState] = React.useState<"idle" | "sending" | "sent">("idle");

  React.useEffect(() => {
    if (plan.data) {
      setFreq(plan.data.frequencyMultiplier ?? 1);
      setExcluded(plan.data.excludedTopics ?? []);
      setEmailReminders(plan.data.emailReminders ?? true);
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
        emailReminders,
      });
      setMsg("Saved — future days updated.");
    } catch {
      setMsg("Couldn't save.");
    } finally {
      setSaving(false);
    }
  }

  async function sendTest() {
    setTestState("sending");
    try {
      await api.post(`examplans/${id}/test-reminder/`, {});
      setTestState("sent");
      setTimeout(() => setTestState("idle"), 4000);
    } catch {
      setTestState("idle");
      setMsg("Couldn't send test email.");
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" /> Email reminders
          </CardTitle>
          <CardDescription>
            We&apos;ll email a nudge when each day&apos;s session is ready, plus
            a heads-up as your exam approaches — so a reminder reaches you even
            when PlayStudy is closed.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <button
            onClick={() => setEmailReminders((v) => !v)}
            className="flex w-full items-center justify-between rounded-xl border p-4 text-left transition-colors hover:bg-accent"
          >
            <div>
              <div className="font-medium">Send me email reminders</div>
              <div className="text-sm text-muted-foreground">
                {me?.user.email ? `Delivered to ${me.user.email}` : "Uses your account email"}
              </div>
            </div>
            <span
              className={cn(
                "relative h-6 w-11 shrink-0 rounded-full transition-colors",
                emailReminders ? "bg-primary" : "bg-muted",
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all",
                  emailReminders ? "left-[22px]" : "left-0.5",
                )}
              />
            </span>
          </button>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={sendTest}
              disabled={testState !== "idle"}
            >
              {testState === "sending" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : testState === "sent" ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {testState === "sent" ? "Sent — check your inbox" : "Send me a test reminder"}
            </Button>
            <span className="text-xs text-muted-foreground">
              Confirms delivery works for your address.
            </span>
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
