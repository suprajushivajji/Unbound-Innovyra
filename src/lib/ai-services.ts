import { z } from "zod";
import { generateJson } from "@/lib/openrouter";
import { type Domain } from "@/lib/domain";

export type { Domain };

let lastAiMode: "openrouter" | "fallback" = "fallback";

export function getAiGenerationMode() {
  return lastAiMode;
}

async function callAiOrFallback<T>(
  aiCall: () => Promise<T>,
  fallback: () => T
): Promise<T> {
  if (!process.env.OPENROUTER_API_KEY) {
    lastAiMode = "fallback";
    return fallback();
  }

  try {
    const result = await aiCall();
    lastAiMode = "openrouter";
    return result;
  } catch (error) {
    console.warn(
      "[ai-services] OpenRouter failed, using local fallback:",
      error instanceof Error ? error.message : error
    );
    lastAiMode = "fallback";
    return fallback();
  }
}

const DomainFocus: Record<Domain, { focus: string[]; projectFlavors: string[] }> =
  {
    "Generative AI": {
      focus: [
        "Prompt Engineering",
        "RAG Systems",
        "LangChain / Agent frameworks",
        "Vector Databases",
        "Tool use + multi-agent orchestration",
        "Fine-tuning fundamentals",
      ],
      projectFlavors: ["RAG app", "agent", "eval harness", "vector search"],
    },
    "Machine Learning": {
      focus: [
        "NumPy",
        "Pandas",
        "Feature engineering",
        "Model training + evaluation",
        "TensorFlow / PyTorch",
        "MLOps basics",
      ],
      projectFlavors: ["classification", "regression", "time-series", "CV/NLP"],
    },
    "Data Engineering": {
      focus: ["SQL", "ETL Pipelines", "Spark", "Kafka", "Airflow", "Data modeling"],
      projectFlavors: ["ETL", "streaming", "warehouse", "lakehouse"],
    },
    "Cloud AI": {
      focus: ["AWS", "Docker", "Kubernetes", "CI/CD", "MLOps", "Observability"],
      projectFlavors: ["deployment", "pipeline", "infra", "monitoring"],
    },
  };

const ResearchSchema = z.object({
  trendingSkills: z.array(z.string()).min(5),
  hiringDemand: z.string().min(10),
  salaryInsights: z.object({
    min: z.number().nonnegative(),
    max: z.number().nonnegative(),
    currency: z.string().min(1),
    notes: z.string().min(5),
  }),
  marketTrends: z.array(z.string()).min(3),
  technologies: z.array(z.string()).min(5),
});

const RoadmapSchema = z.object({
  weeks: z
    .array(
      z.object({
        week: z.number().int().min(1),
        title: z.string().min(3),
        goal: z.string().min(10),
        outcomes: z.array(z.string()).min(3),
        keyTechnologies: z.array(z.string()).min(3),
        timeAllocation: z.object({
          learning: z.number().int().min(0).max(100),
          building: z.number().int().min(0).max(100),
          interview: z.number().int().min(0).max(100),
        }),
      })
    )
    .min(4),
  summary: z.string().min(10),
  riskFactors: z.array(z.string()).default([]),
});

const TasksSchema = z.object({
  tasks: z
    .array(
      z.object({
        title: z.string().min(3).max(180),
        description: z.string().min(10).max(1200),
        status: z.enum([
          "to_learn",
          "in_progress",
          "completed",
          "revision",
          "interview_prep",
        ]),
        priority: z.enum(["low", "medium", "high"]),
        category: z.string().min(2).max(80),
        dueDaysFromNow: z.number().int().min(0).max(365).optional(),
      })
    )
    .min(8),
});

const AnalyticsInsightSchema = z.object({
  insight: z.string().min(10),
  recommendation: z.string().min(10),
});

const AgentOutputSchema = z.object({
  title: z.string().min(3),
  bullets: z.array(z.string()).min(3),
  nextActions: z.array(z.string()).min(3),
});

const ProjectsSchema = z.object({
  projects: z
    .array(
      z.object({
        title: z.string().min(3),
        techStack: z.array(z.string()).min(2),
        difficulty: z.enum(["easy", "medium", "hard"]),
        estimatedTime: z.string().min(2),
      })
    )
    .min(2),
});

const MilestonesSchema = z.object({
  milestones: z
    .array(
      z.object({
        title: z.string().min(3),
        progress: z.number().min(0).max(100),
        completed: z.boolean(),
        dueDaysFromNow: z.number().int().min(0).max(365).optional(),
      })
    )
    .min(4),
});

const InterviewPrepSchema = z.object({
  questions: z.array(z.string()).min(5),
  tips: z.array(z.string()).min(3),
  topics: z.array(z.string()).min(3),
});

export type SkillLevel = "Beginner" | "Intermediate" | "Advanced";

