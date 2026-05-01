# Tournament Hold'em Notes

A single-page (no build, no server) app for taking detailed notes during a
9-handed Texas Hold'em tournament. Every action of every player on every
street is recorded.

## Run

Open `index.html` in any modern browser. State is persisted to
`localStorage`, so the app survives reloads.

## Features

- **9 seats** with persistent player profiles (name, stack, reads).
- **Per-hand state**: blinds/ante, dealer button, positions (BTN, SB, BB,
  UTG ... CO), starting stacks, hole cards.
- **Action log per street**: Preflop / Flop / Turn / River — Fold, Check,
  Call, Bet, Raise, All-in. Antes and blinds are auto-posted.
- **Suggested next-to-act** based on action order around the table; one-click
  Undo for the last action.
- **Board card picker** with used-card tracking so the same card can't be
  assigned twice.
- **Showdown / result**: pick winners, split pots, write a description, and
  finish the hand. Stacks settle automatically and the button rotates.
- **Persistent reads** per player carry across hands; per-hand notes attach
  to the saved hand history.
- **Hand history** with full action-by-action replay.
- **Export / Import** the entire state as JSON.
- **Tournament setup**: edit blind structure (add levels), starting stack,
  and player roster.
