import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const AnalyticsSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    day: { type: String, required: true, index: true }, // YYYY-MM-DD

    completionPercentage: { type: Number, default: 0, min: 0, max: 100 },
    roadmapProgress: { type: Number, default: 0, min: 0, max: 100 },
    milestoneCompletion: { type: Number, default: 0, min: 0, max: 100 },
    streak: { type: Number, default: 0, min: 0 },
    productivityScore: { type: Number, default: 0, min: 0, max: 100 },

    insight: { type: String, default: "" },
    recommendation: { type: String, default: "" },
  },
  { timestamps: true, collection: "analytics" }
);

AnalyticsSchema.index({ userId: 1, day: 1 }, { unique: true });

export type AnalyticsDoc = InferSchemaType<typeof AnalyticsSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Analytics: Model<AnalyticsDoc> =
  (mongoose.models.Analytics as Model<AnalyticsDoc>) ||
  mongoose.model<AnalyticsDoc>("Analytics", AnalyticsSchema);

