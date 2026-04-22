import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef2ff",
          100: "#e0e7ff",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
        },
        ink: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          500: "#64748b",
          700: "#334155",
          900: "#0f172a",
        },
      },
      boxShadow: {
        soft: "0 1px 2px rgba(15,23,42,0.04), 0 8px 24px rgba(15,23,42,0.06)",
      },
    },
  },
  plugins: [],
} satisfies Config;
