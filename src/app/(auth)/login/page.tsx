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

export default function LoginPage() {
  return (
    <div className="w-full max-w-md">
      <Card className="animate-fade-in shadow-xl shadow-black/[0.04] dark:shadow-black/20">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl tracking-tight">Welcome back</CardTitle>
          <CardDescription>Sign in to continue studying</CardDescription>
        </CardHeader>
        <CardContent>
          <React.Suspense fallback={null}>
            <AuthForm mode="login" />
          </React.Suspense>
        </CardContent>
      </Card>
      <p className="mt-4 animate-fade-in text-center text-xs text-muted-foreground [animation-delay:0.2s]">
        Need help signing in?{" "}
        <Link href="/help" className="underline underline-offset-2 hover:text-foreground">
          Visit the help page
        </Link>
        .
      </p>
    </div>
  );
}
