import type { Metadata } from "next";
import { ProsePage } from "@/components/marketing/prose-page";

export const metadata: Metadata = { title: "Contact — PlayStudy" };

export default function ContactPage() {
  return (
    <ProsePage
      eyebrow="Contact"
      title="Talk to us"
      lead="Questions, feedback, or a bug that got past Pip — we read everything."
    >
      <section>
        <h2>Support</h2>
        <p>
          Email{" "}
          <a className="font-medium text-primary underline-offset-4 hover:underline" href="mailto:support@playstudy.app">
            support@playstudy.app
          </a>{" "}
          and include the device you&apos;re on (web or iPhone) plus what you
          were doing — screenshots help a lot. We aim to reply within two
          business days.
        </p>
      </section>
      <section>
        <h2>Feedback & ideas</h2>
        <p>
          Feature requests and game ideas go to{" "}
          <a className="font-medium text-primary underline-offset-4 hover:underline" href="mailto:hello@playstudy.app">
            hello@playstudy.app
          </a>
          . Tell us what you&apos;re studying — the arcade grows in the
          directions learners pull it.
        </p>
      </section>
      <section>
        <h2>Schools & families</h2>
        <p>
          Using PlayStudy with a class or several kids at home? Reach out at{" "}
          <a className="font-medium text-primary underline-offset-4 hover:underline" href="mailto:hello@playstudy.app">
            hello@playstudy.app
          </a>{" "}
          and we&apos;ll help you set up guardian views and shared sets.
        </p>
      </section>
    </ProsePage>
  );
}
