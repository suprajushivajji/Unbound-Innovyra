"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ExecutionPlanForm } from "@/app/dashboard/_components/execution-plan-form";
import {
  TrendingUp,
  DollarSign,
  Flame,
  Zap,
  Rocket,
  Brain,
  Activity,
  Sparkles,
  ChevronRight,
} from "lucide-react";

/* ---------- AI confidence meter ---------- */
function ConfidenceMeter({ value }: { value: number }) {
  const r = 38;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={92} height={92} className="rotate-[-90deg]">
        {/* Background ring */}
        <circle
          cx={46}
          cy={46}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.04)"
          strokeWidth={5}
        />
        {/* Glow ring behind */}
        <motion.circle
          cx={46}
          cy={46}
          r={r}
          fill="none"
          stroke="rgba(139,92,246,0.15)"
          strokeWidth={12}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
          style={{ filter: "blur(4px)" }}
        />
        {/* Main ring */}
        <motion.circle
          cx={46}
          cy={46}
          r={r}
          fill="none"
          stroke="url(#confidence-gradient)"
          strokeWidth={5}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
        />
        <defs>
          <linearGradient id="confidence-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(139,92,246,1)" />
            <stop offset="50%" stopColor="rgba(6,182,212,1)" />
            <stop offset="100%" stopColor="rgba(16,185,129,1)" />
          </linearGradient>
        </defs>
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold tracking-tight">{value}%</span>
        <span className="text-[8px] uppercase tracking-widest text-[rgba(234,240,255,0.45)]">
          Confidence
        </span>
      </div>
      {/* Neural pulse */}
      <div className="absolute inset-0 rounded-full animate-neon-pulse opacity-30" />
    </div>
  );
}

/* ---------- insight card data ---------- */
type InsightCard = {
  id: string;
  icon: React.ReactNode;
  title: string;
  content: string;
  accent: string;
  tags?: string[];
};

const DEFAULT_INSIGHTS: InsightCard[] = [
  {
    id: "market",
    icon: <TrendingUp size={16} />,
    title: "Market Demand",
    content: "Data Engineering demand increased by 28% this quarter. Cloud-native skills are the top driver.",
    accent: "rgba(16,185,129,0.8)",
  },
  {
    id: "salary",
    icon: <DollarSign size={16} />,
    title: "Salary Intelligence",
    content: "Advanced Data Engineers average $95K–$180K. Senior roles with Kafka expertise command 22% premium.",
    accent: "rgba(245,158,11,0.8)",
  },
  {
    id: "trending",
    icon: <Flame size={16} />,
    title: "Trending Skills",
    content: "Top skills accelerating in Q1 2025 hiring signals.",
    accent: "rgba(239,68,68,0.8)",
    tags: ["SQL", "Kafka", "Spark", "Airflow", "dbt", "Kubernetes"],
  },
  {
    id: "recommendation",
    icon: <Zap size={16} />,
    title: "AI Recommendation",
    content: "Focus on Kafka before Airflow for faster interview readiness. Build a streaming project first.",
    accent: "rgba(6,182,212,0.8)",
  },
  {
    id: "hiring",
    icon: <Rocket size={16} />,
    title: "Hiring Momentum",
    content: "Portfolio projects outperform certificates by 43% in recruiter engagement. Prioritize building over studying.",
    accent: "rgba(139,92,246,0.8)",
  },
];

/* ---------- smart execution panel ---------- */
const EXECUTION_ITEMS = [
  {
    icon: <ChevronRight size={12} />,
    label: "Next: Build Kafka Consumer project",
    sublabel: "Estimated 3.5 hrs · High Impact",
    color: "rgba(6,182,212,0.8)",
  },
  {
    icon: <Activity size={12} />,
    label: "Workload: 72% capacity utilized",
    sublabel: "2 tasks in progress · 1 in review",
    color: "rgba(245,158,11,0.8)",
  },
  {
    icon: <Brain size={12} />,
    label: "Roadmap adjusted: +Spark priority",
    sublabel: "Based on 14 new job postings this week",
    color: "rgba(139,92,246,0.8)",
  },
];

