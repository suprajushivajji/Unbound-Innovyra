import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { connectToDatabase, getCollection } from "@/lib/mongodb/client";
import { ObjectId } from "mongodb";

const InputSchema = z.object({
  agentType: z.enum(["interview_prep", "project_advisor", "skill_assessor", "career_coach"]),
  context: z.string().min(3).max(500).optional(),
  careerGoal: z.string().min(3).max(200).optional(),
  currentSkills: z.array(z.string()).optional(),
});

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = InputSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const model = process.env.GEMINI_MODEL ?? "gemini-2.0-flash";
    const apiKey = process.env.GEMINI_API_KEY;

    // If no key, use stub
    if (!apiKey) {
      const responses: Record<string, string> = {
        interview_prep:
          "Common interview questions: System design, data structures, behavioral questions. Practice 30 mins daily.",
        project_advisor:
          "Build a portfolio project that showcases your skills. Start small, ship fast, iterate based on feedback.",
        skill_assessor:
          "Assess your skills against industry benchmarks. Focus on gaps and create a learning plan.",
        career_coach:
          "Your career path is progressing well. Focus on breadth and depth of skills while maintaining a project pipeline.",
      };

      return NextResponse.json({
        agentType: parsed.data.agentType,
        advice: responses[parsed.data.agentType] || "Consulting AI agent...",
        source: "stub",
      });
    }

    const systemPrompts: Record<string, string> = {
      interview_prep: `You are an interview prep agent. Help users prepare for technical interviews.
Return JSON: { "questions": string[], "tips": string[], "resources": string[] }`,
      project_advisor: `You are a project advisor. Help users identify and scope portfolio projects.
Return JSON: { "projectIdea": string, "scope": string[], "timeline": string, "skills": string[] }`,
      skill_assessor: `You are a skill assessor. Evaluate user skills and recommend learning paths.
Return JSON: { "currentLevel": string, "gaps": string[], "recommendations": string[] }`,
      career_coach: `You are a career coach. Provide career guidance and strategic advice.
Return JSON: { "assessment": string, "strategy": string[], "nextSteps": string[] }`,
    };

    const system = systemPrompts[parsed.data.agentType] || systemPrompts.career_coach;

    const user = `
Agent Type: ${parsed.data.agentType}
Context: ${parsed.data.context || "User seeking career guidance"}
Career Goal: ${parsed.data.careerGoal || "Professional development"}
Current Skills: ${(parsed.data.currentSkills || []).join(", ") || "Not specified"}

Please provide actionable advice based on the context.`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
      model
    )}:generateContent?key=${encodeURIComponent(apiKey)}`;

    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: `${system}\n\n${user}` }] }],
        generationConfig: { temperature: 0.4 },
      }),
    });

    const json = await res.json().catch(() => null);

    // Fallback to stub if quota exceeded
    if (!res.ok && json?.error?.status === "RESOURCE_EXHAUSTED") {
      console.warn("Gemini quota exceeded for agents, using stub response");
      const responses: Record<string, any> = {
        interview_prep: {
          questions: [
            "Explain a complex system you've designed",
            "What's your approach to debugging production issues?",
            "Tell us about a challenging project",
          ],
          tips: [
            "Practice explaining your thought process clearly",
            "Ask clarifying questions before solving",
            "Discuss trade-offs in your solutions",
          ],
          resources: [
            "LeetCode",
            "System Design Interview",
            "Behavioral interview prep",
          ],
        },
        project_advisor: {
          projectIdea: "Build an AI-powered career assistant application",
          scope: [
            "User authentication with MongoDB",
            "AI research and insights generation",
            "Task management with Kanban board",
            "Analytics dashboard",
          ],
          timeline: "8-12 weeks",
          skills: [
            "Full-stack development",
            "API integration",
            "Database design",
            "AI/LLM integration",
          ],
        },
        skill_assessor: {
          currentLevel: "Intermediate",
          gaps: [
            "System design patterns",
            "Advanced database optimization",
            "Distributed systems",
          ],
          recommendations: [
            "Complete a system design course",
            "Build production-grade projects",
            "Study scaling patterns",
          ],
        },
        career_coach: {
          assessment:
            "You're making good progress in your career development journey",
          strategy: [
            "Focus on depth in one area while maintaining breadth",
            "Ship projects and build portfolio",
            "Network with peers and mentors",
            "Practice continuous learning",
          ],
          nextSteps: [
            "Complete current project",
            "Interview with 3 companies",
            "Contribute to open source",
          ],
        },
      };

      return NextResponse.json({
        agentType: parsed.data.agentType,
        advice: responses[parsed.data.agentType] || responses.career_coach,
        source: "stub_quota_exceeded",
      });
    }

    if (!res.ok) {
      console.error("Gemini agents error:", res.status, json);
      return NextResponse.json(
        { error: "Failed to get agent advice", details: json },
        { status: 500 }
      );
    }

    const parts = (json?.candidates?.[0]?.content?.parts ??
      []) as Array<{ text?: string }>;
    const text = parts.map((p) => p.text ?? "").join("");

    let adviceData;
    try {
      const cleaned = text.replace(/```json\s*/g, "").replace(/```/g, "").trim();
      adviceData = JSON.parse(cleaned);
    } catch (e) {
      console.error("Failed to parse agent advice JSON:", e);
      adviceData = { advice: text };
    }

    return NextResponse.json({
      agentType: parsed.data.agentType,
      advice: adviceData,
      source: "gemini",
    });
  } catch (error) {
    console.error("Agents error:", error);
    return NextResponse.json(
      { error: "Failed to get agent advice" },
      { status: 500 }
    );
  }
}
