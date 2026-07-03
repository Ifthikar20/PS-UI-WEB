import type { Metadata } from "next";
import { ProsePage } from "@/components/marketing/prose-page";

export const metadata: Metadata = { title: "About — PlayStudy" };

export default function AboutPage() {
  return (
    <ProsePage
      eyebrow="About"
      title="Studying shouldn't feel like a chore"
      lead="PlayStudy exists because the most effective way to learn — active recall, spaced out over time — is also the easiest to skip. So we made it the fun part."
    >
      <section>
        <h2>What we build</h2>
        <p>
          PlayStudy turns whatever you&apos;re learning — pasted notes, links,
          PDFs — into study sets: readable sections, summaries, and question
          banks. Those questions then power a 2D arcade, daily exam-prep
          sessions, and spaced-repetition review, so the material comes back to
          you again and again until it sticks.
        </p>
      </section>
      <section>
        <h2>How we think about learning</h2>
        <ul>
          <li>
            <strong>Recall beats rereading.</strong> Every game and session is
            built around retrieving answers, not skimming pages.
          </li>
          <li>
            <strong>Little and often wins.</strong> Streaks, daily plans, and
            short rounds make five minutes on the bus count.
          </li>
          <li>
            <strong>Progress should be visible.</strong> Points, ranks, and
            activity charts show the work adding up — from Novice to Legend.
          </li>
        </ul>
      </section>
      <section>
        <h2>Where it runs</h2>
        <p>
          One account works everywhere: the web app and the iPhone app share
          the same study sets, scores, streaks, plans, and preferences, synced
          live. Pip — the orange pup on our logo — rides along on both.
        </p>
      </section>
    </ProsePage>
  );
}
