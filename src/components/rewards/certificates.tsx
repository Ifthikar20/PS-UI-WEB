"use client";

import * as React from "react";
import { X, Award, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Pip } from "@/components/pip";
import { CertificateSeal } from "./seal";
import { cn } from "@/lib/utils";

/** Everything a credential needs to decide if it's earned. */
export type CredStats = {
  points: number;
  streak: number;
  studySets: number;
  examsCompleted: number;
  name: string;
};

type Cert = {
  id: string;
  title: string;
  certifies: string;
  requirement: string;
  tone: string; // text color class driving the seal
  progress: (s: CredStats) => number; // 0..1
  meter: (s: CredStats) => string; // "120 / 300 pts"
};

/** The credentials PlayStudy offers, easiest first. */
export const CERTIFICATES: Cert[] = [
  {
    id: "foundations",
    title: "Foundations",
    certifies: "Turned study material into an active study set",
    requirement: "Create your first study set",
    tone: "text-sky-500",
    progress: (s) => Math.min(1, s.studySets),
    meter: (s) => `${Math.min(s.studySets, 1)} / 1 study set`,
  },
  {
    id: "scholar",
    title: "Scholar",
    certifies: "Sustained, point-earning study across the platform",
    requirement: "Earn 300 points",
    tone: "text-violet-500",
    progress: (s) => Math.min(1, s.points / 300),
    meter: (s) => `${Math.min(s.points, 300).toLocaleString()} / 300 pts`,
  },
  {
    id: "dedicated",
    title: "Dedicated Learner",
    certifies: "Showed up and studied every day for a week",
    requirement: "Reach a 7-day streak",
    tone: "text-orange-500",
    progress: (s) => Math.min(1, s.streak / 7),
    meter: (s) => `${Math.min(s.streak, 7)} / 7 days`,
  },
  {
    id: "exam-ready",
    title: "Exam Ready",
    certifies: "Completed a full exam-prep plan, start to finish",
    requirement: "Finish an exam plan",
    tone: "text-emerald-500",
    progress: (s) => Math.min(1, s.examsCompleted),
    meter: (s) => `${Math.min(s.examsCompleted, 1)} / 1 plan`,
  },
  {
    id: "sage",
    title: "Sage",
    certifies: "Deep, consistent mastery of study material",
    requirement: "Earn 1,000 points",
    tone: "text-amber-500",
    progress: (s) => Math.min(1, s.points / 1000),
    meter: (s) => `${Math.min(s.points, 1000).toLocaleString()} / 1,000 pts`,
  },
  {
    id: "legend",
    title: "Legend",
    certifies: "The platform's highest learning credential",
    requirement: "Earn 2,200 points",
    tone: "text-rose-500",
    progress: (s) => Math.min(1, s.points / 2200),
    meter: (s) => `${Math.min(s.points, 2200).toLocaleString()} / 2,200 pts`,
  },
];

export function CertificateGrid({ stats }: { stats: CredStats }) {
  const [viewing, setViewing] = React.useState<Cert | null>(null);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CERTIFICATES.map((c) => {
          const pct = c.progress(stats);
          const earned = pct >= 1;
          return (
            <Card
              key={c.id}
              className={cn(
                "relative overflow-hidden transition-shadow",
                earned ? "border-2 hover:shadow-md" : "border-dashed",
              )}
            >
              <CardContent className="flex h-full flex-col items-center p-5 text-center">
                <CertificateSeal
                  earned={earned}
                  className={cn(
                    "h-20 w-16",
                    earned ? c.tone : "text-muted-foreground/40",
                  )}
                />
                <h3 className="mt-2 font-serif text-lg font-semibold">
                  {c.title}
                </h3>
                <p className="mt-1 flex-1 text-xs leading-relaxed text-muted-foreground">
                  {c.certifies}
                </p>

                {earned ? (
                  <button
                    onClick={() => setViewing(c)}
                    className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent"
                  >
                    <Award className="h-3.5 w-3.5" /> View certificate
                  </button>
                ) : (
                  <div className="mt-4 w-full">
                    <div className="mb-1 flex items-center justify-between text-[11px] text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Lock className="h-3 w-3" /> {c.requirement}
                      </span>
                      <span className="tabular-nums">{c.meter(stats)}</span>
                    </div>
                    <Progress className="h-1.5" value={Math.round(pct * 100)} />
                  </div>
                )}

                {earned && (
                  <span className="absolute right-3 top-3 rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-green-600">
                    Earned
                  </span>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {viewing && (
        <CertificateModal
          cert={viewing}
          name={stats.name}
          onClose={() => setViewing(null)}
        />
      )}
    </>
  );
}

/** The certificate itself — a framed, paper-textured award. */
function CertificateModal({
  cert,
  name,
  onClose,
}: {
  cert: Cert;
  name: string;
  onClose: () => void;
}) {
  const today = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl bg-paper p-2 text-neutral-900 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="rounded-xl border-2 border-neutral-800/70 p-1">
          <div className="rounded-lg border border-neutral-800/30 px-6 py-8 text-center sm:px-10">
            <div className="flex items-center justify-center gap-2">
              <Pip size={28} />
              <span className="font-bold">PlayStudy</span>
            </div>
            <div className="mt-5 text-[11px] font-semibold uppercase tracking-[0.25em] text-neutral-500">
              Certificate of Achievement
            </div>
            <CertificateSeal className={cn("mx-auto mt-4 h-24 w-20", cert.tone)} />
            <h3 className="mt-2 font-serif text-3xl font-bold">{cert.title}</h3>
            <p className="mx-auto mt-3 max-w-xs text-sm text-neutral-600">
              {cert.certifies}
            </p>
            <div className="mx-auto mt-6 w-64 border-b border-neutral-400" />
            <div className="mt-2 font-notes text-2xl">{name || "Learner"}</div>
            <div className="mt-6 flex items-center justify-between text-xs text-neutral-500">
              <span>{today}</span>
              <span className="font-notes text-base text-neutral-700">
                Pip, Chief Study Pup
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full border bg-background text-foreground shadow"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
