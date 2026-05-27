import { OpenRouter } from "@openrouter/sdk";
import { z } from "zod";
import { extractFirstJson, safeJsonParse } from "@/lib/safe-json";

export class AiProviderError extends Error {
  constructor(
    message: string,
    public cause?: unknown
  ) {
    super(message);
    this.name = "AiProviderError";
  }
}

export const DEFAULT_OPENROUTER_MODEL = "deepseek/deepseek-v4-flash:free";

let client: OpenRouter | null = null;

function getOpenRouterClient() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new AiProviderError("Missing OPENROUTER_API_KEY");
  if (!client) {
    client = new OpenRouter({
      apiKey,
      httpReferer: process.env.NEXTAUTH_URL ?? "http://localhost:3000",
      appTitle: "Innovyra",
    });
  }
  return client;
}

function extractMessageText(
  content: string | Array<{ text?: string }> | null | undefined
): string {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content.map((part) => part?.text ?? "").join("");
  }
  return "";
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export function getOpenRouterModel() {
  return process.env.OPENROUTER_MODEL ?? DEFAULT_OPENROUTER_MODEL;
}

export async function generateJson<T>({
  system,
  prompt,
  schema,
  model = getOpenRouterModel(),
  temperature = 0.25,
  retries = 2,
  timeoutMs = 25_000,
}: {
  system: string;
  prompt: string;
  schema: z.ZodType<T>;
  model?: string;
  temperature?: number;
  retries?: number;
  timeoutMs?: number;
}): Promise<T> {
  const openrouter = getOpenRouterClient();
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const result = await openrouter.chat.send(
        {
          chatRequest: {
            model,
            stream: false,
            temperature,
            responseFormat: { type: "json_object" },
            messages: [
              {
                role: "system",
                content: `${system}\n\nReturn ONLY valid JSON. No markdown fences.`,
              },
              { role: "user", content: prompt },
            ],
          },
        },
        { timeoutMs }
      );

      const text = extractMessageText(result.choices[0]?.message?.content);
      const jsonText = extractFirstJson(text) ?? text;
      const parsed = safeJsonParse(jsonText);

      if (!parsed) {
        throw new AiProviderError("OpenRouter returned invalid JSON", { text });
      }

      const validated = schema.safeParse(parsed);
      if (!validated.success) {
        throw new AiProviderError(
          "OpenRouter JSON did not match schema",
          validated.error
        );
      }

      return validated.data;
    } catch (err) {
      lastError = err;
      if (attempt < retries) {
        await sleep(500 * (attempt + 1));
        continue;
      }
    }
  }

  throw new AiProviderError(
    "Failed to generate valid JSON from OpenRouter",
    lastError
  );
}
