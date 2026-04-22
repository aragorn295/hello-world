import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VoiceCRM — remember every conversation",
  description: "One-tap voice notes that transcribe and link to people you meet.",
  manifest: "/manifest.webmanifest",
  applicationName: "VoiceCRM",
  appleWebApp: { capable: true, title: "VoiceCRM", statusBarStyle: "black-translucent" },
  icons: { icon: "/icon.svg", apple: "/icon.svg" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#4f46e5",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="mx-auto max-w-md min-h-screen bg-ink-50">{children}</div>
      </body>
    </html>
  );
}
