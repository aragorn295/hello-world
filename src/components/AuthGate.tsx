"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useStore((s) => s.user);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);
  useEffect(() => {
    if (hydrated && !user) router.replace("/login");
  }, [hydrated, user, router]);

  if (!hydrated) return null;
  if (!user) return null;
  return <>{children}</>;
}
