import Link from "next/link";
import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Nav />
      <main>
        <Hero />

        <section id="modules" className="mx-auto max-w-6xl px-4 pb-14">
          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                title: "DeepSearch Intelligence",
                body: "Market analysis, hiring demand, salary signals, technology relevance scoring — refreshed on demand.",
              },
              {
                title: "AI Reasoning Engine",
                body: "Skill dependency mapping, roadmap optimization, timeline adaptation, workload balancing.",
              },
              {
                title: "Execution Workflow Engine",
                body: "Daily tasks, weekly goals, milestones, portfolio projects, interview prep and resume workflows.",
              },
              {
                title: "Project HUB Dashboard",
                body: "Kanban orchestration, roadmap view, progress analytics, streaks, realtime updates, AI insights.",
              },
            ].map((f) => (
              <Card key={f.title} className="relative overflow-hidden">
                <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[radial-gradient(circle_at_35%_35%,rgba(139,92,246,0.35),transparent_60%)] blur-2xl" />
                <CardHeader>
                  <CardTitle>{f.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-6 text-[var(--muted)]">
                  {f.body}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section id="how" className="mx-auto max-w-6xl px-4 pb-14">
          <Card>
            <CardHeader>
              <CardTitle>Workflow</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-[var(--muted)]">
              <div className="grid gap-3 md:grid-cols-6">
                {[
                  "User Input",
                  "DeepSearch",
                  "Reasoning",
                  "Workflow Gen",
                  "Project HUB",
                  "Adaptive Regen",
                ].map((s, idx) => (
                  <div
                    key={s}
                    className="relative rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(0,0,0,0.18)] px-4 py-4"
                  >
                    <div className="text-xs text-[rgba(234,240,255,0.75)]">
                      Step {idx + 1}
                    </div>
                    <div className="mt-1 text-sm text-[var(--foreground)]">
                      {s}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <section id="hub" className="mx-auto max-w-6xl px-4 pb-20">
          <Card className="relative overflow-hidden">
            <div className="pointer-events-none absolute -left-36 -bottom-36 h-96 w-96 rounded-full bg-[radial-gradient(circle_at_40%_40%,rgba(6,182,212,0.30),transparent_60%)] blur-3xl" />
            <CardHeader>
              <CardTitle>Ready to ship your execution system?</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <p className="max-w-xl text-sm leading-6 text-[var(--muted)]">
                This repo includes Supabase auth, a realtime-ready task model, a
                neon-glass dashboard skeleton, and API route stubs for research
                + roadmap generation.
              </p>
              <div className="flex gap-3">
                <Link href="/auth/signup">
                  <Button size="lg">Create account</Button>
                </Link>
                <Link href="/dashboard">
                  <Button size="lg" variant="outline">
                    Open Project HUB
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="mx-auto max-w-6xl px-4 pb-10 text-xs text-[rgba(234,240,255,0.60)]">
        Innovyra — Smart Career Execution Engine • “Search Less. Execute
        Smarter.”
      </footer>
    </div>
  );
}
