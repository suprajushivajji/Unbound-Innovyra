"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type RoadmapWeek = {
  week?: number;
  title?: string;
  goal?: string;
  outcomes?: string[];
  keyTechnologies?: string[];
  timeAllocation?: { learning?: number; building?: number; interview?: number };
};

type RoadmapData = {
  careerGoal: string;
  domain: string;
  timelineMonths: number;
  weeklyHours: number;
  skillLevel: string;
  weeks: RoadmapWeek[];
  summary: string;
  riskFactors: string[];
};

// Phase grouping logic
function groupWeeksIntoPhases(weeks: RoadmapWeek[]): Record<string, RoadmapWeek[]> {
  const phases: Record<string, RoadmapWeek[]> = {
    "🎯 Foundation": [],
    "🔨 Build": [],
    "⚙️ Advanced": [],
    "🚀 Portfolio": [],
    "🎓 Interview": [],
  };

  weeks.forEach((w, idx) => {
    if (idx < 4) phases["🎯 Foundation"].push(w);
    else if (idx < 8) phases["🔨 Build"].push(w);
    else if (idx < 12) phases["⚙️ Advanced"].push(w);
    else if (idx < 16) phases["🚀 Portfolio"].push(w);
    else phases["🎓 Interview"].push(w);
  });

  return phases;
}

// AI Insights by phase
const phaseInsights = {
  "🎯 Foundation": "⚡ Building strong fundamentals. Focus on core concepts before specialization.",
  "🔨 Build": "🔨 Systems thinking activated. Time to connect theory with practical implementation.",
  "⚙️ Advanced": "⚙️ Advanced patterns emerging. Complexity is expected—embrace the challenge.",
  "🚀 Portfolio": "🚀 Portfolio strength increasing. Real projects demonstrate mastery.",
  "🎓 Interview": "🎓 Interview readiness accelerating. Mock questions calibrated to your level.",
};

// Skills progression
const skillProgression = [
  { name: "SQL", phases: [1, 1, 1, 0, 0] },
  { name: "ETL", phases: [1, 1, 1, 1, 0] },
  { name: "Spark", phases: [0, 1, 1, 1, 1] },
  { name: "Kafka", phases: [0, 0, 1, 1, 1] },
  { name: "System Design", phases: [0, 0, 0, 1, 1] },
];

