"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  School,
  BookOpen,
  GraduationCap,
} from "lucide-react";
import { Pip } from "@/components/pip";
import {
  NotesGlyph,
  BirdGlyph,
  TrophyGlyph,
} from "@/components/marketing/glyphs";
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

/**
 * Sign-up questionnaire — the interactive front door of the learning platform.
 * Three quick steps: a welcome that says what PlayStudy does, a level pick
 * (big, colorful cards that live-preview the dashboard flavor), and — for
 * college — a vibe pick. Progress dots up top; skipping is always allowed.
 */

const LEVELS: {
  value: EduLevel;
  title: string;
  sub: string;
  Icon: typeof School;
  tile: string; // icon tile styling
}[] = [
  {
    value: "school",
    title: "High school or younger",
    sub: "Bright, playful, and game-first.",
    Icon: School,
    tile: "bg-violet-500/15 text-violet-500",
  },
  {
    value: "college",
    title: "College",
    sub: "Clean and focused, with a study timer.",
    Icon: BookOpen,
    tile: "bg-primary/15 text-primary",
  },
  {
    value: "university",
    title: "University & above",
    sub: "A refined, professional workspace.",
    Icon: GraduationCap,
    tile: "bg-amber-500/15 text-amber-600",
  },
];

const VALUE_PROPS: {
  Icon: (p: { className?: string }) => React.JSX.Element;
  title: string;
  sub: string;
}[] = [
  { Icon: NotesGlyph, title: "Notes in", sub: "Paste notes, links, or PDFs" },
  { Icon: BirdGlyph, title: "Games out", sub: "Your material becomes the arcade" },
  { Icon: TrophyGlyph, title: "Progress up", sub: "Scores, streaks, and ranks" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = React.useState<0 | 1 | 2>(0);
  const [level, setLevel] = React.useState<EduLevel | null>(null);
  const [pink, setPink] = React.useState(false);

  // Live-preview the flavor as choices are made.
  const previewFlavor: Flavor | null = level
    ? flavorForLevel(level, pink)
    : null;
  React.useEffect(() => {
    if (previewFlavor) document.documentElement.dataset.flavor = previewFlavor;
  }, [previewFlavor]);

  function finish(flavor: Flavor) {
    writeFlavorCookie(flavor);
    router.push("/dashboard");
    router.refresh();
  }

  function continueFromLevel() {
    if (!level) return;
    if (level === "college") setStep(2);
    else finish(flavorForLevel(level));
  }

  const steps = level === "college" ? 3 : 2;

  return (
    <Card className="w-full max-w-2xl animate-fade-in p-8">
      {/* progress dots */}
      <div className="mb-6 flex items-center justify-center gap-2">
        {Array.from({ length: steps }).map((_, i) => (
          <span
            key={i}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              i === step ? "w-8 bg-primary" : "w-2 bg-border",
              i < step && "bg-primary/50",
            )}
          />
        ))}
      </div>

      {step === 0 && (
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-3xl bg-primary/10">
            <Pip size={72} />
          </div>
          <h1 className="text-2xl font-bold md:text-3xl">
            Make studying feel like play
          </h1>
          <p className="mx-auto mt-2 max-w-md text-muted-foreground">
            Pip turns your notes into study sets, quizzes, and arcade games —
            so practice actually happens.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {VALUE_PROPS.map((v) => (
              <div key={v.title} className="rounded-2xl border bg-background p-4">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <v.Icon className="h-6 w-6 text-primary" />
                </span>
                <div className="mt-2 font-semibold">{v.title}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">{v.sub}</div>
              </div>
            ))}
          </div>
          <Button
            size="lg"
            className="mt-6 w-full text-base sm:w-auto sm:px-10"
            onClick={() => setStep(1)}
          >
            Get started <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      )}

      {step === 1 && (
        <div>
          <h1 className="text-xl font-bold md:text-2xl">What describes you best?</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            We&apos;ll shape your whole dashboard around this — watch the colors
            change as you pick. You can switch anytime in Settings.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {LEVELS.map((l) => {
              const selected = level === l.value;
              return (
                <button
                  key={l.value}
                  onClick={() => setLevel(l.value)}
                  className={cn(
                    "group rounded-2xl border p-5 text-left transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md",
                    selected && "border-primary ring-2 ring-primary",
                  )}
                >
                  <div className="flex items-start justify-between">
                    <span
                      className={cn(
                        "flex h-16 w-16 items-center justify-center rounded-2xl transition-transform group-hover:scale-110",
                        l.tile,
                      )}
                    >
                      <l.Icon className="h-8 w-8" />
                    </span>
                    {selected && (
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Check className="h-4 w-4" />
                      </span>
                    )}
                  </div>
                  <div className="mt-3 font-semibold leading-tight">{l.title}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{l.sub}</div>
                </button>
              );
            })}
          </div>
          <div className="mt-6 flex items-center gap-3">
            <Button variant="outline" onClick={() => setStep(0)}>
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            <Button className="flex-1" size="lg" disabled={!level} onClick={continueFromLevel}>
              Continue <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <h1 className="text-xl font-bold md:text-2xl">Pick your vibe</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Same focused layout — two palettes. Live-previewing as you choose.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {(["focus", "rose"] as Flavor[]).map((f) => {
              const meta = FLAVOR_META[f];
              const selected = (f === "rose") === pink;
              return (
                <button
                  key={f}
                  onClick={() => setPink(f === "rose")}
                  className={cn(
                    "rounded-2xl border p-6 text-left transition-all hover:-translate-y-0.5 hover:shadow-md",
                    selected && "border-primary ring-2 ring-primary",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex -space-x-2">
                      <span
                        className="h-8 w-8 rounded-full ring-2 ring-card"
                        style={{ backgroundColor: meta.swatch[0] }}
                      />
                      <span
                        className="h-8 w-8 rounded-full ring-2 ring-card"
                        style={{ backgroundColor: meta.swatch[1] }}
                      />
                    </span>
                    {selected && (
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Check className="h-4 w-4" />
                      </span>
                    )}
                  </div>
                  <div className="mt-3 text-lg font-semibold">{meta.label}</div>
                  <div className="text-sm text-muted-foreground">{meta.blurb}</div>
                </button>
              );
            })}
          </div>
          <div className="mt-6 flex gap-3">
            <Button variant="outline" onClick={() => setStep(1)}>
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            <Button
              className="flex-1"
              size="lg"
              onClick={() => finish(flavorForLevel("college", pink))}
            >
              Enter PlayStudy <ArrowRight className="h-5 w-5" />
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
