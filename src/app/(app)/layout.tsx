import { redirect } from "next/navigation";
import { django } from "@/lib/server/django";
import { isAuthenticated } from "@/lib/server/session";
import { SessionProvider } from "@/components/app/session-provider";
import { Sidebar, MobileNav } from "@/components/app/sidebar";
import { Topbar } from "@/components/app/topbar";
import type { Me } from "@/lib/types";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAuthenticated())) redirect("/login");

  let me: Me | null = null;
  try {
    me = await django<Me>("me/");
  } catch {
    redirect("/login");
  }

  return (
    <SessionProvider initial={me}>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar />
          <main className="flex-1 px-4 pb-24 pt-6 md:px-8 lg:pb-10">
            {children}
          </main>
        </div>
        <MobileNav />
      </div>
    </SessionProvider>
  );
}
