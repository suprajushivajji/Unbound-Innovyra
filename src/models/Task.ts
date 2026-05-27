import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const TaskSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, maxlength: 180 },
    description: { type: String, default: null },
    status: {
      type: String,
      enum: ["to_learn", "in_progress", "completed", "revision", "interview_prep"],
      default: "to_learn",
      index: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
      index: true,
    },
    category: { type: String, default: "general", index: true },
    dueDate: { type: Date, default: null },
    orderIndex: { type: Number, default: null },
    // for analytics/streak calculation
    completedAt: { type: Date, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" }, collection: "tasks" }
);

export type TaskDoc = InferSchemaType<typeof TaskSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Task: Model<TaskDoc> =
  (mongoose.models.Task as Model<TaskDoc>) || mongoose.model<TaskDoc>("Task", TaskSchema);

