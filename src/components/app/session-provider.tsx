"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/api";
import type { Me } from "@/lib/types";

type SessionContextValue = {
  me: Me | null;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
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

  return (
    <SessionContext.Provider value={{ me, refresh, logout }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = React.useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}
