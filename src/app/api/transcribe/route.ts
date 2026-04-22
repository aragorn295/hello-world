import { NextRequest, NextResponse } from "next/server";
import { transcribeAudio } from "@/lib/transcribe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("audio");
    if (!(file instanceof Blob)) {
      return NextResponse.json({ error: "No audio blob" }, { status: 400 });
    }
    const result = await transcribeAudio(file);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
