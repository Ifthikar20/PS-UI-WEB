"use client";

import * as React from "react";
import {
  DEFAULT_FLAVOR,
  isFlavor,
  readFlavorCookie,
  writeFlavorCookie,
  type Flavor,
} from "@/lib/flavor";
import { useSession } from "./session-provider";

type FlavorContextValue = {
  flavor: Flavor;
  setFlavor: (f: Flavor) => void;
};

const FlavorContext = React.createContext<FlavorContextValue | null>(null);

export function FlavorProvider({
  initial,
  children,
}: {
  initial: Flavor;
  children: React.ReactNode;
}) {
  const { getPref, savePref } = useSession();
  const [flavor, setFlavorState] = React.useState<Flavor>(initial);

  // Reconcile on mount: the server-synced preference wins, then the cookie.
  React.useEffect(() => {
    const serverFlavor = getPref<string | null>("flavor", null);
    const next = isFlavor(serverFlavor) ? serverFlavor : readFlavorCookie();
    if (next && next !== flavor) {
      writeFlavorCookie(next);
      setFlavorState(next);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Drive the CSS variables by setting data-flavor on <html>.
  React.useEffect(() => {
    document.documentElement.dataset.flavor = flavor;
  }, [flavor]);

  const setFlavor = React.useCallback(
    (f: Flavor) => {
      writeFlavorCookie(f);
      setFlavorState(f);
      savePref("flavor", f); // sync across devices
    },
    [savePref],
  );

  return (
    <FlavorContext.Provider value={{ flavor, setFlavor }}>
      {children}
    </FlavorContext.Provider>
  );
}

export function useFlavor() {
  const ctx = React.useContext(FlavorContext);
  if (!ctx) return { flavor: DEFAULT_FLAVOR, setFlavor: () => {} };
  return ctx;
}
