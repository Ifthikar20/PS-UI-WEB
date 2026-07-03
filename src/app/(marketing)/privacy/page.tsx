import type { Metadata } from "next";
import { ProsePage } from "@/components/marketing/prose-page";

export const metadata: Metadata = { title: "Privacy — PlayStudy" };

export default function PrivacyPage() {
  return (
    <ProsePage
      eyebrow="Legal"
      title="Privacy policy"
      lead="The short version: your notes are yours, we collect what the product needs to work, and we don't sell any of it."
    >
      <section>
        <h2>What we collect</h2>
        <ul>
          <li>
            <strong>Account details</strong> — email, name, and sign-in method
            (email/password, Google, or Apple).
          </li>
          <li>
            <strong>Your study material</strong> — the notes, links, and files
            you add, plus the study sets generated from them.
          </li>
          <li>
            <strong>Learning activity</strong> — reading time, quiz results,
            game scores, streaks, and exam-plan progress, used to power your
            dashboard, ranks, and spaced repetition.
          </li>
        </ul>
      </section>
      <section>
        <h2>How it's used</h2>
        <p>
          Solely to run PlayStudy: generating your sets, syncing your account
          across web and iPhone, and showing you your own progress. Aggregated,
          de-identified usage helps us improve the games and generation
          quality. We do not sell personal data or use your notes to advertise
          to you.
        </p>
      </section>
      <section>
        <h2>Where it lives & your controls</h2>
        <p>
          Data is stored on our servers and cached on your devices for offline
          play. You can export or delete your study sets at any time, and
          deleting your account removes your personal data from active systems
          within 30 days. Questions:{" "}
          <a className="font-medium text-primary underline-offset-4 hover:underline" href="mailto:privacy@playstudy.app">
            privacy@playstudy.app
          </a>
          .
        </p>
      </section>
      <p className="text-xs text-muted-foreground">
        This summary is provided for clarity while PlayStudy is in active
        development; the full policy will be published before general
        availability.
      </p>
    </ProsePage>
  );
}
