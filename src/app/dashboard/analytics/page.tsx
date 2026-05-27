"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type AnalyticsData = {
  completionPercentage: number;
  roadmapProgress: number;
  milestoneCompletion: number;
  streak: number;
  productivityScore: number;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  insight?: string;
  recommendation?: string;
};

export default function AnalyticsPage() {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<AnalyticsData | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/analytics");
      if (res.ok) {
        setData(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    void load();
    const interval = setInterval(() => void load(), 5000);
    return () => clearInterval(interval);
  }, []);

  const metrics = [
    { label: "Completion", value: data?.completionPercentage, suffix: "%" },
    { label: "Roadmap Progress", value: data?.roadmapProgress, suffix: "%" },
    { label: "Milestone Completion", value: data?.milestoneCompletion, suffix: "%" },
    { label: "Learning Streak", value: data?.streak, suffix: " days" },
    { label: "Productivity Score", value: data?.productivityScore, suffix: "" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analytics</CardTitle>
        <div className="mt-1 text-sm text-[var(--muted)]">
          Real metrics computed from your tasks and milestones (refreshes every 5s).
        </div>
      </CardHeader>
      <CardContent>
        {loading && !data ? (
          <div className="text-sm text-[var(--muted)]">Loading analytics…</div>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {metrics.map((m) => (
                <div
                  key={m.label}
                  className="glass rounded-2xl p-4"
                >
                  <div className="text-xs text-[rgba(234,240,255,0.65)]">{m.label}</div>
                  <div className="mt-1 text-3xl font-semibold">
                    {loading ? "—" : `${m.value ?? 0}${m.suffix}`}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              <div className="rounded-2xl border border-[rgba(255,255,255,0.10)] bg-[rgba(0,0,0,0.18)] p-4">
                <div className="text-xs font-semibold">Task Breakdown</div>
                <div className="mt-2 space-y-1 text-sm text-[var(--muted)]">
                  <div>Total: {data?.totalTasks ?? 0}</div>
                  <div>Completed: {data?.completedTasks ?? 0}</div>
                  <div>In Progress: {data?.inProgressTasks ?? 0}</div>
                </div>
              </div>

              {data?.insight ? (
                <div className="rounded-2xl border border-[rgba(139,92,246,0.20)] bg-[rgba(139,92,246,0.08)] p-4 lg:col-span-2">
                  <div className="text-xs font-semibold">AI Insight</div>
                  <p className="mt-2 text-sm text-[var(--muted)]">{data.insight}</p>
                  {data.recommendation ? (
                    <>
                      <div className="mt-3 text-xs font-semibold">Recommendation</div>
                      <p className="mt-1 text-sm text-[var(--muted)]">
                        {data.recommendation}
                      </p>
                    </>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
