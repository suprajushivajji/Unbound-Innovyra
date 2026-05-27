"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExecutionPlanForm } from "@/app/dashboard/_components/execution-plan-form";

type ResearchData = {
  trendingSkills: string[];
  hiringDemand: string;
  salaryInsights: {
    min: number;
    max: number;
    currency: string;
    notes: string;
  } | null;
  marketTrends: string[];
  technologies: string[];
};

export default function ResearchPage() {
  const [loading, setLoading] = React.useState(true);
  const [generating, setGenerating] = React.useState(false);
  const [research, setResearch] = React.useState<ResearchData | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/research");
      if (res.ok) {
        const data = await res.json();
        if (data.research) {
          setResearch({
            trendingSkills: data.research.trendingSkills ?? [],
            hiringDemand: data.research.hiringDemand ?? "",
            salaryInsights: data.research.salaryInsights ?? null,
            marketTrends: data.research.marketTrends ?? [],
            technologies: data.research.technologies ?? [],
          });
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    void load();
  }, []);

  async function runDeepSearch() {
    setGenerating(true);
    setError(null);
    try {
      const goalRes = await fetch("/api/career-goal");
      const goalData = goalRes.ok ? await goalRes.json() : null;
      const goal = goalData?.careerGoal;

      const res = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          careerGoal: goal?.careerGoal ?? "Generative AI Engineer",
          preferredDomain: goal?.domain ?? "Generative AI",
          skillLevel: goal?.skillLevel ?? "Beginner",
          timelineMonths: goal?.timelineMonths ?? 3,
          weeklyHours: goal?.weeklyHours ?? 10,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "DeepSearch failed");

      if (json.output) {
        setResearch(json.output);
      }
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "DeepSearch failed.");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="space-y-6">
      <ExecutionPlanForm onComplete={() => void load()} />

      <Card className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-24 -bottom-24 h-80 w-80 rounded-full bg-[radial-gradient(circle_at_35%_35%,rgba(139,92,246,0.28),transparent_65%)] blur-3xl" />
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <div>
            <CardTitle>DeepSearch Research</CardTitle>
            <div className="mt-1 text-sm text-[var(--muted)]">
              Live market intelligence powered by DeepSeek via OpenRouter.
            </div>
          </div>
          <Button onClick={() => void runDeepSearch()} disabled={generating}>
            {generating ? "Searching…" : "Run DeepSearch"}
          </Button>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="mb-3 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-200">
              {error}
            </div>
          ) : null}

          {loading ? (
            <div className="text-sm text-[var(--muted)]">Loading research…</div>
          ) : !research ? (
            <div className="text-sm text-[var(--muted)]">
              No research yet. Generate an execution plan or run DeepSearch.
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-[rgba(255,255,255,0.10)] bg-[rgba(0,0,0,0.22)] p-4">
                <div className="text-xs font-semibold tracking-wide text-[rgba(234,240,255,0.75)]">
                  Trending Skills
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {research.trendingSkills.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-[rgba(139,92,246,0.22)] bg-[rgba(255,255,255,0.04)] px-3 py-1 text-xs"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-[rgba(255,255,255,0.10)] bg-[rgba(0,0,0,0.22)] p-4">
                <div className="text-xs font-semibold tracking-wide text-[rgba(234,240,255,0.75)]">
                  Hiring Demand
                </div>
                <p className="mt-2 text-sm text-[var(--muted)]">{research.hiringDemand}</p>
              </div>

              {research.salaryInsights ? (
                <div className="rounded-2xl border border-[rgba(255,255,255,0.10)] bg-[rgba(0,0,0,0.22)] p-4">
                  <div className="text-xs font-semibold tracking-wide text-[rgba(234,240,255,0.75)]">
                    Salary Insights
                  </div>
                  <div className="mt-2 text-2xl font-semibold">
                    {research.salaryInsights.currency}{" "}
                    {research.salaryInsights.min.toLocaleString()} –{" "}
                    {research.salaryInsights.max.toLocaleString()}
                  </div>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    {research.salaryInsights.notes}
                  </p>
                </div>
              ) : null}

              <div className="rounded-2xl border border-[rgba(255,255,255,0.10)] bg-[rgba(0,0,0,0.22)] p-4">
                <div className="text-xs font-semibold tracking-wide text-[rgba(234,240,255,0.75)]">
                  Market Trends
                </div>
                <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
                  {research.marketTrends.map((t) => (
                    <li key={t}>• {t}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-[rgba(255,255,255,0.10)] bg-[rgba(0,0,0,0.22)] p-4 lg:col-span-2">
                <div className="text-xs font-semibold tracking-wide text-[rgba(234,240,255,0.75)]">
                  Key Technologies
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {research.technologies.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-[rgba(6,182,212,0.25)] bg-[rgba(6,182,212,0.08)] px-3 py-1 text-xs"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
