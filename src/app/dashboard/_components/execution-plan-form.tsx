"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DOMAINS } from "@/lib/domain";

export type ExecutionPlanInput = {
  careerGoal: string;
  preferredDomain: string;
  skillLevel: "Beginner" | "Intermediate" | "Advanced";
  timelineMonths: number;
  weeklyHours: number;
};

const DEFAULTS: ExecutionPlanInput = {
  careerGoal: "Generative AI Engineer",
  preferredDomain: "Generative AI",
  skillLevel: "Beginner",
  timelineMonths: 3,
  weeklyHours: 10,
};

export function ExecutionPlanForm({
  onComplete,
}: {
  onComplete?: () => void;
}) {
  const [form, setForm] = React.useState<ExecutionPlanInput>(DEFAULTS);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [steps, setSteps] = React.useState<string[]>([]);

  React.useEffect(() => {
    void fetch("/api/career-goal")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.careerGoal) {
          setForm({
            careerGoal: data.careerGoal.careerGoal,
            preferredDomain: data.careerGoal.domain,
            skillLevel: data.careerGoal.skillLevel,
            timelineMonths: data.careerGoal.timelineMonths,
            weeklyHours: data.careerGoal.weeklyHours,
          });
        }
      })
      .catch(() => null);
  }, []);

  async function generate() {
    setLoading(true);
    setError(null);
    setSteps(["Initializing execution plan…"]);

    try {
      const res = await fetch("/api/execution-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, replaceExisting: true }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Generation failed");

      setSteps([
        `Mode: ${json.mode ?? "unknown"}`,
        ...(json.steps ?? []).map(
          (s: { step: string; status: string }) => `${s.step}: ${s.status}`
        ),
      ]);
      onComplete?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate plan.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="glass rounded-3xl p-5">
      <div className="text-sm font-semibold tracking-wide">Execution Plan</div>
      <div className="mt-1 text-sm text-[var(--muted)]">
        Generate research, roadmap, tasks, projects, milestones, and analytics in one flow.
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="space-y-1 md:col-span-2">
          <label className="text-xs text-[rgba(234,240,255,0.7)]">Career goal</label>
          <Input
            value={form.careerGoal}
            onChange={(e) => setForm((f) => ({ ...f, careerGoal: e.target.value }))}
            placeholder="e.g. Generative AI Engineer"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-[rgba(234,240,255,0.7)]">Domain</label>
          <select
            value={form.preferredDomain}
            onChange={(e) => setForm((f) => ({ ...f, preferredDomain: e.target.value }))}
            className="h-10 w-full rounded-xl border border-[rgba(255,255,255,0.10)] bg-[rgba(0,0,0,0.22)] px-3 text-sm"
          >
            {DOMAINS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs text-[rgba(234,240,255,0.7)]">Skill level</label>
          <select
            value={form.skillLevel}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                skillLevel: e.target.value as ExecutionPlanInput["skillLevel"],
              }))
            }
            className="h-10 w-full rounded-xl border border-[rgba(255,255,255,0.10)] bg-[rgba(0,0,0,0.22)] px-3 text-sm"
          >
            {(["Beginner", "Intermediate", "Advanced"] as const).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs text-[rgba(234,240,255,0.7)]">Timeline (months)</label>
          <Input
            type="number"
            min={1}
            max={24}
            value={form.timelineMonths}
            onChange={(e) =>
              setForm((f) => ({ ...f, timelineMonths: Number(e.target.value) || 1 }))
            }
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-[rgba(234,240,255,0.7)]">Weekly hours</label>
          <Input
            type="number"
            min={1}
            max={60}
            value={form.weeklyHours}
            onChange={(e) =>
              setForm((f) => ({ ...f, weeklyHours: Number(e.target.value) || 1 }))
            }
          />
        </div>
      </div>

      {error ? (
        <div className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-200">
          {error}
        </div>
      ) : null}

      {steps.length > 0 ? (
        <div className="mt-3 rounded-2xl border border-[rgba(255,255,255,0.10)] bg-[rgba(0,0,0,0.22)] p-3 text-xs text-[rgba(234,240,255,0.75)]">
          {loading ? (
            <div className="mb-2 flex items-center gap-2">
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-[var(--cyan-glow)] shadow-[0_0_12px_rgba(6,182,212,0.65)]" />
              AI orchestrating your plan…
            </div>
          ) : null}
          {steps.map((s) => (
            <div key={s}>{s}</div>
          ))}
        </div>
      ) : null}

      <Button
        onClick={() => void generate()}
        disabled={loading}
        className="mt-4"
      >
        {loading ? "Generating…" : "Generate Full Execution Plan"}
      </Button>
    </div>
  );
}
