"use client";

import { Moon, Sun, Monitor, Check, Crown } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useApi } from "@/lib/use-api";
import { cn } from "@/lib/utils";
import { useFlavor } from "@/components/app/flavor-provider";
import { DoodleSpark, DoodleClock } from "@/components/doodles";
import { FLAVORS, FLAVOR_META } from "@/lib/flavor";
import { SupervisionCard } from "@/components/app/supervision-card";

type Subscription = {
  isPremium: boolean;
  usageCount: number;
  usageLimit: number | null;
  usageResetsAt: string | null;
  remainingFree: number | null;
  canGenerate: boolean;
  expiresAt: string | null;
};

import type { ProgressAnalytics } from "@/lib/types";

function fmtDuration(seconds: number) {
  const m = Math.round(seconds / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  return `${h}h ${m % 60}m`;
}

function fmtDate(iso: string | null) {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  } catch {
    return null;
  }
}

/**
 * Plan & spending — what this account is on and what it's using: the
 * subscription tier, this month's AI generations against the plan's
 * allowance, and total study time invested.
 */
function PlanAndSpending() {
  const sub = useApi<Subscription>("subscription/");
  const progress = useApi<ProgressAnalytics>("progress/me/");

  const s = sub.data;
  const secondsSpent =
    progress.data?.secondsSpent ??
    (progress.data?.studySets ?? []).reduce(
      (a, x) => a + (x.secondsSpent || 0),
      0,
    );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Plan &amp; spending</CardTitle>
        <CardDescription>
          Your plan, this month&apos;s usage, and the time you&apos;ve invested.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {sub.loading ? (
          <Skeleton className="h-24 w-full" />
        ) : (
          <>
            {/* plan row */}
            <div className="flex items-center justify-between rounded-xl border p-4">
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-xl",
                    s?.isPremium ? "bg-accent-2/15" : "bg-secondary",
                  )}
                >
                  <Crown
                    className={cn(
                      "h-5 w-5",
                      s?.isPremium ? "text-accent-2" : "text-muted-foreground",
                    )}
                  />
                </span>
                <div>
                  <div className="font-semibold">
                    {s?.isPremium ? "Premium" : "Free plan"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {s?.isPremium
                      ? s?.expiresAt
                        ? `Renews / expires ${fmtDate(s.expiresAt)}`
                        : "Active"
                      : "Monthly allowance of AI generations"}
                  </div>
                </div>
              </div>
              {!s?.isPremium && (
                <span className="rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground">
                  Upgrade in the iPhone app
                </span>
              )}
            </div>

            {/* generation spending */}
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="inline-flex items-center gap-2 font-medium">
                  <DoodleSpark className="h-5 w-5" /> AI generations this month
                </span>
                <span className="tabular-nums text-muted-foreground">
                  {s?.isPremium
                    ? `${s?.usageCount ?? 0} · unlimited`
                    : `${s?.usageCount ?? 0} / ${s?.usageLimit ?? "—"}`}
                </span>
              </div>
              {!s?.isPremium && s?.usageLimit ? (
                <>
                  <Progress
                    value={Math.min(
                      100,
                      Math.round(((s.usageCount ?? 0) / s.usageLimit) * 100),
                    )}
                  />
                  <div className="mt-1.5 text-xs text-muted-foreground">
                    {s.remainingFree ?? 0} left
                    {s.usageResetsAt
                      ? ` · resets ${fmtDate(s.usageResetsAt)}`
                      : ""}
                  </div>
                </>
              ) : null}
            </div>

            {/* time invested */}
            <div className="flex items-center justify-between rounded-xl bg-secondary/60 p-4">
              <span className="inline-flex items-center gap-2 text-sm font-medium">
                <DoodleClock className="h-5 w-5" /> Study time invested
              </span>
              <span className="text-sm font-semibold tabular-nums">
                {progress.loading ? "—" : fmtDuration(secondsSpent)}
              </span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

const THEME_OPTIONS = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { flavor, setFlavor } = useFlavor();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>
            Light and dark are the two core themes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {THEME_OPTIONS.map((opt) => {
              const active = mounted && theme === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setTheme(opt.value)}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-xl border p-4 text-sm transition-colors hover:bg-accent",
                    active && "border-primary bg-accent",
                  )}
                >
                  <opt.icon className="h-5 w-5" />
                  {opt.label}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dashboard style</CardTitle>
          <CardDescription>
            Pick the flavor that suits you. You chose this at sign-up — change it
            anytime.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {FLAVORS.map((f) => {
              const meta = FLAVOR_META[f];
              const active = flavor === f;
              return (
                <button
                  key={f}
                  onClick={() => setFlavor(f)}
                  className={cn(
                    "flex items-start gap-3 rounded-xl border p-4 text-left transition-colors hover:bg-accent",
                    active && "border-primary ring-1 ring-primary",
                  )}
                >
                  <span className="flex -space-x-1.5 pt-1">
                    <span
                      className="h-5 w-5 rounded-full ring-2 ring-card"
                      style={{ backgroundColor: meta.swatch[0] }}
                    />
                    <span
                      className="h-5 w-5 rounded-full ring-2 ring-card"
                      style={{ backgroundColor: meta.swatch[1] }}
                    />
                  </span>
                  <span className="flex-1">
                    <span className="flex items-center gap-2 font-semibold">
                      {meta.label}
                      {active && <Check className="h-4 w-4 text-primary" />}
                    </span>
                    <span className="mt-0.5 block text-sm text-muted-foreground">
                      {meta.blurb}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <SupervisionCard />

      <PlanAndSpending />
    </div>
  );
}
