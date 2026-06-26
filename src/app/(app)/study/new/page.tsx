"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Link2, FileText, Type, Loader2, UploadCloud } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import type { StudySet, StudySetStatus } from "@/lib/types";

type Phase = "idle" | "uploading" | "creating" | "generating";

export default function NewStudySetPage() {
  const router = useRouter();
  const [phase, setPhase] = React.useState<Phase>("idle");
  const [progress, setProgress] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);
  const [file, setFile] = React.useState<File | null>(null);

  const busy = phase !== "idle";

  async function pollUntilReady(id: string) {
    setPhase("generating");
    // Adaptive backoff mirroring the mobile poller (1.5s → 3s → 5s).
    const delays = [1500, 1500, 3000, 3000, 5000];
    for (let attempt = 0; attempt < 80; attempt++) {
      const status = await api.get<StudySetStatus>(`studysets/${id}/status/`);
      setProgress(Math.round((status.progress || 0) * 100));
      if (status.status === "ready") {
        router.push(`/study/${id}`);
        return;
      }
      if (status.status === "failed") {
        throw new ApiError(500, status.error || "Generation failed");
      }
      await new Promise((r) =>
        setTimeout(r, delays[Math.min(attempt, delays.length - 1)]),
      );
    }
    // Took too long — let the user view whatever is ready in the reader.
    router.push(`/study/${id}`);
  }

  async function create(sourceKind: "link" | "text" | "file", sourceRef: string, title?: string) {
    setError(null);
    try {
      setPhase("creating");
      const created = await api.post<StudySet & StudySetStatus>("studysets/", {
        sourceKind,
        sourceRef,
        title,
      });
      await pollUntilReady(created.id);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Something went wrong.");
      setPhase("idle");
      setProgress(0);
    }
  }

  async function onSubmitLink(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const url = String(fd.get("url") ?? "").trim();
    if (url) await create("link", url, String(fd.get("title") ?? "").trim() || undefined);
  }

  async function onSubmitText(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const text = String(fd.get("text") ?? "").trim();
    if (text) await create("text", text, String(fd.get("title") ?? "").trim() || undefined);
  }

  async function onSubmitFile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!file) return;
    setError(null);
    try {
      setPhase("uploading");
      const form = new FormData();
      form.append("file", file);
      const { key } = await api.upload<{ key: string }>("uploads/", form);
      await create("file", key, file.name);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Upload failed.");
      setPhase("idle");
    }
  }

  if (busy) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center justify-center py-24 text-center">
        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
        <h2 className="mt-6 text-xl font-semibold">
          {phase === "uploading"
            ? "Uploading…"
            : phase === "creating"
              ? "Getting started…"
              : "Generating your study set"}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          This can take up to a minute. We&apos;re creating sections, quizzes,
          and games.
        </p>
        {phase === "generating" && (
          <Progress className="mt-6 w-full" value={progress} />
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          New study set
        </h1>
        <p className="mt-1 text-muted-foreground">
          Add a link, paste text, or upload a document.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>What are you studying?</CardTitle>
          <CardDescription>
            We&apos;ll turn it into sections, quizzes, and games.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="link">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="link">
                <Link2 className="mr-2 h-4 w-4" /> Link
              </TabsTrigger>
              <TabsTrigger value="text">
                <Type className="mr-2 h-4 w-4" /> Text
              </TabsTrigger>
              <TabsTrigger value="file">
                <FileText className="mr-2 h-4 w-4" /> File
              </TabsTrigger>
            </TabsList>

            <TabsContent value="link">
              <form onSubmit={onSubmitLink} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="url">URL</Label>
                  <Input id="url" name="url" type="url" required placeholder="https://en.wikipedia.org/wiki/..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title-link">Title (optional)</Label>
                  <Input id="title-link" name="title" placeholder="My study set" />
                </div>
                <Button type="submit" className="w-full">Generate</Button>
              </form>
            </TabsContent>

            <TabsContent value="text">
              <form onSubmit={onSubmitText} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="text">Paste your notes</Label>
                  <textarea
                    id="text"
                    name="text"
                    required
                    rows={8}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder="Paste the content you want to study…"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title-text">Title (optional)</Label>
                  <Input id="title-text" name="title" placeholder="My study set" />
                </div>
                <Button type="submit" className="w-full">Generate</Button>
              </form>
            </TabsContent>

            <TabsContent value="file">
              <form onSubmit={onSubmitFile} className="space-y-4">
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed py-10 text-center hover:bg-secondary/40">
                  <UploadCloud className="h-8 w-8 text-muted-foreground" />
                  <span className="mt-3 text-sm font-medium">
                    {file ? file.name : "Click to choose a file"}
                  </span>
                  <span className="mt-1 text-xs text-muted-foreground">
                    PDF, DOCX, TXT, MD, or an image of your notes
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.txt,.md,.doc,.docx,.png,.jpg,.jpeg"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  />
                </label>
                <Button type="submit" className="w-full" disabled={!file}>
                  Upload &amp; generate
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          {error && (
            <p className="mt-4 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
