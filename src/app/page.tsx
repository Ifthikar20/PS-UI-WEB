import type * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  BookOpen,
  Gamepad2,
  Trophy,
  CalendarCheck,
  Users,
  Play,
  RefreshCw,
  Monitor,
} from "lucide-react";
import { SiteHeader } from "@/components/marketing/site-header";
import { Reveal } from "@/components/marketing/reveal";
import { PhoneMock, BrowserMock } from "@/components/marketing/device-mocks";
import { DemoGame } from "@/components/marketing/demo-game";
import { GamesMarquee } from "@/components/marketing/games-marquee";
import { AppStoreBadge } from "@/components/marketing/app-store-badge";
import { Logo } from "@/components/logo";
import { Pip } from "@/components/pip";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const FEATURES = [
  {
    icon: Sparkles,
    title: "Turn anything into a study set",
    body: "Paste a link, upload a PDF, or snap your notes. Summaries, quizzes, and games are generated automatically — and appear live as they're created.",
  },
  {
    icon: Gamepad2,
    title: "Learn by playing",
    body: "Six 2D arcade games run on your material. Crash in Flappy Pip? Answer a question to revive. Clear a wave? Answer to launch the next.",
  },
  {
    icon: BookOpen,
    title: "A reader that works like you do",
    body: "Notion-style notes with highlighting, section-by-section progress, and a branching learning path.",
  },
  {
    icon: CalendarCheck,
    title: "Exam prep that paces you",
    body: "Set a date, approve your AI study guide, then read + answer a little every day. Misses go into spaced repetition until you've got them.",
  },
  {
    icon: Trophy,
    title: "Scores, streaks & ranks",
    body: "Every round earns points. Beat your personal best, keep the streak alive, climb from Novice upward.",
  },
  {
    icon: Users,
    title: "Family progress",
    body: "Parents can follow along with a guardian dashboard for each learner.",
  },
];

const STEPS = [
  { n: "01", title: "Add your material", body: "Link, file, or text — whatever you're studying." },
  { n: "02", title: "Read & play", body: "Study the sections, then let the arcade quiz you on them." },
  { n: "03", title: "Level up", body: "Beat your best, keep your streak, and watch it stick." },
];

const SYNC_ITEMS = ["Study sets", "Scores & streaks", "Preferences", "Exam plans"];

