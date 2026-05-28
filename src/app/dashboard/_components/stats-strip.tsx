"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Zap,
  TrendingUp,
  TrendingDown,
  Brain,
  Flame,
  Target,
  Activity,
} from "lucide-react";

/* ---------- circular progress ring ---------- */
function ProgressRing({
  value,
  size = 64,
  stroke = 4,
  color,
}: {
  value: number;
  size?: number;
  stroke?: number;
  color: string;
}) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;

  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth={stroke}
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.4, ease: [0.4, 0, 0.2, 1] }}
        style={{
          filter: `drop-shadow(0 0 6px ${color})`,
        }}
      />
    </svg>
  );
}

/* ---------- animated counter ---------- */
function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [display, setDisplay] = React.useState(0);

  React.useEffect(() => {
    const start = 0;
    const end = value;
    const duration = 1200;
    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + (end - start) * eased));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [value]);

  return (
    <span className="tabular-nums">
      {display}
      {suffix}
    </span>
  );
}

/* ---------- metric data ---------- */
type Metric = {
  label: string;
  value: number;
  suffix: string;
  change: number;
  icon: React.ReactNode;
  color: string;
  gradient: string;
};

const METRICS: Metric[] = [
  {
    label: "Execution Score",
    value: 82,
    suffix: "%",
    change: 12,
    icon: <Target size={18} />,
    color: "rgba(6,182,212,1)",
    gradient: "linear-gradient(135deg, rgba(6,182,212,0.15), rgba(6,182,212,0.03))",
  },
  {
    label: "Learning Momentum",
    value: 76,
    suffix: "%",
    change: 8,
    icon: <Brain size={18} />,
    color: "rgba(139,92,246,1)",
    gradient: "linear-gradient(135deg, rgba(139,92,246,0.15), rgba(139,92,246,0.03))",
  },
  {
    label: "Productivity Growth",
    value: 64,
    suffix: "%",
    change: -3,
    icon: <Activity size={18} />,
    color: "rgba(59,130,246,1)",
    gradient: "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(59,130,246,0.03))",
  },
  {
    label: "Weekly Consistency",
    value: 91,
    suffix: "%",
    change: 5,
    icon: <Flame size={18} />,
    color: "rgba(245,158,11,1)",
    gradient: "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(245,158,11,0.03))",
  },
  {
    label: "AI Readiness",
    value: 88,
    suffix: "%",
    change: 15,
    icon: <Zap size={18} />,
    color: "rgba(16,185,129,1)",
    gradient: "linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.03))",
  },
];

/* ---------- component ---------- */
export function StatsStrip() {
  const [loaded, setLoaded] = React.useState(false);
  const [completion, setCompletion] = React.useState(0);

  React.useEffect(() => {
    void fetch("/api/analytics")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.completionPercentage) setCompletion(data.completionPercentage);
      })
      .catch(() => null);
    // slight delay so ring animations start after mount
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  const metrics = React.useMemo(() => {
    const copy = [...METRICS];
    if (completion > 0) copy[0] = { ...copy[0], value: completion };
    return copy;
  }, [completion]);

  return (
    <div className="grid gap-3 grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
      {metrics.map((m, i) => (
        <motion.div
          key={m.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="metric-card glass rounded-2xl p-4 relative overflow-hidden group"
        >
          {/* Background gradient blob */}
          <div
            className="pointer-events-none absolute inset-0 opacity-60 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: m.gradient }}
          />

          {/* Floating particle accents */}
          <div
            className="pointer-events-none absolute top-2 right-2 h-1 w-1 rounded-full animate-particle"
            style={{ background: m.color, animationDelay: `${i * 0.5}s` }}
          />

          <div className="relative z-10 flex items-start justify-between">
            {/* Left: icon + label */}
            <div className="flex-1">
              <div
                className="inline-flex items-center justify-center h-8 w-8 rounded-lg mb-2"
                style={{
                  background: `${m.color}15`,
                  border: `1px solid ${m.color}30`,
                  color: m.color,
                }}
              >
                {m.icon}
              </div>
              <div className="text-[11px] uppercase tracking-wider text-[rgba(234,240,255,0.55)] font-medium">
                {m.label}
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight">
                  {loaded ? <AnimatedCounter value={m.value} suffix={m.suffix} /> : "—"}
                </span>
                <span
                  className="flex items-center gap-0.5 text-xs font-medium"
                  style={{
                    color: m.change >= 0 ? "rgba(16,185,129,0.9)" : "rgba(239,68,68,0.9)",
                  }}
                >
                  {m.change >= 0 ? (
                    <TrendingUp size={12} />
                  ) : (
                    <TrendingDown size={12} />
                  )}
                  {m.change >= 0 ? "+" : ""}
                  {m.change}%
                </span>
              </div>
            </div>

            {/* Right: progress ring */}
            <div className="shrink-0 -mt-1">
              {loaded && (
                <ProgressRing
                  value={m.value}
                  size={52}
                  stroke={3}
                  color={m.color}
                />
              )}
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-3 h-1 w-full rounded-full overflow-hidden bg-[rgba(255,255,255,0.04)]">
            <motion.div
              className="h-full rounded-full"
              style={{ background: m.color }}
              initial={{ width: 0 }}
              animate={{ width: loaded ? `${m.value}%` : "0%" }}
              transition={{ duration: 1.2, delay: 0.3 + i * 0.08, ease: [0.4, 0, 0.2, 1] }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