export type ExecutionInput = {
  careerGoal: string;
  domain: Domain;
  skillLevel: SkillLevel;
  timelineMonths: number;
  weeklyHours: number;
};

export async function generateResearch(input: {
  careerGoal: string;
  domain: Domain;
  skillLevel: "Beginner" | "Intermediate" | "Advanced";
  timelineMonths: number;
  weeklyHours: number;
}) {
  const focus = DomainFocus[input.domain];
  const system = [
    "You are Innovyra's DeepSearch Research Agent.",
    "Return ONLY JSON. Do NOT include markdown fences.",
    "Be specific and domain-correct; do not reuse generic AI answers across domains.",
    "Use realistic but not overly precise salary ranges; include notes.",
    `Domain focus keywords: ${focus.focus.join(", ")}.`,
    `Project flavors: ${focus.projectFlavors.join(", ")}.`,
  ].join("\n");

  const prompt = [
    `Career goal: ${input.careerGoal}`,
    `Domain: ${input.domain}`,
    `Skill level: ${input.skillLevel}`,
    `Timeline: ${input.timelineMonths} months`,
    `Weekly hours: ${input.weeklyHours}`,
    "",
    "Generate research outputs that reflect CURRENT market patterns conceptually (no citations needed).",
  ].join("\n");

  return callAiOrFallback(
    () =>
      generateJson({
        system,
        prompt,
        schema: ResearchSchema,
        temperature: 0.35,
        retries: 2,
      }),
    () => ({
      trendingSkills: focus.focus.slice(0, 6),
      hiringDemand: `Strong demand for ${input.domain} talent pursuing ${input.careerGoal}. (Offline insights — OpenRouter unavailable or rate limited.)`,
      salaryInsights: {
        min:
          input.skillLevel === "Advanced"
            ? 95000
            : input.skillLevel === "Intermediate"
              ? 75000
              : 60000,
        max:
          input.skillLevel === "Advanced"
            ? 180000
            : input.skillLevel === "Intermediate"
              ? 140000
              : 110000,
        currency: "USD",
        notes: `Estimated ${input.skillLevel} range for ${input.domain}; verify with current job boards.`,
      },
      marketTrends: [
        "Hiring favors candidates who ship end-to-end portfolio projects",
        "Demand is increasing for demonstrable project experience",
        "Portfolios outperform certificates for technical roles",
      ],
      technologies: focus.focus,
    })
  );
}

export async function generateRoadmap(input: {
  careerGoal: string;
  domain: Domain;
  skillLevel: "Beginner" | "Intermediate" | "Advanced";
  timelineMonths: number;
  weeklyHours: number;
}) {
  const totalWeeks = Math.max(4, input.timelineMonths * 4);
  const focus = DomainFocus[input.domain];

  const intensity =
    input.weeklyHours >= 35 ? "aggressive" : input.weeklyHours >= 15 ? "balanced" : "light";
  const system = [
    "You are Innovyra's Planning Agent.",
    "Return ONLY JSON (no markdown).",
    "Weeks must be strictly increasing and cover the full timeline.",
    "Time allocation percentages must sum to 100 for each week.",
    `Domain focus keywords: ${focus.focus.join(", ")}.`,
  ].join("\n");

  const prompt = [
    `Career goal: ${input.careerGoal}`,
    `Domain: ${input.domain}`,
    `Skill level: ${input.skillLevel}`,
    `Timeline: ${input.timelineMonths} months (${totalWeeks} weeks)`,
    `Weekly hours: ${input.weeklyHours} (${intensity})`,
    "",
    "Requirements:",
    "- 2 months => compressed essentials, intense delivery",
    "- 12 months => deeper specialization + multiple projects + interview phase",
    "- Output MUST be domain-specific and NOT generic",
  ].join("\n");

  return callAiOrFallback(
    () =>
      generateJson({
        system,
        prompt,
        schema: RoadmapSchema,
        temperature: 0.35,
        retries: 2,
      }),
    () => {
      const weeks = Array.from({ length: totalWeeks }).map((_, i) => ({
        week: i + 1,
        title: `Week ${i + 1}: ${focus.focus[i % focus.focus.length]}`,
        goal: `Progress toward ${input.careerGoal} (${input.domain})`,
        outcomes: [
          "Ship one measurable artifact",
          "Document learnings + revisions",
          "Practice interview/assessment",
        ],
        keyTechnologies: focus.focus.slice(0, 4),
        timeAllocation: { learning: 40, building: 40, interview: 20 },
      }));
      return {
        weeks,
        summary: `${input.timelineMonths}-month ${input.domain} roadmap for ${input.careerGoal} (${input.weeklyHours}h/week).`,
        riskFactors: ["Time constraints", "Scope creep on projects"],
      };
    }
  );
}

