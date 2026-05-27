"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function StatsStrip() {
  const [loading, setLoading] = React.useState(true);
  const [completion, setCompletion] = React.useState(0);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/analytics");
      if (res.ok) {
        const data = await res.json();
        setCompletion(data.completionPercentage || 0);
      }
    } catch (error) {
      console.error("Failed to load analytics:", error);
    }
    setLoading(false);
  }

  React.useEffect(() => {
    void load();
  }, []);

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Completion</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-[var(--muted)]">
          <div className="text-3xl font-semibold text-[var(--foreground)]">
            {loading ? "—" : `${completion}%`}
          </div>
          <div className="mt-1">Across all tasks in your Project HUB.</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Learning streak</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-[var(--muted)]">
          <div className="text-3xl font-semibold text-[var(--foreground)]">
            — days
          </div>
          <div className="mt-1">
            (MVP placeholder) Connect to analytics table for streak tracking.
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Productivity score</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-[var(--muted)]">
          <div className="text-3xl font-semibold text-[var(--foreground)]">
            —
          </div>
          <div className="mt-1">
            (MVP placeholder) Derived from completions + consistency.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
