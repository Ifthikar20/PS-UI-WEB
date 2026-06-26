import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { django } from "@/lib/server/django";
import { isAuthenticated } from "@/lib/server/session";
import { SessionProvider } from "@/components/app/session-provider";
import { FlavorProvider } from "@/components/app/flavor-provider";
import { Sidebar, MobileNav } from "@/components/app/sidebar";
import { Topbar } from "@/components/app/topbar";
import { DEFAULT_FLAVOR, isFlavor, FLAVOR_COOKIE } from "@/lib/flavor";
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

  const cookieFlavor = (await cookies()).get(FLAVOR_COOKIE)?.value;
  const flavor = isFlavor(cookieFlavor) ? cookieFlavor : DEFAULT_FLAVOR;

  return (
    <SessionProvider initial={me}>
      <FlavorProvider initial={flavor}>
        {/* Gray canvas behind the card-shaped app frame (Airbnb style). */}
        <div
          data-flavor={flavor}
          className="min-h-screen bg-canvas lg:p-4"
        >
          <div className="mx-auto flex min-h-screen max-w-[1600px] overflow-hidden border bg-background shadow-sm lg:min-h-[calc(100vh-2rem)] lg:rounded-3xl">
            <Sidebar />
            <div className="flex min-w-0 flex-1 flex-col">
              <Topbar />
              <main className="flex-1 px-4 pb-24 pt-6 md:px-8 lg:pb-10">
                {children}
              </main>
            </div>
            <MobileNav />
          </div>
        </div>
      </FlavorProvider>
    </SessionProvider>
  );
}
