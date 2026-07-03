"use client";

import * as React from "react";
import Link from "next/link";
import { Send, UserPlus, Trash2, BookOpen } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { useApi, asList } from "@/lib/use-api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { FamilyGlyph } from "@/components/marketing/glyphs";
import type { Assignment, GuardianStatus, Paginated, StudySet } from "@/lib/types";

/**
 * Supervise — the schools/Montessori channel. A supervisor (teacher or
 * guardian) links learners with their share codes, pushes study sets to them
 * (the set is copied into the learner's library), and follows their progress
 * on each assignment. Learners read, play, and quiz the pushed content with
 * all the normal tools.
 */
export default function SupervisePage() {
  const status = useApi<GuardianStatus>("guardian/status/");
  const assignments = useApi<{ results: Assignment[] }>("supervisor/assignments/");
  const sets = useApi<Paginated<StudySet>>("studysets/?status=ready");

  const readySets = (sets.data?.results ?? []).filter(
    (s) => s.status === "ready",
  );
  const children = status.data?.children ?? [];
  const byStudent = new Map<string, Assignment[]>();
  for (const a of assignments.data?.results ?? []) {
    if (a.student) {
      byStudent.set(a.student.id, [...(byStudent.get(a.student.id) ?? []), a]);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Supervise</h1>
        <p className="mt-1 text-muted-foreground">
          Link your learners, push them content to study, and follow their
          progress. Built for classrooms, Montessori groups, and families.
        </p>
      </div>

      <LinkLearnerCard onLinked={() => status.reload()} />

      {status.loading ? (
        <Skeleton className="h-40 w-full" />
      ) : children.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary">
              <FamilyGlyph className="h-8 w-8 text-primary" />
            </span>
            <p className="max-w-md text-sm text-muted-foreground">
              No learners linked yet. Ask each learner to open{" "}
              <span className="font-medium text-foreground">
                Settings → Supervision → Share my code
              </span>{" "}
              on their device, then enter the 6-letter code above.
            </p>
          </CardContent>
        </Card>
      ) : (
        children.map((c) => (
          <StudentCard
            key={c.id}
            student={c}
            assignments={byStudent.get(c.id) ?? []}
            readySets={readySets}
            onAssigned={() => assignments.reload()}
          />
        ))
      )}
    </div>
  );
}

function LinkLearnerCard({ onLinked }: { onLinked: () => void }) {
  const [code, setCode] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [msg, setMsg] = React.useState<string | null>(null);

  async function redeem() {
    if (!code.trim()) return;
    setBusy(true);
    setMsg(null);
    try {
      const r = await api.post<{ student: { name: string } }>(
        "guardian/redeem/",
        { code: code.trim().toUpperCase() },
      );
      setMsg(`Linked ${r.student.name}.`);
      setCode("");
      onLinked();
    } catch (e) {
      setMsg(e instanceof ApiError ? e.message : "That code didn't work.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <UserPlus className="h-4 w-4" /> Link a learner
        </CardTitle>
        <CardDescription>
          Enter the 6-letter code from the learner&apos;s Settings → Supervision.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap items-center gap-2">
        <Input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === "Enter" && redeem()}
          placeholder="e.g. F9UN2E"
          maxLength={6}
          className="w-40 font-mono uppercase tracking-[0.2em]"
        />
        <Button onClick={redeem} disabled={busy || code.trim().length < 6}>
          Link learner
        </Button>
        {msg && <span className="text-sm text-muted-foreground">{msg}</span>}
      </CardContent>
    </Card>
  );
}

function StudentCard({
  student,
  assignments,
  readySets,
  onAssigned,
}: {
  student: GuardianStatus["children"][number];
  assignments: Assignment[];
  readySets: StudySet[];
  onAssigned: () => void;
}) {
  const [setId, setSetId] = React.useState("");
  const [note, setNote] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);

  async function push() {
    if (!setId) return;
    setBusy(true);
    setErr(null);
    try {
      await api.post("supervisor/assign/", {
        studentId: student.id,
        studySetId: setId,
        note,
      });
      setSetId("");
      setNote("");
      onAssigned();
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Could not assign.");
    } finally {
      setBusy(false);
    }
  }

  async function unlink() {
    if (!confirm(`Unlink ${student.name}? Their copies of assigned sets stay with them.`)) return;
    await api.del(`guardian/links/${student.linkId}/`).catch(() => {});
    location.reload();
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-base">{student.name}</CardTitle>
          <CardDescription>{student.email}</CardDescription>
        </div>
        <button
          onClick={unlink}
          title="Unlink learner"
          className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* push content */}
        <div className="rounded-xl border bg-muted/40 p-4">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Push content
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              value={setId}
              onChange={(e) => setSetId(e.target.value)}
              className="h-10 min-w-52 flex-1 rounded-lg border bg-background px-3 text-sm outline-none"
            >
              <option value="">Choose one of your study sets…</option>
              {readySets.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
            </select>
            <Input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Note for the learner (optional)"
              className="min-w-52 flex-[2]"
              maxLength={280}
            />
            <Button onClick={push} disabled={busy || !setId}>
              <Send className="h-4 w-4" /> Assign
            </Button>
          </div>
          {err && <p className="mt-2 text-sm text-destructive">{err}</p>}
        </div>

        {/* assignment progress */}
        {assignments.length > 0 && (
          <div className="space-y-3">
            {assignments.map((a) => {
              const pct = a.sectionsTotal
                ? Math.round((100 * a.sectionsCompleted) / a.sectionsTotal)
                : 0;
              return (
                <div key={a.id} className="rounded-xl border p-3.5">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                    <span className="inline-flex items-center gap-2 font-medium">
                      <BookOpen className="h-4 w-4 text-primary" /> {a.title}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {a.openedAt ? "opened" : "not opened yet"} ·{" "}
                      {a.sectionsCompleted}/{a.sectionsTotal} sections
                    </span>
                  </div>
                  {a.note && (
                    <p className="mt-1 text-xs italic text-muted-foreground">
                      “{a.note}”
                    </p>
                  )}
                  <Progress className="mt-2 h-1.5" value={pct} />
                </div>
              );
            })}
          </div>
        )}

        <div className="text-right">
          <Link
            href={`/supervise/${student.id}`}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Full progress board →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
