"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { NoteCard } from "@/components/NoteCard";
import { AuthGate } from "@/components/AuthGate";
import { useStore } from "@/lib/store";
import { initials, timeAgo } from "@/lib/format";

export default function ContactDetailPage() {
  return (
    <AuthGate>
      <ContactDetail />
    </AuthGate>
  );
}

function ContactDetail() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const contact = useStore((s) => s.contacts.find((c) => c.id === params.id));
  const notes = useStore((s) => s.notes.filter((n) => n.contactId === params.id));
  const insights = useStore((s) => s.insights);
  const updateContact = useStore((s) => s.updateContact);
  const deleteContact = useStore((s) => s.deleteContact);
  const toggleInsight = useStore((s) => s.toggleInsight);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(() => ({
    name: contact?.name ?? "",
    company: contact?.company ?? "",
    role: contact?.role ?? "",
    email: contact?.email ?? "",
    phone: contact?.phone ?? "",
    linkedinUrl: contact?.linkedinUrl ?? "",
  }));

  const openActions = useMemo(
    () =>
      insights.filter(
        (i) => !i.done && i.type === "action" && notes.some((n) => n.id === i.noteId),
      ),
    [insights, notes],
  );
  const personal = useMemo(
    () => insights.filter((i) => i.type === "personal" && notes.some((n) => n.id === i.noteId)),
    [insights, notes],
  );

  if (!contact) {
    return (
      <>
        <Header title="Contact" back="/contacts" />
        <main className="p-6 text-center text-ink-500">Contact not found.</main>
      </>
    );
  }

  const save = () => {
    updateContact(contact.id, {
      name: form.name.trim() || contact.name,
      company: form.company.trim() || undefined,
      role: form.role.trim() || undefined,
      email: form.email.trim() || undefined,
      phone: form.phone.trim() || undefined,
      linkedinUrl: form.linkedinUrl.trim() || undefined,
    });
    setEditing(false);
  };

  const remove = () => {
    if (confirm(`Delete ${contact.name}? Notes will be kept but unlinked.`)) {
      deleteContact(contact.id);
      router.replace("/contacts");
    }
  };

  return (
    <>
      <Header title={contact.name} back="/contacts" />
      <main className="px-4 pt-4 pb-16">
        <section className="card p-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-brand-100 text-brand-700 grid place-items-center font-semibold text-lg">
              {initials(contact.name)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-ink-900">{contact.name}</div>
              <div className="text-sm text-ink-500 truncate">
                {[contact.role, contact.company].filter(Boolean).join(" · ") || "Add details"}
              </div>
            </div>
            <button onClick={() => setEditing((v) => !v)} className="btn-outline text-sm">
              {editing ? "Cancel" : "Edit"}
            </button>
          </div>

          {editing ? (
            <div className="mt-3 space-y-2">
              {(["name", "company", "role", "email", "phone", "linkedinUrl"] as const).map((k) => (
                <input
                  key={k}
                  value={form[k]}
                  onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                  placeholder={k}
                  className="w-full h-10 rounded-lg border border-ink-200 px-3 text-sm bg-white"
                />
              ))}
              <div className="flex gap-2 pt-1">
                <button onClick={save} className="btn-primary flex-1">Save</button>
                <button onClick={remove} className="btn-outline text-red-600 border-red-200">Delete</button>
              </div>
            </div>
          ) : (
            <div className="mt-3 space-y-1 text-sm text-ink-700">
              {contact.email && <div>📧 {contact.email}</div>}
              {contact.phone && <div>📞 {contact.phone}</div>}
              {contact.linkedinUrl && (
                <div>
                  🔗 <a href={contact.linkedinUrl} target="_blank" rel="noreferrer" className="text-brand-600">
                    {contact.linkedinUrl.replace(/^https?:\/\//, "")}
                  </a>
                </div>
              )}
              {contact.lastMetAt && (
                <div className="text-xs text-ink-500">Last met {timeAgo(contact.lastMetAt)}</div>
              )}
            </div>
          )}
        </section>

        {personal.length > 0 && (
          <section className="card p-4 mb-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-500 mb-2">💡 Key facts</h3>
            <ul className="space-y-1 text-sm text-ink-900">
              {personal.slice(0, 8).map((p) => (
                <li key={p.id}>• {p.content}</li>
              ))}
            </ul>
          </section>
        )}

        {openActions.length > 0 && (
          <section className="card p-4 mb-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-500 mb-2">
              ✅ Open actions ({openActions.length})
            </h3>
            <ul className="space-y-1.5">
              {openActions.map((a) => (
                <li key={a.id} className="flex items-start gap-2">
                  <button
                    onClick={() => toggleInsight(a.id)}
                    className="mt-0.5 h-5 w-5 shrink-0 rounded-md border border-ink-200 grid place-items-center"
                    aria-label="Mark done"
                  />
                  <div className="text-sm text-ink-900">{a.content}</div>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-500 mb-2">
            Timeline ({notes.length})
          </h3>
          {notes.length === 0 ? (
            <div className="card p-6 text-center text-ink-500 text-sm">
              No notes yet with {contact.name}. <Link href="/record" className="text-brand-600">Record one →</Link>
            </div>
          ) : (
            <div className="space-y-2">
              {notes.map((n) => (
                <NoteCard key={n.id} note={n} />
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