/** Floating arcade décor for the hero (hidden on small screens). */
const FLOATERS: { emoji: string; className: string; delay: string; rot: string }[] = [
  { emoji: "🐤", className: "left-[8%] top-24 text-5xl", delay: "0s", rot: "-8deg" },
  { emoji: "🚀", className: "right-[10%] top-32 text-5xl", delay: "0.8s", rot: "10deg" },
  { emoji: "⚡", className: "left-[16%] bottom-24 text-4xl", delay: "1.6s", rot: "6deg" },
  { emoji: "🫧", className: "right-[18%] bottom-16 text-4xl", delay: "2.4s", rot: "-6deg" },
  { emoji: "⭐", className: "left-[38%] top-10 text-3xl", delay: "1.2s", rot: "12deg" },
  { emoji: "🏆", className: "right-[34%] bottom-6 text-3xl", delay: "2s", rot: "-10deg" },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-clip">
      <SiteHeader />

      {/* ============ Hero ============ */}
      <section className="relative">
        {/* gradient glows */}
        <div className="pointer-events-none absolute -top-32 left-1/2 h-[480px] w-[720px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />
        <div className="pointer-events-none absolute right-[12%] top-40 h-64 w-64 rounded-full bg-accent-2/20 blur-[90px]" />
        {/* floating arcade bits */}
        {FLOATERS.map((f) => (
          <span
            key={f.emoji}
            aria-hidden
            style={{ animationDelay: f.delay, "--float-rot": f.rot } as React.CSSProperties}
            className={`pointer-events-none absolute hidden animate-float drop-shadow-lg md:block ${f.className}`}
          >
            {f.emoji}
          </span>
        ))}

        <div className="container relative flex flex-col items-center py-20 text-center md:py-28">
          <div className="inline-flex items-center gap-2 rounded-full border bg-secondary/80 px-4 py-1.5 text-sm font-medium backdrop-blur animate-fade-in">
            <Pip size={20} /> The arcade that studies with you
          </div>
          <h1 className="mt-6 max-w-4xl text-4xl font-black tracking-tight md:text-7xl animate-fade-in">
            Your notes,
            <span className="block bg-gradient-to-r from-primary via-primary to-accent-2 bg-clip-text text-transparent">
              playable.
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground animate-fade-in">
            PlayStudy turns what you&apos;re learning into 2D arcade games,
            quizzes, and daily challenges — on the web and on your phone, always
            in sync.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row animate-fade-in">
            <Button size="lg" className="px-8 text-base" asChild>
              <Link href="/signup">
                Start free <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="px-8 text-base" asChild>
              <a href="#demo">
                <Play className="h-4 w-4 fill-current" /> Play the demo
              </a>
            </Button>
          </div>
          <div className="mt-6 animate-fade-in">
            <AppStoreBadge />
          </div>
        </div>
      </section>

      {/* ============ Split screen: mobile + web ============ */}
      <section id="everywhere" className="border-t bg-muted/30 py-24">
        <div className="container">
          <Reveal className="text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
              One account. Every screen.
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              Start a set on your phone on the bus, finish the round on your
              laptop. Everything lives in one place, so nothing is ever out of
              date.
            </p>
          </Reveal>

          <div className="mt-14 grid items-center gap-10 lg:grid-cols-[auto_1fr_auto] lg:gap-6">
            {/* phone */}
            <Reveal delay={100} className="justify-self-center">
              <PhoneMock />
              <div className="mt-6 flex justify-center">
                <AppStoreBadge />
              </div>
            </Reveal>

            {/* sync connector */}
            <Reveal delay={250} className="justify-self-center">
              <div className="flex flex-col items-center gap-3 lg:min-w-52">
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <span
                      key={i}
                      style={{ animationDelay: `${i * 0.18}s` }}
                      className="h-2 w-2 animate-pulse-dot rounded-full bg-primary"
                    />
                  ))}
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full border bg-background px-4 py-1.5 text-sm font-semibold shadow-sm">
                  <RefreshCw className="h-4 w-4 text-primary" /> Syncs live
                </span>
                <div className="flex max-w-56 flex-wrap justify-center gap-1.5">
                  {SYNC_ITEMS.map((s) => (
                    <span
                      key={s}
                      className="rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* browser */}
            <Reveal delay={400} className="w-full max-w-xl justify-self-center">
              <BrowserMock />
              <div className="mt-6 flex justify-center">
                <Button size="lg" variant="outline" asChild>
                  <Link href="/login">
                    <Monitor className="h-4 w-4" /> Sign in on the web
                  </Link>
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ Playable demo ============ */}
      <section id="demo" className="py-24">
        <div className="container">
          <Reveal className="text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
              Don&apos;t take our word for it
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              This is the actual in-app game, right here on the page. Crash and
              you&apos;ll see the trick: answering a question brings you back.
            </p>
          </Reveal>
          <Reveal delay={150} className="mt-12">
            <DemoGame />
          </Reveal>
        </div>
      </section>

      {/* ============ 2D games ============ */}
      <section id="games" className="border-t bg-muted/30 py-24">
        <div className="container">
          <Reveal className="text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
              Built around 2D games
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              Not gamification stickers — real arcade games where the only way
              forward is knowing your material. One implementation per game,
              identical on web and mobile.
            </p>
          </Reveal>
        </div>
        <Reveal delay={150} className="mt-12">
          <GamesMarquee />
        </Reveal>
      </section>

      {/* ============ Features ============ */}
      <section id="features" className="container py-24">
        <Reveal className="text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
            A whole learning platform behind the arcade
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 80}>
              <Card className="h-full p-6 transition-all hover:-translate-y-1 hover:shadow-lg">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                  <f.icon className="h-6 w-6 text-primary" />
                </span>
                <h3 className="mt-4 font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ How it works ============ */}
      <section id="how" className="border-t bg-muted/30 py-24">
        <div className="container">
          <Reveal>
            <h2 className="text-center text-3xl font-bold tracking-tight md:text-4xl">
              Three steps to smarter studying
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 120}>
                <div className="h-full rounded-xl border bg-card p-6">
                  <div className="text-3xl font-bold text-primary/30">{s.n}</div>
                  <h3 className="mt-3 font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="container py-24">
        <Reveal>
          <Card className="relative flex flex-col items-center gap-6 overflow-hidden bg-primary p-12 text-center text-primary-foreground">
            <span aria-hidden className="pointer-events-none absolute -left-4 top-6 rotate-[-12deg] text-6xl opacity-20">🐤</span>
            <span aria-hidden className="pointer-events-none absolute -right-2 bottom-4 rotate-[10deg] text-6xl opacity-20">🚀</span>
            <h2 className="max-w-xl text-3xl font-bold tracking-tight md:text-4xl">
              Ready to press start on studying?
            </h2>
            <div className="flex flex-col items-center gap-3 sm:flex-row">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/signup">
                  Get started for free <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <AppStoreBadge />
            </div>
          </Card>
        </Reveal>
      </section>

      {/* Footer */}
      <footer className="border-t py-10">
        <div className="container flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
          <Logo />
          <p>© {new Date().getFullYear()} PlayStudy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
