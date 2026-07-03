"use client";

import { Moon, Sun, Monitor, Check } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useFlavor } from "@/components/app/flavor-provider";
import { FLAVORS, FLAVOR_META } from "@/lib/flavor";

const THEME_OPTIONS = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { flavor, setFlavor } = useFlavor();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>
            Light and dark are the two core themes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {THEME_OPTIONS.map((opt) => {
              const active = mounted && theme === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setTheme(opt.value)}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-xl border p-4 text-sm transition-colors hover:bg-accent",
                    active && "border-primary bg-accent",
                  )}
                >
                  <opt.icon className="h-5 w-5" />
                  {opt.label}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dashboard style</CardTitle>
          <CardDescription>
            Pick the flavor that suits you. You chose this at sign-up — change it
            anytime.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {FLAVORS.map((f) => {
              const meta = FLAVOR_META[f];
              const active = flavor === f;
              return (
                <button
                  key={f}
                  onClick={() => setFlavor(f)}
                  className={cn(
                    "flex items-start gap-3 rounded-xl border p-4 text-left transition-colors hover:bg-accent",
                    active && "border-primary ring-1 ring-primary",
                  )}
                >
                  <span className="flex -space-x-1.5 pt-1">
                    <span
                      className="h-5 w-5 rounded-full ring-2 ring-card"
                      style={{ backgroundColor: meta.swatch[0] }}
                    />
                    <span
                      className="h-5 w-5 rounded-full ring-2 ring-card"
                      style={{ backgroundColor: meta.swatch[1] }}
                    />
                  </span>
                  <span className="flex-1">
                    <span className="flex items-center gap-2 font-semibold">
                      {meta.label}
                      {active && <Check className="h-4 w-4 text-primary" />}
                    </span>
                    <span className="mt-0.5 block text-sm text-muted-foreground">
                      {meta.blurb}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
