import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const ProjectSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true },
    techStack: { type: [String], default: [] },
    difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "medium" },
    estimatedTime: { type: String, default: "" },
    status: { type: String, default: "idea", index: true },
  },
  { timestamps: true, collection: "projects" }
);

export type ProjectDoc = InferSchemaType<typeof ProjectSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Project: Model<ProjectDoc> =
  (mongoose.models.Project as Model<ProjectDoc>) ||
  mongoose.model<ProjectDoc>("Project", ProjectSchema);

