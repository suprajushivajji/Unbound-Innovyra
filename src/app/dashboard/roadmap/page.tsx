"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExecutionPlanForm } from "@/app/dashboard/_components/execution-plan-form";

type RoadmapWeek = {
  week?: number;
  title?: string;
  goal?: string;
  outcomes?: string[];
  keyTechnologies?: string[];
  timeAllocation?: { learning?: number; building?: number; interview?: number };
};

type RoadmapData = {
  careerGoal: string;
  domain: string;
  timelineMonths: number;
  weeklyHours: number;
  skillLevel: string;
  weeks: RoadmapWeek[];
  summary: string;
  riskFactors: string[];
};

export default function RoadmapPage() {
  const [loading, setLoading] = React.useState(true);
  const [roadmap, setRoadmap] = React.useState<RoadmapData | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/roadmap");
      if (res.ok) {
        const data = await res.json();
        setRoadmap(data.roadmap ?? null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    void load();
    const interval = setInterval(() => void load(), 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <ExecutionPlanForm onComplete={() => void load()} />

      <Card>
        <CardHeader>
          <CardTitle>Career Roadmap</CardTitle>
          <div className="mt-1 text-sm text-[var(--muted)]">
            Domain-specific weekly plan stored in MongoDB.
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-sm text-[var(--muted)]">Loading roadmap…</div>
          ) : !roadmap ? (
            <div className="text-sm text-[var(--muted)]">
              No roadmap yet. Generate an execution plan to create your personalized timeline.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="glass rounded-2xl p-4">
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full border border-[rgba(139,92,246,0.22)] px-3 py-1">
                    {roadmap.domain}
                  </span>
                  <span className="rounded-full border border-[rgba(6,182,212,0.25)] px-3 py-1">
                    {roadmap.timelineMonths} months
                  </span>
                  <span className="rounded-full border border-[rgba(255,255,255,0.10)] px-3 py-1">
                    {roadmap.weeklyHours} hrs/week
                  </span>
                  <span className="rounded-full border border-[rgba(255,255,255,0.10)] px-3 py-1">
                    {roadmap.skillLevel}
                  </span>
                </div>
                <p className="mt-3 text-sm text-[var(--muted)]">{roadmap.summary}</p>
              </div>

              <div className="space-y-3">
                {roadmap.weeks.map((w, idx) => (
                  <div
                    key={`${w.week ?? idx}-${w.title ?? idx}`}
                    className="rounded-2xl border border-[rgba(255,255,255,0.10)] bg-[rgba(0,0,0,0.18)] p-4"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-sm font-medium">
                        Week {w.week ?? idx + 1}: {w.title ?? "Phase"}
                      </div>
                      {w.timeAllocation ? (
                        <div className="text-[10px] text-[var(--muted)]">
                          L {w.timeAllocation.learning}% · B {w.timeAllocation.building}% · I{" "}
                          {w.timeAllocation.interview}%
                        </div>
                      ) : null}
                    </div>
                    <p className="mt-2 text-sm text-[var(--muted)]">{w.goal}</p>
                    {w.outcomes?.length ? (
                      <ul className="mt-2 space-y-1 text-xs text-[rgba(234,240,255,0.75)]">
                        {w.outcomes.map((o) => (
                          <li key={o}>• {o}</li>
                        ))}
                      </ul>
                    ) : null}
                    {w.keyTechnologies?.length ? (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {w.keyTechnologies.map((t) => (
                          <span
                            key={t}
                            className="rounded-full bg-[rgba(6,182,212,0.08)] px-2 py-0.5 text-[10px]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>

              {roadmap.riskFactors?.length ? (
                <div className="rounded-2xl border border-[rgba(255,255,255,0.10)] bg-[rgba(0,0,0,0.18)] p-4">
                  <div className="text-xs font-semibold tracking-wide">Risk Factors</div>
                  <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
                    {roadmap.riskFactors.map((r) => (
                      <li key={r}>• {r}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
