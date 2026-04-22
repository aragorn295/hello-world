"use client";

import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { AuthGate } from "@/components/AuthGate";
import { useStore } from "@/lib/store";

export default function SettingsPage() {
  return (
    <AuthGate>
      <Settings />
    </AuthGate>
  );
}

function Settings() {
  const router = useRouter();
  const user = useStore((s) => s.user)!;
  const logout = useStore((s) => s.logout);
  const notes = useStore((s) => s.notes);
  const contacts = useStore((s) => s.contacts);

  const signOut = () => {
    logout();
    router.replace("/login");
  };

  const clearData = () => {
    if (confirm("Clear all notes, insights and contacts? This cannot be undone.")) {
      localStorage.removeItem("voicecrm-store");
      location.reload();
    }
  };

  return (
    <>
      <Header title="Settings" />
      <main className="px-4 pt-4 pb-28 space-y-4">
        <section className="card p-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-brand-100 text-brand-700 grid place-items-center font-semibold text-lg">
              {user.name.slice(0, 1)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-ink-900">{user.name}</div>
              <div className="text-sm text-ink-500 truncate">{user.email}</div>
              <div className="text-xs text-ink-500 mt-0.5">Signed in via {user.provider}</div>
            </div>
          </div>
        </section>

        <section className="card p-4 text-sm text-ink-700 space-y-1">
          <div className="flex justify-between"><span>Notes</span><span>{notes.length}</span></div>
          <div className="flex justify-between"><span>Contacts</span><span>{contacts.length}</span></div>
        </section>

        <section className="card p-4 text-sm text-ink-700 space-y-2">
          <div className="font-semibold text-ink-900">Connections</div>
          <Row label="Transcription" value={process.env.NEXT_PUBLIC_BUILD_MODE === "real" ? "OpenAI Whisper" : "Mock (add OPENAI_API_KEY)"} />
          <Row label="Insights" value="Claude Sonnet 4.6 when ANTHROPIC_API_KEY set, else mock" />
          <Row label="Storage" value="Browser localStorage (swap to Supabase later)" />
          <Row label="Auth" value="Demo sign-in (swap to NextAuth Google/Meta)" />
        </section>

        <section className="space-y-2">
          <button onClick={signOut} className="w-full btn-outline h-12">Sign out</button>
          <button onClick={clearData} className="w-full btn-outline h-12 text-red-600 border-red-200">
            Clear all local data
          </button>
        </section>
      </main>
      <BottomNav />
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-ink-500">{label}</span>
      <span className="text-right text-ink-700">{value}</span>
    </div>
  );
}
