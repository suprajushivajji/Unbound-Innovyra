"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const AGENTS = [
  {
    id: "research" as const,
    type: "skill_assessor" as const,
    name: "Research Agent",
    emoji: "🔍",
    description: "Market trends, hiring demand, and skill intelligence.",
    capabilities: ["Live market intelligence", "Hiring demand analysis", "Salary forecasting"],
    thinkingExamples: [
      "Scanning Data Engineering market trends…",
      "Analyzing hiring demand for AI roles…",
      "Calculating salary benchmarks…",
    ],
    metrics: { title: "Skills Analyzed", value: 127, total: 200 },
    priority: "HIGH PRIORITY",
    color: "from-cyan-500 to-blue-600",
  },
  {
    id: "planning" as const,
    type: "project_advisor" as const,
    name: "Planning Agent",
    emoji: "📋",
    description: "Roadmap generation and task planning guidance.",
    capabilities: ["Roadmap optimization", "Execution sequencing", "Adaptive workload balancing"],
    thinkingExamples: [
      "Optimizing roadmap sequence…",
      "Balancing workload distribution…",
      "Analyzing skill progression gaps…",
    ],
    metrics: { title: "Tasks Generated", value: 34, total: 50 },
    priority: "HIGH PRIORITY",
    color: "from-purple-500 to-violet-600",
  },
  {
    id: "resume" as const,
    type: "career_coach" as const,
    name: "Resume Agent",
    emoji: "📄",
    description: "Portfolio guidance and resume optimization tasks.",
    capabilities: ["Portfolio scoring", "GitHub readiness analysis", "ATS optimization"],
    thinkingExamples: [
      "Analyzing portfolio gaps…",
      "Scoring GitHub readiness…",
      "Optimizing for ATS systems…",
    ],
    metrics: { title: "Portfolio Strength", value: 78, total: 100, percent: true },
    priority: "MEDIUM PRIORITY",
    color: "from-amber-500 to-orange-600",
  },
  {
    id: "interview" as const,
    type: "interview_prep" as const,
    name: "Interview Agent",
    emoji: "🎤",
    description: "Mock interviews and coding preparation.",
    capabilities: ["Behavioral preparation", "Coding challenges", "Company-specific flows"],
    thinkingExamples: [
      "Generating mock interview questions…",
      "Analyzing interview patterns…",
      "Preparing behavioral responses…",
    ],
    metrics: { title: "Questions Generated", value: 64, total: 100 },
    priority: "MEDIUM PRIORITY",
    color: "from-pink-500 to-rose-600",
  },
];

type AgentStatus = "idle" | "active" | "processing" | "learning" | "optimizing";
type AgentOutput = {
  advice?: string;
  title?: string;
  bullets?: string[];
  nextActions?: string[];
};

// Status Badge Component
function StatusBadge({ status }: { status: AgentStatus }) {
  const statusConfig = {
    active: { emoji: "🟢", text: "Active", color: "from-green-400 to-emerald-500" },
    processing: { emoji: "🔵", text: "Processing", color: "from-blue-400 to-cyan-500" },
    learning: { emoji: "🟣", text: "Learning", color: "from-purple-400 to-pink-500" },
    optimizing: { emoji: "🟡", text: "Optimizing", color: "from-yellow-400 to-amber-500" },
    idle: { emoji: "⚪", text: "Idle", color: "from-gray-400 to-slate-500" },
  };

  const config = statusConfig[status];

  return (
    <motion.div
      className="flex items-center gap-2"
      animate={{
        scale: status !== "idle" ? [1, 1.05, 1] : 1,
      }}
      transition={{
        duration: 2,
        repeat: status !== "idle" ? Infinity : 0,
      }}
    >
      <div className="text-lg">{config.emoji}</div>
      <div className={`text-xs font-semibold bg-gradient-to-r ${config.color} bg-clip-text text-transparent`}>
        {config.text}
      </div>
    </motion.div>
  );
}

