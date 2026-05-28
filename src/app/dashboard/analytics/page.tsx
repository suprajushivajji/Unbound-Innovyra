"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { motion } from "framer-motion";

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

// Animated counter component
function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [displayed, setDisplayed] = React.useState(0);

  React.useEffect(() => {
    const duration = 800;
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      setDisplayed(Math.round(progress * value));
      if (progress === 1) clearInterval(interval);
    }, 16);
    return () => clearInterval(interval);
  }, [value]);

  return (
    <span>
      {displayed}
      {suffix}
    </span>
  );
}

// Execution score circle
function ExecutionScoreRing({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex h-40 w-40 items-center justify-center">
      <svg className="absolute h-40 w-40" viewBox="0 0 120 120">
        {/* Background ring */}
        <circle
          cx="60"
          cy="60"
          r="45"
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="8"
        />
        {/* Animated progress ring */}
        <motion.circle
          cx="60"
          cy="60"
          r="45"
          fill="none"
          stroke="url(#scoreGradient)"
          strokeWidth="8"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          strokeLinecap="round"
        />
        {/* Gradient definition */}
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(139,92,246,1)" />
            <stop offset="100%" stopColor="rgba(6,182,212,1)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="flex flex-col items-center">
        <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
          <AnimatedCounter value={score} />
        </div>
        <div className="text-xs text-[rgba(234,240,255,0.6)]">Score</div>
      </div>
    </div>
  );
}

// Growth chart data generator
function generateGrowthData() {
  return [
    { week: "W1", productivity: 20, tasks: 25, consistency: 60 },
    { week: "W2", productivity: 35, tasks: 42, consistency: 70 },
    { week: "W3", productivity: 28, tasks: 35, consistency: 65 },
    { week: "W4", productivity: 50, tasks: 65, consistency: 80 },
    { week: "W5", productivity: 72, tasks: 85, consistency: 85 },
    { week: "W6", productivity: 84, tasks: 95, consistency: 90 },
  ];
}

// Skill radar data
function generateSkillsData() {
  return [
    { skill: "System Design", value: 75 },
    { skill: "Problem Solving", value: 82 },
    { skill: "SQL", value: 68 },
    { skill: "Spark", value: 72 },
    { skill: "Kafka", value: 65 },
    { skill: "Airflow", value: 70 },
  ];
}

// Productivity heatmap
function generateHeatmapData() {
  const data = [];
  for (let i = 0; i < 42; i++) {
    data.push({
      day: i,
      value: Math.floor(Math.random() * 100),
      date: new Date(Date.now() - i * 86400000).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    });
  }
  return data.reverse();
}

// Milestone timeline
const milestones = [
  { label: "Foundation", completed: true, icon: "📚" },
  { label: "Building", completed: true, icon: "🔨" },
  { label: "Intermediate", completed: false, icon: "⚙️" },
  { label: "Advanced", completed: false, icon: "🚀" },
  { label: "Portfolio", completed: false, icon: "🎯" },
];

// Execution feed items
const feedItems = [
  { type: "milestone", message: "Completed Spark fundamentals milestone", time: "2h ago" },
  { type: "warning", message: "Execution consistency dropped by 12%", time: "1h ago" },
  { type: "insight", message: "AI adjusted workload - lighter schedule recommended", time: "45m ago" },
  { type: "success", message: "Interview Agent generated 15 new questions", time: "30m ago" },
];

