"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { api, auth } from "@/lib/api";
import type { Me } from "@/lib/types";

type SessionContextValue = {
  me: Me | null;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
  /** Read a synced preference value. */
  getPref: <T>(key: string, fallback: T) => T;
  /** Persist a preference to the server (merge) + update local state. */
  savePref: (key: string, value: unknown) => void;
};

const SessionContext = React.createContext<SessionContextValue | null>(null);

export function SessionProvider({
  initial,
  children,
}: {
  initial: Me | null;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [me, setMe] = React.useState<Me | null>(initial);

  const refresh = React.useCallback(async () => {
    try {
      const data = await auth.session();
      setMe(data?.user ? (data as Me) : null);
    } catch {
      setMe(null);
    }
  }, []);

  const logout = React.useCallback(async () => {
    try {
      await auth.logout();
    } finally {
      setMe(null);
      router.push("/login");
      router.refresh();
    }
  }, [router]);

  const getPref = React.useCallback(
    <T,>(key: string, fallback: T): T => {
      const v = me?.user.preferences?.[key];
      return v === undefined ? fallback : (v as T);
    },
    [me],
  );

  const savePref = React.useCallback((key: string, value: unknown) => {
    // Optimistic local update so the UI reacts instantly.
    setMe((prev) =>
      prev
        ? {
            ...prev,
            user: {
              ...prev.user,
              preferences: { ...(prev.user.preferences ?? {}), [key]: value },
            },
          }
        : prev,
    );
    // Fire-and-forget server merge (preferences are non-critical).
    api.patch("me/", { preferences: { [key]: value } }).catch(() => {});
  }, []);

  return (
    <SessionContext.Provider value={{ me, refresh, logout, getPref, savePref }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = React.useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}
