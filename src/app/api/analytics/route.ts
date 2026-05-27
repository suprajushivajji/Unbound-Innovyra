import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { dbConnect } from "@/lib/mongodb";
import mongoose from "mongoose";
import { Task } from "@/models/Task";
import { Milestone } from "@/models/Milestone";
import { Roadmap } from "@/models/Roadmap";
import { Analytics } from "@/models/Analytics";
import { generateAnalyticsInsight } from "@/lib/ai-services";

function dayKey(d: Date) {
  return d.toISOString().slice(0, 10);
}

function calcStreak(completedDates: Date[]) {
  const set = new Set(completedDates.map((d) => dayKey(d)));
  let streak = 0;
  const cur = new Date();
  while (true) {
    const key = dayKey(cur);
    if (!set.has(key)) break;
    streak += 1;
    cur.setDate(cur.getDate() - 1);
  }
  return streak;
}

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const userId = new mongoose.Types.ObjectId(session.user.id);
    const filter: any = { userId };

    const tasks = await Task.find(filter).lean();
    const milestones = await Milestone.find(filter).lean();
    const latestRoadmap = await Roadmap.findOne(filter)
      .sort({ createdAt: -1 })
      .lean();

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === "completed").length;
    const inProgressTasks = tasks.filter((t) => t.status === "in_progress").length;

    const completionPercentage =
      totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    const totalMilestones = milestones.length;
    const completedMilestones = milestones.filter((m) => m.completed).length;
    const milestoneCompletion =
      totalMilestones === 0
        ? 0
        : Math.round((completedMilestones / totalMilestones) * 100);

    // Rough roadmap progress: completed tasks vs weeks (fallback to completion %)
    const roadmapWeeks = latestRoadmap?.weeks?.length ?? 0;
    const roadmapProgress =
      roadmapWeeks === 0
        ? completionPercentage
        : Math.min(
            100,
            Math.round((completedTasks / Math.max(roadmapWeeks, 1)) * 100)
          );

    const completionDates = tasks
      .map((t) => (t.completedAt ? new Date(t.completedAt) : null))
      .filter((d): d is Date => Boolean(d));
    const streak = calcStreak(completionDates);

    const streakFactor = Math.round((Math.min(streak, 14) / 14) * 100);
    const productivityScore = Math.round(
      0.6 * completionPercentage + 0.4 * streakFactor
    );

    const ai = await generateAnalyticsInsight({
      completionPercentage,
      totalTasks,
      completedTasks,
      inProgressTasks,
      streak,
    }).catch(() => ({
      insight: "",
      recommendation: "",
    }));

    const today = dayKey(new Date());
    await Analytics.findOneAndUpdate(
      { userId, day: today },
      {
        $set: {
          completionPercentage,
          roadmapProgress,
          milestoneCompletion,
          streak,
          productivityScore,
          insight: ai.insight ?? "",
          recommendation: ai.recommendation ?? "",
        },
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      completionPercentage,
      roadmapProgress,
      milestoneCompletion,
      streak,
      productivityScore,
      totalTasks,
      completedTasks,
      inProgressTasks,
      insight: ai.insight,
      recommendation: ai.recommendation,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
