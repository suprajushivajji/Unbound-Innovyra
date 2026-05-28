"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Search,
  TrendingUp,
  Zap,
  Brain,
  Flame,
  MapPin,
  BarChart3,
  Rocket,
  Radio,
  ChevronRight,
  DollarSign,
  Globe,
  Layers,
  Target,
} from "lucide-react";

/* ===== TYPES ===== */
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

/* ===== MINI CHART (bar spark) ===== */
function MiniBarChart({
  data,
  color,
  height = 32,
}: {
  data: number[];
  color: string;
  height?: number;
}) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-[2px]" style={{ height }}>
      {data.map((v, i) => (
        <motion.div
          key={i}
          className="rounded-t-sm w-[4px]"
          style={{ background: color }}
          initial={{ height: 0 }}
          animate={{ height: `${(v / max) * 100}%` }}
          transition={{ duration: 0.6, delay: i * 0.05 }}
        />
      ))}
    </div>
  );
}

/* ===== TREND LINE CHART ===== */
function TrendLineChart({ color }: { color: string }) {
  const pts = [20, 35, 28, 48, 40, 58, 52, 72, 65, 80, 78, 92];
  const w = 160;
  const h = 40;
  const path = pts
    .map((p, i) => {
      const x = (i / (pts.length - 1)) * w;
      const y = h - (p / 100) * h;
      return `${i === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={w} height={h + 4} className="overflow-visible">
      {/* Glow area */}
      <defs>
        <linearGradient id={`trend-fill-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        d={path + ` L${w},${h} L0,${h} Z`}
        fill={`url(#trend-fill-${color})`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />
      <motion.path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        style={{ filter: `drop-shadow(0 0 4px ${color})` }}
      />
    </svg>
  );
}

/* ===== SKILL INTELLIGENCE BAR ===== */
function SkillBar({
  skill,
  demand,
  growth,
  color,
  delay,
}: {
  skill: string;
  demand: number;
  growth: string;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="flex items-center gap-3"
    >
      <span className="w-16 text-[11px] font-medium text-[rgba(234,240,255,0.7)] shrink-0">
        {skill}
      </span>
      <div className="flex-1 h-[6px] rounded-full bg-[rgba(255,255,255,0.04)] overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, ${color}, ${color}88)`,
            boxShadow: `0 0 8px ${color}40`,
          }}
          initial={{ width: 0 }}
          animate={{ width: `${demand}%` }}
          transition={{ duration: 1, delay: delay + 0.2, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>
      <span
        className="text-[10px] font-semibold shrink-0"
        style={{ color }}
      >
        {growth}
      </span>
    </motion.div>
  );
}

/* ===== DEEPSEARCH STATUS ===== */
function DeepSearchStatus({ active }: { active: boolean }) {
  const statuses = [
    { color: "rgba(16,185,129,0.9)", label: "DeepSearch Active", pulse: true },
    { color: "rgba(59,130,246,0.9)", label: "Scanning Hiring Trends", pulse: true },
    { color: "rgba(139,92,246,0.9)", label: "Updating Market Intelligence", pulse: false },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3">
      {statuses.map((s, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <div
            className={`h-2 w-2 rounded-full ${active ? "animate-status-blink" : ""}`}
            style={{
              background: s.color,
              boxShadow: active ? `0 0 8px ${s.color}` : "none",
              animationDelay: `${i * 0.6}s`,
            }}
          />
          <span className="text-[10px] text-[rgba(234,240,255,0.5)]">{s.label}</span>
        </div>
      ))}
    </div>
  );
}

/* ===== AI TREND TIMELINE ===== */
const TREND_YEARS = [
  { year: "2024", label: "SQL Dominance", color: "rgba(59,130,246,0.9)", icon: <Layers size={12} /> },
  { year: "2025", label: "Kafka Surge", color: "rgba(6,182,212,0.9)", icon: <Zap size={12} /> },
  { year: "2026", label: "AI Data Pipelines Growth", color: "rgba(139,92,246,0.9)", icon: <Brain size={12} /> },
  { year: "2027", label: "Autonomous Analytics", color: "rgba(16,185,129,0.9)", icon: <Rocket size={12} /> },
];

/* ===== DEFAULT SKILL DATA ===== */
const DEFAULT_SKILLS = [
  { skill: "SQL", demand: 92, growth: "+8%", color: "rgba(59,130,246,0.9)" },
  { skill: "Kafka", demand: 85, growth: "+28%", color: "rgba(6,182,212,0.9)" },
  { skill: "Spark", demand: 78, growth: "+15%", color: "rgba(245,158,11,0.9)" },
  { skill: "Airflow", demand: 71, growth: "+12%", color: "rgba(139,92,246,0.9)" },
  { skill: "dbt", demand: 65, growth: "+35%", color: "rgba(16,185,129,0.9)" },
  { skill: "Python", demand: 95, growth: "+5%", color: "rgba(239,68,68,0.9)" },
];

const DEFAULT_RECOMMENDATIONS = [
  { icon: <Zap size={13} />, text: "Focus on ETL pipelines first — highest ROI for job readiness.", color: "rgba(6,182,212,0.8)" },
  { icon: <Rocket size={13} />, text: "Kafka adoption rising rapidly — early expertise = competitive edge.", color: "rgba(139,92,246,0.8)" },
  { icon: <MapPin size={13} />, text: "Portfolio projects increase hiring chances by 43% vs certificates.", color: "rgba(16,185,129,0.8)" },
  { icon: <Target size={13} />, text: "System design knowledge is now tested in 78% of senior interviews.", color: "rgba(245,158,11,0.8)" },
];

/* ========== MAIN COMPONENT ========== */
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
    } catch {
      // silent
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
      if (json.output) setResearch(json.output);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "DeepSearch failed.");
    } finally {
      setGenerating(false);
    }
  }

  const skills = React.useMemo(() => {
    if (!research?.trendingSkills?.length) return DEFAULT_SKILLS;
    return research.trendingSkills.slice(0, 8).map((s, i) => ({
      skill: s,
      demand: 95 - i * 7,
      growth: `+${Math.round(35 - i * 4)}%`,
      color: DEFAULT_SKILLS[i % DEFAULT_SKILLS.length].color,
    }));
  }, [research]);

  return (
    <div className="space-y-4">
      {/* ===== HEADER ===== */}
      <div className="glass-glow rounded-3xl p-5 relative overflow-hidden">
        <div className="pointer-events-none absolute -right-32 -top-32 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.15),transparent_65%)] blur-3xl" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search size={16} className="text-[rgba(6,182,212,0.8)]" />
              </div>
              <span className="text-sm font-semibold tracking-wide">
                DeepSearch Intelligence Lab
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.2)] px-2 py-0.5 text-[9px] font-bold text-[rgba(16,185,129,0.8)]">
                <Radio size={8} />
                LIVE
              </span>
            </div>
            <div className="mt-1 text-xs text-[rgba(234,240,255,0.45)]">
              Real-time market intelligence • Skill gap analysis • Career trajectory optimization
            </div>
          </div>
          <Button
            onClick={() => void runDeepSearch()}
            disabled={generating}
            size="sm"
            className="shrink-0"
          >
            {generating ? (
              <>
                <div className="h-3 w-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Analyzing…
              </>
            ) : (
              <>
                <Brain size={14} />
                Run DeepSearch
              </>
            )}
          </Button>
        </div>

        {/* DeepSearch Status */}
        <div className="relative z-10 mt-3">
          <DeepSearchStatus active={generating} />
        </div>

        {error && (
          <div className="relative z-10 mt-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs text-red-200">
            {error}
          </div>
        )}
      </div>

      {loading ? (
        <div className="glass rounded-2xl p-8 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full border-2 border-[rgba(6,182,212,0.3)] border-t-[rgba(6,182,212,0.9)] animate-spin" />
            <span className="text-sm text-[var(--muted)]">Loading intelligence…</span>
          </div>
        </div>
      ) : (
        <>
          {/* ===== LIVE MARKET DASHBOARD ===== */}
          <div className="grid gap-3 lg:grid-cols-4">
            {[
              {
                icon: <TrendingUp size={16} />,
                label: "Market Growth",
                value: "+28%",
                sub: "Data Engineering demand this quarter",
                color: "rgba(16,185,129,0.9)",
                chartData: [30, 35, 45, 42, 55, 60, 58, 72, 68, 80, 85, 92],
              },
              {
                icon: <DollarSign size={16} />,
                label: "Avg. Salary",
                value: research?.salaryInsights ? `$${Math.round(((research.salaryInsights.min + research.salaryInsights.max) / 2) / 1000)}K` : "$137K",
                sub: research?.salaryInsights ? `${research.salaryInsights.currency}${research.salaryInsights.min.toLocaleString()}–${research.salaryInsights.max.toLocaleString()}` : "Range: $95K–$180K",
                color: "rgba(245,158,11,0.9)",
                chartData: [60, 62, 65, 68, 70, 72, 75, 78, 80, 83, 85, 88],
              },
              {
                icon: <Globe size={16} />,
                label: "Active Roles",
                value: "12.4K",
                sub: "Open positions matching your profile",
                color: "rgba(59,130,246,0.9)",
                chartData: [40, 55, 48, 60, 52, 65, 70, 68, 75, 80, 82, 90],
              },
              {
                icon: <Flame size={16} />,
                label: "Skill Gap Score",
                value: "73%",
                sub: "Coverage of in-demand skills",
                color: "rgba(139,92,246,0.9)",
                chartData: [20, 28, 35, 42, 45, 50, 55, 58, 63, 68, 71, 73],
              },
            ].map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="metric-card glass rounded-2xl p-4 relative overflow-hidden"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="inline-flex items-center justify-center h-7 w-7 rounded-lg"
                    style={{ background: `${m.color}12`, color: m.color }}
                  >
                    {m.icon}
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-[rgba(234,240,255,0.5)] font-medium">
                    {m.label}
                  </span>
                </div>
                <div className="text-2xl font-bold tracking-tight" style={{ color: m.color }}>
                  {m.value}
                </div>
                <div className="text-[10px] text-[rgba(234,240,255,0.4)] mt-0.5">{m.sub}</div>
                <div className="mt-2">
                  <MiniBarChart data={m.chartData} color={m.color} height={28} />
                </div>
              </motion.div>
            ))}
          </div>

          {/* ===== SKILL INTELLIGENCE + INDUSTRY DEMAND ===== */}
          <div className="grid gap-3 lg:grid-cols-2">
            {/* Skill Intelligence Matrix */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="glass rounded-2xl p-5"
            >
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 size={14} className="text-[rgba(6,182,212,0.8)]" />
                <span className="text-xs font-semibold tracking-wide">
                  Skill Intelligence Matrix
                </span>
              </div>
              <div className="space-y-3">
                {skills.map((s, i) => (
                  <SkillBar
                    key={s.skill}
                    skill={s.skill}
                    demand={s.demand}
                    growth={s.growth}
                    color={s.color}
                    delay={i * 0.06}
                  />
                ))}
              </div>
            </motion.div>

            {/* Industry Demand Graph */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.4 }}
              className="glass rounded-2xl p-5"
            >
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={14} className="text-[rgba(139,92,246,0.8)]" />
                <span className="text-xs font-semibold tracking-wide">
                  Industry Demand Trends
                </span>
              </div>
              <div className="space-y-4">
                {[
                  { label: "Hiring Growth", color: "rgba(16,185,129,0.9)" },
                  { label: "Salary Trend", color: "rgba(245,158,11,0.9)" },
                  { label: "Skill Popularity", color: "rgba(6,182,212,0.9)" },
                ].map((t) => (
                  <div key={t.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-[rgba(234,240,255,0.5)]">{t.label}</span>
                      <span className="text-[10px] font-medium" style={{ color: t.color }}>
                        ↑ Trending
                      </span>
                    </div>
                    <TrendLineChart color={t.color} />
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ===== AI TREND TIMELINE ===== */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="glass rounded-2xl p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <Layers size={14} className="text-[rgba(245,158,11,0.8)]" />
              <span className="text-xs font-semibold tracking-wide">
                AI Technology Trend Timeline
              </span>
            </div>
            <div className="flex items-center gap-0 overflow-x-auto pb-1 custom-scrollbar">
              {TREND_YEARS.map((t, i) => (
                <React.Fragment key={t.year}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + i * 0.1, duration: 0.4 }}
                    className="shrink-0 flex flex-col items-center relative"
                  >
                    <div
                      className="h-10 w-10 rounded-xl flex items-center justify-center mb-2"
                      style={{
                        background: `${t.color}15`,
                        border: `1px solid ${t.color}30`,
                        color: t.color,
                        boxShadow: `0 0 15px ${t.color}15`,
                      }}
                    >
                      {t.icon}
                    </div>
                    <span className="text-sm font-bold" style={{ color: t.color }}>
                      {t.year}
                    </span>
                    <span className="text-[10px] text-[rgba(234,240,255,0.5)] mt-0.5 text-center max-w-[100px]">
                      {t.label}
                    </span>
                  </motion.div>
                  {i < TREND_YEARS.length - 1 && (
                    <div className="flex-1 min-w-[40px] max-w-[80px] flex items-center px-2">
                      <motion.div
                        className="w-full h-[2px] rounded-full"
                        style={{
                          background: `linear-gradient(90deg, ${t.color}60, ${TREND_YEARS[i + 1].color}60)`,
                        }}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.5 + i * 0.1, duration: 0.6 }}
                      />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </motion.div>

          {/* ===== MARKET TRENDS + AI RECOMMENDATIONS ===== */}
          <div className="grid gap-3 lg:grid-cols-2">
            {/* Market Trends */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.4 }}
              className="glass rounded-2xl p-5"
            >
              <div className="flex items-center gap-2 mb-3">
                <Globe size={14} className="text-[rgba(59,130,246,0.8)]" />
                <span className="text-xs font-semibold tracking-wide">
                  Market Intelligence
                </span>
              </div>
              {research?.marketTrends?.length ? (
                <div className="space-y-2">
                  {research.marketTrends.map((t, i) => (
                    <motion.div
                      key={t}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.3 }}
                      className="flex items-start gap-2 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] px-3 py-2"
                    >
                      <ChevronRight size={12} className="mt-0.5 text-[rgba(59,130,246,0.6)] shrink-0" />
                      <span className="text-[11px] text-[rgba(234,240,255,0.6)] leading-relaxed">{t}</span>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {[
                    "Cloud-native data architectures replacing legacy ETL systems at 40% faster rate",
                    "Real-time streaming adoption up 35% — Kafka leads enterprise deployments",
                    "AI/ML integration in data pipelines becoming standard requirement",
                    "Remote-first roles increased 22% for senior data engineers",
                  ].map((t, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.3 }}
                      className="flex items-start gap-2 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] px-3 py-2"
                    >
                      <ChevronRight size={12} className="mt-0.5 text-[rgba(59,130,246,0.6)] shrink-0" />
                      <span className="text-[11px] text-[rgba(234,240,255,0.6)] leading-relaxed">{t}</span>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* AI Strategic Recommendations */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="glass rounded-2xl p-5"
            >
              <div className="flex items-center gap-2 mb-3">
                <Brain size={14} className="text-[rgba(139,92,246,0.8)]" />
                <span className="text-xs font-semibold tracking-wide">
                  AI Strategic Recommendations
                </span>
              </div>
              <div className="space-y-2">
                {DEFAULT_RECOMMENDATIONS.map((r, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.35 }}
                    className="flex items-start gap-2.5 rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(0,0,0,0.18)] px-3 py-2.5 group hover:border-[rgba(139,92,246,0.2)] transition-all"
                  >
                    <div
                      className="mt-0.5 shrink-0"
                      style={{ color: r.color }}
                    >
                      {r.icon}
                    </div>
                    <span className="text-[11px] text-[rgba(234,240,255,0.6)] leading-relaxed">
                      {r.text}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ===== TECHNOLOGIES ===== */}
          {research?.technologies?.length ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.4 }}
              className="glass rounded-2xl p-5"
            >
              <div className="flex items-center gap-2 mb-3">
                <Layers size={14} className="text-[rgba(6,182,212,0.8)]" />
                <span className="text-xs font-semibold tracking-wide">
                  Key Technologies in Demand
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {research.technologies.map((t, i) => (
                  <motion.span
                    key={t}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.04, duration: 0.3 }}
                    className="rounded-full border border-[rgba(6,182,212,0.2)] bg-[rgba(6,182,212,0.06)] px-3 py-1 text-xs font-medium text-[rgba(6,182,212,0.85)] hover:bg-[rgba(6,182,212,0.12)] hover:border-[rgba(6,182,212,0.35)] transition-all cursor-default"
                  >
                    {t}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ) : null}
        </>
      )}
    </div>
  );
}
