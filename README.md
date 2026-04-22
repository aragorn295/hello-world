# VoiceCRM

One-tap voice notes that transcribe, extract action items and personal facts, and
link each note to a contact. Built as a PWA so the same codebase can later be
wrapped with Capacitor for iOS + Android app-store distribution.

## Running locally

```bash
npm install
npm run dev
```

Open http://localhost:3000 and sign in with the demo provider.

## Swapping mocks for real services

Copy `.env.local.example` to `.env.local` and fill in any of the following:

- `ANTHROPIC_API_KEY` — enables real insight extraction with Claude Sonnet 4.6
- `OPENAI_API_KEY` — enables real transcription with Whisper
- `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` — persistent cloud storage (placeholder, not wired yet)
- `GOOGLE_CLIENT_ID` / `FACEBOOK_CLIENT_ID` — real OAuth (placeholder, not wired yet)

Every unset variable falls back to a deterministic mock so the UI is always demo-able.

## Architecture

- **Next.js 14 App Router + React 18 + TypeScript**
- **Tailwind CSS** for styling
- **Zustand** persisted to `localStorage` as the client data store (swap point for Supabase)
- **API routes** in `src/app/api/*` hide the LLM keys from the client
- **PWA manifest** in `public/manifest.webmanifest`; wrap with Capacitor for native builds

## Screens

- `/login` — Google / Meta sign-in (demo)
- `/` — home, record button + recent notes + counters
- `/record` — live recording with waveform, pause/stop
- `/notes/[id]` — transcript, summary, extracted insights, contact linking, audio playback
- `/contacts` — search / list
- `/contacts/[id]` — profile, key facts, open actions, timeline
- `/contacts/new` — create a contact manually
- `/dashboard` — open actions across all contacts, follow-ups, contact heatmap
- `/settings` — account, connections status, sign out, clear data

## Data model (localStorage today, Postgres later)

```
users       (id, name, email, provider)
contacts    (id, name, company, role, email, phone, linkedinUrl, lastMetAt)
voice_notes (id, contactId?, audioDataUrl, durationS, transcript, summary, status)
insights    (id, noteId, type, content, dueDate?, done)
              type ∈ action | personal | followup | funny | other
```

## Roadmap

- Phase 2 — Supabase persistence, real NextAuth providers, offline recording queue, contact import (vCard / LinkedIn).
- Phase 3 — Capacitor wrap for iOS + Android with StoreKit / Play Billing subscriptions.
