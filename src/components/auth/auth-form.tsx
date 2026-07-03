"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { auth, ApiError } from "@/lib/api";
import { googleIdToken, appleIdToken } from "@/lib/oauth";
import { readFlavorCookie } from "@/lib/flavor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleIcon, AppleIcon } from "./social-icons";

const REMEMBER_KEY = "ps_remember_email";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const params = useSearchParams();
  const [loading, setLoading] = React.useState(false);
  const [social, setSocial] = React.useState<"google" | "apple" | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [showPassword, setShowPassword] = React.useState(false);
  const [remember, setRemember] = React.useState(false);
  const [email, setEmail] = React.useState("");

  // "Remember me" prefills the email on this device.
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(REMEMBER_KEY);
      if (saved) {
        setEmail(saved);
        setRemember(true);
      }
    } catch {
      /* ignore */
    }
  }, []);

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
    const emailValue = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");
    const name = String(form.get("name") ?? "");
    try {
      localStorage.setItem(REMEMBER_KEY, remember ? emailValue : "");
      if (!remember) localStorage.removeItem(REMEMBER_KEY);
    } catch {
      /* ignore */
    }
    try {
      if (mode === "signup") await auth.signup(emailValue, password, name || undefined);
      else await auth.login(emailValue, password);
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
    <div className="space-y-5">
      <form onSubmit={onSubmit} className="space-y-4">
        {mode === "signup" && (
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Ada Lovelace"
              autoComplete="name"
              className="h-11 rounded-xl"
            />
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="••••••••"
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              className="h-11 rounded-xl pr-11"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-0.5 text-sm">
          <label className="flex cursor-pointer select-none items-center gap-2 text-muted-foreground">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 rounded border-input accent-[hsl(var(--foreground))]"
            />
            Remember me
          </label>
          <Link
            href="/help"
            className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {error && (
          <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="h-12 w-full rounded-xl bg-foreground text-base text-background hover:bg-foreground/90"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {mode === "signup" ? "Create account" : "Sign in"}
        </Button>
      </form>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">or</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <div className="space-y-2.5">
        <Button
          type="button"
          variant="outline"
          onClick={() => onSocial("google")}
          disabled={social !== null}
          className="h-12 w-full rounded-xl text-[15px]"
        >
          {social === "google" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <GoogleIcon className="h-4 w-4" />
          )}
          Continue with Google
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => onSocial("apple")}
          disabled={social !== null}
          className="h-12 w-full rounded-xl text-[15px]"
        >
          {social === "apple" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <AppleIcon className="h-4 w-4" />
          )}
          Continue with Apple
        </Button>
      </div>

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
