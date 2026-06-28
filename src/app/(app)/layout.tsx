import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { django, DjangoError } from "@/lib/server/django";
import { isAuthenticated } from "@/lib/server/session";
import { SessionProvider } from "@/components/app/session-provider";
import { FlavorProvider } from "@/components/app/flavor-provider";
import { FocusTimerProvider } from "@/components/app/focus-timer-provider";
import { PreferenceSync } from "@/components/app/preference-sync";
import { Sidebar, MobileNav } from "@/components/app/sidebar";
import { Topbar } from "@/components/app/topbar";
import { AppUnavailable } from "@/components/app/app-unavailable";
import { DEFAULT_FLAVOR, isFlavor, FLAVOR_COOKIE } from "@/lib/flavor";
import type { Me } from "@/lib/types";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAuthenticated())) redirect("/login");

  // Load the signed-in user. If this fails we must NOT redirect to /login:
  // the session cookies still exist, so middleware would bounce /login right
  // back here — an infinite /dashboard ↔ /login loop. Instead render a
  // recovery screen in place (the user can retry or sign out).
  let me: Me | null = null;
  try {
    me = await django<Me>("me/");
  } catch (e) {
    const expired = e instanceof DjangoError && (e.status === 401 || e.status === 403);
    return <AppUnavailable expired={expired} />;
  }

  const cookieFlavor = (await cookies()).get(FLAVOR_COOKIE)?.value;
  const flavor = isFlavor(cookieFlavor) ? cookieFlavor : DEFAULT_FLAVOR;

  return (
    <SessionProvider initial={me}>
      <FlavorProvider initial={flavor}>
        <FocusTimerProvider>
          <PreferenceSync />
          {/* Full-bleed dashboard: sidebar + content fill the viewport. */}
          <div data-flavor={flavor} className="flex min-h-screen bg-background">
            <Sidebar />
            <div className="flex min-w-0 flex-1 flex-col">
              <Topbar />
              <main className="flex-1 px-4 pb-24 pt-6 md:px-8 lg:pb-10">
                {children}
              </main>
            </div>
            <MobileNav />
          </div>
        </FocusTimerProvider>
      </FlavorProvider>
    </SessionProvider>
  );
}
