"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { useApi } from "@/lib/use-api";
import { Pip } from "@/components/pip";
import { DoodleStar, DoodleSpark } from "@/components/doodles";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Paginated, StudySet, GameManifestEntry } from "@/lib/types";

/** Shared data fetch for every dashboard flavor. */
export function useDashboardData() {
  const sets = useApi<Paginated<StudySet>>("studysets/");
  // The games endpoint returns a bare array (not paginated).
  const games = useApi<GameManifestEntry[]>("games/");
  return { sets, games };
}

export function greeting(name?: string | null) {
  const first = name?.split(" ")[0];
  const h = new Date().getHours();
  const part = h < 5 ? "Up late" : h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
  return first ? `${part}, ${first}` : `${part}`;
}

const TAGLINES = [
  "Ready to learn something new today?",
  "A little every day goes a long way.",
  "Your streak is waiting for you.",
  "Turn today's notes into tonight's high score.",
  "One section, one quiz — that's a win.",
];

/**
 * Animated dashboard hero: Pip bobbing with sparkles, a time-of-day greeting,
 * and a tagline that rotates every few seconds — the dashboard says hello
 * instead of sitting still.
 */
export function DashboardHero({ name, big = false }: { name?: string | null; big?: boolean }) {
  const [line, setLine] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setLine((l) => (l + 1) % TAGLINES.length), 4500);
    return () => clearInterval(id);
  }, []);

  return (
    <Card className="brand-wash overflow-hidden border-2">
      <CardContent
        className={
          big
            ? "flex flex-col items-center gap-6 p-8 text-center sm:flex-row sm:text-left"
            : "flex flex-col items-center gap-5 p-6 text-center sm:flex-row sm:text-left"
        }
      >
        {/* Pip, alive: gentle bob + orbiting sparkles */}
        <span className="relative shrink-0">
          <span
            className="block animate-bob rounded-[2rem] bg-background/70 p-3 shadow-sm"
            style={{ animationDuration: "3.2s" }}
          >
            <Pip size={big ? 84 : 64} />
          </span>
          <span className="absolute -right-3 -top-2 animate-pulse-dot">
            <DoodleStar className="h-5 w-5" />
          </span>
          {/* delayed so the two twinkles alternate */}
          <span
            className="absolute -left-4 top-1/2 animate-pulse-dot"
            style={{ animationDelay: "0.8s" }}
          >
            <DoodleSpark className="h-4 w-4" />
          </span>
        </span>

        <div className="min-w-0 flex-1">
          <h1
            className={
              (big ? "text-2xl md:text-3xl" : "text-2xl md:text-[1.7rem]") +
              " animate-fade-in font-bold tracking-tight"
            }
          >
            {greeting(name)}
          </h1>
          {/* key remount re-runs the fade for each new line */}
          <p key={line} className="mt-1 animate-fade-in text-muted-foreground">
            {TAGLINES[line]}
          </p>
        </div>

        <Button size={big ? "lg" : "default"} asChild>
          <Link href="/study/new">
            <Plus className={big ? "h-5 w-5" : "h-4 w-4"} /> New study set
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

/** Eased count-up for stat numbers, so values land with a bit of life. */
export function useCountUp(target: number, ms = 900) {
  const [value, setValue] = React.useState(0);
  React.useEffect(() => {
    if (!Number.isFinite(target)) return;
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / ms);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return value;
}

export function CountUp({ value }: { value: number }) {
  const n = useCountUp(value);
  return <>{n.toLocaleString()}</>;
}

export function SectionHeader({
  title,
  href,
  cta,
}: {
  title: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-lg font-semibold">{title}</h2>
      <Link
        href={href}
        className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        {cta} <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

export function StatTile({
  icon,
  label,
  value,
  tone,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  tone?: string;
  /** Optional footer row (e.g. a mini progress bar) inside the tile. */
  sub?: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center gap-4">
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-xl ${tone ?? "bg-secondary"}`}
          >
            {icon}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm text-muted-foreground">{label}</div>
            <div className="truncate text-xl font-bold">{value}</div>
          </div>
        </div>
        {sub && <div className="mt-3">{sub}</div>}
      </CardContent>
    </Card>
  );
}

export function CardGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-44 w-full" />
      ))}
    </div>
  );
}
