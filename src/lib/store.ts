"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { nanoid } from "nanoid";
import type { Contact, Insight, User, VoiceNote } from "./types";

type State = {
  user: User | null;
  contacts: Contact[];
  notes: VoiceNote[];
  insights: Insight[];
  login: (user: User) => void;
  logout: () => void;
  addContact: (c: Omit<Contact, "id" | "createdAt">) => Contact;
  updateContact: (id: string, patch: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
  addNote: (n: Omit<VoiceNote, "id" | "createdAt">) => VoiceNote;
  updateNote: (id: string, patch: Partial<VoiceNote>) => void;
  deleteNote: (id: string) => void;
  setInsights: (noteId: string, items: Omit<Insight, "id" | "noteId">[]) => void;
  toggleInsight: (id: string) => void;
  linkNoteToContact: (noteId: string, contactId: string | undefined) => void;
};

export const useStore = create<State>()(
  persist(
    (set) => ({
      user: null,
      contacts: [],
      notes: [],
      insights: [],

      login: (user) => set({ user }),
      logout: () => set({ user: null }),

      addContact: (c) => {
        const contact: Contact = { ...c, id: nanoid(10), createdAt: new Date().toISOString() };
        set((s) => ({ contacts: [contact, ...s.contacts] }));
        return contact;
      },
      updateContact: (id, patch) =>
        set((s) => ({
          contacts: s.contacts.map((c) => (c.id === id ? { ...c, ...patch } : c)),
        })),
      deleteContact: (id) =>
        set((s) => ({
          contacts: s.contacts.filter((c) => c.id !== id),
          notes: s.notes.map((n) => (n.contactId === id ? { ...n, contactId: undefined } : n)),
        })),

      addNote: (n) => {
        const note: VoiceNote = { ...n, id: nanoid(10), createdAt: new Date().toISOString() };
        set((s) => ({ notes: [note, ...s.notes] }));
        return note;
      },
      updateNote: (id, patch) =>
        set((s) => ({ notes: s.notes.map((n) => (n.id === id ? { ...n, ...patch } : n)) })),
      deleteNote: (id) =>
        set((s) => ({
          notes: s.notes.filter((n) => n.id !== id),
          insights: s.insights.filter((i) => i.noteId !== id),
        })),

      setInsights: (noteId, items) =>
        set((s) => ({
          insights: [
            ...s.insights.filter((i) => i.noteId !== noteId),
            ...items.map((it) => ({ ...it, id: nanoid(10), noteId })),
          ],
        })),
      toggleInsight: (id) =>
        set((s) => ({
          insights: s.insights.map((i) => (i.id === id ? { ...i, done: !i.done } : i)),
        })),

      linkNoteToContact: (noteId, contactId) =>
        set((s) => {
          const notes = s.notes.map((n) => (n.id === noteId ? { ...n, contactId } : n));
          const contacts = contactId
            ? s.contacts.map((c) =>
                c.id === contactId ? { ...c, lastMetAt: new Date().toISOString() } : c,
              )
            : s.contacts;
          return { notes, contacts };
        }),
    }),
    {
      name: "voicecrm-store",
      storage: createJSONStorage(() => (typeof window === "undefined" ? dummyStorage : localStorage)),
      partialize: (s) => ({
        user: s.user,
        contacts: s.contacts,
        notes: s.notes.map((n) => ({ ...n, audioDataUrl: undefined })),
        insights: s.insights,
      }),
    },
  ),
);

const dummyStorage: Storage = {
  length: 0,
  clear: () => {},
  getItem: () => null,
  key: () => null,
  removeItem: () => {},
  setItem: () => {},
};
