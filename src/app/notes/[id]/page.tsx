"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { InsightList } from "@/components/InsightList";
import { AuthGate } from "@/components/AuthGate";
import { useStore } from "@/lib/store";
import { timeAgo, formatDuration } from "@/lib/format";

export default function NoteDetailPage() {
  return (
    <AuthGate>
      <NoteDetail />
    </AuthGate>
  );
}

function NoteDetail() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const note = useStore((s) => s.notes.find((n) => n.id === params.id));
  const insights = useStore((s) => s.insights.filter((i) => i.noteId === params.id));
  const contacts = useStore((s) => s.contacts);
  const contact = useStore((s) => s.contacts.find((c) => c.id === note?.contactId));
  const linkNoteToContact = useStore((s) => s.linkNoteToContact);
  const addContact = useStore((s) => s.addContact);
  const deleteNote = useStore((s) => s.deleteNote);

  const [showTranscript, setShowTranscript] = useState(false);
  const [showLink, setShowLink] = useState(false);
  const [newName, setNewName] = useState("");

  const sortedContacts = useMemo(
    () => [...contacts].sort((a, b) => a.name.localeCompare(b.name)),
    [contacts],
  );

  if (!note) {
    return (
      <>
        <Header title="Note" back="/" />
        <main className="p-6 text-center text-ink-500">Note not found.</main>
      </>
    );
  }

  const remove = () => {
    if (confirm("Delete this note?")) {
      deleteNote(note.id);
      router.replace("/");
    }
  };

  return (
    <>
      <Header title="Note" back="/" />
      <main className="px-4 pt-4 pb-16">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm text-ink-500">
            {new Date(note.createdAt).toLocaleString(undefined, {
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}{" "}
            · {timeAgo(note.createdAt)}
          </div>
          <button onClick={remove} className="text-sm text-red-600">Delete</button>
        </div>

        <section className="card p-3 mb-4 flex items-center justify-between">
          {contact ? (
            <Link href={`/contacts/${contact.id}`} className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-full bg-brand-100 text-brand-700 grid place-items-center font-semibold">
                {contact.name.slice(0, 1)}
              </div>
              <div>
                <div className="text-sm font-medium text-ink-900">{contact.name}</div>
                <div className="text-xs text-ink-500">
                  {[contact.role, contact.company].filter(Boolean).join(" · ") || "Linked"}
                </div>
              </div>
            </Link>
          ) : (
            <div className="text-sm text-ink-500">Not linked to a contact</div>
          )}
          <button onClick={() => setShowLink(true)} className="btn-outline h-9 text-sm">
            {contact ? "Change" : "Link"}
          </button>
        </section>

        {note.status === "processing" ? (
          <div className="card p-6 text-center text-ink-500">Transcribing and extracting insights…</div>
        ) : note.status === "failed" ? (
          <div className="card p-6 text-center text-red-700 bg-red-50 border-red-200">
            Processing failed. Record again to try once more.
          </div>
        ) : (
          <>
            {note.summary && (
              <section className="mb-5">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-500 mb-1.5">Summary</h2>
                <p className="text-ink-900">{note.summary}</p>
              </section>
            )}

            <section className="card p-4 mb-5">
              <InsightList insights={insights} />
            </section>

            {note.audioDataUrl && (
              <section className="mb-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-500 mb-1.5">
                  Audio · {formatDuration(note.durationS)}
                </h3>
                <audio controls src={note.audioDataUrl} className="w-full" />
              </section>
            )}

            <section>
              <button
                onClick={() => setShowTranscript((v) => !v)}
                className="text-sm text-brand-600 font-medium"
              >
                {showTranscript ? "▾ Hide full transcript" : "▸ Full transcript"}
              </button>
              {showTranscript && (
                <p className="mt-2 text-sm text-ink-700 whitespace-pre-wrap">{note.transcript}</p>
              )}
            </section>
          </>
        )}
      </main>

      {showLink && (
        <div className="fixed inset-0 z-30 bg-black/40 flex items-end" onClick={() => setShowLink(false)}>
          <div
            className="w-full bg-white rounded-t-2xl p-4 max-h-[75vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center font-semibold text-ink-900 mb-3">Link to contact</div>
            <div className="flex gap-2 mb-3">
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="New contact name"
                className="flex-1 h-11 rounded-xl border border-ink-200 px-3 text-sm"
              />
              <button
                onClick={() => {
                  if (!newName.trim()) return;
                  const c = addContact({ name: newName.trim() });
                  linkNoteToContact(note.id, c.id);
                  setShowLink(false);
                }}
                className="btn-primary"
              >
                Add
              </button>
            </div>
            <div className="space-y-1">
              {contact && (
                <button
                  onClick={() => {
                    linkNoteToContact(note.id, undefined);
                    setShowLink(false);
                  }}
                  className="w-full text-left py-2 px-3 rounded-lg hover:bg-ink-50 text-red-600 text-sm"
                >
                  Unlink from {contact.name}
                </button>
              )}
              {sortedContacts.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    linkNoteToContact(note.id, c.id);
                    setShowLink(false);
                  }}
                  className="w-full text-left py-2 px-3 rounded-lg hover:bg-ink-50 flex items-center justify-between"
                >
                  <span className="text-ink-900">{c.name}</span>
                  {c.id === contact?.id && <span className="text-brand-600 text-sm">Linked</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
