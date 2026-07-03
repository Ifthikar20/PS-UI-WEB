"use client";

import * as React from "react";
import { Copy, Check, RefreshCw, Trash2 } from "lucide-react";
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
import type { GuardianStatus } from "@/lib/types";

/**
 * Settings → Supervision: the learner's side of the schools channel. Issue a
 * one-time share code for a teacher/guardian, and see (or remove) the
 * supervisors currently linked to this account.
 */
export function SupervisionCard() {
  const status = useApi<GuardianStatus>("guardian/status/");
  const [code, setCode] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  async function issue() {
    setBusy(true);
    try {
      const r = await api.post<{ code: string }>("guardian/code/");
      setCode(r.code);
      setCopied(false);
    } catch {
      /* leave as-is */
    } finally {
      setBusy(false);
    }
  }

  async function copy() {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
    } catch {
      /* clipboard unavailable */
    }
  }

  async function unlink(linkId: number) {
    await api.del(`guardian/links/${linkId}/`).catch(() => {});
    status.reload();
  }

  const parents = status.data?.parents ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Supervision</CardTitle>
        <CardDescription>
          Let a teacher or guardian follow your progress and send you content
          to study. Share a code with them — it works once and expires in 30
          minutes.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {code ? (
            <>
              <span className="rounded-lg border bg-secondary px-4 py-2 font-mono text-lg font-bold tracking-[0.3em]">
                {code}
              </span>
              <Button variant="outline" size="sm" onClick={copy}>
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-green-600" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" /> Copy
                  </>
                )}
              </Button>
              <Button variant="ghost" size="sm" onClick={issue} disabled={busy}>
                <RefreshCw className="h-4 w-4" /> New code
              </Button>
            </>
          ) : (
            <Button onClick={issue} disabled={busy}>
              Share my code
            </Button>
          )}
        </div>

        {parents.length > 0 && (
          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Your supervisors
            </div>
            <ul className="space-y-2">
              {parents.map((p) => (
                <li
                  key={p.linkId}
                  className="flex items-center justify-between rounded-xl border p-3 text-sm"
                >
                  <span>
                    <span className="font-medium">{p.name}</span>
                    <span className="ml-2 text-muted-foreground">{p.email}</span>
                  </span>
                  <button
                    onClick={() => unlink(p.linkId)}
                    title="Remove supervisor"
                    className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