export default function RoadmapPage() {
  const [loading, setLoading] = React.useState(true);
  const [roadmap, setRoadmap] = React.useState<RoadmapData | null>(null);
  const [viewMode, setViewMode] = React.useState<"timeline" | "milestone">("timeline");
  const [expandedPhase, setExpandedPhase] = React.useState<string>("🎯 Foundation");

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/roadmap");
      if (res.ok) {
        const data = await res.json();
        setRoadmap(data.roadmap ?? null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    void load();
    const interval = setInterval(() => void load(), 8000);
    return () => clearInterval(interval);
  }, []);

  const phases = roadmap ? groupWeeksIntoPhases(roadmap.weeks) : {};
  const completionPercent = roadmap ? Math.round((Object.values(phases).flat().length / 25) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* TOP SUMMARY BAR */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-4 border border-[rgba(139,92,246,0.2)]"
      >
        <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
          <div className="text-center">
            <div className="text-[10px] text-[rgba(234,240,255,0.6)]">Domain</div>
            <div className="mt-1 text-sm font-semibold text-cyan-400">{roadmap?.domain ?? "—"}</div>
          </div>
          <div className="text-center">
            <div className="text-[10px] text-[rgba(234,240,255,0.6)]">Level</div>
            <div className="mt-1 text-sm font-semibold text-purple-400">{roadmap?.skillLevel ?? "—"}</div>
          </div>
          <div className="text-center">
            <div className="text-[10px] text-[rgba(234,240,255,0.6)]">Timeline</div>
            <div className="mt-1 text-sm font-semibold">{roadmap?.timelineMonths ?? "—"} mo</div>
          </div>
          <div className="text-center">
            <div className="text-[10px] text-[rgba(234,240,255,0.6)]">Weekly</div>
            <div className="mt-1 text-sm font-semibold text-green-400">{roadmap?.weeklyHours ?? "—"} hrs</div>
          </div>
          <div className="text-center">
            <div className="text-[10px] text-[rgba(234,240,255,0.6)]">Progress</div>
            <div className="mt-1 text-sm font-semibold text-orange-400">{completionPercent}%</div>
          </div>
          <div className="text-center">
            <div className="text-[10px] text-[rgba(234,240,255,0.6)]">Status</div>
            <div className="mt-1 text-sm font-semibold flex items-center justify-center gap-1">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Active
            </div>
          </div>
        </div>
      </motion.div>

      {/* VIEW MODE TOGGLES */}
      <div className="flex gap-2">
        {(["timeline", "milestone"] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              viewMode === mode
                ? "bg-purple-600 text-white"
                : "border border-[rgba(255,255,255,0.1)] text-[rgba(234,240,255,0.7)] hover:border-[rgba(139,92,246,0.3)]"
            }`}
          >
            {mode === "timeline" ? "📊 Timeline" : "🎯 Milestones"}
          </button>
        ))}
      </div>

      {/* SKILL DEPENDENCY FLOW */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass rounded-2xl p-4 border border-[rgba(139,92,246,0.2)] overflow-x-auto"
      >
        <div className="text-xs font-semibold tracking-wide mb-3">⛓️ Skill Progression</div>
        <div className="flex gap-2 whitespace-nowrap">
          {skillProgression.map((skill, idx) => (
            <div key={skill.name} className="flex items-center gap-2">
              <div className="relative w-20 h-20 flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="35"
                    fill="none"
                    stroke="rgba(139,92,246,0.1)"
                    strokeWidth="2"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="35"
                    fill="none"
                    stroke="url(#grad)"
                    strokeWidth="3"
                    strokeDasharray={`${
                      (skill.phases.reduce((a, b) => a + b) / skill.phases.length) * 220
                    } 220`}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="rgba(139,92,246,1)" />
                      <stop offset="100%" stopColor="rgba(6,182,212,1)" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute text-center">
                  <div className="text-[10px] font-bold text-cyan-400">
                    {Math.round((skill.phases.reduce((a, b) => a + b) / skill.phases.length) * 100)}%
                  </div>
                </div>
              </div>
              <div className="text-xs">{skill.name}</div>
              {idx < skillProgression.length - 1 && (
                <div className="text-purple-400 font-bold">→</div>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* INTERACTIVE TIMELINE */}
      <div className="space-y-3">
        {Object.entries(phases).map(([phaseName, weeksList], phaseIdx) => {
          const isExpanded = expandedPhase === phaseName;
          const phaseProgress = Math.round((weeksList.length / 5) * 100);

          return (
            <motion.div
              key={phaseName}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: phaseIdx * 0.1 }}
              className="glass rounded-2xl border border-[rgba(139,92,246,0.2)] overflow-hidden hover:border-[rgba(139,92,246,0.4)] transition-all"
            >
              {/* PHASE HEADER */}
              <motion.button
                onClick={() => setExpandedPhase(isExpanded ? "" : phaseName)}
                className="w-full p-4 flex items-center justify-between hover:bg-[rgba(139,92,246,0.05)] transition-colors"
              >
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-3">
                    <div className="text-lg">{phaseName.split(" ")[0]}</div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold">{phaseName}</div>
                      <div className="text-[10px] text-[rgba(234,240,255,0.5)] mt-1">
                        {weeksList.length} weeks • {phaseInsights[phaseName as keyof typeof phaseInsights]}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-xs font-semibold text-purple-400">{phaseProgress}%</div>
                    <div className="w-12 h-1.5 mt-1 rounded-full bg-[rgba(139,92,246,0.1)] overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all"
                        style={{ width: `${phaseProgress}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-xl text-[rgba(234,240,255,0.5)]">
                    {isExpanded ? "▼" : "▶"}
                  </div>
                </div>
              </motion.button>

              {/* EXPANDED CONTENT */}
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: isExpanded ? "auto" : 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 space-y-2 border-t border-[rgba(255,255,255,0.05)]">
                  {weeksList.map((w, wIdx) => (
                    <motion.div
                      key={`${w.week}-${wIdx}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: wIdx * 0.05 }}
                      className="rounded-lg bg-[rgba(0,0,0,0.3)] p-3 border border-[rgba(139,92,246,0.1)] hover:border-[rgba(139,92,246,0.3)] transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="text-xs font-semibold">
                            Week {w.week}: {w.title}
                          </div>
                          <p className="text-[10px] text-[rgba(234,240,255,0.6)] mt-1">{w.goal}</p>
                          {w.keyTechnologies?.length ? (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {w.keyTechnologies.slice(0, 3).map((t) => (
                                <span
                                  key={t}
                                  className="text-[9px] px-1.5 py-0.5 rounded-full bg-[rgba(6,182,212,0.1)] text-cyan-400 border border-[rgba(6,182,212,0.2)]"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          ) : null}
                        </div>
                        {w.timeAllocation && (
                          <div className="text-[9px] text-[rgba(234,240,255,0.5)] whitespace-nowrap">
                            <div>L:{w.timeAllocation.learning}%</div>
                            <div>B:{w.timeAllocation.building}%</div>
                            <div>I:{w.timeAllocation.interview}%</div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* MILESTONE CHECKPOINTS */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass rounded-2xl p-4 border border-[rgba(139,92,246,0.2)]"
      >
        <div className="text-xs font-semibold tracking-wide mb-3">🎯 Milestone Checkpoints</div>
        <div className="space-y-2">
          {[
            { label: "Foundation Complete", percent: completionPercent >= 20 ? 100 : completionPercent * 5 },
            { label: "Core Systems", percent: completionPercent >= 40 ? 100 : Math.max(0, (completionPercent - 20) * 2.5) },
            { label: "Portfolio Ready", percent: completionPercent >= 70 ? 100 : Math.max(0, (completionPercent - 40) * 3.33) },
            { label: "Interview Ready", percent: completionPercent >= 90 ? 100 : Math.max(0, (completionPercent - 70) * 5) },
          ].map((milestone, idx) => (
            <div key={milestone.label} className="flex items-center gap-3">
              <div className="text-xs text-[rgba(234,240,255,0.6)] min-w-[120px]">{milestone.label}</div>
              <div className="flex-1 h-1.5 rounded-full bg-[rgba(139,92,246,0.1)] overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-cyan-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${milestone.percent}%` }}
                  transition={{ delay: idx * 0.2, duration: 1 }}
                ></motion.div>
              </div>
              <div className="text-[10px] font-semibold text-purple-400 min-w-[35px] text-right">
                {Math.round(milestone.percent)}%
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* CAREER READINESS TRACKER */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass rounded-2xl p-4 border border-[rgba(139,92,246,0.2)]"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold tracking-wide">🚀 Career Readiness</div>
            <div className="text-[10px] text-[rgba(234,240,255,0.6)] mt-1">
              Estimated completion: {roadmap ? Math.ceil(roadmap.timelineMonths * (1 - completionPercent / 100)) : "—"} months
            </div>
          </div>
          <div className="relative w-16 h-16">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="rgba(139,92,246,0.1)"
                strokeWidth="3"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="url(#careerGrad)"
                strokeWidth="3"
                strokeDasharray={`${(completionPercent / 100) * 251.2} 251.2`}
                strokeLinecap="round"
                initial={{ strokeDasharray: "0 251.2" }}
                animate={{ strokeDasharray: `${(completionPercent / 100) * 251.2} 251.2` }}
                transition={{ duration: 1.5 }}
              />
              <defs>
                <linearGradient id="careerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(139,92,246,1)" />
                  <stop offset="100%" stopColor="rgba(6,182,212,1)" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-lg font-bold text-cyan-400">{completionPercent}%</div>
                <div className="text-[8px] text-[rgba(234,240,255,0.5)]">Ready</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* FOOTER MESSAGE */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-[10px] text-[rgba(234,240,255,0.5)]"
      >
        ✨ AI Execution Timeline Active • Auto-updating every 8 seconds
      </motion.div>
    </div>
  );
}
