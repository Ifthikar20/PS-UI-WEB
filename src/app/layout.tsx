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
  title: "PlayStudy — Turn your notes into games",
  description:
    "Snap a picture of your notes and we'll generate quizzes, flashcards, and games to make learning fun.",
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
