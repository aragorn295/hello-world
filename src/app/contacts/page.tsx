"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { ContactCard } from "@/components/ContactCard";
import { AuthGate } from "@/components/AuthGate";
import { useStore } from "@/lib/store";

export default function ContactsPage() {
  return (
    <AuthGate>
      <ContactsContent />
    </AuthGate>
  );
}

function ContactsContent() {
  const contacts = useStore((s) => s.contacts);
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const list = [...contacts].sort((a, b) => a.name.localeCompare(b.name));
    if (!needle) return list;
    return list.filter(
      (c) =>
        c.name.toLowerCase().includes(needle) ||
        c.company?.toLowerCase().includes(needle) ||
        c.email?.toLowerCase().includes(needle),
    );
  }, [contacts, q]);

  return (
    <>
      <Header title="Contacts" />
      <main className="px-4 pt-4 pb-28">
        <div className="flex gap-2 mb-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search contacts"
            className="flex-1 h-11 rounded-xl border border-ink-200 px-3 text-sm bg-white"
          />
          <Link href="/contacts/new" className="btn-primary">+ New</Link>
        </div>

        {filtered.length === 0 ? (
          <div className="card p-6 text-center text-ink-500 text-sm">
            No contacts yet. Record a note — we'll try to auto-detect names.
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((c) => (
              <ContactCard key={c.id} contact={c} />
            ))}
          </div>
        )}
      </main>
      <BottomNav />
    </>
  );
}
