import { NextRequest, NextResponse } from "next/server";
import { extractInsights } from "@/lib/insights";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { transcript } = (await req.json()) as { transcript?: string };
    if (!transcript || typeof transcript !== "string") {
      return NextResponse.json({ error: "Missing transcript" }, { status: 400 });
    }
    const result = await extractInsights(transcript);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
