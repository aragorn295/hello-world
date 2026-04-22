"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { initials, timeAgo } from "@/lib/format";
import type { Contact } from "@/lib/types";

export function ContactCard({ contact }: { contact: Contact }) {
  const notes = useStore((s) => s.notes.filter((n) => n.contactId === contact.id));
  const openActions = useStore((s) =>
    s.insights.filter(
      (i) => !i.done && i.type === "action" && notes.some((n) => n.id === i.noteId),
    ),
  ).length;

  return (
    <Link href={`/contacts/${contact.id}`} className="card p-4 block flex items-center gap-3 hover:shadow-lg transition">
      <div className="h-10 w-10 rounded-full bg-brand-100 text-brand-700 grid place-items-center font-semibold">
        {initials(contact.name)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-ink-900 truncate">{contact.name}</div>
        <div className="text-xs text-ink-500 truncate">
          {[contact.role, contact.company].filter(Boolean).join(" · ") || "No details yet"}
        </div>
      </div>
      <div className="text-right">
        <div className="text-xs text-ink-500">{contact.lastMetAt ? timeAgo(contact.lastMetAt) : "—"}</div>
        {openActions > 0 && (
          <div className="mt-0.5 pill bg-orange-100 text-orange-700">{openActions} open</div>
        )}
      </div>
    </Link>
  );
}
