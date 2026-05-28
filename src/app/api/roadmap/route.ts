import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { dbConnect } from "@/lib/mongodb";
import mongoose from "mongoose";
import { Roadmap } from "@/models/Roadmap";
import { generateRoadmap, type Domain } from "@/lib/ai-services";

const InputSchema = z.object({
  careerGoal: z.string().min(3).max(200),
  preferredDomain: z.string().min(2).max(100),
  timelineMonths: z.number().int().min(1).max(24),
  weeklyHours: z.number().int().min(1).max(60),
  skillLevel: z.enum(["Beginner", "Intermediate", "Advanced"]),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const doc = await Roadmap.findOne({
      userId: new mongoose.Types.ObjectId(session.user.id),
    })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ roadmap: doc ?? null });
  } catch (error) {
    console.error("Get roadmap error:", error);
    return NextResponse.json({ error: "Failed to fetch roadmap" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = InputSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const domain = parsed.data.preferredDomain as Domain;
    const roadmapData = await generateRoadmap({
      careerGoal: parsed.data.careerGoal,
      domain,
      skillLevel: parsed.data.skillLevel,
      timelineMonths: parsed.data.timelineMonths,
      weeklyHours: parsed.data.weeklyHours,
    });

    await dbConnect();
    const doc = await Roadmap.create({
      userId: new mongoose.Types.ObjectId(session.user.id),
      careerGoal: parsed.data.careerGoal,
      domain,
      timelineMonths: parsed.data.timelineMonths,
      weeklyHours: parsed.data.weeklyHours,
      skillLevel: parsed.data.skillLevel,
      weeks: roadmapData.weeks,
      summary: roadmapData.summary,
      riskFactors: roadmapData.riskFactors,
    });

    return NextResponse.json({
      input: parsed.data,
      roadmap: roadmapData,
      roadmapId: doc._id.toString(),
      mode: process.env.OPENROUTER_API_KEY ? "openrouter" : "fallback",
    });
  } catch (error) {
    console.error("Roadmap error:", error);
    return NextResponse.json(
      { error: "Failed to create roadmap" },
      { status: 500 }
    );
  }
}
