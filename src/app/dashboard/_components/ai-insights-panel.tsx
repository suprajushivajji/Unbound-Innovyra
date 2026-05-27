"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExecutionPlanForm } from "@/app/dashboard/_components/execution-plan-form";

export function AiInsightsPanel() {
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState<unknown>(null);
  const [error, setError] = React.useState<string | null>(null);

  async function run() {
    setLoading(true);
    setError(null);
    try {
      const goalRes = await fetch("/api/career-goal");
      const goalData = goalRes.ok ? await goalRes.json() : null;
      const goal = goalData?.careerGoal;

      const res = await fetch("/api/research", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          careerGoal: goal?.careerGoal ?? "Generative AI Engineer",
          preferredDomain: goal?.domain ?? "Generative AI",
          skillLevel: goal?.skillLevel ?? "Beginner",
          timelineMonths: goal?.timelineMonths ?? 3,
          weeklyHours: goal?.weeklyHours ?? 10,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Request failed");
      setData({
        mode: json.mode ?? "unknown",
        ...(json.output ?? json),
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to run research.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <ExecutionPlanForm />

      <Card className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-24 -bottom-24 h-80 w-80 rounded-full bg-[radial-gradient(circle_at_35%_35%,rgba(139,92,246,0.28),transparent_65%)] blur-3xl" />
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <div>
            <CardTitle>AI insights</CardTitle>
            <div className="mt-1 text-sm text-[var(--muted)]">
              DeepSearch intelligence via OpenRouter (DeepSeek) — stored in MongoDB.
            </div>
          </div>
          <Button onClick={() => void run()} disabled={loading}>
            {loading ? "Thinking…" : "Run DeepSearch"}
          </Button>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-200">
              {error}
            </div>
          ) : null}
          <pre className="mt-3 max-h-[320px] overflow-auto rounded-2xl border border-[rgba(255,255,255,0.10)] bg-[rgba(0,0,0,0.35)] p-4 text-xs leading-5 text-[rgba(234,240,255,0.75)]">
            {data ? JSON.stringify(data, null, 2) : "No insights yet. Run DeepSearch or generate a full execution plan."}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
