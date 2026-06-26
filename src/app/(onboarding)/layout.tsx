import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/server/session";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAuthenticated())) redirect("/login");
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <header className="container flex h-16 items-center justify-between">
        <Logo href="/dashboard" />
        <ThemeToggle />
      </header>
      <main className="flex flex-1 items-center justify-center px-6 py-10">
        {children}
      </main>
    </div>
  );
}
