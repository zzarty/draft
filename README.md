# Draft — Gesture Drawing

A minimal gesture drawing timer for artists. Load a folder of reference images, set a duration, and practice timed poses.

## Features

- **Timed sessions** — preset durations (30s – 10m) or custom values
- **Shuffle & loop** — randomize order and auto-repeat
- **Audio cues** — beeps at 3-2-1 countdown and on advance
- **Keyboard shortcuts** — Space (play/pause), ←/→ (prev/next), R (shuffle), Esc (settings)
- **Mobile-friendly** — responsive layout with touch file picker on tablets/phones

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Drop an image folder (desktop) or tap to select files (mobile).

## Production Build

```bash
npm run build
npm start
```

## Deploy to GitHub Pages

Push to `main` and the included GitHub Actions workflow will build and deploy automatically.

To enable it: **Settings → Pages → Source → GitHub Actions**.

The site is available at [draft.zzarty.com](https://draft.zzarty.com).

## Tech Stack

- [Next.js](https://nextjs.org) 16 (App Router, Turbopack)
- [React](https://react.dev) 19
- [Tailwind CSS](https://tailwindcss.com) 4
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev)