// Typing Effect Component
function TypingEffect({ text, speed = 50 }: { text: string; speed?: number }) {
  const [displayText, setDisplayText] = React.useState("");

  React.useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= text.length) {
        setDisplayText(text.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return <span>{displayText}</span>;
}

// Animated Counter Component
function AnimatedCounter({ value, total, percent = false }: { value: number; total?: number; percent?: boolean }) {
  const [displayValue, setDisplayValue] = React.useState(0);

  React.useEffect(() => {
    let start = 0;
    const increment = value / 30;
    const interval = setInterval(() => {
      start += increment;
      if (start >= value) {
        setDisplayValue(value);
        clearInterval(interval);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 30);

    return () => clearInterval(interval);
  }, [value]);

  return (
    <div className="flex items-baseline gap-1">
      <div className="text-2xl font-bold text-cyan-400">{displayValue}</div>
      {percent ? <span className="text-xs text-[rgba(234,240,255,0.6)]">%</span> : <span className="text-xs text-[rgba(234,240,255,0.6)]">/ {total}</span>}
    </div>
  );
}

// Agent Performance Metrics Component
function AgentMetrics({ metric }: { metric: { title: string; value: number; total?: number; percent?: boolean } }) {
  const percentage = metric.percent ? metric.value : (metric.value / (metric.total || 100)) * 100;

  return (
    <motion.div className="space-y-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[rgba(234,240,255,0.75)]">{metric.title}</span>
        <AnimatedCounter value={metric.value} total={metric.total} percent={metric.percent} />
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-[rgba(255,255,255,0.1)]">
        <motion.div
          className="h-full bg-gradient-to-r from-cyan-400 to-purple-500"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.5 }}
        />
      </div>
    </motion.div>
  );
}

// Live AI Thinking Component
function LiveAIThinking({ examples }: { examples: string[] }) {
  const [currentThought, setCurrentThought] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentThought((prev) => (prev + 1) % examples.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [examples.length]);

  return (
    <motion.div
      className="rounded-xl border border-[rgba(139,92,246,0.3)] bg-[rgba(139,92,246,0.05)] px-3 py-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <div className="flex items-start gap-2">
        <div className="text-lg">💭</div>
        <div className="flex-1">
          <div className="text-xs font-semibold text-[rgba(234,240,255,0.75)]">Current AI Action</div>
          <motion.div
            className="text-xs text-[rgba(234,240,255,0.6)] mt-1"
            key={currentThought}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <TypingEffect text={examples[currentThought]} speed={40} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

// Priority Badge Component
function PriorityBadge({ priority }: { priority: string }) {
  const isHigh = priority.includes("HIGH");
  return (
    <div
      className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${
        isHigh
          ? "bg-red-500/20 text-red-300 border border-red-500/30"
          : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
      }`}
    >
      {priority}
    </div>
  );
}

// Execution Orchestrator Agent Component
function ExecutionOrchestratorAgent() {
  const [isActive, setIsActive] = React.useState(false);

  return (
    <motion.div
      className="lg:col-span-2"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="relative overflow-hidden border-[rgba(139,92,246,0.5)] bg-gradient-to-br from-[rgba(139,92,246,0.1)] to-[rgba(6,182,212,0.1)]">
        <div className="pointer-events-none absolute -right-16 -top-16 h-96 w-96 rounded-full bg-[radial-gradient(circle_at_35%_35%,rgba(139,92,246,0.2),transparent_65%)] blur-3xl" />
        <div className="pointer-events-none absolute -left-16 -bottom-16 h-96 w-96 rounded-full bg-[radial-gradient(circle_at_35%_35%,rgba(6,182,212,0.2),transparent_65%)] blur-3xl" />

        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="text-4xl">🚀</div>
              <div>
                <CardTitle className="text-2xl">Execution Orchestrator Agent</CardTitle>
                <div className="mt-2 text-sm text-[rgba(234,240,255,0.7)]">
                  Central AI Brain • Coordinates all agents • Monitors execution • Adapts workflows dynamically
                </div>
              </div>
            </div>
            <motion.div
              animate={{
                scale: isActive ? [1, 1.2, 1] : 1,
              }}
              transition={{
                duration: 2,
                repeat: isActive ? Infinity : 0,
              }}
            >
              <Button size="sm" onClick={() => setIsActive(!isActive)}>
                {isActive ? "Stop" : "Activate"}
              </Button>
            </motion.div>
          </div>
        </CardHeader>

        {isActive && (
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="text-sm font-semibold text-[rgba(234,240,255,0.75)]">
                🎯 Orchestration Status
              </div>
              
              {/* Neural Network Visualization */}
              <div className="grid grid-cols-4 gap-3">
                {AGENTS.map((agent, idx) => (
                  <motion.div
                    key={agent.id}
                    className="rounded-lg border border-[rgba(139,92,246,0.3)] bg-[rgba(139,92,246,0.05)] p-2 text-center"
                    animate={{
                      borderColor: [
                        "rgba(139,92,246,0.3)",
                        "rgba(6,182,212,0.6)",
                        "rgba(139,92,246,0.3)",
                      ],
                    }}
                    transition={{
                      duration: 3,
                      delay: idx * 0.3,
                      repeat: Infinity,
                    }}
                  >
                    <div className="text-xl">{agent.emoji}</div>
                    <div className="text-xs font-semibold text-[rgba(234,240,255,0.6)]">
                      {agent.name.split(" ")[0]}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Orchestration Activities */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-[rgba(234,240,255,0.75)]">
                  📊 Current Operations
                </div>
                <motion.div
                  className="rounded-lg bg-[rgba(0,0,0,0.2)] px-3 py-2 text-xs text-[rgba(234,240,255,0.6)]"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ✓ Monitoring all agent execution progress
                </motion.div>
                <motion.div
                  className="rounded-lg bg-[rgba(0,0,0,0.2)] px-3 py-2 text-xs text-[rgba(234,240,255,0.6)]"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
                >
                  ✓ Detecting learning gaps and adjusting priorities
                </motion.div>
                <motion.div
                  className="rounded-lg bg-[rgba(0,0,0,0.2)] px-3 py-2 text-xs text-[rgba(234,240,255,0.6)]"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.8 }}
                >
                  ✓ Optimizing roadmap based on execution data
                </motion.div>
              </div>

              {/* System Status */}
              <div className="rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-2">
                <motion.div
                  className="flex items-center gap-2"
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                >
                  <div className="h-2 w-2 rounded-full bg-green-400" />
                  <span className="text-xs font-semibold text-green-300">
                    AI Execution System Active • All Agents Online
                  </span>
                </motion.div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </motion.div>
  );
}

// Realtime Execution Feed Component
function ExecutionFeed() {
  const feedItems = [
    { emoji: "🔍", text: "Research Agent updated market trends" },
    { emoji: "📋", text: "Planning Agent generated 12 tasks" },
    { emoji: "📄", text: "Resume Agent optimized portfolio plan" },
    { emoji: "🎤", text: "Interview Agent created 20 mock questions" },
  ];

  return (
    <motion.div
      className="rounded-xl border border-[rgba(139,92,246,0.2)] bg-[rgba(139,92,246,0.05)] p-4 space-y-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <div className="text-xs font-semibold text-[rgba(234,240,255,0.75)]">📡 Realtime Execution Feed</div>
      <div className="space-y-2">
        {feedItems.map((item, idx) => (
          <motion.div
            key={idx}
            className="flex items-center gap-2 rounded-lg bg-[rgba(0,0,0,0.2)] px-2 py-1.5 text-xs text-[rgba(234,240,255,0.6)]"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <span>{item.emoji}</span>
            <span>{item.text}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default function AgentsPage() {
  const [loadingAgent, setLoadingAgent] = React.useState<string | null>(null);
  const [expandedAgent, setExpandedAgent] = React.useState<string | null>(null);
  const [outputs, setOutputs] = React.useState<Record<string, AgentOutput>>({});
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [agentStatus, setAgentStatus] = React.useState<Record<string, AgentStatus>>({
    research: "idle",
    planning: "idle",
    resume: "idle",
    interview: "idle",
  });

  // Simulate agent status changes
  React.useEffect(() => {
    const interval = setInterval(() => {
      setAgentStatus((prev) => {
        const statuses: AgentStatus[] = ["idle", "active", "processing", "learning", "optimizing"];
        return {
          research: statuses[Math.floor(Math.random() * statuses.length)],
          planning: statuses[Math.floor(Math.random() * statuses.length)],
          resume: statuses[Math.floor(Math.random() * statuses.length)],
          interview: statuses[Math.floor(Math.random() * statuses.length)],
        };
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  async function runAgent(agentConfig: (typeof AGENTS)[number]) {
    const { id, type } = agentConfig;
    setLoadingAgent(id);
    setExpandedAgent(id);
    setErrors((e) => ({ ...e, [id]: "" }));
    setAgentStatus((prev) => ({ ...prev, [id]: "processing" }));

    try {
      const res = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentType: type, careerGoal: "Generative AI Engineer" }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Agent run failed");

      setOutputs((o) => ({ ...o, [id]: json }));
      setAgentStatus((prev) => ({ ...prev, [id]: "active" }));
    } catch (e) {
      setErrors((err) => ({
        ...err,
        [id]: e instanceof Error ? e.message : "Agent failed.",
      }));
      setAgentStatus((prev) => ({ ...prev, [id]: "idle" }));
    } finally {
      setLoadingAgent(null);
    }
  }

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header with System Status */}
      <motion.div
        className="space-y-3"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">⚙️ AI Execution Command Center</h2>
            <p className="mt-1 text-sm text-[rgba(234,240,255,0.6)]">
              4 specialized agents + Execution Orchestrator = Autonomous execution system
            </p>
          </div>
          <motion.div
            className="rounded-lg border border-green-500/50 bg-green-500/10 px-4 py-2"
            animate={{
              borderColor: [
                "rgba(34,197,94,0.5)",
                "rgba(34,197,94,1)",
                "rgba(34,197,94,0.5)",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            <motion.div
              className="flex items-center gap-2"
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
              }}
            >
              <motion.div
                className="h-3 w-3 rounded-full bg-green-400"
                animate={{
                  boxShadow: [
                    "0 0 0 0 rgba(34,197,94,0.7)",
                    "0 0 0 10px rgba(34,197,94,0)",
                  ],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                }}
              />
              <span className="text-sm font-semibold text-green-300">System Active</span>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Agent Cards Grid */}
      <motion.div className="grid gap-4 lg:grid-cols-2">
        {AGENTS.map((agent, idx) => {
          const output = outputs[agent.id];
          const error = errors[agent.id];
          const loading = loadingAgent === agent.id;
          const status = agentStatus[agent.id];
          const isExpanded = expandedAgent === agent.id && output;

          return (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="relative"
            >
              <Card
                className={`relative overflow-hidden transition-all ${
                  isExpanded ? "lg:col-span-2" : ""
                }`}
              >
                {/* Animated Background Gradient */}
                <div
                  className={`pointer-events-none absolute -right-16 -bottom-16 h-48 w-48 rounded-full blur-2xl ${
                    loading ? "animate-pulse" : ""
                  }`}
                  style={{
                    background: `radial-gradient(circle_at_35%_35%,${agent.color},transparent_65%)`,
                    opacity: 0.15,
                  }}
                />

                <CardHeader className="flex flex-row items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{agent.emoji}</span>
                      <CardTitle className="text-lg">{agent.name}</CardTitle>
                      <StatusBadge status={status} />
                    </div>
                    <div className="mt-2 text-sm text-[rgba(234,240,255,0.6)]">
                      {agent.description}
                    </div>

                    {/* Capabilities */}
                    <div className="mt-3 flex flex-wrap gap-1">
                      {agent.capabilities.map((cap) => (
                        <span
                          key={cap}
                          className="inline-block rounded-full bg-[rgba(139,92,246,0.1)] px-2 py-1 text-xs text-[rgba(234,240,255,0.6)]"
                        >
                          {cap}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button
                      size="sm"
                      onClick={() => void runAgent(agent)}
                      disabled={loading}
                      className={`whitespace-nowrap ${
                        loading
                          ? "animate-pulse"
                          : "hover:shadow-lg hover:shadow-purple-500/20"
                      }`}
                    >
                      {loading ? "Running…" : "Execute"}
                    </Button>
                    <PriorityBadge priority={agent.priority} />
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Live AI Thinking */}
                  <LiveAIThinking examples={agent.thinkingExamples} />

                  {/* Performance Metrics */}
                  <AgentMetrics metric={agent.metrics} />

                  {/* Output Section */}
                  {error ? (
                    <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-200">
                      {error}
                    </div>
                  ) : output?.advice ? (
                    <motion.div
                      className="space-y-3"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {typeof output.advice === "string" ? (
                        <div className="text-sm text-[rgba(234,240,255,0.75)]">
                          {output.advice}
                        </div>
                      ) : (
                        <div className="space-y-2 text-sm">
                          {/* Handle different agent response types */}
                          {(output.advice as any)?.assessment && (
                            <div>
                              <div className="text-xs font-semibold text-[rgba(234,240,255,0.75)]">
                                Assessment
                              </div>
                              <div className="text-xs text-[rgba(234,240,255,0.6)]">
                                {(output.advice as any).assessment}
                              </div>
                            </div>
                          )}
                          {(output.advice as any)?.currentLevel && (
                            <div>
                              <div className="text-xs font-semibold text-[rgba(234,240,255,0.75)]">
                                Current Level
                              </div>
                              <div className="text-xs text-[rgba(234,240,255,0.6)]">
                                {(output.advice as any).currentLevel}
                              </div>
                            </div>
                          )}
                          {(output.advice as any)?.projectIdea && (
                            <div>
                              <div className="text-xs font-semibold text-[rgba(234,240,255,0.75)]">
                                Project Idea
                              </div>
                              <div className="text-xs text-[rgba(234,240,255,0.6)]">
                                {(output.advice as any).projectIdea}
                              </div>
                            </div>
                          )}
                          {(output.advice as any)?.strategy && (
                            <div>
                              <div className="text-xs font-semibold text-[rgba(234,240,255,0.75)]">
                                Strategy
                              </div>
                              <ul className="space-y-1 text-xs text-[rgba(234,240,255,0.6)]">
                                {(output.advice as any).strategy.map((item: string) => (
                                  <li key={item}>• {item}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {(output.advice as any)?.gaps && (
                            <div>
                              <div className="text-xs font-semibold text-[rgba(234,240,255,0.75)]">
                                Skill Gaps
                              </div>
                              <ul className="space-y-1 text-xs text-[rgba(234,240,255,0.6)]">
                                {(output.advice as any).gaps.map((item: string) => (
                                  <li key={item}>• {item}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {(output.advice as any)?.recommendations && (
                            <div>
                              <div className="text-xs font-semibold text-[rgba(234,240,255,0.75)]">
                                Recommendations
                              </div>
                              <ul className="space-y-1 text-xs text-[rgba(234,240,255,0.6)]">
                                {(output.advice as any).recommendations.map((item: string) => (
                                  <li key={item}>• {item}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {(output.advice as any)?.nextSteps && (
                            <div>
                              <div className="text-xs font-semibold text-[rgba(234,240,255,0.75)]">
                                Next Steps
                              </div>
                              <ul className="space-y-1 text-xs text-[rgba(234,240,255,0.6)]">
                                {(output.advice as any).nextSteps.map((item: string) => (
                                  <li key={item}>→ {item}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {(output.advice as any)?.questions && (
                            <div>
                              <div className="text-xs font-semibold text-[rgba(234,240,255,0.75)]">
                                Interview Questions
                              </div>
                              <ul className="space-y-1 text-xs text-[rgba(234,240,255,0.6)]">
                                {(output.advice as any).questions.map((item: string) => (
                                  <li key={item}>• {item}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                      {output.title && (
                        <div className="text-xs font-semibold tracking-wide text-[rgba(234,240,255,0.75)]">
                          {output.title}
                        </div>
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
                    </motion.div>
                  ) : (
                    <motion.div
                      className="rounded-lg bg-[rgba(139,92,246,0.05)] px-3 py-2 text-xs text-[rgba(234,240,255,0.6)]"
                      animate={{ opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      💡 Click Execute to run this agent and generate domain-specific guidance
                    </motion.div>
                  )}

                  {/* Agent Memory Context */}
                  {output && (
                    <motion.div
                      className="rounded-lg border border-[rgba(6,182,212,0.2)] bg-[rgba(6,182,212,0.05)] px-3 py-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="text-xs font-semibold text-[rgba(234,240,255,0.75)]">
                        🧠 Agent Memory
                      </div>
                      <div className="mt-1 text-xs text-[rgba(234,240,255,0.6)]">
                        Based on your previous {agent.name.toLowerCase()} execution,
                        this agent has adapted its recommendations for better results.
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}

        {/* Execution Orchestrator Agent */}
        <ExecutionOrchestratorAgent />
      </motion.div>

      {/* Realtime Execution Feed */}
      <ExecutionFeed />

      {/* Connection Lines Visualization */}
      <motion.div
        className="rounded-lg border border-[rgba(139,92,246,0.2)] bg-[rgba(139,92,246,0.02)] p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div className="text-xs font-semibold text-[rgba(234,240,255,0.75)] mb-3">
          📡 Multi-Agent Collaboration Flow
        </div>
        <div className="space-y-1 text-xs text-[rgba(234,240,255,0.6)]">
          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🔍 Research Agent → 📊 Market Intelligence & Salary Data
          </motion.div>
          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
          >
            📋 Planning Agent → 🗂️ Optimized Roadmap & Task Sequencing
          </motion.div>
          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
          >
            📄 Resume Agent ↔ 🎤 Interview Agent → 🚀 Integrated Job Readiness
          </motion.div>
          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
          >
            🎯 Orchestrator Agent → ⚙️ Continuous Optimization & Adaptation
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
