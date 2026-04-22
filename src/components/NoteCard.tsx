"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { timeAgo } from "@/lib/format";
import type { VoiceNote } from "@/lib/types";

export function NoteCard({ note }: { note: VoiceNote }) {
  const contact = useStore((s) => s.contacts.find((c) => c.id === note.contactId));
  const insights = useStore((s) => s.insights.filter((i) => i.noteId === note.id));
  const actions = insights.filter((i) => i.type === "action" && !i.done).length;
  const personal = insights.filter((i) => i.type === "personal").length;

  return (
    <Link href={`/notes/${note.id}`} className="card p-4 block hover:shadow-lg transition">
      <div className="flex items-center justify-between text-sm">
        <div className="font-medium text-ink-900">
          {contact ? `🎙 ${contact.name}` : "🎙 Unlinked"}
        </div>
        <div className="text-ink-500 text-xs">{timeAgo(note.createdAt)}</div>
      </div>
      <p className="mt-1.5 text-sm text-ink-700 line-clamp-2">
        {note.status === "processing" ? "Transcribing…" : note.summary || note.transcript.slice(0, 140)}
      </p>
      <div className="mt-2 flex items-center gap-2 text-xs">
        {actions > 0 && (
          <span className="pill bg-orange-100 text-orange-700">🟠 {actions} action{actions > 1 ? "s" : ""}</span>
        )}
        {personal > 0 && (
          <span className="pill bg-emerald-100 text-emerald-700">💡 {personal} personal</span>
        )}
        {note.status === "processing" && (
          <span className="pill bg-ink-100 text-ink-700">processing…</span>
        )}
      </div>
    </Link>
  );
}
