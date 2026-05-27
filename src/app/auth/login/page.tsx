"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { signIn } from "next-auth/react";
import { AuthShell } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!result?.ok) {
        throw new Error(result?.error || "Login failed");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Log in"
      subtitle="Resume your execution system and pick up where you left off."
    >
      <form onSubmit={onSubmit} className="space-y-3">
        <div className="space-y-2">
          <label className="text-xs text-[rgba(234,240,255,0.7)]">Email</label>
          <Input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@domain.com"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs text-[rgba(234,240,255,0.7)]">
            Password
          </label>
          <Input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>

        {error ? (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-200">
            {error}
          </div>
        ) : null}

        <Button disabled={loading} className="w-full">
          {loading ? "Signing in…" : "Sign in"}
        </Button>

        <div className="text-center text-xs text-[var(--muted)]">
          No account?{" "}
          <Link
            href="/auth/signup"
            className="text-[rgba(6,182,212,0.95)] hover:underline"
          >
            Create one
          </Link>
        </div>
      </form>
    </AuthShell>
  );
}