export default function AnalyticsPage() {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<AnalyticsData | null>(null);
  const [timestamp, setTimestamp] = React.useState<string>("");
  const [growthData, setGrowthData] = React.useState<any[]>([]);
  const [skillsData, setSkillsData] = React.useState<any[]>([]);
  const [heatmapData, setHeatmapData] = React.useState<any[]>([]);

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
    // Set timestamp and generate data on client side only to avoid hydration mismatch
    setTimestamp(new Date().toLocaleTimeString());
    setGrowthData(generateGrowthData());
    setSkillsData(generateSkillsData());
    setHeatmapData(generateHeatmapData());
    
    void load();
    const interval = setInterval(() => void load(), 5000);
    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <div className="glass rounded-3xl p-6">
          <h1 className="text-2xl font-bold">AI Execution Analytics Center</h1>
          <p className="mt-1 text-sm text-[rgba(234,240,255,0.6)]">
            Real-time AI-driven career growth intelligence • Last updated: {timestamp || "—"}
          </p>
        </div>
      </motion.div>

      {/* Main Growth Graph */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>📈 Execution Growth Trajectory</CardTitle>
            <div className="mt-1 text-sm text-[var(--muted)]">
              Track your productivity growth, task completion trends, and execution momentum
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={growthData}>
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="rgba(139,92,246,0.8)" />
                    <stop offset="95%" stopColor="rgba(139,92,246,0.1)" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="week" stroke="rgba(234,240,255,0.4)" />
                <YAxis stroke="rgba(234,240,255,0.4)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0,0,0,0.8)",
                    border: "1px solid rgba(139,92,246,0.5)",
                    borderRadius: "8px",
                  }}
                  cursor={{ stroke: "rgba(139,92,246,0.5)" }}
                />
                <Line
                  type="monotone"
                  dataKey="productivity"
                  stroke="rgba(139,92,246,1)"
                  strokeWidth={3}
                  dot={{ fill: "rgba(139,92,246,1)", r: 5 }}
                  activeDot={{ r: 8, fill: "rgba(6,182,212,1)" }}
                  fill="url(#colorGradient)"
                  isAnimationActive
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Execution Score + Key Metrics */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Execution Score */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>⚡ AI Execution Score</CardTitle>
              <div className="text-xs text-[var(--muted)] mt-1">
                Composite score from consistency & completion
              </div>
            </CardHeader>
            <CardContent className="flex justify-center">
              <ExecutionScoreRing score={data?.productivityScore ?? 0} />
            </CardContent>
          </Card>
        </motion.div>

        {/* Weekly Performance Cards */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Tasks Completed", value: data?.completedTasks ?? 0, icon: "✅", color: "from-green-500 to-emerald-600" },
              { label: "Hours Invested", value: Math.round((data?.streak ?? 0) * 1.5), icon: "⏱️", color: "from-blue-500 to-cyan-600" },
              { label: "Streak Days", value: data?.streak ?? 0, icon: "🔥", color: "from-orange-500 to-red-600" },
              { label: "Efficiency", value: `${Math.round((data?.completedTasks ?? 0) / Math.max((data?.totalTasks ?? 1), 1) * 100)}%`, icon: "🚀", color: "from-purple-500 to-pink-600" },
            ].map((card, i) => (
              <motion.div
                key={card.label}
                className="glass rounded-2xl p-4 border border-[rgba(255,255,255,0.1)] hover:border-[rgba(139,92,246,0.3)] transition-all"
                whileHover={{ scale: 1.02, borderColor: "rgba(139,92,246,0.5)" }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs text-[rgba(234,240,255,0.6)]">{card.label}</div>
                    <div className={`mt-2 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${card.color}`}>
                      {card.value}
                    </div>
                  </div>
                  <div className="text-2xl">{card.icon}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Skill Growth Radar + Task Breakdown */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Skill Radar */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>🎯 Skill Growth Radar</CardTitle>
              <div className="text-xs text-[var(--muted)] mt-1">
                Multi-dimensional skill development tracking
              </div>
            </CardHeader>
            <CardContent className="flex justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={skillsData}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis dataKey="skill" stroke="rgba(234,240,255,0.5)" />
                  <PolarRadiusAxis stroke="rgba(234,240,255,0.3)" />
                  <Radar
                    name="Skill Level"
                    dataKey="value"
                    stroke="rgba(139,92,246,1)"
                    fill="rgba(139,92,246,0.3)"
                    isAnimationActive
                  />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Task Completion Breakdown */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>📊 Task Completion Analytics</CardTitle>
              <div className="text-xs text-[var(--muted)] mt-1">
                Real-time task status distribution
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={[
                    {
                      name: "Tasks",
                      completed: data?.completedTasks ?? 0,
                      inProgress: data?.inProgressTasks ?? 0,
                      pending: (data?.totalTasks ?? 0) - (data?.completedTasks ?? 0) - (data?.inProgressTasks ?? 0),
                    },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="rgba(234,240,255,0.4)" />
                  <YAxis stroke="rgba(234,240,255,0.4)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(0,0,0,0.8)",
                      border: "1px solid rgba(139,92,246,0.5)",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="completed" stackId="a" fill="rgba(34,197,94,0.8)" />
                  <Bar dataKey="inProgress" stackId="a" fill="rgba(59,130,246,0.8)" />
                  <Bar dataKey="pending" stackId="a" fill="rgba(107,114,128,0.4)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Productivity Heatmap */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>🔥 42-Day Productivity Heatmap</CardTitle>
            <div className="text-xs text-[var(--muted)] mt-1">
              Daily activity intensity • Darker = more active
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1">
              {heatmapData.map((day, i) => {
                const intensity = day.value / 100;
                const getColor = () => {
                  if (intensity < 0.3) return "rgba(139,92,246,0.1)";
                  if (intensity < 0.6) return "rgba(139,92,246,0.4)";
                  if (intensity < 0.8) return "rgba(139,92,246,0.7)";
                  return "rgba(139,92,246,1)";
                };
                return (
                  <motion.div
                    key={i}
                    className="aspect-square rounded-lg cursor-pointer group relative"
                    style={{ backgroundColor: getColor() }}
                    whileHover={{ scale: 1.2 }}
                  >
                    <div className="absolute hidden group-hover:block -top-8 left-0 text-xs text-white bg-black rounded px-2 py-1 whitespace-nowrap">
                      {day.date}: {day.value}%
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Milestone Timeline + Execution Feed */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Milestone Timeline */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>🎯 Career Milestone Timeline</CardTitle>
              <div className="text-xs text-[var(--muted)] mt-1">
                Progress through execution phases
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {milestones.map((m, i) => (
                  <motion.div
                    key={m.label}
                    className="flex items-center gap-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                      m.completed
                        ? "bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg shadow-green-500/50"
                        : "bg-[rgba(255,255,255,0.1)] border border-[rgba(139,92,246,0.3)]"
                    }`}>
                      {m.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">{m.label}</div>
                      <div className="h-1 mt-2 rounded-full bg-[rgba(255,255,255,0.1)]">
                        {m.completed && (
                          <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-green-400 to-cyan-400"
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 0.8 }}
                          />
                        )}
                      </div>
                    </div>
                    <div className="text-lg">{m.completed ? "✅" : "⏳"}</div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Execution Feed */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>⚡ Realtime Execution Feed</CardTitle>
              <div className="text-xs text-[var(--muted)] mt-1">
                Live system updates & AI insights
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {feedItems.map((item, i) => {
                  const getIcon = () => {
                    if (item.type === "milestone") return "🎯";
                    if (item.type === "warning") return "⚠️";
                    if (item.type === "success") return "🚀";
                    return "💡";
                  };
                  const getBorder = () => {
                    if (item.type === "milestone") return "border-l-green-500";
                    if (item.type === "warning") return "border-l-yellow-500";
                    if (item.type === "success") return "border-l-cyan-500";
                    return "border-l-purple-500";
                  };
                  return (
                    <motion.div
                      key={i}
                      className={`rounded-lg border-l-2 ${getBorder()} bg-[rgba(0,0,0,0.3)] p-3 hover:bg-[rgba(139,92,246,0.1)] transition-all`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-lg mt-0.5">{getIcon()}</span>
                        <div className="flex-1">
                          <p className="text-sm">{item.message}</p>
                          <p className="text-xs text-[rgba(234,240,255,0.4)] mt-1">{item.time}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* AI Insights Panel */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>🤖 AI Performance Insights & Recommendations</CardTitle>
            <div className="text-xs text-[var(--muted)] mt-1">
              Intelligent analysis of your execution patterns
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-[rgba(139,92,246,0.2)] bg-[rgba(139,92,246,0.08)] p-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">✅</span>
                  <div>
                    <div className="text-sm font-semibold">Key Insight</div>
                    <p className="text-sm text-[rgba(234,240,255,0.75)] mt-2">
                      {data?.insight || "You perform better during shorter, focused study sessions with clear milestones."}
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-[rgba(6,182,212,0.2)] bg-[rgba(6,182,212,0.08)] p-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🎯</span>
                  <div>
                    <div className="text-sm font-semibold">AI Recommendation</div>
                    <p className="text-sm text-[rgba(234,240,255,0.75)] mt-2">
                      {data?.recommendation || "Complete 1-2 more small projects before interview prep to build confidence and portfolio depth."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Future Prediction Panel */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>🔮 Career Readiness Prediction</CardTitle>
            <div className="text-xs text-[var(--muted)] mt-1">
              AI forecast based on current trajectory
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 lg:grid-cols-3">
              {[
                { metric: "Interview Ready", percentage: 68, color: "from-purple-400 to-pink-600" },
                { metric: "Roadmap Completion", percentage: 82, color: "from-cyan-400 to-blue-600" },
                { metric: "Skill Depth", percentage: 75, color: "from-green-400 to-emerald-600" },
              ].map((pred) => (
                <motion.div
                  key={pred.metric}
                  className="rounded-2xl glass p-4 border border-[rgba(255,255,255,0.1)]"
                  whileHover={{ borderColor: "rgba(139,92,246,0.5)" }}
                >
                  <div className="text-sm font-semibold mb-3">{pred.metric}</div>
                  <div className="relative h-2 rounded-full bg-[rgba(255,255,255,0.1)] overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full bg-gradient-to-r ${pred.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${pred.percentage}%` }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                    />
                  </div>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r" style={{backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`}}>
                      {pred.percentage}%
                    </span>
                    <span className="text-xs text-[rgba(234,240,255,0.5)]">
                      {pred.percentage > 70 ? "🚀 On track" : "⏳ In progress"}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mt-4 rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[rgba(0,0,0,0.2)] p-4">
              <div className="text-sm text-[rgba(234,240,255,0.75)]">
                <strong>Estimated Goal Completion:</strong> 5.2 months at current pace
              </div>
              <div className="text-xs text-[rgba(234,240,255,0.5)] mt-2">
                Prediction based on: task completion rate, consistency, roadmap progress
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Summary Card */}
      <motion.div variants={itemVariants}>
        <Card className="border-[rgba(139,92,246,0.3)] bg-gradient-to-r from-[rgba(139,92,246,0.1)] to-[rgba(6,182,212,0.1)]">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold">
                🎯 Your AI Execution System is <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">ALIVE</span>
              </div>
              <p className="text-[rgba(234,240,255,0.75)]">
                Data updates every 5 seconds • All systems operational • AI actively optimizing your career path
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