export async function generateTasks(input: {
  careerGoal: string;
  domain: Domain;
  skillLevel: "Beginner" | "Intermediate" | "Advanced";
  timelineMonths: number;
  weeklyHours: number;
  roadmapSummary: string;
}) {
  const focus = DomainFocus[input.domain];
  const totalWeeks = Math.max(4, input.timelineMonths * 4);

  const system = [
    "You are Innovyra's Execution Workflow Engine.",
    "Return ONLY JSON.",
    "Generate actionable tasks for a Kanban board.",
    "Ensure tasks are domain-specific and map to categories: learning, project, interview, resume, revision.",
    `Domain focus keywords: ${focus.focus.join(", ")}.`,
  ].join("\n");

  const prompt = [
    `Career goal: ${input.careerGoal}`,
    `Domain: ${input.domain}`,
    `Skill level: ${input.skillLevel}`,
    `Timeline: ${input.timelineMonths} months (${totalWeeks} weeks)`,
    `Weekly hours: ${input.weeklyHours}`,
    "",
    `Roadmap summary: ${input.roadmapSummary}`,
    "",
    "Rules:",
    "- Return 10-18 tasks",
    "- Mix statuses: mostly to_learn, some in_progress, include interview_prep items",
    "- Include 1-3 revision tasks",
    "- Use priority to reflect impact",
  ].join("\n");

  return callAiOrFallback(
    () =>
      generateJson({
        system,
        prompt,
        schema: TasksSchema,
        temperature: 0.4,
        retries: 2,
      }),
    () => {
      const base = focus.focus.slice(0, 6);
      return {
        tasks: [
          ...base.map((s, idx) => ({
            title: `Learn: ${s}`,
            description: `Focused study + notes + mini-exercises for ${s}.`,
            status: "to_learn" as const,
            priority: idx < 2 ? ("high" as const) : ("medium" as const),
            category: "learning",
            dueDaysFromNow: (idx + 1) * 2,
          })),
          {
            title: "Build: Portfolio project skeleton",
            description:
              "Scaffold repo, define milestones, ship first working slice.",
            status: "in_progress" as const,
            priority: "high" as const,
            category: "project",
            dueDaysFromNow: 7,
          },
          {
            title: "Interview Prep: weekly mock",
            description: "Run one mock interview and write a reflection note.",
            status: "interview_prep" as const,
            priority: "medium" as const,
            category: "interview",
            dueDaysFromNow: 7,
          },
        ],
      };
    }
  );
}

export async function generateAnalyticsInsight(input: {
  completionPercentage: number;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  streak: number;
}) {
  const system = [
    "You are Innovyra's Analytics Agent.",
    "Return ONLY JSON: { \"insight\": string, \"recommendation\": string }",
    "Be brief but specific; no fluff.",
  ].join("\n");

  const prompt = [
    `Completion: ${input.completionPercentage}%`,
    `Total tasks: ${input.totalTasks}`,
    `Completed: ${input.completedTasks}`,
    `In progress: ${input.inProgressTasks}`,
    `Streak (days): ${input.streak}`,
    "",
    "Generate insight + 1 concrete recommendation for next 48 hours.",
  ].join("\n");

  return callAiOrFallback(
    () =>
      generateJson({
        system,
        prompt,
        schema: AnalyticsInsightSchema,
        temperature: 0.3,
        retries: 1,
        timeoutMs: 18_000,
      }),
    () => ({
      insight: `You are at ${input.completionPercentage}% completion (${input.completedTasks}/${input.totalTasks} tasks) with a ${input.streak}-day streak.`,
      recommendation:
        input.inProgressTasks > 0
          ? "Finish in-progress tasks before starting new ones this week."
          : "Ship one measurable artifact in the next 48 hours to extend your streak.",
    })
  );
}

export async function generateProjects(input: ExecutionInput) {
  const focus = DomainFocus[input.domain];
  const projectCount =
    input.timelineMonths <= 2 ? 2 : input.timelineMonths >= 12 ? 5 : 3;

  const intensity =
    input.weeklyHours >= 35 ? "aggressive" : input.weeklyHours >= 15 ? "balanced" : "light";

  const system = [
    "You are Innovyra's Project Hub generator.",
    "Return ONLY JSON.",
    "Projects must be domain-specific portfolio builds, not generic tutorials.",
    `Domain focus: ${focus.focus.join(", ")}.`,
  ].join("\n");

  const prompt = [
    `Career goal: ${input.careerGoal}`,
    `Domain: ${input.domain}`,
    `Skill level: ${input.skillLevel}`,
    `Timeline: ${input.timelineMonths} months`,
    `Weekly hours: ${input.weeklyHours} (${intensity})`,
    "",
    `Generate exactly ${projectCount} portfolio projects with techStack, difficulty, estimatedTime.`,
    "2 months => fewer, focused projects. 12 months => deeper, advanced projects.",
  ].join("\n");

  return callAiOrFallback(
    () =>
      generateJson({
        system,
        prompt,
        schema: ProjectsSchema,
        temperature: 0.4,
        retries: 2,
      }),
    () => ({
      projects: focus.projectFlavors.slice(0, projectCount).map((flavor, i) => ({
        title: `${flavor} portfolio project`,
        techStack: focus.focus.slice(0, 4),
        difficulty: (i === 0 ? "easy" : i === 1 ? "medium" : "hard") as
          | "easy"
          | "medium"
          | "hard",
        estimatedTime: input.weeklyHours >= 35 ? "1-2 weeks" : "2-4 weeks",
      })),
    })
  );
}

