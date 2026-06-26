"use client";

import * as React from "react";
import {
  DEFAULT_FLAVOR,
  readFlavorCookie,
  writeFlavorCookie,
  type Flavor,
} from "@/lib/flavor";

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
  const [flavor, setFlavorState] = React.useState<Flavor>(initial);

  // Reconcile with the cookie on mount (covers client-side changes).
  React.useEffect(() => {
    const cookie = readFlavorCookie();
    if (cookie && cookie !== flavor) setFlavorState(cookie);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Drive the CSS variables by setting data-flavor on <html>.
  React.useEffect(() => {
    document.documentElement.dataset.flavor = flavor;
  }, [flavor]);

  const setFlavor = React.useCallback((f: Flavor) => {
    writeFlavorCookie(f);
    setFlavorState(f);
  }, []);

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
