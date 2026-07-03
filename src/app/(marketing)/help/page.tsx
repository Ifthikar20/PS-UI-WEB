import type { Metadata } from "next";
import { ProsePage } from "@/components/marketing/prose-page";

export const metadata: Metadata = { title: "Help — PlayStudy" };

const FAQS: { q: string; a: string }[] = [
  {
    q: "How do I create a study set?",
    a: "Hit “New study set” and paste notes, a link, or upload a PDF. The set opens immediately and fills in live — sections and questions appear as they're generated, so you can start reading right away.",
  },
  {
    q: "How do the games use my material?",
    a: "Every arcade game pulls questions (or key terms) from the study set you launch it with. Crashing, clearing a wave, or advancing usually requires answering one — that's the point.",
  },
  {
    q: "What are points, streaks, and ranks?",
    a: "Finishing quizzes, playing rounds, and completing focus sessions earn points. Daily activity keeps a streak alive, and total points climb the rank ladder from Novice (0) to Legend (2,200).",
  },
  {
    q: "How does exam prep work?",
    a: "Create a plan with your exam date, review and approve the generated study guide, then do the short daily session — read a section, answer its questions. Anything you miss returns via spaced repetition until you get it right.",
  },
  {
    q: "Does my progress sync between web and iPhone?",
    a: "Yes. Study sets, scores, streaks, exam plans, and preferences (like theme and dashboard flavor) live in your account and sync live across devices.",
  },
  {
    q: "Why did my focus timer pause itself?",
    a: "The timer tracks real activity. If there's no interaction for about six minutes — or the tab goes to the background — it pauses and tells you why. Scroll, click, or type to resume.",
  },
];

export default function HelpPage() {
  return (
    <ProsePage
      eyebrow="Help"
      title="Frequently asked"
      lead="Quick answers to the questions we hear most. Can't find yours? Write to support@playstudy.app."
    >
      <div className="divide-y rounded-2xl border">
        {FAQS.map((f) => (
          <details key={f.q} className="group px-5 py-4 open:bg-muted/40">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-medium marker:hidden">
              {f.q}
              <span className="text-muted-foreground transition-transform duration-200 group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="pt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
          </details>
        ))}
      </div>
    </ProsePage>
  );
}
