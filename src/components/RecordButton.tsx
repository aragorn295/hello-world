"use client";

import { useRouter } from "next/navigation";

export function RecordButton({ size = "lg" }: { size?: "lg" | "md" }) {
  const router = useRouter();
  const dim = size === "lg" ? "h-44 w-44" : "h-28 w-28";
  return (
    <button
      onClick={() => router.push("/record")}
      className={`pulse-ring ${dim} rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-soft grid place-items-center active:scale-[0.98] transition`}
      aria-label="Record a voice note"
    >
      <div className="flex flex-col items-center">
        <MicIcon />
        <span className="mt-2 font-semibold tracking-wide">RECORD</span>
      </div>
    </button>
  );
}

function MicIcon() {
  return (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="9" y="3" width="6" height="12" rx="3" fill="currentColor" />
      <path d="M5 11a7 7 0 0 0 14 0" strokeLinecap="round" />
      <path d="M12 18v3" strokeLinecap="round" />
      <path d="M8 21h8" strokeLinecap="round" />
    </svg>
  );
}
