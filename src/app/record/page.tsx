"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Waveform } from "@/components/Waveform";
import { AuthGate } from "@/components/AuthGate";
import { useStore } from "@/lib/store";
import { formatDuration } from "@/lib/format";

export default function RecordPage() {
  return (
    <AuthGate>
      <RecordContent />
    </AuthGate>
  );
}

type Phase = "idle" | "recording" | "paused" | "processing" | "error";

function RecordContent() {
  const router = useRouter();
  const addNote = useStore((s) => s.addNote);
  const updateNote = useStore((s) => s.updateNote);
  const setInsights = useStore((s) => s.setInsights);
  const contacts = useStore((s) => s.contacts);
  const addContact = useStore((s) => s.addContact);
  const linkNoteToContact = useStore((s) => s.linkNoteToContact);

  const [phase, setPhase] = useState<Phase>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const tickRef = useRef<number | null>(null);
  const startedAtRef = useRef<number>(0);
  const accumulatedRef = useRef<number>(0);

  useEffect(() => {
    return () => cleanup();
  }, []);

  const cleanup = () => {
    if (tickRef.current) window.clearInterval(tickRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      try { mediaRecorderRef.current.stop(); } catch {}
    }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    audioCtxRef.current?.close().catch(() => {});
    streamRef.current = null;
    audioCtxRef.current = null;
    setAnalyser(null);
  };

  const start = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const AudioCtx =
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;
      const src = ctx.createMediaStreamSource(stream);
      const an = ctx.createAnalyser();
      an.fftSize = 256;
      src.connect(an);
      setAnalyser(an);

      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      chunksRef.current = [];
      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      mr.onstop = () => void handleStop();
      mr.start(500);

      accumulatedRef.current = 0;
      startedAtRef.current = Date.now();
      tickRef.current = window.setInterval(() => {
        setElapsed(accumulatedRef.current + (Date.now() - startedAtRef.current) / 1000);
      }, 200);
      setPhase("recording");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not start microphone";
      setError(msg);
      setPhase("error");
    }
  };

  const pause = () => {
    const mr = mediaRecorderRef.current;
    if (!mr || mr.state !== "recording") return;
    mr.pause();
    accumulatedRef.current += (Date.now() - startedAtRef.current) / 1000;
    if (tickRef.current) window.clearInterval(tickRef.current);
    setPhase("paused");
  };

  const resume = () => {
    const mr = mediaRecorderRef.current;
    if (!mr || mr.state !== "paused") return;
    mr.resume();
    startedAtRef.current = Date.now();
    tickRef.current = window.setInterval(() => {
      setElapsed(accumulatedRef.current + (Date.now() - startedAtRef.current) / 1000);
    }, 200);
    setPhase("recording");
  };

  const stop = () => {
    const mr = mediaRecorderRef.current;
    if (!mr || mr.state === "inactive") return;
    if (tickRef.current) window.clearInterval(tickRef.current);
    if (mr.state === "recording") {
      accumulatedRef.current += (Date.now() - startedAtRef.current) / 1000;
    }
    mr.stop();
    setPhase("processing");
  };

  const handleStop = async () => {
    const blob = new Blob(chunksRef.current, { type: chunksRef.current[0]?.type || "audio/webm" });
    const durationS = Math.round(accumulatedRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());

    const dataUrl = await blobToDataUrl(blob);
    const note = addNote({
      audioDataUrl: dataUrl,
      durationS,
      transcript: "",
      summary: "",
      status: "processing",
    });

    try {
      const form = new FormData();
      form.append("audio", blob, "note.webm");
      const txRes = await fetch("/api/transcribe", { method: "POST", body: form });
      if (!txRes.ok) throw new Error(await txRes.text());
      const { transcript } = (await txRes.json()) as { transcript: string };

      const inRes = await fetch("/api/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript }),
      });
      if (!inRes.ok) throw new Error(await inRes.text());
      const data = (await inRes.json()) as {
        summary: string;
        insights: { type: "action" | "personal" | "followup" | "funny" | "other"; content: string; dueDate?: string }[];
        contactGuess?: { name?: string; company?: string; role?: string };
      };

      updateNote(note.id, { transcript, summary: data.summary, status: "ready" });
      setInsights(
        note.id,
        data.insights.map((i) => ({ type: i.type, content: i.content, dueDate: i.dueDate, done: false })),
      );

      const guessName = data.contactGuess?.name?.trim();
      if (guessName) {
        const existing = contacts.find(
          (c) => c.name.toLowerCase() === guessName.toLowerCase(),
        );
        if (existing) {
          linkNoteToContact(note.id, existing.id);
        } else {
          const newContact = addContact({
            name: guessName,
            company: data.contactGuess?.company,
            role: data.contactGuess?.role,
          });
          linkNoteToContact(note.id, newContact.id);
        }
      }

      router.replace(`/notes/${note.id}`);
    } catch (err) {
      updateNote(note.id, { status: "failed" });
      const msg = err instanceof Error ? err.message : "Processing failed";
      setError(msg);
      setPhase("error");
    }
  };

  return (
    <>
      <Header title="Recording" back="/" />
      <main className="px-6 pt-10 pb-20 flex flex-col items-center">
        {phase === "idle" && (
          <div className="mt-8 text-center">
            <p className="text-ink-500 mb-8">Ready when you are. You can tag the contact after.</p>
            <button onClick={start} className="btn-primary h-14 px-10 text-lg">
              Start recording
            </button>
          </div>
        )}

        {(phase === "recording" || phase === "paused") && (
          <>
            <div className="mt-4 text-5xl font-mono tabular-nums text-ink-900">
              {formatDuration(elapsed)}
            </div>
            <div className="mt-2 text-sm text-ink-500">
              {phase === "paused" ? "Paused" : "Listening…"}
            </div>
            <div className="mt-8 w-full">
              <Waveform analyser={analyser} active={phase === "recording"} />
            </div>
            <div className="mt-10 flex gap-3">
              {phase === "recording" ? (
                <button onClick={pause} className="btn-outline h-12 w-32">⏸ Pause</button>
              ) : (
                <button onClick={resume} className="btn-outline h-12 w-32">▶ Resume</button>
              )}
              <button onClick={stop} className="btn-primary h-12 w-32">⏹ Stop</button>
            </div>
          </>
        )}

        {phase === "processing" && (
          <div className="mt-16 flex flex-col items-center gap-4">
            <Spinner />
            <div className="text-ink-700 font-medium">Transcribing and extracting insights…</div>
            <div className="text-xs text-ink-500 max-w-xs text-center">
              Hang tight — this takes a few seconds. We'll drop you into the note when it's done.
            </div>
          </div>
        )}

        {phase === "error" && (
          <div className="mt-10 card p-4 text-sm text-red-700 bg-red-50 border-red-200">
            <div className="font-semibold mb-1">Something went wrong</div>
            <div>{error}</div>
            <button onClick={() => setPhase("idle")} className="btn-outline mt-3">Try again</button>
          </div>
        )}
      </main>
    </>
  );
}

function Spinner() {
  return (
    <div className="h-10 w-10 rounded-full border-4 border-brand-100 border-t-brand-600 animate-spin" />
  );
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
}
