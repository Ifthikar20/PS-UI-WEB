import * as React from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AuthForm } from "@/components/auth/auth-form";

export default function SignupPage() {
  return (
    <div className="w-full max-w-md">
      <Card className="animate-fade-in shadow-xl shadow-black/[0.04] dark:shadow-black/20">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl tracking-tight">
            Create your account
          </CardTitle>
          <CardDescription>Start turning notes into games</CardDescription>
        </CardHeader>
        <CardContent>
          <React.Suspense fallback={null}>
            <AuthForm mode="signup" />
          </React.Suspense>
        </CardContent>
      </Card>
      <p
        className="mt-4 animate-fade-in text-center text-xs text-muted-foreground [animation-delay:0.2s]"
      >
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
