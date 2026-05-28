"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Zap,
  Rocket,
  MapPin,
  Brain,
  GitBranch,
  BookOpen,
  Radio,
} from "lucide-react";

type TimelineEvent = {
  id: string;
  icon: React.ReactNode;
  label: string;
  time: string;
  color: string;
  status: "done" | "active" | "pending";
};

const DEMO_EVENTS: TimelineEvent[] = [
  {
    id: "1",
    icon: <CheckCircle2 size={13} />,
    label: "SQL Fundamentals completed",
    time: "2m ago",
    color: "rgba(16,185,129,0.9)",
    status: "done",
  },
  {
    id: "2",
    icon: <Zap size={13} />,
    label: "Kafka streaming module started",
    time: "12m ago",
    color: "rgba(6,182,212,0.9)",
    status: "active",
  },
  {
    id: "3",
    icon: <Rocket size={13} />,
    label: "AI adjusted roadmap priorities",
    time: "28m ago",
    color: "rgba(139,92,246,0.9)",
    status: "done",
  },
  {
    id: "4",
    icon: <MapPin size={13} />,
    label: "Interview prep activated — System Design",
    time: "1h ago",
    color: "rgba(245,158,11,0.9)",
    status: "done",
  },
  {
    id: "5",
    icon: <Brain size={13} />,
    label: "DeepSearch updated market intelligence",
    time: "2h ago",
    color: "rgba(139,92,246,0.9)",
    status: "done",
  },
  {
    id: "6",
    icon: <GitBranch size={13} />,
    label: "Portfolio project scaffolded — ETL Pipeline",
    time: "3h ago",
    color: "rgba(59,130,246,0.9)",
    status: "done",
  },
  {
    id: "7",
    icon: <BookOpen size={13} />,
    label: "Spark module queued for tomorrow",
    time: "4h ago",
    color: "rgba(6,182,212,0.7)",
    status: "pending",
  },
];

export function ExecutionTimeline() {
  return (
    <div className="glass rounded-2xl p-4 relative overflow-hidden">
      {/* Scan line effect */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute left-0 right-0 h-8 animate-scan opacity-10"
          style={{
            background:
              "linear-gradient(180deg, transparent, rgba(6,182,212,0.4), transparent)",
          }}
        />
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Radio
              size={14}
              className="text-[rgba(6,182,212,0.8)]"
            />
            <div className="absolute inset-0 animate-ping">
              <Radio size={14} className="text-[rgba(6,182,212,0.3)]" />
            </div>
          </div>
          <span className="text-xs font-semibold tracking-wide">
            Realtime Execution Timeline
          </span>
        </div>
        <span className="text-[10px] text-[rgba(234,240,255,0.4)] flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-[rgba(16,185,129,0.8)] animate-pulse" />
          Auto-updating
        </span>
      </div>

      {/* Scrollable horizontal timeline */}
      <div className="relative z-10 flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
        {DEMO_EVENTS.map((evt, i) => (
          <motion.div
            key={evt.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06, duration: 0.35 }}
            className="shrink-0 flex items-center gap-2 rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(0,0,0,0.25)] px-3 py-2 min-w-[220px] group hover:border-[rgba(6,182,212,0.25)] transition-all"
          >
            <div
              className="shrink-0 flex items-center justify-center h-7 w-7 rounded-lg"
              style={{
                background: `${evt.color}15`,
                color: evt.color,
                boxShadow:
                  evt.status === "active"
                    ? `0 0 12px ${evt.color}40`
                    : "none",
              }}
            >
              {evt.icon}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-medium leading-tight truncate">
                {evt.label}
              </div>
              <div className="text-[9px] text-[rgba(234,240,255,0.35)] mt-0.5">
                {evt.time}
              </div>
            </div>
            {evt.status === "active" && (
              <div className="shrink-0 h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: evt.color, boxShadow: `0 0 6px ${evt.color}` }} />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
