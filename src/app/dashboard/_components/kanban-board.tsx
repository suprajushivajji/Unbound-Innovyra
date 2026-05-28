"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Zap,
  Clock,
  Sparkles,
  AlertTriangle,
  TrendingUp,
  GraduationCap,
  ChevronRight,
  Plus,
  Flame,
  Shield,
} from "lucide-react";

export type TaskStatus =
  | "to_learn"
  | "in_progress"
  | "completed"
  | "revision"
  | "interview_prep";

export type TaskRow = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  due_date: string | null;
  order_index: number | null;
  created_at: string;
  updated_at: string;
};

/* ---------- smart tag system ---------- */
const TAG_MAP: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  high_priority: {
    label: "HIGH PRIORITY",
    color: "rgba(239,68,68,0.8)",
    icon: <AlertTriangle size={10} />,
  },
  revision_needed: {
    label: "REVISION NEEDED",
    color: "rgba(245,158,11,0.8)",
    icon: <Shield size={10} />,
  },
  market_trending: {
    label: "MARKET TRENDING",
    color: "rgba(16,185,129,0.8)",
    icon: <TrendingUp size={10} />,
  },
  interview_critical: {
    label: "INTERVIEW CRITICAL",
    color: "rgba(139,92,246,0.9)",
    icon: <GraduationCap size={10} />,
  },
};

function getSmartTag(title: string, status: TaskStatus) {
  const lower = title.toLowerCase();
  if (status === "revision") return TAG_MAP.revision_needed;
  if (status === "interview_prep") return TAG_MAP.interview_critical;
  if (lower.includes("kafka") || lower.includes("spark") || lower.includes("ai") || lower.includes("llm"))
    return TAG_MAP.market_trending;
  if (lower.includes("sql") || lower.includes("python") || lower.includes("project"))
    return TAG_MAP.high_priority;
  return null;
}

function getEstimatedTime(title: string): string {
  const words = title.split(" ").length;
  if (words > 6) return "~3h";
  if (words > 3) return "~2h";
  return "~1h";
}

function getIntensity(status: TaskStatus): { label: string; level: number; color: string } {
  switch (status) {
    case "in_progress":
      return { label: "Active", level: 80, color: "rgba(6,182,212,1)" };
    case "interview_prep":
      return { label: "Critical", level: 95, color: "rgba(139,92,246,1)" };
    case "revision":
      return { label: "Medium", level: 60, color: "rgba(245,158,11,1)" };
    case "completed":
      return { label: "Done", level: 100, color: "rgba(16,185,129,1)" };
    default:
      return { label: "Queued", level: 30, color: "rgba(255,255,255,0.4)" };
  }
}

/* ---------- columns config ---------- */
const COLUMNS: {
  key: TaskStatus;
  label: string;
  color: string;
  glowColor: string;
  icon: React.ReactNode;
}[] = [
  {
    key: "to_learn",
    label: "To Learn",
    color: "rgba(139,92,246,0.85)",
    glowColor: "rgba(139,92,246,0.25)",
    icon: <Sparkles size={14} />,
  },
  {
    key: "in_progress",
    label: "In Progress",
    color: "rgba(6,182,212,0.85)",
    glowColor: "rgba(6,182,212,0.25)",
    icon: <Zap size={14} />,
  },
  {
    key: "completed",
    label: "Completed",
    color: "rgba(16,185,129,0.85)",
    glowColor: "rgba(16,185,129,0.25)",
    icon: <Flame size={14} />,
  },
  {
    key: "revision",
    label: "Revision",
    color: "rgba(245,158,11,0.85)",
    glowColor: "rgba(245,158,11,0.25)",
    icon: <AlertTriangle size={14} />,
  },
  {
    key: "interview_prep",
    label: "Interview Prep",
    color: "rgba(139,92,246,0.85)",
    glowColor: "rgba(139,92,246,0.25)",
    icon: <GraduationCap size={14} />,
  },
];