/* ========== COMPONENT ========== */
export function AiInsightsPanel() {
  const [loading, setLoading] = React.useState(false);
  const [insights, setInsights] = React.useState<InsightCard[]>(DEFAULT_INSIGHTS);
  const [error, setError] = React.useState<string | null>(null);
  const [showForm, setShowForm] = React.useState(false);

  async function runDeepSearch() {
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

      // Map API response to insight cards if available
      const output = json.output ?? json;
      if (output.trendingSkills || output.hiringDemand || output.salaryInsights) {
        const mapped: InsightCard[] = [
          {
            id: "market",
            icon: <TrendingUp size={16} />,
            title: "Market Demand",
            content: output.hiringDemand || DEFAULT_INSIGHTS[0].content,
            accent: "rgba(16,185,129,0.8)",
          },
          {
            id: "salary",
            icon: <DollarSign size={16} />,
            title: "Salary Intelligence",
            content: output.salaryInsights
              ? `${output.salaryInsights.currency ?? "$"}${output.salaryInsights.min?.toLocaleString()} – ${output.salaryInsights.max?.toLocaleString()}. ${output.salaryInsights.notes ?? ""}`
              : DEFAULT_INSIGHTS[1].content,
            accent: "rgba(245,158,11,0.8)",
          },
          {
            id: "trending",
            icon: <Flame size={16} />,
            title: "Trending Skills",
            content: "Top skills accelerating in current hiring signals.",
            accent: "rgba(239,68,68,0.8)",
            tags: output.trendingSkills ?? DEFAULT_INSIGHTS[2].tags,
          },
          ...DEFAULT_INSIGHTS.slice(3),
        ];
        setInsights(mapped);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to run research.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Collapsible execution plan form */}
      <div className="glass rounded-2xl overflow-hidden">
        <button
          onClick={() => setShowForm(!showForm)}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-[rgba(255,255,255,0.02)] transition"
        >
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-[rgba(139,92,246,0.7)]" />
            <span className="text-xs font-semibold tracking-wide">
              Execution Plan Generator
            </span>
          </div>
          <ChevronRight
            size={14}
            className={`text-[rgba(234,240,255,0.4)] transition-transform ${showForm ? "rotate-90" : ""}`}
          />
        </button>
        {showForm && (
          <div className="px-1 pb-1">
            <ExecutionPlanForm />
          </div>
        )}
      </div>

      {/* AI Intelligence Dashboard */}
      <div className="glass-glow rounded-3xl p-5 relative overflow-hidden">
        {/* Background effects */}
        <div className="pointer-events-none absolute -right-20 -bottom-20 h-60 w-60 rounded-full bg-[radial-gradient(circle_at_35%_35%,rgba(139,92,246,0.2),transparent_65%)] blur-3xl" />
        <div className="pointer-events-none absolute -left-16 -top-16 h-40 w-40 rounded-full bg-[radial-gradient(circle_at_65%_65%,rgba(6,182,212,0.12),transparent_65%)] blur-3xl" />

        {/* Header */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <Brain size={16} className="text-[rgba(139,92,246,0.8)]" />
              <span className="text-sm font-semibold tracking-wide">
                AI Intelligence Dashboard
              </span>
            </div>
            <div className="mt-1 text-xs text-[rgba(234,240,255,0.45)]">
              DeepSearch market intelligence • Powered by AI analysis
            </div>
          </div>
          <Button
            onClick={() => void runDeepSearch()}
            disabled={loading}
            size="sm"
            className="shrink-0"
          >
            {loading ? (
              <>
                <div className="h-3 w-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Analyzing…
              </>
            ) : (
              <>
                <Zap size={14} />
                Run DeepSearch
              </>
            )}
          </Button>
        </div>

        {error && (
          <div className="relative z-10 mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-xs text-red-200">
            {error}
          </div>
        )}

        {/* Intelligence Grid */}
        <div className="relative z-10 grid gap-3 lg:grid-cols-3">
          {/* Left: Insight Cards */}
          <div className="lg:col-span-2 grid gap-3 sm:grid-cols-2">
            {insights.map((card, i) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(0,0,0,0.22)] p-4 group hover:border-[rgba(139,92,246,0.25)] transition-all relative overflow-hidden"
              >
                {/* Accent line */}
                <div
                  className="absolute top-0 left-0 w-full h-[2px]"
                  style={{
                    background: `linear-gradient(90deg, ${card.accent}, transparent)`,
                  }}
                />
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="inline-flex items-center justify-center h-7 w-7 rounded-lg"
                    style={{
                      background: `${card.accent}12`,
                      color: card.accent,
                    }}
                  >
                    {card.icon}
                  </div>
                  <span className="text-xs font-semibold tracking-wide text-[rgba(234,240,255,0.75)]">
                    {card.title}
                  </span>
                </div>
                <p className="text-[12px] leading-relaxed text-[rgba(234,240,255,0.55)]">
                  {card.content}
                </p>
                {card.tags && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {card.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-[rgba(239,68,68,0.2)] bg-[rgba(239,68,68,0.06)] px-2 py-0.5 text-[10px] font-medium text-[rgba(239,68,68,0.8)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Right: Confidence + Execution Panel */}
          <div className="space-y-3">
            {/* AI Confidence */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(0,0,0,0.22)] p-4 flex flex-col items-center"
            >
              <div className="text-[10px] uppercase tracking-widest text-[rgba(234,240,255,0.45)] mb-3">
                Research Confidence
              </div>
              <ConfidenceMeter value={91} />
              <div className="mt-3 text-[10px] text-[rgba(234,240,255,0.4)] text-center">
                Based on market data correlation & skill gap analysis
              </div>
            </motion.div>

            {/* Execution Orchestrator */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(0,0,0,0.22)] p-4"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="h-2 w-2 rounded-full bg-[rgba(6,182,212,0.8)] animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
                <span className="text-[10px] font-semibold uppercase tracking-widest text-[rgba(234,240,255,0.55)]">
                  Execution Orchestrator
                </span>
              </div>
              <div className="space-y-2">
                {EXECUTION_ITEMS.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 rounded-lg bg-[rgba(255,255,255,0.02)] px-2.5 py-2 border border-[rgba(255,255,255,0.04)]"
                  >
                    <div
                      className="mt-0.5 shrink-0"
                      style={{ color: item.color }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-[11px] font-medium leading-tight">
                        {item.label}
                      </div>
                      <div className="text-[9px] text-[rgba(234,240,255,0.35)] mt-0.5">
                        {item.sublabel}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
