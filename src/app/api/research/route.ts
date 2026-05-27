import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { dbConnect } from "@/lib/mongodb";
import mongoose from "mongoose";
import { AIResearch } from "@/models/AIResearch";
import { generateResearch, type Domain } from "@/lib/ai-services";

const InputSchema = z.object({
  careerGoal: z.string().min(3).max(200),
  preferredDomain: z.string().min(2).max(100),
  skillLevel: z.enum(["Beginner", "Intermediate", "Advanced"]).optional(),
  timelineMonths: z.number().int().min(1).max(24).optional(),
  weeklyHours: z.number().int().min(1).max(60).optional(),
});

function safeJsonFromGeminiText(text: string) {
  // Gemini often wraps JSON in ```json ... ``` fences.
  const cleaned = text
    .replace(/```json\s*/g, "")
    .replace(/```/g, "")
    .trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    return { raw: text };
  }
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const doc = await AIResearch.findOne({
      userId: new mongoose.Types.ObjectId(session.user.id),
    })
      .sort({ createdAt: -1 })
      .lean();

    if (!doc) {
      return NextResponse.json({ research: null });
    }

    return NextResponse.json({
      research: {
        trendingSkills: doc.trendingSkills ?? [],
        hiringDemand: doc.hiringDemand ?? "",
        salaryInsights: doc.salaryInsights ?? null,
        marketTrends: doc.marketTrends ?? [],
        technologies: doc.technologies ?? [],
      },
      createdAt: doc.createdAt,
    });
  } catch (error) {
    console.error("Get research error:", error);
    return NextResponse.json({ error: "Failed to fetch research" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();

  const body = await req.json().catch(() => null);
  const parsed = InputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const domain = parsed.data.preferredDomain as Domain;
    const output = await generateResearch({
      careerGoal: parsed.data.careerGoal,
      domain,
      skillLevel: parsed.data.skillLevel ?? "Beginner",
      timelineMonths: parsed.data.timelineMonths ?? 3,
      weeklyHours: parsed.data.weeklyHours ?? 10,
    });

    // Persist if authenticated
    if (session?.user?.id) {
      try {
        await dbConnect();
        await AIResearch.create({
          userId: new mongoose.Types.ObjectId(session.user.id),
          provider: "gemini",
          model: process.env.GEMINI_MODEL ?? "gemini-2.0-flash",
          input: parsed.data,
          output,
          trendingSkills: output.trendingSkills,
          hiringDemand: output.hiringDemand,
          salaryInsights: output.salaryInsights,
          marketTrends: output.marketTrends,
          technologies: output.technologies,
        });
      } catch (e) {
        console.error("Failed to persist research:", e);
      }
    }

    return NextResponse.json({
      mode: process.env.GEMINI_API_KEY ? "gemini" : "stub",
      model: process.env.GEMINI_MODEL ?? "gemini-2.0-flash",
      output,
    });
  } catch (error) {
    console.error("Research error:", error);
    return NextResponse.json(
      { error: "Failed to generate research" },
      { status: 500 }
    );
  }
}
