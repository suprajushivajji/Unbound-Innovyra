"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";
import {
  BarChart3,
  BrainCircuit,
  KanbanSquare,
  LogOut,
  Route,
  Search,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

const navItems = [
  { href: "/dashboard", label: "Project HUB", icon: KanbanSquare },
  { href: "/dashboard/roadmap", label: "Roadmap", icon: Route },
  { href: "/dashboard/research", label: "Research", icon: Search },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/agents", label: "Agents", icon: BrainCircuit },
] as const;

export function DashboardShell({
  children,
  userEmail,
}: {
  children: React.ReactNode;
  userEmail: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [signingOut, setSigningOut] = React.useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await signOut({ redirect: false });
      router.push("/");
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="glass h-fit rounded-3xl p-4 lg:sticky lg:top-6">
            <Link href="/" className="group flex items-center gap-3 px-2 py-2">
              <div className="relative">
                <div className="absolute -inset-2 rounded-2xl opacity-0 blur-md transition group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(circle at 30% 20%, rgba(139,92,246,0.55), rgba(6,182,212,0.12) 70%, transparent)",
                  }}
                />
                <Image
                  src="/logo/innovyra-icon.svg"
                  alt="Innovyra"
                  width={34}
                  height={34}
                  className="relative"
                />
              </div>
              <div className="leading-tight">
                <div className="text-sm font-semibold tracking-wide">
                  Innovyra
                </div>
                <div className="text-xs text-[var(--muted)]">
                  Execution OS
                </div>
              </div>
            </Link>

            <div className="mt-4 space-y-1">
              {navItems.map((item) => {
                const active = item.href === pathname;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-3 rounded-2xl px-3 py-2 text-sm transition",
                      active
                        ? "bg-[rgba(6,182,212,0.10)] text-[var(--foreground)] shadow-[0_0_0_1px_rgba(6,182,212,0.25)_inset]"
                        : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[rgba(255,255,255,0.06)]",
                    )}
                  >
                    <span
                      className={cn(
                        "relative inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[rgba(255,255,255,0.10)] bg-[rgba(0,0,0,0.22)]",
                        active &&
                          "border-[rgba(6,182,212,0.35)] shadow-[0_0_20px_rgba(6,182,212,0.14)]"
                      )}
                    >
                      <Icon size={18} />
                      {active ? (
                        <span className="absolute -right-2 top-1/2 h-6 w-1 -translate-y-1/2 rounded-full bg-[linear-gradient(180deg,rgba(139,92,246,0.85),rgba(6,182,212,0.75))] shadow-[0_0_18px_rgba(139,92,246,0.35)]" />
                      ) : null}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span>{item.label}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="mt-6 rounded-2xl border border-[rgba(255,255,255,0.10)] bg-[rgba(0,0,0,0.18)] p-3">
              <div className="text-xs text-[rgba(234,240,255,0.65)]">
                Signed in
              </div>
              <div className="mt-1 truncate text-sm">{userEmail}</div>
              <Button
                onClick={handleSignOut}
                disabled={signingOut}
                variant="ghost"
                className="mt-3 w-full justify-start"
              >
                <LogOut size={16} />
                {signingOut ? "Signing out…" : "Sign out"}
              </Button>
            </div>
          </aside>

          <section className="space-y-6">
            <header className="glass flex flex-col gap-3 rounded-3xl p-5 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-sm font-semibold tracking-wide">
                  Project HUB
                </div>
                <div className="mt-1 text-sm text-[var(--muted)]">
                  Your career execution cockpit — tasks, milestones, analytics,
                  and AI insight in one place.
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => router.refresh()}
                  className="h-10"
                >
                  Refresh
                </Button>
                <Button
                  onClick={() => router.push("/dashboard")}
                  className="h-10"
                >
                  Open Kanban
                </Button>
              </div>
            </header>

            {children}
          </section>
        </div>
      </div>
    </div>
  );
}