/* ========== COMPONENT ========== */
export function KanbanBoard() {
  const [tasks, setTasks] = React.useState<TaskRow[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [newTitle, setNewTitle] = React.useState("");
  const [expandedTask, setExpandedTask] = React.useState<string | null>(null);

  const grouped = React.useMemo(() => {
    const map = new Map<TaskStatus, TaskRow[]>();
    COLUMNS.forEach((c) => map.set(c.key, []));
    tasks.forEach((t) => map.get(t.status)?.push(t));
    return map;
  }, [tasks]);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/tasks", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        const data = await res.json();
        const taskList = Array.isArray(data) ? data : data.tasks || [];
        setTasks(taskList);
      } else if (res.status === 401) {
        setTasks([]);
      } else {
        setTasks([]);
      }
    } catch {
      setTasks([]);
    }
    setLoading(false);
  }

  React.useEffect(() => {
    void load();
    const interval = setInterval(() => void load(), 5000);
    return () => clearInterval(interval);
  }, []);

  async function addTask() {
    const title = newTitle.trim();
    if (!title) return;
    setNewTitle("");
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, status: "to_learn" }),
      });
      if (res.ok) await load();
    } catch {
      // silent
    }
  }

  async function setStatus(id: string, status: TaskStatus) {
    try {
      const res = await fetch("/api/tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) await load();
    } catch {
      // silent
    }
  }

  return (
    <div className="glass-glow rounded-3xl p-5 relative overflow-hidden">
      {/* Ambient particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute h-1 w-1 rounded-full animate-particle"
            style={{
              background: i % 2 === 0 ? "rgba(6,182,212,0.4)" : "rgba(139,92,246,0.4)",
              left: `${15 + i * 18}%`,
              top: `${10 + i * 12}%`,
              animationDelay: `${i * 1.2}s`,
              animationDuration: `${5 + i}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[rgba(6,182,212,0.9)] animate-status-blink shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
            <span className="text-sm font-semibold tracking-wide">
              AI Workflow Orchestrator
            </span>
          </div>
          <div className="mt-1 text-xs text-[rgba(234,240,255,0.55)]">
            Realtime execution pipeline — {tasks.length} tasks tracked •{" "}
            {grouped.get("completed")?.length ?? 0} completed
          </div>
        </div>

        <div className="flex w-full max-w-md gap-2">
          <div className="relative flex-1">
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Add task (e.g., Build RAG mini-project)…"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  void addTask();
                }
              }}
              className="pr-10"
            />
            <Sparkles
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgba(139,92,246,0.5)]"
            />
          </div>
          <Button onClick={() => void addTask()} className="shrink-0 gap-1" size="sm">
            <Plus size={14} />
            Add
          </Button>
        </div>
      </div>

      {/* Kanban columns */}
      <div className="relative z-10 flex gap-3 overflow-x-auto pb-2 custom-scrollbar xl:grid xl:grid-cols-5 xl:overflow-visible xl:pb-0">
        {COLUMNS.map((col, ci) => {
          const colTasks = grouped.get(col.key) ?? [];
          return (
            <motion.div
              key={col.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: ci * 0.06, duration: 0.4 }}
              className="min-w-0 shrink-0 w-[200px] xl:w-auto xl:shrink"
            >
              {/* Column header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-flex items-center justify-center h-6 w-6 rounded-lg"
                    style={{
                      background: `${col.color}15`,
                      color: col.color,
                    }}
                  >
                    {col.icon}
                  </span>
                  <span className="text-xs font-medium tracking-wide text-[rgba(234,240,255,0.75)]">
                    {col.label}
                  </span>
                </div>
                <span
                  className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold"
                  style={{
                    background: `${col.color}20`,
                    color: col.color,
                    border: `1px solid ${col.color}30`,
                  }}
                >
                  {colTasks.length}
                </span>
              </div>

              {/* Column body */}
              <div
                className="rounded-2xl p-2 min-h-[120px] custom-scrollbar overflow-y-auto max-h-[400px]"
                style={{
                  background: "rgba(0,0,0,0.22)",
                  border: `1px solid rgba(255,255,255,0.06)`,
                  boxShadow: `0 0 0 1px ${col.glowColor} inset`,
                }}
              >
                {loading ? (
                  <div className="flex items-center gap-2 p-3 text-xs text-[var(--muted)]">
                    <div className="h-2 w-2 rounded-full bg-[var(--cyan-glow)] animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
                    Syncing…
                  </div>
                ) : colTasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-6 text-[rgba(234,240,255,0.3)]">
                    <div className="h-8 w-8 rounded-full border border-dashed border-[rgba(255,255,255,0.1)] flex items-center justify-center mb-2">
                      <Plus size={14} />
                    </div>
                    <span className="text-[10px]">Drop tasks here</span>
                  </div>
                ) : (
                  <AnimatePresence mode="popLayout">
                    <div className="space-y-2">
                      {colTasks.map((t, ti) => {
                        const tag = getSmartTag(t.title, t.status);
                        const time = getEstimatedTime(t.title);
                        const intensity = getIntensity(t.status);
                        const isExpanded = expandedTask === t.id;

                        return (
                          <motion.div
                            key={t.id}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.25, delay: ti * 0.03 }}
                            onClick={() =>
                              setExpandedTask(isExpanded ? null : t.id)
                            }
                            className={cn(
                              "task-card rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-3 py-2.5 cursor-pointer relative overflow-hidden",
                              isExpanded && "border-[rgba(6,182,212,0.3)]"
                            )}
                          >
                            {/* Priority glow indicator */}
                            {tag && (
                              <div
                                className="absolute top-0 left-0 w-full h-[2px]"
                                style={{
                                  background: `linear-gradient(90deg, transparent, ${tag.color}, transparent)`,
                                }}
                              />
                            )}

                            {/* Task title & meta */}
                            <div className="text-sm leading-5 font-medium">
                              {t.title}
                            </div>

                            {/* Smart tags */}
                            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                              {tag && (
                                <span
                                  className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                                  style={{
                                    background: `${tag.color}15`,
                                    color: tag.color,
                                    border: `1px solid ${tag.color}25`,
                                  }}
                                >
                                  {tag.icon}
                                  {tag.label}
                                </span>
                              )}
                              <span className="inline-flex items-center gap-1 text-[10px] text-[rgba(234,240,255,0.45)]">
                                <Clock size={9} />
                                {time}
                              </span>
                            </div>

                            {/* Execution intensity bar */}
                            <div className="mt-2 flex items-center gap-2">
                              <div className="flex-1 h-[3px] rounded-full bg-[rgba(255,255,255,0.04)] overflow-hidden">
                                <motion.div
                                  className="h-full rounded-full"
                                  style={{ background: intensity.color }}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${intensity.level}%` }}
                                  transition={{ duration: 0.8, delay: 0.2 }}
                                />
                              </div>
                              <span
                                className="text-[9px] font-medium"
                                style={{ color: intensity.color }}
                              >
                                {intensity.label}
                              </span>
                            </div>

                            {/* Expanded move actions */}
                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="overflow-hidden"
                                >
                                  <div className="mt-2 pt-2 border-t border-[rgba(255,255,255,0.06)] flex flex-wrap gap-1">
                                    {COLUMNS.filter(
                                      (c) => c.key !== col.key
                                    ).map((c) => (
                                      <button
                                        key={c.key}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          void setStatus(t.id, c.key);
                                        }}
                                        className="group/btn inline-flex items-center gap-1 rounded-lg border border-[rgba(255,255,255,0.06)] bg-[rgba(0,0,0,0.25)] px-2 py-1 text-[9px] text-[rgba(234,240,255,0.6)] transition-all hover:text-white hover:border-[rgba(6,182,212,0.35)] hover:shadow-[0_0_12px_rgba(6,182,212,0.15)]"
                                      >
                                        <ChevronRight
                                          size={9}
                                          className="transition-transform group-hover/btn:translate-x-0.5"
                                        />
                                        {c.label}
                                      </button>
                                    ))}
                                  </div>

                                  {/* AI suggestion */}
                                  <div className="mt-2 flex items-start gap-1.5 rounded-lg bg-[rgba(139,92,246,0.06)] border border-[rgba(139,92,246,0.12)] px-2 py-1.5">
                                    <Sparkles
                                      size={10}
                                      className="mt-0.5 text-[rgba(139,92,246,0.7)] shrink-0"
                                    />
                                    <span className="text-[9px] text-[rgba(234,240,255,0.5)] leading-snug">
                                      AI suggests focusing on this{" "}
                                      {col.key === "to_learn"
                                        ? "before starting new topics"
                                        : col.key === "revision"
                                        ? "to solidify understanding"
                                        : "to build momentum"}
                                    </span>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        );
                      })}
                    </div>
                  </AnimatePresence>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
