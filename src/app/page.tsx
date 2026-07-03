import Link from "next/link";
import { ArrowRight, ArrowDown, Check } from "lucide-react";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { Reveal } from "@/components/marketing/reveal";
import { PhoneMock, BrowserMock } from "@/components/marketing/device-mocks";
import { DemoGame } from "@/components/marketing/demo-game";
import { GamesMarquee } from "@/components/marketing/games-marquee";
import { GamesArsenal } from "@/components/marketing/games-arsenal";
import { Journey } from "@/components/marketing/journey";
import { ProductFilm } from "@/components/marketing/product-film";
import { AppStoreBadge, APP_STORE_URL } from "@/components/marketing/app-store-badge";
import {
  NotesGlyph,
  PathGlyph,
  PlanGlyph,
  TrophyGlyph,
  TimerGlyph,
  FamilyGlyph,
  AppleGlyph,
  SyncGlyph,
  BoltGlyph,
} from "@/components/marketing/glyphs";

/** Small uppercase section label — the editorial "eyebrow". */
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 flex justify-center">
      <span className="rounded-full border px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {children}
      </span>
    </div>
  );
}

const BENTO = [
  {
    Icon: NotesGlyph,
    title: "Anything becomes a study set",
    body: "Paste a link, drop a PDF, or type your notes. Sections, summaries, and questions generate live — you start reading while it finishes.",
    span: "lg:col-span-7",
    visual: (
      <div className="mt-6 space-y-2.5">
        {[88, 64, 76].map((w, i) => (
          <div key={i} className="h-2.5 rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-foreground/10"
              style={{ width: `${w}%` }}
            />
          </div>
        ))}
        <div className="flex gap-1.5 pt-1.5">
          {["Section 1", "Section 2", "12 questions"].map((t) => (
            <span
              key={t}
              className="rounded-full border px-2.5 py-1 text-[11px] font-medium text-muted-foreground"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    ),
  },
  {
    Icon: PathGlyph,
    title: "A reader with a path",
    body: "Notion-style notes, your own highlights, and a branching learning tree that shows exactly what's left.",
    span: "lg:col-span-5",
  },
  {
    Icon: PlanGlyph,
    title: "Exam prep that paces you",
    body: "Set the date, approve your plan, do a little daily. Misses return through spaced repetition until they stick.",
    span: "lg:col-span-5",
  },
  {
    Icon: TrophyGlyph,
    title: "Rounds, records, ranks",
    body: "Every game is a round against your personal best. Points build streaks; streaks build ranks.",
    span: "lg:col-span-7",
    visual: (
      <div className="mt-6">
        <div className="flex items-baseline justify-between text-xs font-medium text-muted-foreground">
          <span>Novice</span>
          <span>Explorer</span>
        </div>
        <div className="mt-2 h-2.5 rounded-full bg-secondary">
          <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-primary to-accent-2" />
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          55 points to the next rank
        </div>
      </div>
    ),
  },
  {
    Icon: TimerGlyph,
    title: "A timer that pays attention",
    body: "Focus sessions pause themselves when you drift and nudge you to break when you've earned it.",
    span: "lg:col-span-6",
  },
  {
    Icon: FamilyGlyph,
    title: "Family progress",
    body: "A guardian view for parents — streaks, time, and accuracy for every learner in the house.",
    span: "lg:col-span-6",
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-clip">
      <SiteHeader />

      {/* ============ Hero — type on paper ============ */}
      <section className="relative pt-36 md:pt-44">
        {/* backdrop: a sheet of paper fading out mid-hero, ruled by a faint grid */}
        <div
          aria-hidden
          className="bg-paper pointer-events-none absolute inset-x-0 top-0 h-[560px] [mask-image:linear-gradient(to_bottom,black_55%,transparent)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[560px] [background-image:linear-gradient(to_right,hsl(var(--border)/0.5)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.5)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(55%_60%_at_50%_10%,black,transparent)]"
        />

        {/* character: pinned study scraps (hidden on small screens) */}
        <Reveal
          delay={500}
          className="pointer-events-none absolute left-[6%] top-48 hidden xl:block"
        >
          <div className="w-40 -rotate-6 animate-wiggle rounded-xl border bg-card p-3.5 shadow-lg [--wiggle-base:-6deg]">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Quiz Rush
            </div>
            <div className="mt-1 flex items-center justify-between text-sm font-semibold">
              7 × 8 = 56
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600">
                <Check className="h-3 w-3" />
              </span>
            </div>
          </div>
        </Reveal>
        <Reveal
          delay={650}
          className="pointer-events-none absolute right-[6%] top-64 hidden xl:block"
        >
          <div className="w-36 rotate-[5deg] animate-wiggle rounded-xl border bg-card p-3.5 shadow-lg [--wiggle-base:5deg]">
            <div className="flex items-center gap-2">
              <BoltGlyph className="h-4 w-4 text-accent-2" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Streak
              </span>
            </div>
            <div className="mt-1 text-sm font-semibold">Day 6 — keep it alive</div>
          </div>
        </Reveal>

        <div className="container relative flex flex-col items-center text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border bg-background/70 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-2" />
              For learners who&apos;d rather be playing
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-8 max-w-4xl text-balance text-5xl font-semibold leading-[1.04] tracking-tight md:text-7xl">
              Studying that
              <span className="relative inline-block font-serif italic text-primary">
                {" "}
                plays back
                {/* hand-drawn underline, drawn on load */}
                <svg
                  viewBox="0 0 220 14"
                  className="absolute -bottom-2 left-2 w-[96%] text-accent-2 md:-bottom-3"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M4 9.5C44 4 96 3 132 6.5c26 2.5 56 3 84-1.5"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    pathLength="1"
                    strokeDasharray="1"
                    className="animate-draw"
                  />
                </svg>
              </span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mx-auto mt-6 max-w-xl text-balance text-lg leading-relaxed text-muted-foreground">
              PlayStudy turns your notes into study sets and 2D arcade games,
              then keeps every score, streak, and plan in sync between the web
              and your phone.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row">
              <Link
                href="/signup"
                className="group inline-flex h-12 items-center gap-2 rounded-full bg-foreground px-7 text-[15px] font-semibold text-background transition-all hover:shadow-lg hover:shadow-foreground/20"
              >
                Start learning free
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="#film"
                className="group inline-flex h-12 items-center gap-2 rounded-full border px-7 text-[15px] font-medium transition-colors hover:bg-secondary"
              >
                Watch it work
                <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
              </a>
            </div>
          </Reveal>
          <Reveal delay={320}>
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <AppleGlyph className="h-4 w-4" /> Also on iPhone — get the app
            </a>
          </Reveal>

          {/* hero product shot */}
          <Reveal delay={380} className="relative mt-16 w-full max-w-4xl md:mt-20">
            <BrowserMock />
          </Reveal>
        </div>
      </section>

      {/* ============ Product film ============ */}
      <section id="film" className="scroll-mt-24 py-24 md:py-32">
        <div className="container">
          <Reveal className="text-center">
            <Eyebrow>How it works</Eyebrow>
            <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-5xl">
              Notes to playing in under a minute
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
              Watch the whole loop — or hover to pause and click through the
              chapters yourself.
            </p>
          </Reveal>
          <Reveal delay={150} className="mt-12">
            <ProductFilm />
          </Reveal>
        </div>
      </section>

      {/* ============ Split screen: mobile + web ============ */}
      <section id="everywhere" className="scroll-mt-24 border-t bg-muted/30 py-24 md:py-32">
        <div className="container">
          <Reveal className="text-center">
            <Eyebrow>Web + iPhone</Eyebrow>
            <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-5xl">
              One account. Every screen.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Start a set on the bus, finish the round at your desk. Everything
              lives in one place, so nothing is ever out of date.
            </p>
          </Reveal>

          <div className="mt-16 grid items-center gap-10 lg:grid-cols-[auto_1fr_auto] lg:gap-6">
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
                      className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-primary"
                    />
                  ))}
                </div>
                <span className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-sm font-medium shadow-sm">
                  <SyncGlyph className="h-4 w-4 text-primary" /> Syncs live
                </span>
                <div className="flex max-w-56 flex-wrap justify-center gap-1.5">
                  {["Study sets", "Scores & streaks", "Preferences", "Exam plans"].map((s) => (
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

            <Reveal delay={400} className="w-full max-w-xl justify-self-center">
              <BrowserMock />
              <div className="mt-6 flex justify-center">
                <Link
                  href="/login"
                  className="group inline-flex h-11 items-center gap-2 rounded-full border px-6 text-sm font-medium transition-colors hover:bg-secondary"
                >
                  Sign in on the web
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ Live demo ============ */}
      <section id="demo" className="scroll-mt-24 py-24 md:py-32">
        <div className="container">
          <Reveal className="text-center">
            <Eyebrow>Live demo</Eyebrow>
            <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-5xl">
              Don&apos;t take our word for it
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
              This is the actual in-app game. Crash, and you&apos;ll meet the
              idea that runs the whole product: answering brings you back.
            </p>
          </Reveal>
          <Reveal delay={150} className="mt-12">
            <DemoGame />
          </Reveal>
        </div>
      </section>

      {/* ============ Games — the arsenal ============ */}
      <section id="games" className="scroll-mt-24 border-t bg-muted/30 py-24 md:py-32">
        <div className="container">
          <Reveal className="text-center">
            <Eyebrow>The arcade</Eyebrow>
            <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-5xl">
              Six games in the arsenal
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Not gamification stickers — real 2D games where the only way
              forward is knowing your material. Each one trains a different
              muscle, and every one runs identically on web and mobile.
            </p>
          </Reveal>
        </div>
        <Reveal delay={120} className="mt-12">
          <GamesMarquee />
        </Reveal>
        <div className="container mt-12">
          <GamesArsenal />
        </div>
      </section>

      {/* ============ The journey — leveling up ============ */}
      <section id="journey" className="scroll-mt-24 py-24 md:py-32">
        <div className="container">
          <Reveal className="text-center">
            <Eyebrow>The journey</Eyebrow>
            <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-5xl">
              Every round levels you up
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Reading sections, finishing quizzes, playing rounds, and keeping
              streaks all earn points — and points climb a real ladder. Seven
              ranks stand between your first set and Legend.
            </p>
          </Reveal>
          <div className="mt-16">
            <Journey />
          </div>
        </div>
      </section>

      {/* ============ Features — bento ============ */}
      <section id="features" className="container scroll-mt-24 py-24 md:py-32">
        <Reveal className="text-center">
          <Eyebrow>Everything else</Eyebrow>
          <h2 className="mx-auto max-w-2xl text-balance text-3xl font-semibold tracking-tight md:text-5xl">
            A full learning platform behind the arcade
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-4 lg:grid-cols-12">
          {BENTO.map((f, i) => (
            <Reveal key={f.title} delay={i * 70} className={f.span}>
              <div className="group h-full rounded-3xl border bg-card p-7 transition-all duration-300 hover:-translate-y-1 hover:border-foreground/20 hover:shadow-xl hover:shadow-black/[0.05]">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary transition-transform duration-300 group-hover:scale-110">
                  <f.Icon className="h-6 w-6 text-foreground/80" />
                </span>
                <h3 className="mt-5 text-lg font-semibold tracking-tight">{f.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                  {f.body}
                </p>
                {f.visual}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="container pb-28">
        <Reveal>
          <div className="relative overflow-hidden rounded-[32px] bg-foreground px-8 py-16 text-center text-background md:py-20">
            {/* quiet texture instead of a glow */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.16] [background-image:linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(70%_90%_at_50%_0%,black,transparent)]"
            />
            <h2 className="relative mx-auto max-w-2xl text-balance text-3xl font-semibold tracking-tight md:text-5xl">
              Press start on studying
            </h2>
            <p className="relative mx-auto mt-4 max-w-md text-background/70">
              Free to try — your first study set takes about a minute.
            </p>
            <div className="relative mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/signup"
                className="group inline-flex h-12 items-center gap-2 rounded-full bg-background px-7 text-[15px] font-semibold text-foreground transition-all hover:shadow-lg"
              >
                Get started free
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <AppStoreBadge />
            </div>
          </div>
        </Reveal>
      </section>

      <SiteFooter />
    </div>
  );
}
