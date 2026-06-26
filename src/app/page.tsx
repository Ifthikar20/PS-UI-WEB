import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  BookOpen,
  Gamepad2,
  Trophy,
  CalendarCheck,
  Users,
  Brain,
} from "lucide-react";
import { SiteHeader } from "@/components/marketing/site-header";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const FEATURES = [
  {
    icon: Sparkles,
    title: "Turn anything into a study set",
    body: "Paste a link, upload a PDF, or snap your notes. We generate summaries, quizzes, and games automatically.",
    accent: "bg-pastel-lime",
  },
  {
    icon: BookOpen,
    title: "Study section by section",
    body: "Bite-sized sections with a quiz gate so you actually retain what you read.",
    accent: "bg-pastel-sky",
  },
  {
    icon: Gamepad2,
    title: "Learn by playing",
    body: "Your study set powers arcade games — answer questions to keep playing.",
    accent: "bg-pastel-peach",
  },
  {
    icon: CalendarCheck,
    title: "Exam prep plans",
    body: "Set an exam date and get a daily question schedule that paces you to the finish.",
    accent: "bg-pastel-mint",
  },
  {
    icon: Trophy,
    title: "Build a streak & climb ranks",
    body: "Earn points for every session, keep your streak alive, and rank up from Novice to Legend.",
    accent: "bg-pastel-lavender",
  },
  {
    icon: Users,
    title: "Family progress",
    body: "Parents can follow along with a guardian dashboard for each learner.",
    accent: "bg-pastel-sky",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Add your material",
    body: "Link, file, or text — whatever you're studying.",
  },
  {
    n: "02",
    title: "We generate everything",
    body: "Summaries, quizzes, flashcards, and word games in seconds.",
  },
  {
    n: "03",
    title: "Study & play",
    body: "Read, quiz, and play games that reinforce what matters.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      {/* Hero */}
      <section className="container flex flex-col items-center py-20 text-center md:py-32">
        <div className="inline-flex items-center gap-2 rounded-full border bg-secondary px-4 py-1.5 text-sm font-medium animate-fade-in">
          <Sparkles className="h-4 w-4" />
          Study notes, reinvented as games
        </div>
        <h1 className="mt-6 max-w-3xl text-4xl font-bold tracking-tight md:text-6xl animate-fade-in">
          Turn your notes into
          <span className="block">interactive learning.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-muted-foreground animate-fade-in">
          PlayStudy turns any link, document, or photo of your notes into
          quizzes, flashcards, and arcade games — so studying actually sticks.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row animate-fade-in">
          <Button size="lg" asChild>
            <Link href="/signup">
              Start free <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/login">I already have an account</Link>
          </Button>
        </div>

        {/* Hero mock board */}
        <div className="mt-16 w-full max-w-4xl">
          <Card className="overflow-hidden border-2 p-2 shadow-xl">
            <div className="grid gap-2 rounded-lg bg-muted/40 p-4 md:grid-cols-3">
              {[
                { label: "Biology 101", tone: "bg-pastel-mint" },
                { label: "World History", tone: "bg-pastel-peach" },
                { label: "Organic Chem", tone: "bg-pastel-lavender" },
              ].map((c) => (
                <div
                  key={c.label}
                  className="rounded-xl border bg-card p-4 text-left"
                >
                  <div
                    className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${c.tone} text-black`}
                  >
                    <Brain className="h-5 w-5" />
                  </div>
                  <div className="font-semibold">{c.label}</div>
                  <div className="text-xs text-muted-foreground">
                    12 sections · 40 questions
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t bg-muted/30 py-20">
        <div className="container">
          <h2 className="text-center text-3xl font-bold tracking-tight md:text-4xl">
            Everything you need to learn faster
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground">
            The same features you love on mobile, now on the web.
          </p>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <Card key={f.title} className="p-6 transition-shadow hover:shadow-md">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${f.accent} text-black`}
                >
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Games */}
      <section id="games" className="py-20">
        <div className="container grid items-center gap-12 lg:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border bg-secondary px-3 py-1 text-sm font-medium">
              <Gamepad2 className="h-4 w-4" /> The same games as the app
            </div>
            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
              Your notes, now playable
            </h2>
            <p className="mt-4 text-muted-foreground">
              Quiz Rush, Word Pop, Flashcard Sprint and more run right in your
              browser — powered by the exact same game engine as the mobile app.
              Answer questions from your study set to keep the game going.
            </p>
            <Button className="mt-6" asChild>
              <Link href="/signup">
                Play your first game <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { name: "Quiz Rush", tone: "bg-pastel-lime" },
              { name: "Word Pop", tone: "bg-pastel-sky" },
              { name: "Flashcard Sprint", tone: "bg-pastel-peach" },
              { name: "True / False", tone: "bg-pastel-lavender" },
            ].map((g) => (
              <Card
                key={g.name}
                className={`flex aspect-square flex-col justify-end ${g.tone} border-none p-5 text-black`}
              >
                <Gamepad2 className="h-7 w-7" />
                <span className="mt-2 font-semibold">{g.name}</span>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="border-t bg-muted/30 py-20">
        <div className="container">
          <h2 className="text-center text-3xl font-bold tracking-tight md:text-4xl">
            Three steps to smarter studying
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n} className="rounded-xl border bg-card p-6">
                <div className="text-3xl font-bold text-muted-foreground/40">
                  {s.n}
                </div>
                <h3 className="mt-3 font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container py-24">
        <Card className="flex flex-col items-center gap-6 bg-primary p-12 text-center text-primary-foreground">
          <h2 className="max-w-xl text-3xl font-bold tracking-tight md:text-4xl">
            Ready to make studying fun?
          </h2>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/signup">
              Get started for free <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </Card>
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
