"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-10 pb-12 md:pt-16">
      <div className="grid items-center gap-10 md:grid-cols-2">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="inline-flex items-center gap-2 rounded-full border border-[rgba(6,182,212,0.30)] bg-[rgba(6,182,212,0.08)] px-3 py-1 text-xs text-[rgba(234,240,255,0.85)]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--cyan-glow)] shadow-[0_0_18px_rgba(6,182,212,0.65)]" />
            Smart Career Execution Engine
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: "easeOut", delay: 0.05 }}
            className="mt-5 text-4xl font-semibold leading-tight tracking-tight md:text-5xl"
          >
            From{" "}
            <span className="bg-[linear-gradient(135deg,#8B5CF6,#3B82F6,#06B6D4)] bg-clip-text text-transparent">
              Career Goal
            </span>{" "}
            → Real Execution → Measurable Growth.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: "easeOut", delay: 0.12 }}
            className="mt-4 max-w-xl text-sm leading-6 text-[var(--muted)] md:text-base"
          >
            Innovyra turns your intent into an execution system: DeepSearch
            intelligence, AI reasoning, and a Project HUB that adapts as you
            progress.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: "easeOut", delay: 0.18 }}
            className="mt-7 flex flex-wrap items-center gap-3"
          >
            <Link href="/auth/signup">
              <Button size="lg">Start execution</Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline">
                View dashboard
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-8 flex flex-wrap gap-2 text-xs text-[rgba(234,240,255,0.70)]"
          >
            {[
              "DeepSearch Intelligence",
              "AI Reasoning",
              "Workflow Automation",
              "Project HUB Orchestration",
            ].map((t) => (
              <span
                key={t}
                className="rounded-full border border-[rgba(139,92,246,0.22)] bg-[rgba(255,255,255,0.04)] px-3 py-1"
              >
                {t}
              </span>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.12 }}
          className="relative"
        >
          <div className="absolute -inset-6 rounded-3xl bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.40),transparent_55%),radial-gradient(circle_at_70%_60%,rgba(6,182,212,0.28),transparent_60%)] blur-xl" />
          <div className="glass relative overflow-hidden rounded-3xl p-6">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold tracking-wide">
                Execution OS
              </div>
              <div className="text-xs text-[var(--muted)]">
                Search less. Execute smarter.
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              {[
                { k: "Research", v: "Hiring trends + skill demand score" },
                { k: "Reason", v: "Balance time, constraints, dependencies" },
                { k: "Generate", v: "Daily tasks + weekly milestones" },
                { k: "Orchestrate", v: "Kanban + analytics + realtime sync" },
              ].map((row) => (
                <div
                  key={row.k}
                  className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(0,0,0,0.18)] px-4 py-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-sm">{row.k}</div>
                    <div className="h-2 w-2 rounded-full bg-[rgba(6,182,212,0.75)] shadow-[0_0_16px_rgba(6,182,212,0.65)]" />
                  </div>
                  <div className="mt-1 text-xs text-[var(--muted)]">
                    {row.v}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between rounded-2xl border border-[rgba(139,92,246,0.20)] bg-[rgba(139,92,246,0.08)] px-4 py-3">
              <div className="flex items-center gap-3">
                <Image
                  src="/logo/innovyra-icon.svg"
                  alt="Innovyra"
                  width={28}
                  height={28}
                />
                <div>
                  <div className="text-sm font-medium">Adaptive Regeneration</div>
                  <div className="text-xs text-[var(--muted)]">
                    Plans evolve with your progress.
                  </div>
                </div>
              </div>
              <div className="text-xs text-[rgba(234,240,255,0.80)]">
                Live
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