export async function generateMilestones(input: ExecutionInput & { roadmapSummary: string }) {
  const focus = DomainFocus[input.domain];
  const milestoneCount =
    input.timelineMonths <= 2 ? 4 : input.timelineMonths >= 12 ? 8 : 6;

  const system = [
    "You are Innovyra's Milestone Planner.",
    "Return ONLY JSON.",
    "Milestones must align to roadmap phases and domain specialization.",
    `Domain focus: ${focus.focus.join(", ")}.`,
  ].join("\n");

  const prompt = [
    `Career goal: ${input.careerGoal}`,
    `Domain: ${input.domain}`,
    `Timeline: ${input.timelineMonths} months`,
    `Weekly hours: ${input.weeklyHours}`,
    `Roadmap summary: ${input.roadmapSummary}`,
    "",
    `Generate ${milestoneCount} milestones with progress=0, completed=false, dueDaysFromNow.`,
  ].join("\n");

  return callAiOrFallback(
    () =>
      generateJson({
        system,
        prompt,
        schema: MilestonesSchema,
        temperature: 0.35,
        retries: 2,
      }),
    () => ({
      milestones: Array.from({ length: milestoneCount }).map((_, i) => ({
        title: `${focus.focus[i % focus.focus.length]} milestone ${i + 1}`,
        progress: 0,
        completed: false,
        dueDaysFromNow: (i + 1) * 14,
      })),
    })
  );
}

export async function generateInterviewPrep(input: ExecutionInput) {
  const focus = DomainFocus[input.domain];

  const system = [
    "You are Innovyra's Interview Prep Agent.",
    "Return ONLY JSON.",
    "Questions must be domain-specific (technical + system design where relevant).",
    `Domain focus: ${focus.focus.join(", ")}.`,
  ].join("\n");

  const prompt = [
    `Career goal: ${input.careerGoal}`,
    `Domain: ${input.domain}`,
    `Skill level: ${input.skillLevel}`,
    `Timeline: ${input.timelineMonths} months`,
    "",
    "Generate mock interview questions, preparation tips, and key topics.",
  ].join("\n");

  return callAiOrFallback(
    () =>
      generateJson({
        system,
        prompt,
        schema: InterviewPrepSchema,
        temperature: 0.4,
        retries: 2,
      }),
    () => ({
      questions: focus.focus
        .slice(0, 5)
        .map((s) => `Explain ${s} and when you'd use it.`),
      tips: [
        "Practice explaining trade-offs out loud",
        "Use STAR format for behavioral questions",
        "Ship one demo project per week",
      ],
      topics: focus.focus.slice(0, 4),
    })
  );
}

export async function runAgent(input: {
  agent: "research" | "planning" | "resume" | "interview";
  domain: Domain;
  careerGoal: string;
  context?: string;
}) {
  const system = [
    `You are Innovyra's ${input.agent} agent.`,
    "Return ONLY JSON: { title, bullets: string[], nextActions: string[] }",
    "Bullets must be concrete and aligned to the domain.",
    `Domain: ${input.domain}`,
  ].join("\n");

  const prompt = [
    `Career goal: ${input.careerGoal}`,
    `Context: ${input.context ?? "N/A"}`,
    `Domain focus keywords: ${DomainFocus[input.domain].focus.join(", ")}`,
  ].join("\n");

  return callAiOrFallback(
    () =>
      generateJson({
        system,
        prompt,
        schema: AgentOutputSchema,
        temperature: 0.45,
        retries: 1,
        timeoutMs: 18_000,
      }),
    () => ({
      title: `${input.agent.charAt(0).toUpperCase()}${input.agent.slice(1)} Agent`,
      bullets: [
        `Domain: ${input.domain}`,
        `Goal: ${input.careerGoal}`,
        `Focus: ${DomainFocus[input.domain].focus.slice(0, 3).join(", ")}`,
      ],
      nextActions: [
        "Generate a full execution plan from the dashboard",
        "Complete this week's highest-priority task",
        "Schedule a mock interview session",
      ],
    })
  );
}

