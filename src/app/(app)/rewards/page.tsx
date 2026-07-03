"use client";

import { DoodleStar, DoodleFlame, DoodleTrophy } from "@/components/doodles";
import { useSession } from "@/components/app/session-provider";
import { useApi, asList } from "@/lib/use-api";
import { Progress } from "@/components/ui/progress";
import { CertificateGrid, type CredStats } from "@/components/rewards/certificates";
import { BadgeGrid } from "@/components/rewards/badges";
import { cn } from "@/lib/utils";
import type { ExamPlan, StudySet } from "@/lib/types";

// Rank ladder mirrored from the mobile app (lib/core/rewards/rewards_bloc.dart).
const RANKS = [
  { name: "Novice", threshold: 0 },
  { name: "Explorer", threshold: 100 },
  { name: "Scholar", threshold: 300 },
  { name: "Strategist", threshold: 600 },
  { name: "Sage", threshold: 1000 },
  { name: "Master", threshold: 1500 },
  { name: "Legend", threshold: 2200 },
];

export default function RewardsPage() {
  const { me } = useSession();
  const sets = useApi<unknown>("studysets/");
  const plans = useApi<unknown>("examplans/");

  const r = me?.rewards;
  const points = r?.points ?? 0;
  const stats: CredStats = {
    points,
    streak: r?.streak ?? 0,
    studySets: asList<StudySet>(sets.data).length,
    examsCompleted: asList<ExamPlan>(plans.data).filter(
      (p) => p.status === "completed",
    ).length,
    name: me?.user.name || me?.user.email.split("@")[0] || "Learner",
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Rewards
          </h1>
          <p className="mt-1 text-muted-foreground">
            The certificates and badges you can earn on PlayStudy.
          </p>
        </div>
        {/* Compact stats — everything else on this page is credentials */}
        <div className="flex items-center gap-2">
          <StatChip icon={<DoodleStar className="h-5 w-5" />} label={`${points.toLocaleString()} pts`} />
          <StatChip icon={<DoodleFlame className="h-5 w-5" />} label={`${r?.streak ?? 0}-day streak`} />
          <StatChip icon={<DoodleTrophy className="h-5 w-5" />} label={r?.rank.name ?? "Novice"} />
        </div>
      </div>

      <section>
        <h2 className="text-lg font-semibold">Certificates</h2>
        <p className="mb-4 mt-0.5 text-sm text-muted-foreground">
          Credentials you earn by learning — each one unlocks a shareable
          certificate.
        </p>
        <CertificateGrid stats={stats} />
      </section>

      <section>
        <h2 className="text-lg font-semibold">Badges</h2>
        <p className="mb-4 mt-0.5 text-sm text-muted-foreground">
          Smaller wins along the way.
        </p>
        <BadgeGrid stats={stats} />
      </section>

      {/* Rank ladder, compressed to one rail */}
      <section className="rounded-xl border p-5">
        <div className="mb-1 flex items-center justify-between text-sm">
          <span className="font-medium">
            Rank: {r?.rank.name ?? "Novice"}
          </span>
          {r?.nextRank && (
            <span className="text-muted-foreground">
              {r.pointsToNextRank.toLocaleString()} pts to {r.nextRank.name}
            </span>
          )}
        </div>
        <Progress className="mt-2" value={Math.round((r?.rankProgress || 0) * 100)} />
        <div className="mt-3 flex justify-between">
          {RANKS.map((rank) => {
            const reached = points >= rank.threshold;
            const current = r?.rank.name === rank.name;
            return (
              <div
                key={rank.name}
                className="flex flex-col items-center gap-1"
                title={`${rank.threshold.toLocaleString()} pts`}
              >
                <span
                  className={cn(
                    "h-2.5 w-2.5 rounded-full",
                    reached ? "bg-primary" : "bg-muted",
                    current && "ring-2 ring-primary/40 ring-offset-1 ring-offset-background",
                  )}
                />
                <span
                  className={cn(
                    "hidden text-[10px] sm:block",
                    current ? "font-semibold text-foreground" : "text-muted-foreground",
                  )}
                >
                  {rank.name}
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function StatChip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1.5 text-sm font-medium">
      {icon} {label}
    </span>
  );
}
