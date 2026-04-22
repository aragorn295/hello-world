"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { initials } from "@/lib/format";

export function Header({ title, back }: { title?: string; back?: string }) {
  const user = useStore((s) => s.user);
  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-ink-100">
      <div className="h-14 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          {back ? (
            <Link href={back} aria-label="Back" className="text-ink-700 hover:text-ink-900">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
          ) : (
            <div className="text-xl">🎙</div>
          )}
          <div className="font-semibold text-ink-900">{title ?? "VoiceCRM"}</div>
        </div>
        {user ? (
          <Link href="/settings" className="h-8 w-8 rounded-full bg-brand-100 text-brand-700 grid place-items-center text-sm font-semibold">
            {initials(user.name)}
          </Link>
        ) : (
          <Link href="/login" className="text-sm text-brand-600">Sign in</Link>
        )}
      </div>
    </header>
  );
}
