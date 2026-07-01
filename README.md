# Str3tch

A quick, guided stretching app for building a daily mobility habit. Pick a routine, follow the
timed sequence, and track your streak — all stored locally on your device, no account needed.

## Features

- Pre-built routines by goal: general mobility, targeted relief (back/hips, neck/shoulders),
  activity recovery, and a quick daily habit-builder
- Guided player with a countdown timer, audio/vibration cues, pause/skip/back controls
- Streaks and session history, stored in local storage
- Optional daily reminder (local notification) and installable as a PWA for home-screen use

## Development

```bash
npm install
npm run dev      # start dev server
npm run build    # type-check + production build
npm run lint     # oxlint
```

## Notes on reminders

This app has no backend — reminders fire via the browser Notifications API while the app is
open or installed as a PWA. Background reliability varies by platform (iOS Safari in particular
limits background web notifications), so for the best experience, add Str3tch to your home
screen and keep notifications allowed.
