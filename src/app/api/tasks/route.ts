import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { dbConnect } from "@/lib/mongodb";
import mongoose from "mongoose";
import { Task } from "@/models/Task";

const CreateTaskSchema = z.object({
  title: z.string().min(1).max(180),
  description: z.string().max(2000).optional().nullable(),
  status: z
    .enum(["to_learn", "in_progress", "completed", "revision", "interview_prep"])
    .optional(),
  // accept both snake_case and camelCase
  due_date: z.string().datetime().optional().nullable(),
  dueDate: z.string().datetime().optional().nullable(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  category: z.string().max(80).optional(),
});

const UpdateTaskSchema = z.object({
  id: z.string(),
  title: z.string().min(1).max(180).optional(),
  description: z.string().max(2000).optional().nullable(),
  status: z
    .enum(["to_learn", "in_progress", "completed", "revision", "interview_prep"])
    .optional(),
  due_date: z.string().datetime().optional().nullable(),
  dueDate: z.string().datetime().optional().nullable(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  category: z.string().max(80).optional(),
});

function serializeTask(t: any) {
  return {
    id: t._id?.toString?.() ?? String(t._id),
    user_id: t.userId?.toString?.() ?? String(t.userId ?? ""),
    title: t.title,
    description: t.description ?? null,
    status: t.status,
    priority: t.priority ?? "medium",
    category: t.category ?? "general",
    due_date: t.dueDate ? new Date(t.dueDate).toISOString() : null,
    order_index: t.orderIndex ?? null,
    created_at: t.created_at ? new Date(t.created_at).toISOString() : null,
    updated_at: t.updated_at ? new Date(t.updated_at).toISOString() : null,
  };
}

export async function GET(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const userId = new mongoose.Types.ObjectId(session.user.id);
    const tasks = await Task.find({ userId })
      .sort({ orderIndex: 1, created_at: 1 })
      .lean();

    return NextResponse.json({ tasks: tasks.map(serializeTask) });
  } catch (error) {
    console.error("Get tasks error:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
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
    const body = await req.json();
    const parsed = CreateTaskSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    await dbConnect();
    const userId = new mongoose.Types.ObjectId(session.user.id);
    const due = parsed.data.dueDate ?? parsed.data.due_date ?? null;

    const created = await Task.create({
      userId,
      title: parsed.data.title,
      description: parsed.data.description ?? null,
      status: parsed.data.status ?? "to_learn",
      priority: parsed.data.priority ?? "medium",
      category: parsed.data.category ?? "general",
      dueDate: due ? new Date(due) : null,
    });

    return NextResponse.json({ task: serializeTask(created) }, { status: 201 });
  } catch (error) {
    console.error("Create task error:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = UpdateTaskSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    await dbConnect();
    const userId = new mongoose.Types.ObjectId(session.user.id);
    const taskId = new mongoose.Types.ObjectId(parsed.data.id);

    const updateData: Record<string, unknown> = {};
    if (parsed.data.title !== undefined) updateData.title = parsed.data.title;
    if (parsed.data.description !== undefined)
      updateData.description = parsed.data.description;
    if (parsed.data.status !== undefined) {
      updateData.status = parsed.data.status;
      updateData.completedAt =
        parsed.data.status === "completed" ? new Date() : null;
    }
    if (parsed.data.priority !== undefined) updateData.priority = parsed.data.priority;
    if (parsed.data.category !== undefined) updateData.category = parsed.data.category;

    const due = parsed.data.dueDate ?? parsed.data.due_date;
    if (due !== undefined) updateData.dueDate = due ? new Date(due) : null;

    const updated = await Task.findOneAndUpdate(
      { _id: taskId, userId },
      { $set: updateData },
      { new: true }
    ).lean();

    if (!updated) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ task: serializeTask(updated) }, { status: 200 });
  } catch (error) {
    console.error("Update task error:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}
