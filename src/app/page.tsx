"use client";

import { useMemo } from "react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { RecordButton } from "@/components/RecordButton";
import { NoteCard } from "@/components/NoteCard";
import { AuthGate } from "@/components/AuthGate";
import { useStore } from "@/lib/store";

export default function HomePage() {
  return (
    <AuthGate>
      <HomeContent />
    </AuthGate>
  );
}

function HomeContent() {
  const notes = useStore((s) => s.notes);
  const contacts = useStore((s) => s.contacts);
  const openActions = useStore(
    (s) => s.insights.filter((i) => i.type === "action" && !i.done).length,
  );

  const recent = useMemo(() => notes.slice(0, 10), [notes]);

  return (
    <>
      <Header title="VoiceCRM" />
      <main className="px-4 pb-28 pt-6">
        <section className="flex flex-col items-center pt-6 pb-10">
          <RecordButton />
          <p className="mt-5 text-sm text-ink-500">Tap to capture</p>
        </section>

        <section className="card p-3 flex items-center justify-around text-sm mb-6">
          <div className="text-center">
            <div className="text-xl font-semibold text-ink-900">{openActions}</div>
            <div className="text-xs text-ink-500">Open actions</div>
          </div>
          <div className="h-8 w-px bg-ink-100" />
          <div className="text-center">
            <div className="text-xl font-semibold text-ink-900">{contacts.length}</div>
            <div className="text-xs text-ink-500">Contacts</div>
          </div>
          <div className="h-8 w-px bg-ink-100" />
          <div className="text-center">
            <div className="text-xl font-semibold text-ink-900">{notes.length}</div>
            <div className="text-xs text-ink-500">Notes</div>
          </div>
        </section>

        <h2 className="text-sm font-semibold text-ink-700 mb-2">Recent</h2>
        {recent.length === 0 ? (
          <div className="card p-6 text-center text-ink-500 text-sm">
            No notes yet. Tap the record button to capture your first one.
          </div>
        ) : (
          <div className="space-y-2">
            {recent.map((n) => (
              <NoteCard key={n.id} note={n} />
            ))}
          </div>
        )}
      </main>
      <BottomNav />
    </>
  );
}
