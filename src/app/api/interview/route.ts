import { NextResponse } from "next/server";
import { z } from "zod";
import mongoose from "mongoose";
import { auth } from "@/lib/auth";
import { dbConnect } from "@/lib/mongodb";
import { normalizeDomain } from "@/lib/domain";
import { generateInterviewPrep, getAiGenerationMode } from "@/lib/ai-services";
import { Interview } from "@/models/Interview";
import { CareerGoal } from "@/models/CareerGoal";

const GenerateSchema = z.object({
  careerGoal: z.string().min(3).max(200).optional(),
  preferredDomain: z.string().min(2).max(100).optional(),
  skillLevel: z.enum(["Beginner", "Intermediate", "Advanced"]).optional(),
  timelineMonths: z.number().int().min(1).max(24).optional(),
  weeklyHours: z.number().int().min(1).max(60).optional(),
});

function serializeInterview(doc: {
  _id: mongoose.Types.ObjectId;
  domain: string;
  questions: string[];
  tips: string[];
  topics: string[];
  createdAt?: Date;
}) {
  return {
    id: doc._id.toString(),
    domain: doc.domain,
    questions: doc.questions ?? [],
    tips: doc.tips ?? [],
    topics: doc.topics ?? [],
    createdAt: doc.createdAt?.toISOString() ?? null,
  };
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const userId = new mongoose.Types.ObjectId(session.user.id);
    const doc = await Interview.findOne({ userId }).sort({ createdAt: -1 }).lean();

    return NextResponse.json({
      interview: doc ? serializeInterview(doc as any) : null,
    });
  } catch (error) {
    console.error("Get interview error:", error);
    return NextResponse.json({ error: "Failed to fetch interview prep" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const parsed = GenerateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    await dbConnect();
    const userId = new mongoose.Types.ObjectId(session.user.id);

    const latestGoal = await CareerGoal.findOne({ userId }).sort({ createdAt: -1 }).lean();

    const domain = normalizeDomain(
      parsed.data.preferredDomain ?? latestGoal?.domain ?? "Generative AI"
    );
    if (!domain) {
      return NextResponse.json({ error: "Invalid domain" }, { status: 400 });
    }

    const executionInput = {
      careerGoal:
        parsed.data.careerGoal ??
        latestGoal?.careerGoal ??
        `${domain} Engineer`,
      domain,
      skillLevel: parsed.data.skillLevel ?? latestGoal?.skillLevel ?? "Beginner",
      timelineMonths: parsed.data.timelineMonths ?? latestGoal?.timelineMonths ?? 3,
      weeklyHours: parsed.data.weeklyHours ?? latestGoal?.weeklyHours ?? 10,
    };

    const output = await generateInterviewPrep(executionInput);

    const doc = await Interview.create({
      userId,
      careerGoalId: latestGoal?._id ?? undefined,
      domain,
      questions: output.questions,
      tips: output.tips,
      topics: output.topics,
    });

    return NextResponse.json({
      interview: serializeInterview(doc.toObject() as any),
      mode: getAiGenerationMode(),
    });
  } catch (error) {
    console.error("Interview generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate interview prep" },
      { status: 500 }
    );
  }
}
