import { StatsStrip } from "@/app/dashboard/_components/stats-strip";
import { ExecutionTimeline } from "@/app/dashboard/_components/execution-timeline";
import { KanbanBoard } from "@/app/dashboard/_components/kanban-board";
import { AiInsightsPanel } from "@/app/dashboard/_components/ai-insights-panel";

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <StatsStrip />
      <ExecutionTimeline />
      <KanbanBoard />
      <AiInsightsPanel />
    </div>
  );
}
