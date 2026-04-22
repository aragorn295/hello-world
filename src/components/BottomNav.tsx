"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const items = [
  { href: "/", label: "Home", icon: HomeIcon },
  { href: "/contacts", label: "Contacts", icon: ContactsIcon },
  { href: "/dashboard", label: "Dashboard", icon: DashIcon },
  { href: "/settings", label: "Settings", icon: GearIcon },
];

export function BottomNav() {
  const path = usePathname();
  return (
    <nav className="fixed bottom-0 inset-x-0 mx-auto max-w-md bg-white border-t border-ink-100 z-20">
      <ul className="grid grid-cols-4">
        {items.map(({ href, label, icon: Icon }) => {
          const active = path === href || (href !== "/" && path?.startsWith(href));
          return (
            <li key={href}>
              <Link
                href={href}
                className={clsx(
                  "flex flex-col items-center justify-center gap-0.5 py-2.5 text-xs",
                  active ? "text-brand-600" : "text-ink-500",
                )}
              >
                <Icon active={!!active} />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
      <path d="M3 11l9-7 9 7v10a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1V11z" strokeLinejoin="round"/>
    </svg>
  );
}
function ContactsIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="4" fill={active ? "currentColor" : "none"} />
      <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" strokeLinecap="round"/>
    </svg>
  );
}
function DashIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="8" height="8" rx="1.5"/>
      <rect x="13" y="3" width="8" height="5" rx="1.5"/>
      <rect x="13" y="10" width="8" height="11" rx="1.5"/>
      <rect x="3" y="13" width="8" height="8" rx="1.5"/>
    </svg>
  );
}
function GearIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" fill={active ? "currentColor" : "none"} />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>
    </svg>
  );
}
