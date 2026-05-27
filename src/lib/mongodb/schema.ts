// MongoDB Collections Schema for Innovyra
// Run this to set up indexes and collections

const collections = {
  // Users collection (managed by NextAuth MongoDB adapter)
  users: {
    schema: {
      _id: "ObjectId",
      email: "string (unique)",
      password: "string (hashed)",
      name: "string (optional)",
      emailVerified: "Date (optional)",
      image: "string (optional)",
      createdAt: "Date",
      updatedAt: "Date",
    },
    indexes: [
      { email: 1, unique: true },
      { createdAt: 1 },
    ],
  },

  // Sessions collection (managed by NextAuth MongoDB adapter)
  sessions: {
    schema: {
      _id: "ObjectId",
      sessionToken: "string (unique)",
      userId: "ObjectId",
      expires: "Date",
      createdAt: "Date",
    },
    indexes: [
      { sessionToken: 1, unique: true },
      { userId: 1 },
      { expires: 1 },
    ],
  },

  // Career Goals
  career_goals: {
    schema: {
      _id: "ObjectId",
      userId: "ObjectId",
      career_goal: "string",
      preferred_domain: "string",
      skill_level: "enum: Beginner|Intermediate|Advanced",
      timeline_months: "number (1-24)",
      weekly_hours: "number (1-60)",
      created_at: "Date",
      updated_at: "Date",
    },
    indexes: [
      { userId: 1 },
      { created_at: -1 },
    ],
  },

  // AI Research Results
  ai_research: {
    schema: {
      _id: "ObjectId",
      userId: "ObjectId",
      career_goal_id: "ObjectId (optional)",
      provider: "string (e.g. 'openrouter')",
      model: "string",
      input: "object (JSON)",
      output: "object (JSON)",
      created_at: "Date",
    },
    indexes: [
      { userId: 1 },
      { created_at: -1 },
    ],
  },

  // Roadmaps
  roadmaps: {
    schema: {
      _id: "ObjectId",
      userId: "ObjectId",
      career_goal_id: "ObjectId (optional)",
      title: "string",
      weeks: "array of week objects",
      created_at: "Date",
      updated_at: "Date",
    },
    indexes: [
      { userId: 1 },
      { created_at: -1 },
    ],
  },

  // Tasks
  tasks: {
    schema: {
      _id: "ObjectId",
      userId: "ObjectId",
      title: "string",
      description: "string (optional)",
      status: "enum: to_learn|in_progress|completed|revision|interview_prep",
      due_date: "Date (optional)",
      order_index: "number (optional)",
      created_at: "Date",
      updated_at: "Date",
    },
    indexes: [
      { userId: 1 },
      { userId: 1, status: 1 },
      { userId: 1, order_index: 1 },
      { created_at: -1 },
    ],
  },

  // Milestones
  milestones: {
    schema: {
      _id: "ObjectId",
      userId: "ObjectId",
      title: "string",
      description: "string (optional)",
      target_date: "Date (optional)",
      completed: "boolean",
      created_at: "Date",
      updated_at: "Date",
    },
    indexes: [
      { userId: 1 },
      { completed: 1 },
      { created_at: -1 },
    ],
  },

  // Projects
  projects: {
    schema: {
      _id: "ObjectId",
      userId: "ObjectId",
      title: "string",
      description: "string (optional)",
      difficulty: "enum: easy|medium|hard",
      status: "string (e.g. 'idea', 'in_progress', 'completed')",
      created_at: "Date",
      updated_at: "Date",
    },
    indexes: [
      { userId: 1 },
      { status: 1 },
      { created_at: -1 },
    ],
  },

  // Analytics
  analytics: {
    schema: {
      _id: "ObjectId",
      userId: "ObjectId",
      day: "Date",
      completion_pct: "number (0-100)",
      learning_streak_days: "number (optional)",
      productivity_score: "number (optional)",
      created_at: "Date",
    },
    indexes: [
      { userId: 1, day: 1 },
      { userId: 1, created_at: -1 },
    ],
  },
};

/**
 * To set up MongoDB indexes, run this in mongosh:
 * 
 * db.users.createIndex({ email: 1 }, { unique: true })
 * db.users.createIndex({ createdAt: 1 })
 * 
 * db.sessions.createIndex({ sessionToken: 1 }, { unique: true })
 * db.sessions.createIndex({ userId: 1 })
 * db.sessions.createIndex({ expires: 1 })
 * 
 * db.career_goals.createIndex({ userId: 1 })
 * db.career_goals.createIndex({ created_at: -1 })
 * 
 * db.ai_research.createIndex({ userId: 1 })
 * db.ai_research.createIndex({ created_at: -1 })
 * 
 * db.roadmaps.createIndex({ userId: 1 })
 * db.roadmaps.createIndex({ created_at: -1 })
 * 
 * db.tasks.createIndex({ userId: 1 })
 * db.tasks.createIndex({ userId: 1, status: 1 })
 * db.tasks.createIndex({ userId: 1, order_index: 1 })
 * db.tasks.createIndex({ created_at: -1 })
 * 
 * db.milestones.createIndex({ userId: 1 })
 * db.milestones.createIndex({ completed: 1 })
 * db.milestones.createIndex({ created_at: -1 })
 * 
 * db.projects.createIndex({ userId: 1 })
 * db.projects.createIndex({ status: 1 })
 * db.projects.createIndex({ created_at: -1 })
 * 
 * db.analytics.createIndex({ userId: 1, day: 1 })
 * db.analytics.createIndex({ userId: 1, created_at: -1 })
 */

export default collections;
