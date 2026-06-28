"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { RefreshCw, ServerCrash, LogOut } from "lucide-react";
import { auth } from "@/lib/api";
import { Button } from "@/components/ui/button";

/**
 * Shown when the app shell can't load the signed-in user (e.g. the backend is
 * unreachable). Rendered IN PLACE — never as a redirect — because redirecting
 * to /login while the session cookies still exist makes middleware bounce
 * straight back here, which is an infinite /dashboard ↔ /login loop.
 */
export function AppUnavailable({ expired = false }: { expired?: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = React.useState(false);

  async function signOut() {
    setBusy(true);
    try {
      await auth.logout(); // clears the httpOnly session cookies
    } catch {
      /* clear locally regardless */
    }
    // Cookies are gone now, so middleware lets /login render instead of bouncing.
    window.location.href = "/login";
  }

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary">
        <ServerCrash className="h-7 w-7 text-muted-foreground" />
      </div>
      <div>
        <h1 className="text-xl font-semibold">
          {expired ? "Your session expired" : "Can’t reach the server"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {expired
            ? "Please sign in again to continue."
            : "We couldn’t load your account. The server may be starting up or temporarily offline."}
        </p>
      </div>
      <div className="flex gap-2">
        {!expired && (
          <Button onClick={() => router.refresh()} variant="default">
            <RefreshCw className="h-4 w-4" /> Try again
          </Button>
        )}
        <Button onClick={signOut} variant={expired ? "default" : "outline"} disabled={busy}>
          <LogOut className="h-4 w-4" /> Sign out
        </Button>
      </div>
    </div>
  );
}
