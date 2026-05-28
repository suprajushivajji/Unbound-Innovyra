"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import StaggeredMenu from "@/components/staggered-menu/StaggeredMenu";
import type { StaggeredMenuItem } from "@/components/staggered-menu/StaggeredMenu";

const navItems: StaggeredMenuItem[] = [
  { label: "Main", ariaLabel: "Go to Main", link: "/dashboard" },
  { label: "Roadmap", ariaLabel: "View your roadmap", link: "/dashboard/roadmap" },
  { label: "Research", ariaLabel: "Open DeepSearch Research", link: "/dashboard/research" },
  { label: "Analytics", ariaLabel: "View analytics", link: "/dashboard/analytics" },
  { label: "Agents", ariaLabel: "AI Agent Orchestrator", link: "/dashboard/agents" },
];

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

  function handleNavClick(item: StaggeredMenuItem) {
    router.push(item.link);
  }

  const logoElement = (
    <Link href="/" className="sm-logo flex items-center gap-3">
      <div className="relative">
        <div
          className="absolute -inset-2 rounded-2xl opacity-0 blur-md transition group-hover:opacity-100"
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
      <div className="flex flex-col leading-[1.2] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
        <span className="text-[0.95rem] font-extrabold tracking-wide text-white">Innovyra</span>
        <span className="text-[0.7rem] font-bold text-white/90">Execution OS</span>
      </div>
    </Link>
  );

  const footerContent = (
    <div>
      <div className="sm-user-email">Signed in</div>
      <div className="sm-user-address">{userEmail}</div>
      <button
        onClick={handleSignOut}
        disabled={signingOut}
        className="sm-signout"
        type="button"
      >
        <LogOut size={14} />
        {signingOut ? "Signing out…" : "Sign out"}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen relative">
      {/* Staggered Menu - fixed overlay */}
      <StaggeredMenu
        position="right"
        items={navItems}
        displaySocials={false}
        displayItemNumbering={true}
        menuButtonColor="rgba(234,240,255,0.8)"
        openMenuButtonColor="rgba(234,240,255,0.9)"
        changeMenuColorOnOpen={false}
        colors={["rgba(11,17,32,0.95)", "rgba(139,92,246,0.12)"]}
        accentColor="#06b6d4"
        logoElement={logoElement}
        onItemClick={handleNavClick}
        footerContent={footerContent}
        isFixed={true}
        closeOnClickAway={true}
      />

      {/* Main content */}
      <div className="mx-auto max-w-6xl px-4 pt-24 pb-6">
        <section className="space-y-4 min-w-0">
          <header className="glass-glow flex flex-col gap-3 rounded-3xl p-5 md:flex-row md:items-center md:justify-between relative overflow-hidden">
            {/* Ambient gradient */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.1),transparent_65%)] blur-3xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[rgba(16,185,129,0.8)] animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <div className="text-sm font-semibold tracking-wide">
                  {pathname === "/dashboard"
                    ? "AI Execution Command Center"
                    : pathname === "/dashboard/research"
                    ? "DeepSearch Intelligence Lab"
                    : pathname === "/dashboard/roadmap"
                    ? "Career Roadmap Engine"
                    : pathname === "/dashboard/analytics"
                    ? "Performance Analytics"
                    : pathname === "/dashboard/agents"
                    ? "AI Agent Orchestrator"
                    : "Project HUB"}
                </div>
              </div>
              <div className="mt-1 text-xs text-[rgba(234,240,255,0.45)]">
                {pathname === "/dashboard"
                  ? "Real-time career execution cockpit — tasks, AI insights, and orchestration in one place."
                  : pathname === "/dashboard/research"
                  ? "Live market intelligence, skill gap analysis, and career trajectory optimization."
                  : "Your career execution operating system — powered by AI."}
              </div>
            </div>
            <div className="relative z-10 flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                onClick={() => router.refresh()}
                className="h-9 text-xs"
                size="sm"
              >
                Refresh
              </Button>
            </div>
          </header>

          {children}
        </section>
      </div>
    </div>
  );
}
