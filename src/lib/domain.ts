export const DOMAINS = [
  "Generative AI",
  "Machine Learning",
  "Data Engineering",
  "Cloud AI",
] as const;

export type Domain = (typeof DOMAINS)[number];

const DOMAIN_ALIASES: Record<string, Domain> = {
  "generative ai": "Generative AI",
  genai: "Generative AI",
  "machine learning": "Machine Learning",
  ml: "Machine Learning",
  "data engineering": "Data Engineering",
  de: "Data Engineering",
  "cloud ai": "Cloud AI",
  cloud: "Cloud AI",
  mlops: "Cloud AI",
};

export function normalizeDomain(value: string): Domain | null {
  const trimmed = value.trim();
  if ((DOMAINS as readonly string[]).includes(trimmed)) {
    return trimmed as Domain;
  }
  return DOMAIN_ALIASES[trimmed.toLowerCase()] ?? null;
}
