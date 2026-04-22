"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { AuthGate } from "@/components/AuthGate";
import { useStore } from "@/lib/store";

export default function NewContactPage() {
  return (
    <AuthGate>
      <NewContact />
    </AuthGate>
  );
}

function NewContact() {
  const router = useRouter();
  const addContact = useStore((s) => s.addContact);

  const [form, setForm] = useState({
    name: "",
    company: "",
    role: "",
    email: "",
    phone: "",
    linkedinUrl: "",
    notes: "",
  });

  const set = <K extends keyof typeof form>(k: K, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const save = () => {
    if (!form.name.trim()) return;
    const c = addContact({
      name: form.name.trim(),
      company: form.company.trim() || undefined,
      role: form.role.trim() || undefined,
      email: form.email.trim() || undefined,
      phone: form.phone.trim() || undefined,
      linkedinUrl: form.linkedinUrl.trim() || undefined,
      notes: form.notes.trim() || undefined,
    });
    router.replace(`/contacts/${c.id}`);
  };

  return (
    <>
      <Header title="New contact" back="/contacts" />
      <main className="px-4 pt-4 pb-20 space-y-3">
        <Field label="Name" value={form.name} onChange={(v) => set("name", v)} required />
        <Field label="Company" value={form.company} onChange={(v) => set("company", v)} />
        <Field label="Role" value={form.role} onChange={(v) => set("role", v)} />
        <Field label="Email" value={form.email} onChange={(v) => set("email", v)} type="email" />
        <Field label="Phone" value={form.phone} onChange={(v) => set("phone", v)} type="tel" />
        <Field
          label="LinkedIn URL"
          value={form.linkedinUrl}
          onChange={(v) => set("linkedinUrl", v)}
          type="url"
        />
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-ink-500">Notes</label>
          <textarea
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
            rows={3}
            className="mt-1 w-full rounded-xl border border-ink-200 px-3 py-2 text-sm bg-white"
          />
        </div>
        <button
          onClick={save}
          disabled={!form.name.trim()}
          className="btn-primary w-full h-12 disabled:opacity-50"
        >
          Save contact
        </button>
      </main>
    </>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wider text-ink-500">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <input
        value={value}
        type={type}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full h-11 rounded-xl border border-ink-200 px-3 text-sm bg-white"
      />
    </div>
  );
}
