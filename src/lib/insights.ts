import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import type { InsightType } from "./types";

type InsightItem = {
  type: InsightType;
  content: string;
  dueDate?: string;
};

export type InsightResult = {
  summary: string;
  contactGuess?: { name?: string; company?: string; role?: string };
  insights: InsightItem[];
};

const hasClaude = !!process.env.ANTHROPIC_API_KEY;

const SYSTEM = `You extract structured notes from a voice memo someone recorded after meeting another person.
Return STRICT JSON of the form:
{
  "summary": "1-2 sentence summary",
  "contactGuess": { "name": "...", "company": "...", "role": "..." },
  "insights": [
    { "type": "action" | "personal" | "followup" | "funny" | "other",
      "content": "short phrase",
      "dueDate": "YYYY-MM-DD" (optional, only for action/followup when clear)
    }
  ]
}
Guidelines:
- action: concrete to-do the speaker must do (send, call, intro, share, prepare).
- personal: facts about the other person (family, hobbies, background).
- followup: something to revisit later; usually time-bound but softer than action.
- funny: memorable or humorous moment worth recalling next meeting.
- other: anything important that doesn't fit.
Keep each content under 90 chars. Do not hallucinate dates; only include dueDate if the transcript implies one.`;

export async function extractInsights(transcript: string): Promise<InsightResult> {
  if (!hasClaude) return mockInsights(transcript);

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
  const msg = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: SYSTEM,
    messages: [{ role: "user", content: `Transcript:\n"""${transcript}"""\n\nReturn JSON only.` }],
  });

  const text = msg.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Claude returned no JSON");
  const parsed = JSON.parse(jsonMatch[0]) as InsightResult;
  return parsed;
}

function mockInsights(transcript: string): InsightResult {
  const t = transcript.toLowerCase();
  const insights: InsightItem[] = [];

  const actionMatches = [
    [/send.{0,40}(proposal|deck|pricing|sheet|case study)/, "action"],
    [/intro\w*\s+\w+/, "action"],
    [/schedule.{0,20}(demo|call|meeting)/, "action"],
    [/follow up|check back|ping/, "followup"],
  ] as const;
  for (const [re, type] of actionMatches) {
    const m = transcript.match(re);
    if (m) insights.push({ type, content: capitalize(m[0]) });
  }

  const personalCues = [
    /(son|daughter|wife|husband|kids?)\s+[^,.]+/gi,
    /(marathon|photography|cricket|chess|cycling)[^,.]*/gi,
    /(iit|iim|harvard|stanford|mit)[^,.]*/gi,
    /(flipkart|google|meta|amazon|microsoft)[^,.]*/gi,
  ];
  for (const re of personalCues) {
    const matches = transcript.match(re) || [];
    for (const m of matches.slice(0, 2)) insights.push({ type: "personal", content: trim(m, 80) });
  }

  if (/funny|joke|laughed|story about/.test(t)) {
    const m = transcript.match(/(funny[^.]*|joke[^.]*|story about[^.]*)/i);
    if (m) insights.push({ type: "funny", content: trim(m[0], 80) });
  }

  const nameMatch = transcript.match(/\b([A-Z][a-z]+)\s+([A-Z][a-z]+)\b/);
  const companyMatch = transcript.match(/\bfrom\s+([A-Z][A-Za-z]+)/);
  const roleMatch = transcript.match(/\b(VP|Director|CEO|CTO|Head|Manager|Founder)\s+of\s+[A-Za-z ]+/i);

  const summary = summarize(transcript);

  return {
    summary,
    contactGuess: {
      name: nameMatch ? `${nameMatch[1]} ${nameMatch[2]}` : undefined,
      company: companyMatch?.[1],
      role: roleMatch?.[0],
    },
    insights: dedupe(insights).slice(0, 10),
  };
}

function summarize(t: string): string {
  const firstSentence = t.split(/(?<=[.!?])\s+/)[0] || t;
  return firstSentence.length > 180 ? firstSentence.slice(0, 177) + "…" : firstSentence;
}
function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function trim(s: string, n: number) {
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}
function dedupe(items: InsightItem[]): InsightItem[] {
  const seen = new Set<string>();
  return items.filter((i) => {
    const key = `${i.type}:${i.content.toLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
