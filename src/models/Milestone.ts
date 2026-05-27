import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const MilestoneSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    completed: { type: Boolean, default: false, index: true },
    dueDate: { type: Date, default: null },
  },
  { timestamps: true, collection: "milestones" }
);

export type MilestoneDoc = InferSchemaType<typeof MilestoneSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Milestone: Model<MilestoneDoc> =
  (mongoose.models.Milestone as Model<MilestoneDoc>) ||
  mongoose.model<MilestoneDoc>("Milestone", MilestoneSchema);

