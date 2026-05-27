"use client";

import * as React from "react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

const COLUMNS: { key: TaskStatus; label: string; tint: string }[] = [
  { key: "to_learn", label: "To Learn", tint: "rgba(139,92,246,0.24)" },
  { key: "in_progress", label: "In Progress", tint: "rgba(6,182,212,0.22)" },
  { key: "completed", label: "Completed", tint: "rgba(59,130,246,0.20)" },
  { key: "revision", label: "Revision", tint: "rgba(255,255,255,0.10)" },
  {
    key: "interview_prep",
    label: "Interview Prep",
    tint: "rgba(139,92,246,0.18)",
  },
];

export function KanbanBoard() {
  const [tasks, setTasks] = React.useState<TaskRow[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [newTitle, setNewTitle] = React.useState("");

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
        // Handle both formats: { tasks: [...] } and [...]
        const taskList = Array.isArray(data) ? data : (data.tasks || []);
        setTasks(taskList);
      } else if (res.status === 401) {
        console.warn("Not authenticated, tasks will be empty");
        setTasks([]);
      } else {
        console.error("Failed to load tasks: HTTP", res.status);
        setTasks([]);
      }
    } catch (error) {
      console.error("Failed to load tasks:", error);
      setTasks([]);
    }
    setLoading(false);
  }

  React.useEffect(() => {
    void load();
    // Poll for updates every 5 seconds
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
        body: JSON.stringify({
          title,
          status: "to_learn",
        }),
      });
      if (res.ok) {
        await load();
      } else {
        console.error("Failed to add task: HTTP", res.status);
      }
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  }

  async function setStatus(id: string, status: TaskStatus) {
    try {
      const res = await fetch("/api/tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        await load();
      } else {
        console.error("Failed to update task: HTTP", res.status);
      }
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  }

  return (
    <div className="glass rounded-3xl p-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-sm font-semibold tracking-wide">Kanban</div>
          <div className="mt-1 text-sm text-[var(--muted)]">
            Realtime-ready board (Supabase Realtime). Add tasks and move them
            across your execution pipeline.
          </div>
        </div>

        <div className="flex w-full max-w-xl gap-2">
          <Input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Add a new task (e.g., Build RAG mini-project)…"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                void addTask();
              }
            }}
          />
          <Button onClick={() => void addTask()} className="shrink-0">
            Add
          </Button>
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-5">
        {COLUMNS.map((col) => (
          <div key={col.key} className="min-w-0">
            <div className="flex items-center justify-between">
              <div className="text-xs tracking-wide text-[rgba(234,240,255,0.75)]">
                {col.label}
              </div>
              <div className="rounded-full border border-[rgba(255,255,255,0.10)] bg-[rgba(0,0,0,0.22)] px-2 py-0.5 text-[10px]">
                {grouped.get(col.key)?.length ?? 0}
              </div>
            </div>
            <div
              className="mt-2 rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(0,0,0,0.18)] p-2"
              style={{ boxShadow: `0 0 0 1px ${col.tint} inset` }}
            >
              {loading ? (
                <div className="p-3 text-xs text-[var(--muted)]">Loading…</div>
              ) : (grouped.get(col.key)?.length ?? 0) === 0 ? (
                <div className="p-3 text-xs text-[var(--muted)]">
                  Drop tasks here.
                </div>
              ) : (
                <div className="space-y-2">
                  {(grouped.get(col.key) ?? []).map((t) => (
                    <div
                      key={t.id}
                      className="rounded-xl border border-[rgba(255,255,255,0.10)] bg-[rgba(255,255,255,0.04)] px-3 py-3"
                    >
                      <div className="text-sm leading-5">{t.title}</div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {COLUMNS.filter((c) => c.key !== col.key).map((c) => (
                          <button
                            key={c.key}
                            onClick={() => void setStatus(t.id, c.key)}
                            className={cn(
                              "rounded-full border border-[rgba(255,255,255,0.10)] bg-[rgba(0,0,0,0.20)] px-2 py-0.5 text-[10px] text-[rgba(234,240,255,0.75)] transition hover:text-white",
                              "hover:border-[rgba(6,182,212,0.35)]"
                            )}
                          >
                            Move → {c.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
