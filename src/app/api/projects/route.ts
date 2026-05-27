import { NextResponse } from "next/server";
import { z } from "zod";
import mongoose from "mongoose";
import { auth } from "@/lib/auth";
import { dbConnect } from "@/lib/mongodb";

import { Project } from "@/models/Project";

const CreateProjectSchema = z.object({
  title: z.string().min(1).max(200),
  techStack: z.array(z.string()).optional(),
  difficulty: z.enum(["easy", "medium", "hard"]).optional(),
  estimatedTime: z.string().max(100).optional(),
  status: z.string().max(50).optional(),
});

function serializeProject(p: {
  _id: mongoose.Types.ObjectId;
  title: string;
  techStack?: string[];
  difficulty?: string;
  estimatedTime?: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}) {
  return {
    id: p._id.toString(),
    title: p.title,
    techStack: p.techStack ?? [],
    difficulty: p.difficulty ?? "medium",
    estimatedTime: p.estimatedTime ?? "",
    status: p.status ?? "idea",
    createdAt: p.createdAt?.toISOString() ?? null,
    updatedAt: p.updatedAt?.toISOString() ?? null,
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
    const filter: any = { userId };
    const projects = await Project.find(filter).sort({ createdAt: -1 }).lean();

    return NextResponse.json({
      projects: projects.map((p) => serializeProject(p as any)),
    });
  } catch (error) {
    console.error("Get projects error:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => null);
    const parsed = CreateProjectSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    await dbConnect();
    const userId = new mongoose.Types.ObjectId(session.user.id);

    const created = await Project.create({
      userId,
      title: parsed.data.title,
      techStack: parsed.data.techStack ?? [],
      difficulty: parsed.data.difficulty ?? "medium",
      estimatedTime: parsed.data.estimatedTime ?? "",
      status: parsed.data.status ?? "idea",
    });

    return NextResponse.json(
      { project: serializeProject(created.toObject() as any) },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create project error:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
