import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const InterviewSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    careerGoalId: { type: Schema.Types.ObjectId, ref: "CareerGoal" },
    domain: { type: String, required: true, index: true },
    questions: { type: [String], default: [] },
    tips: { type: [String], default: [] },
    topics: { type: [String], default: [] },
  },
  { timestamps: true, collection: "interviews" }
);

export type InterviewDoc = InferSchemaType<typeof InterviewSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Interview: Model<InterviewDoc> =
  (mongoose.models.Interview as Model<InterviewDoc>) ||
  mongoose.model<InterviewDoc>("Interview", InterviewSchema);
