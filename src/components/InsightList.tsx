"use client";

import { useStore } from "@/lib/store";
import type { Insight, InsightType } from "@/lib/types";

const LABELS: Record<InsightType, { title: string; emoji: string; tint: string }> = {
  action: { title: "Actions", emoji: "✅", tint: "bg-orange-50 text-orange-800" },
  personal: { title: "Personal", emoji: "💡", tint: "bg-emerald-50 text-emerald-800" },
  followup: { title: "Follow-ups", emoji: "🔁", tint: "bg-sky-50 text-sky-800" },
  funny: { title: "Memorable", emoji: "😂", tint: "bg-amber-50 text-amber-800" },
  other: { title: "Notes", emoji: "📝", tint: "bg-ink-50 text-ink-700" },
};

const ORDER: InsightType[] = ["action", "personal", "followup", "funny", "other"];

export function InsightList({ insights }: { insights: Insight[] }) {
  const toggle = useStore((s) => s.toggleInsight);
  if (!insights.length) {
    return <div className="text-sm text-ink-500 italic">No insights yet.</div>;
  }

  return (
    <div className="space-y-4">
      {ORDER.map((type) => {
        const items = insights.filter((i) => i.type === type);
        if (!items.length) return null;
        const meta = LABELS[type];
        return (
          <section key={type}>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-500 mb-1.5">
              <span className="mr-1">{meta.emoji}</span>
              {meta.title}
            </h3>
            <ul className="space-y-1.5">
              {items.map((i) => (
                <li key={i.id} className="flex items-start gap-2">
                  {type === "action" || type === "followup" ? (
                    <button
                      onClick={() => toggle(i.id)}
                      aria-label={i.done ? "Mark not done" : "Mark done"}
                      className={`mt-0.5 h-5 w-5 shrink-0 rounded-md border grid place-items-center ${
                        i.done ? "bg-brand-600 border-brand-600 text-white" : "border-ink-200"
                      }`}
                    >
                      {i.done && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </button>
                  ) : (
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-ink-200" />
                  )}
                  <div className="flex-1">
                    <div className={`text-sm ${i.done ? "line-through text-ink-500" : "text-ink-900"}`}>
                      {i.content}
                    </div>
                    {i.dueDate && (
                      <div className="text-xs text-ink-500">Due {new Date(i.dueDate).toLocaleDateString()}</div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
