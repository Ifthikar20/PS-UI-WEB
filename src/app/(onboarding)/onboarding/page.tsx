"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, School, BookOpen, ArrowRight, Check } from "lucide-react";
import { Pip } from "@/components/pip";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  flavorForLevel,
  writeFlavorCookie,
  FLAVOR_META,
  type EduLevel,
  type Flavor,
} from "@/lib/flavor";

const LEVELS: {
  value: EduLevel;
  title: string;
  sub: string;
  icon: typeof School;
}[] = [
  {
    value: "school",
    title: "High school or younger",
    sub: "A bright, playful, game-first experience.",
    icon: School,
  },
  {
    value: "college",
    title: "College",
    sub: "A clean, focused dashboard with a study timer.",
    icon: BookOpen,
  },
  {
    value: "university",
    title: "University & above",
    sub: "A refined, professional workspace.",
    icon: GraduationCap,
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = React.useState<1 | 2>(1);
  const [level, setLevel] = React.useState<EduLevel | null>(null);
  const [pink, setPink] = React.useState(false);

  // Live-preview the flavor as choices are made.
  const previewFlavor: Flavor | null = level
    ? flavorForLevel(level, pink)
    : null;
  React.useEffect(() => {
    if (previewFlavor) document.documentElement.dataset.flavor = previewFlavor;
  }, [previewFlavor]);

  function pickLevel(value: EduLevel) {
    setLevel(value);
    if (value === "college") {
      setStep(2);
    } else {
      finish(flavorForLevel(value));
    }
  }

  function finish(flavor: Flavor) {
    writeFlavorCookie(flavor);
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <Card className="w-full max-w-2xl animate-fade-in p-8">
      <div className="mb-6 flex items-center gap-3">
        <span className="rounded-2xl bg-primary/10 p-2">
          <Pip size={40} />
        </span>
        <div>
          <h1 className="text-xl font-bold">Let&apos;s set up your space</h1>
          <p className="text-sm text-muted-foreground">
            We&apos;ll tailor your dashboard to fit you.
          </p>
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-3">
          <p className="text-sm font-medium">Where are you in your studies?</p>
          {LEVELS.map((l) => (
            <button
              key={l.value}
              onClick={() => pickLevel(l.value)}
              className={cn(
                "flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-colors hover:bg-accent",
                level === l.value && "border-primary ring-1 ring-primary",
              )}
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary">
                <l.icon className="h-5 w-5" />
              </span>
              <span className="flex-1">
                <span className="block font-semibold">{l.title}</span>
                <span className="block text-sm text-muted-foreground">
                  {l.sub}
                </span>
              </span>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <p className="text-sm font-medium">Pick your vibe</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {(["focus", "rose"] as Flavor[]).map((f) => {
              const meta = FLAVOR_META[f];
              const selected = (f === "rose") === pink;
              return (
                <button
                  key={f}
                  onClick={() => setPink(f === "rose")}
                  className={cn(
                    "rounded-xl border p-5 text-left transition-colors hover:bg-accent",
                    selected && "border-primary ring-1 ring-primary",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{meta.emoji}</span>
                    {selected && <Check className="h-4 w-4 text-primary" />}
                  </div>
                  <div className="mt-2 font-semibold">{meta.label}</div>
                  <div className="text-sm text-muted-foreground">
                    {meta.blurb}
                  </div>
                </button>
              );
            })}
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button
              className="flex-1"
              onClick={() => finish(flavorForLevel("college", pink))}
            >
              Enter PlayStudy <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <button
        onClick={() => finish("focus")}
        className="mx-auto mt-6 block text-xs text-muted-foreground hover:text-foreground"
      >
        Skip for now
      </button>
    </Card>
  );
}
