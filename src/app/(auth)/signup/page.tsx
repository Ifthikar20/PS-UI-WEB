import * as React from "react";
import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";

export default function SignupPage() {
  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold tracking-tight">Create your account</h1>
      <p className="mt-1.5 text-muted-foreground">
        Start turning notes into games.
      </p>
      <div className="mt-8">
        <React.Suspense fallback={null}>
          <AuthForm mode="signup" />
        </React.Suspense>
      </div>
      <p className="mt-5 text-center text-xs text-muted-foreground">
        By continuing you agree to our{" "}
        <Link href="/terms" className="underline underline-offset-2 hover:text-foreground">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="underline underline-offset-2 hover:text-foreground">
          Privacy policy
        </Link>
        .
      </p>
    </div>
  );
}
