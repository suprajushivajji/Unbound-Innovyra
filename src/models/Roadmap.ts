import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const RoadmapWeekSchema = new Schema(
  {
    week: Number,
    title: String,
    goal: String,
    outcomes: [String],
    keyTechnologies: [String],
    timeAllocation: {
      learning: Number,
      building: Number,
      interview: Number,
    },
  },
  { _id: false }
);

const RoadmapSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    careerGoalId: { type: Schema.Types.ObjectId, ref: "CareerGoal" },

    careerGoal: { type: String, required: true },
    domain: { type: String, required: true, index: true },
    timelineMonths: { type: Number, required: true },
    weeklyHours: { type: Number, required: true },
    skillLevel: { type: String, required: true },

    weeks: { type: [RoadmapWeekSchema], default: [] },
    summary: { type: String, default: "" },
    riskFactors: { type: [String], default: [] },
  },
  { timestamps: true, collection: "roadmaps" }
);

export type RoadmapDoc = InferSchemaType<typeof RoadmapSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Roadmap: Model<RoadmapDoc> =
  (mongoose.models.Roadmap as Model<RoadmapDoc>) ||
  mongoose.model<RoadmapDoc>("Roadmap", RoadmapSchema);

