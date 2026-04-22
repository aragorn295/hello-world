"use client";

import { useRouter } from "next/navigation";
import { nanoid } from "nanoid";
import { useStore } from "@/lib/store";

export default function LoginPage() {
  const router = useRouter();
  const login = useStore((s) => s.login);

  const signIn = (provider: "google" | "facebook") => {
    login({
      id: nanoid(8),
      name: provider === "google" ? "Rajeev Kumar" : "Rajeev Kumar",
      email: provider === "google" ? "rajeev@gmail.com" : "rajeev@meta.com",
      provider,
    });
    router.replace("/");
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-b from-brand-50 to-white">
      <div className="text-center mb-12">
        <div className="text-5xl mb-3">🎙</div>
        <h1 className="text-3xl font-bold text-ink-900">VoiceCRM</h1>
        <p className="mt-2 text-ink-500">Never forget a conversation.</p>
      </div>

      <div className="w-full max-w-sm space-y-3">
        <button
          onClick={() => signIn("google")}
          className="w-full h-12 rounded-xl bg-white border border-ink-200 flex items-center justify-center gap-3 font-medium hover:bg-ink-50"
        >
          <GoogleLogo /> Continue with Google
        </button>
        <button
          onClick={() => signIn("facebook")}
          className="w-full h-12 rounded-xl bg-[#1877F2] text-white flex items-center justify-center gap-3 font-medium hover:brightness-95"
        >
          <MetaLogo /> Continue with Meta
        </button>
      </div>

      <p className="text-xs text-ink-500 mt-8 px-6 text-center">
        Demo mode — no real OAuth yet. Drop <code className="text-ink-700">GOOGLE_CLIENT_ID</code> into
        <code className="text-ink-700"> .env.local</code> to enable real sign-in.
      </p>
    </main>
  );
}

function GoogleLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C33.6 6.1 29 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C33.6 6.1 29 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5 0 9.5-1.9 12.9-5l-6-4.9C28.9 35.6 26.6 36.5 24 36.5c-5.2 0-9.6-3.3-11.2-8l-6.6 5.1C9.3 40 16.1 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.6l6 4.9c-.4.3 6.8-4.9 6.8-14.5 0-1.2-.1-2.4-.4-3.5z"/>
    </svg>
  );
}
function MetaLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M13 22v-8h3l1-4h-4V7.5c0-1.2.3-2 2-2h2V2.2C16.6 2.1 15.3 2 14 2c-2.8 0-4.7 1.7-4.7 4.9V10H6v4h3.3v8H13z"/>
    </svg>
  );
}
