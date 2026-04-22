export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  provider: "google" | "facebook" | "demo";
};

export type Contact = {
  id: string;
  name: string;
  company?: string;
  role?: string;
  email?: string;
  phone?: string;
  linkedinUrl?: string;
  notes?: string;
  createdAt: string;
  lastMetAt?: string;
};

export type InsightType = "action" | "personal" | "followup" | "funny" | "other";

export type Insight = {
  id: string;
  noteId: string;
  type: InsightType;
  content: string;
  dueDate?: string;
  done: boolean;
};

export type VoiceNote = {
  id: string;
  contactId?: string;
  audioDataUrl?: string;
  durationS: number;
  transcript: string;
  summary: string;
  context?: string;
  createdAt: string;
  status: "processing" | "ready" | "failed";
};

export type NoteBundle = {
  note: VoiceNote;
  insights: Insight[];
};
