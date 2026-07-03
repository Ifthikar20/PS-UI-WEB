import type { Metadata } from "next";
import { ProsePage } from "@/components/marketing/prose-page";

export const metadata: Metadata = { title: "Terms — PlayStudy" };

export default function TermsPage() {
  return (
    <ProsePage
      eyebrow="Legal"
      title="Terms of service"
      lead="The plain-English rules for using PlayStudy."
    >
      <section>
        <h2>Your account</h2>
        <p>
          You need an account to save study sets and progress. Keep your
          credentials to yourself; you&apos;re responsible for activity under
          your account. Learners under 13 need a parent or guardian to set
          things up.
        </p>
      </section>
      <section>
        <h2>Your content</h2>
        <p>
          Notes and files you upload stay yours. You grant us the limited
          rights needed to store them, generate study material from them, and
          sync them to your devices — nothing more. Don&apos;t upload material
          you don&apos;t have the right to use.
        </p>
      </section>
      <section>
        <h2>Fair use</h2>
        <ul>
          <li>Don&apos;t abuse the service, scrape it, or disrupt other learners.</li>
          <li>Don&apos;t attempt to extract or manipulate other users&apos; data.</li>
          <li>Generated content can contain mistakes — verify before the exam.</li>
        </ul>
      </section>
      <section>
        <h2>The service</h2>
        <p>
          PlayStudy is provided “as is” while in active development; features
          may change as we improve them. We may suspend accounts that violate
          these terms. Questions:{" "}
          <a className="font-medium text-primary underline-offset-4 hover:underline" href="mailto:hello@playstudy.app">
            hello@playstudy.app
          </a>
          .
        </p>
      </section>
      <p className="text-xs text-muted-foreground">
        This summary is provided for clarity while PlayStudy is in active
        development; complete terms will be published before general
        availability.
      </p>
    </ProsePage>
  );
}
