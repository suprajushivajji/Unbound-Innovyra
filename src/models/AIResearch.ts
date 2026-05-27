import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const SalarySchema = new Schema(
  {
    min: Number,
    max: Number,
    currency: String,
    notes: String,
  },
  { _id: false }
);

const AIResearchSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    careerGoalId: { type: Schema.Types.ObjectId, ref: "CareerGoal" },
    provider: { type: String, default: "openrouter" },
    model: { type: String },

    // Normalized fields (what the UI should use)
    trendingSkills: [{ type: String }],
    hiringDemand: { type: String },
    salaryInsights: SalarySchema,
    marketTrends: [{ type: String }],
    technologies: [{ type: String }],

    // Raw structured response (kept for debugging / future rendering)
    output: { type: Schema.Types.Mixed, default: {} },
    input: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true, collection: "ai_research" }
);

export type AIResearchDoc = InferSchemaType<typeof AIResearchSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const AIResearch: Model<AIResearchDoc> =
  (mongoose.models.AIResearch as Model<AIResearchDoc>) ||
  mongoose.model<AIResearchDoc>("AIResearch", AIResearchSchema);

