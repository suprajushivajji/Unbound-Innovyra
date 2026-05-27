import { NextResponse } from "next/server";
import { z } from "zod";
import mongoose from "mongoose";
import { auth } from "@/lib/auth";
import { dbConnect } from "@/lib/mongodb";
import { normalizeDomain } from "@/lib/domain";
import { ExecutionInputSchema } from "@/lib/schemas";
import { computeUserAnalytics } from "@/lib/analytics-utils";
import {
  generateResearch,
  generateRoadmap,
  generateTasks,
  generateProjects,
  generateMilestones,
  generateInterviewPrep,
  getAiGenerationMode,
} from "@/lib/ai-services";
import { getOpenRouterModel } from "@/lib/openrouter";
import { CareerGoal } from "@/models/CareerGoal";
import { AIResearch } from "@/models/AIResearch";
import { Roadmap } from "@/models/Roadmap";
import { Task } from "@/models/Task";
import { Project } from "@/models/Project";
import { Milestone } from "@/models/Milestone";
import { Interview } from "@/models/Interview";

const StepSchema = z.enum([
  "career_goal",
  "research",
  "roadmap",
  "tasks",
  "projects",
  "milestones",
  "interview",
  "analytics",
  "complete",
]);

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const userId = new mongoose.Types.ObjectId(session.user.id);

    const [careerGoal, research, roadmap, taskCount, projectCount, milestoneCount, interview] =
      await Promise.all([
        CareerGoal.findOne({ userId }).sort({ createdAt: -1 }).lean(),
        AIResearch.findOne({ userId }).sort({ createdAt: -1 }).lean(),
        Roadmap.findOne({ userId }).sort({ createdAt: -1 }).lean(),
        Task.countDocuments({ userId } as any),
        Project.countDocuments({ userId } as any),
        Milestone.countDocuments({ userId } as any),
        Interview.findOne({ userId }).sort({ createdAt: -1 }).lean(),
      ]);

    const hasPlan = Boolean(research && roadmap && taskCount > 0);

    return NextResponse.json({
      hasPlan,
      careerGoal: careerGoal ?? null,
      counts: {
        tasks: taskCount,
        projects: projectCount,
        milestones: milestoneCount,
      },
      latest: {
        researchId: research?._id?.toString() ?? null,
        roadmapId: roadmap?._id?.toString() ?? null,
        interviewId: interview?._id?.toString() ?? null,
      },
    });
  } catch (error) {
    console.error("Execution plan status error:", error);
    return NextResponse.json(
      { error: "Failed to fetch execution plan status" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => null);
    const parsed = ExecutionInputSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const domain = normalizeDomain(parsed.data.preferredDomain);
    if (!domain) {
      return NextResponse.json(
        {
          error: "Invalid domain",
          allowed: ["Generative AI", "Machine Learning", "Data Engineering", "Cloud AI"],
        },
        { status: 400 }
      );
    }

    await dbConnect();
    const userId = new mongoose.Types.ObjectId(session.user.id);
    const executionInput = {
      careerGoal: parsed.data.careerGoal,
      domain,
      skillLevel: parsed.data.skillLevel,
      timelineMonths: parsed.data.timelineMonths,
      weeklyHours: parsed.data.weeklyHours,
    };

    const steps: Array<{ step: z.infer<typeof StepSchema>; status: "done" | "error" }> = [];

    const careerGoalDoc = await CareerGoal.create({
      userId,
      careerGoal: parsed.data.careerGoal,
      domain,
      timelineMonths: parsed.data.timelineMonths,
      skillLevel: parsed.data.skillLevel,
      weeklyHours: parsed.data.weeklyHours,
    });
    steps.push({ step: "career_goal", status: "done" });

    const researchOutput = await generateResearch(executionInput);
    const researchDoc = await AIResearch.create({
      userId,
      careerGoalId: careerGoalDoc._id,
      provider: getAiGenerationMode(),
      model: getOpenRouterModel(),
      input: parsed.data,
      output: researchOutput,
      trendingSkills: researchOutput.trendingSkills,
      hiringDemand: researchOutput.hiringDemand,
      salaryInsights: researchOutput.salaryInsights,
      marketTrends: researchOutput.marketTrends,
      technologies: researchOutput.technologies,
    });
    steps.push({ step: "research", status: "done" });

    const roadmapOutput = await generateRoadmap(executionInput);
    const roadmapDoc = await Roadmap.create({
      userId,
      careerGoalId: careerGoalDoc._id,
      careerGoal: parsed.data.careerGoal,
      domain,
      timelineMonths: parsed.data.timelineMonths,
      weeklyHours: parsed.data.weeklyHours,
      skillLevel: parsed.data.skillLevel,
      weeks: roadmapOutput.weeks,
      summary: roadmapOutput.summary,
      riskFactors: roadmapOutput.riskFactors,
    });
    steps.push({ step: "roadmap", status: "done" });

    if (parsed.data.replaceExisting) {
      await Promise.all([
        Task.deleteMany({ userId } as any),
        Project.deleteMany({ userId } as any),
        Milestone.deleteMany({ userId } as any),
      ]);
    }

    const tasksOutput = await generateTasks({
      ...executionInput,
      roadmapSummary: roadmapOutput.summary,
    });

    const now = Date.now();
    const createdTasks = await Task.insertMany(
      tasksOutput.tasks.map((t, idx) => ({
        userId,
        title: t.title,
        description: t.description,
        status: t.status,
        priority: t.priority,
        category: t.category,
        dueDate: t.dueDaysFromNow
          ? new Date(now + t.dueDaysFromNow * 86_400_000)
          : null,
        orderIndex: idx,
      }))
    );
    steps.push({ step: "tasks", status: "done" });

    const projectsOutput = await generateProjects(executionInput);
    const createdProjects = await Project.insertMany(
      projectsOutput.projects.map((p) => ({
        userId,
        title: p.title,
        techStack: p.techStack,
        difficulty: p.difficulty,
        estimatedTime: p.estimatedTime,
        status: "planned",
      }))
    );
    steps.push({ step: "projects", status: "done" });

    const milestonesOutput = await generateMilestones({
      ...executionInput,
      roadmapSummary: roadmapOutput.summary,
    });
    const createdMilestones = await Milestone.insertMany(
      milestonesOutput.milestones.map((m) => ({
        userId,
        title: m.title,
        progress: m.progress,
        completed: m.completed,
        dueDate: m.dueDaysFromNow
          ? new Date(now + m.dueDaysFromNow * 86_400_000)
          : null,
      }))
    );
    steps.push({ step: "milestones", status: "done" });

    const interviewOutput = await generateInterviewPrep(executionInput);
    const interviewDoc = await Interview.create({
      userId,
      careerGoalId: careerGoalDoc._id,
      domain,
      questions: interviewOutput.questions,
      tips: interviewOutput.tips,
      topics: interviewOutput.topics,
    });
    steps.push({ step: "interview", status: "done" });

    const analytics = await computeUserAnalytics(userId);
    steps.push({ step: "analytics", status: "done" });
    steps.push({ step: "complete", status: "done" });

    return NextResponse.json({
      success: true,
      mode: getAiGenerationMode(),
      steps,
      careerGoalId: careerGoalDoc._id.toString(),
      researchId: researchDoc._id.toString(),
      roadmapId: roadmapDoc._id.toString(),
      interviewId: interviewDoc._id.toString(),
      counts: {
        tasks: createdTasks.length,
        projects: createdProjects.length,
        milestones: createdMilestones.length,
      },
      research: researchOutput,
      roadmap: roadmapOutput,
      analytics,
    });
  } catch (error) {
    console.error("Execution plan error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate execution plan",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
