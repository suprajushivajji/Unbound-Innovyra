import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const CareerGoalSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    careerGoal: { type: String, required: true },
    domain: { type: String, required: true },
    timelineMonths: { type: Number, required: true, min: 1, max: 24 },
    skillLevel: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      required: true,
    },
    weeklyHours: { type: Number, required: true, min: 1, max: 60 },
  },
  { timestamps: true, collection: "career_goals" }
);

export type CareerGoalDoc = InferSchemaType<typeof CareerGoalSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const CareerGoal: Model<CareerGoalDoc> =
  (mongoose.models.CareerGoal as Model<CareerGoalDoc>) ||
  mongoose.model<CareerGoalDoc>("CareerGoal", CareerGoalSchema);

