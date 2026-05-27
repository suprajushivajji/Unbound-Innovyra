"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const AGENTS = [
  {
    id: "research" as const,
    type: "skill_assessor" as const,
    name: "Research Agent",
    description: "Market trends, hiring demand, and skill intelligence.",
  },
  {
    id: "planning" as const,
    type: "project_advisor" as const,
    name: "Planning Agent",
    description: "Roadmap generation and task planning guidance.",
  },
  {
    id: "resume" as const,
    type: "career_coach" as const,
    name: "Resume Agent",
    description: "Portfolio guidance and resume optimization tasks.",
  },
  {
    id: "interview" as const,
    type: "interview_prep" as const,
    name: "Interview Agent",
    description: "Mock interviews and coding preparation.",
  },
];

type AgentOutput = {
  advice?: string;
  title?: string;
  bullets?: string[];
  nextActions?: string[];
};

export default function AgentsPage() {
  const [loadingAgent, setLoadingAgent] = React.useState<string | null>(null);
  const [outputs, setOutputs] = React.useState<Record<string, AgentOutput>>({});
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  async function runAgent(agentConfig: (typeof AGENTS)[number]) {
    const { id, type } = agentConfig;
    setLoadingAgent(id);
    setErrors((e) => ({ ...e, [id]: "" }));

    try {
      const res = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentType: type, careerGoal: "Generative AI Engineer" }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Agent run failed");

      setOutputs((o) => ({ ...o, [id]: json }));
    } catch (e) {
      setErrors((err) => ({
        ...err,
        [id]: e instanceof Error ? e.message : "Agent failed.",
      }));
    } finally {
      setLoadingAgent(null);
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {AGENTS.map((agent) => {
        const output = outputs[agent.id];
        const error = errors[agent.id];
        const loading = loadingAgent === agent.id;

        return (
          <Card key={agent.id} className="relative overflow-hidden">
            <div className="pointer-events-none absolute -right-16 -bottom-16 h-48 w-48 rounded-full bg-[radial-gradient(circle_at_35%_35%,rgba(6,182,212,0.18),transparent_65%)] blur-2xl" />
            <CardHeader className="flex flex-row items-start justify-between gap-3">
              <div>
                <CardTitle>{agent.name}</CardTitle>
                <div className="mt-1 text-sm text-[var(--muted)]">{agent.description}</div>
              </div>
              <Button
                size="sm"
                onClick={() => void runAgent(agent)}
                disabled={loading}
              >
                {loading ? "Running…" : "Run"}
              </Button>
            </CardHeader>
            <CardContent>
              {error ? (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-200">
                  {error}
                </div>
              ) : output?.advice ? (
                <div className="space-y-3">
                  <div className="text-sm">{output.advice}</div>
                  {output.title && (
                    <>
                      <div className="text-xs font-semibold tracking-wide text-[rgba(234,240,255,0.75)]">
                        {output.title}
                      </div>
                    </>
                  )}
                  {output.bullets && output.bullets.length > 0 && (
                    <ul className="space-y-1 text-xs text-[rgba(234,240,255,0.75)]">
                      {output.bullets.map((b) => (
                        <li key={b}>• {b}</li>
                      ))}
                    </ul>
                  )}
                  {output.nextActions && output.nextActions.length > 0 && (
                    <>
                      <div className="text-xs font-semibold tracking-wide text-[rgba(234,240,255,0.75)]">
                        Next Actions
                      </div>
                      <ul className="space-y-1 text-xs text-[rgba(234,240,255,0.75)]">
                        {output.nextActions.map((a) => (
                          <li key={a}>→ {a}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              ) : (
                <div className="text-sm text-[var(--muted)]">
                  Run this agent to generate domain-specific guidance.
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
