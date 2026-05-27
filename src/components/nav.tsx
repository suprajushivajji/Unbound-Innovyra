"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export function Nav({ className }: { className?: string }) {
  return (
    <header className={cn("sticky top-0 z-40", className)}>
      <div className="mx-auto max-w-6xl px-4 pt-4">
        <div className="glass flex items-center justify-between rounded-2xl px-4 py-3">
          <Link href="/" className="group flex items-center gap-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative"
            >
              <motion.div
                className="absolute -inset-2 rounded-2xl opacity-0 blur-md transition group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(circle at 30% 20%, rgba(139,92,246,0.55), rgba(6,182,212,0.10) 70%, transparent)",
                }}
              />
              <Image
                src="/logo/innovyra-icon.svg"
                alt="Innovyra"
                width={34}
                height={34}
                className="relative"
                priority
              />
            </motion.div>
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-wide">Innovyra</div>
              <div className="text-xs text-[var(--muted)]">
                Smart Career Execution Engine
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            <Link
              href="#modules"
              className="rounded-lg px-3 py-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[rgba(255,255,255,0.06)]"
            >
              Modules
            </Link>
            <Link
              href="#hub"
              className="rounded-lg px-3 py-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[rgba(255,255,255,0.06)]"
            >
              Project HUB
            </Link>
            <Link
              href="#how"
              className="rounded-lg px-3 py-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[rgba(255,255,255,0.06)]"
            >
              Workflow
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="sm">Get started</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

