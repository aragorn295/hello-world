import "server-only";

const hasOpenAI = !!process.env.OPENAI_API_KEY;

export async function transcribeAudio(audio: Blob): Promise<{ transcript: string; durationS: number }> {
  if (!hasOpenAI) return mockTranscribe(audio);

  const form = new FormData();
  form.append("file", audio, "note.webm");
  form.append("model", "whisper-1");
  form.append("response_format", "json");

  const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    body: form,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Whisper failed: ${res.status} ${text}`);
  }
  const data = (await res.json()) as { text: string };
  return { transcript: data.text, durationS: 0 };
}

function mockTranscribe(audio: Blob): { transcript: string; durationS: number } {
  const samples = [
    "Had dinner with Priya Shah from Acme at the Oberoi. She's the new VP of Sales and took over in February. Her husband is a cardiologist at Lilavati and they have a son Aarav who's starting IIT Bombay in August, she's anxious about the move. She runs marathons, doing the Mumbai marathon in January. We discussed the Q3 renewal — she wants me to send a proposal by Friday, and she asked if I could intro her to Ankit on the legal side. Funny moment — she told a long story about her CFO who formats everything in Excel including his grocery list. Need to check back after Aarav moves in in August.",
    "Coffee with Arjun Kumar at Blue Tokai in BKC. He's moving from Flipkart to a stealth startup next month doing supply chain. Mentioned his wife is expecting in October. He wants an intro to our CTO about their warehouse tech. Action: send him the case study deck this week. Follow up after his baby is born.",
    "Quick catch up with Neha Patel. She got promoted to Director. Loves photography — showed me her shots from Ladakh. Her team has budget approved for next quarter, wants to pilot our enterprise tier. Action: send pricing sheet, schedule demo with her team.",
  ];
  const pick = samples[Math.floor(Math.random() * samples.length)];
  return { transcript: pick, durationS: Math.max(30, Math.round((audio.size || 100000) / 4000)) };
}
