"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { auth, ApiError } from "@/lib/api";
import { googleIdToken, appleIdToken } from "@/lib/oauth";
import { readFlavorCookie } from "@/lib/flavor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleIcon, AppleIcon } from "./social-icons";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const params = useSearchParams();
  const [loading, setLoading] = React.useState(false);
  const [social, setSocial] = React.useState<"google" | "apple" | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  function destination(isSignup: boolean) {
    // New accounts (and anyone without a chosen flavor) go through onboarding.
    if (isSignup || !readFlavorCookie()) return "/onboarding";
    return params.get("next") || "/dashboard";
  }

  function go(isSignup: boolean) {
    router.push(destination(isSignup));
    router.refresh();
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");
    const name = String(form.get("name") ?? "");
    try {
      if (mode === "signup") await auth.signup(email, password, name || undefined);
      else await auth.login(email, password);
      go(mode === "signup");
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Something went wrong. Try again.",
      );
      setLoading(false);
    }
  }

  async function onSocial(provider: "google" | "apple") {
    setError(null);
    setSocial(provider);
    try {
      const idToken =
        provider === "google" ? await googleIdToken() : await appleIdToken();
      await auth.provider(provider, idToken);
      go(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed.");
      setSocial(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => onSocial("google")}
          disabled={social !== null}
        >
          {social === "google" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <GoogleIcon className="h-4 w-4" />
          )}
          Google
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => onSocial("apple")}
          disabled={social !== null}
        >
          {social === "apple" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <AppleIcon className="h-4 w-4" />
          )}
          Apple
        </Button>
      </div>

      <div className="flex items-center gap-3 py-1">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">or</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {mode === "signup" && (
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" placeholder="Ada Lovelace" autoComplete="name" />
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            placeholder="••••••••"
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
          />
        </div>

        {error && (
          <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {mode === "signup" ? "Create account" : "Sign in"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        {mode === "signup" ? (
          <>
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-foreground underline-offset-4 hover:underline">
              Sign in
            </Link>
          </>
        ) : (
          <>
            New to PlayStudy?{" "}
            <Link href="/signup" className="font-medium text-foreground underline-offset-4 hover:underline">
              Create an account
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
