import type { Metadata } from "next";
import { Inter, Lora, Patrick_Hand } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Reader fonts: a comfortable serif and a handwritten "notes" face.
const lora = Lora({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const patrickHand = Patrick_Hand({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-notes",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://playstudy.ai"),
  title: "PlayStudy — Turn your notes into games",
  description:
    "Turn any notes into study sets, quizzes, and arcade games — Quiz Rush, Word Pop, Flappy Quiz, and more. Learn by playing, on the web and iPhone.",
  applicationName: "PlayStudy",
  keywords: [
    "study games",
    "flashcards",
    "quiz maker",
    "exam prep",
    "learning app",
  ],
  openGraph: {
    type: "website",
    url: "https://playstudy.ai",
    siteName: "PlayStudy",
    title: "PlayStudy — Turn your notes into games",
    description:
      "Turn any notes into study sets, quizzes, and arcade games. Learn by playing, on the web and iPhone.",
  },
  twitter: {
    card: "summary_large_image",
    title: "PlayStudy — Turn your notes into games",
    description:
      "Turn any notes into study sets, quizzes, and arcade games. Learn by playing.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${lora.variable} ${patrickHand.variable} font-sans`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
