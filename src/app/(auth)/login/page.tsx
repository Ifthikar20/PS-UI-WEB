import * as React from "react";
import { AuthForm } from "@/components/auth/auth-form";

export default function LoginPage() {
  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
      <p className="mt-1.5 text-muted-foreground">
        Sign in to your PlayStudy account.
      </p>
      <div className="mt-8">
        <React.Suspense fallback={null}>
          <AuthForm mode="login" />
        </React.Suspense>
      </div>
    </div>
  );
}
