import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { auth } from "@/lib/auth";
import { dbConnect } from "@/lib/mongodb";
import { CareerGoal } from "@/models/CareerGoal";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const userId = new mongoose.Types.ObjectId(session.user.id);
    const goal = await CareerGoal.findOne({ userId }).sort({ createdAt: -1 }).lean();

    if (!goal) {
      return NextResponse.json({ careerGoal: null });
    }

    return NextResponse.json({
      careerGoal: {
        id: goal._id.toString(),
        careerGoal: goal.careerGoal,
        domain: goal.domain,
        timelineMonths: goal.timelineMonths,
        skillLevel: goal.skillLevel,
        weeklyHours: goal.weeklyHours,
        createdAt: goal.createdAt?.toISOString?.() ?? null,
      },
    });
  } catch (error) {
    console.error("Get career goal error:", error);
    return NextResponse.json({ error: "Failed to fetch career goal" }, { status: 500 });
  }
}
