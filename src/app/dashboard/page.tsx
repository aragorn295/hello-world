"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { AuthGate } from "@/components/AuthGate";
import { useStore } from "@/lib/store";

export default function DashboardPage() {
  return (
    <AuthGate>
      <Dashboard />
    </AuthGate>
  );
}

function Dashboard() {
  const notes = useStore((s) => s.notes);
  const contacts = useStore((s) => s.contacts);
  const insights = useStore((s) => s.insights);
  const toggleInsight = useStore((s) => s.toggleInsight);

  const openActions = useMemo(
    () => insights.filter((i) => !i.done && i.type === "action"),
    [insights],
  );
  const openFollowups = useMemo(
    () => insights.filter((i) => !i.done && i.type === "followup"),
    [insights],
  );

  const byContact = useMemo(() => {
    const map = new Map<string, number>();
    for (const n of notes) if (n.contactId) map.set(n.contactId, (map.get(n.contactId) || 0) + 1);
    return [...map.entries()]
      .map(([id, count]) => ({
        contact: contacts.find((c) => c.id === id)!,
        count,
      }))
      .filter((r) => r.contact)
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [notes, contacts]);

  const max = Math.max(1, ...byContact.map((r) => r.count));

  return (
    <>
      <Header title="Dashboard" />
      <main className="px-4 pt-4 pb-28 space-y-4">
        <section className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-ink-900">Open actions</h3>
            <span className="pill bg-orange-100 text-orange-700">{openActions.length}</span>
          </div>
          {openActions.length === 0 ? (
            <div className="text-sm text-ink-500 italic">All clear. Nothing to do.</div>
          ) : (
            <ul className="space-y-2">
              {openActions.map((a) => {
                const note = notes.find((n) => n.id === a.noteId);
                const contact = contacts.find((c) => c.id === note?.contactId);
                return (
                  <li key={a.id} className="flex items-start gap-2">
                    <button
                      onClick={() => toggleInsight(a.id)}
                      aria-label="Mark done"
                      className="mt-0.5 h-5 w-5 shrink-0 rounded-md border border-ink-200 grid place-items-center"
                    />
                    <div className="flex-1">
                      <div className="text-sm text-ink-900">{a.content}</div>
                      <div className="text-xs text-ink-500">
                        {contact ? (
                          <Link href={`/contacts/${contact.id}`} className="text-brand-600">
                            {contact.name}
                          </Link>
                        ) : (
                          "Unlinked"
                        )}
                        {a.dueDate && ` · due ${new Date(a.dueDate).toLocaleDateString()}`}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="card p-4">
          <h3 className="font-semibold text-ink-900 mb-2">Follow-ups due soon</h3>
          {openFollowups.length === 0 ? (
            <div className="text-sm text-ink-500 italic">Nothing queued.</div>
          ) : (
            <ul className="space-y-1.5 text-sm text-ink-900">
              {openFollowups.map((f) => (
                <li key={f.id}>• {f.content}</li>
              ))}
            </ul>
          )}
        </section>

        <section className="card p-4">
          <h3 className="font-semibold text-ink-900 mb-3">Most active contacts</h3>
          {byContact.length === 0 ? (
            <div className="text-sm text-ink-500 italic">No linked notes yet.</div>
          ) : (
            <ul className="space-y-2">
              {byContact.map(({ contact, count }) => (
                <li key={contact.id}>
                  <Link href={`/contacts/${contact.id}`} className="flex items-center gap-2">
                    <div className="w-24 truncate text-sm text-ink-900">{contact.name}</div>
                    <div className="flex-1 h-2 rounded-full bg-ink-100 overflow-hidden">
                      <div
                        className="h-full bg-brand-500"
                        style={{ width: `${(count / max) * 100}%` }}
                      />
                    </div>
                    <div className="w-10 text-right text-xs text-ink-500">{count}</div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
      <BottomNav />
    </>
  );
}
