# 🎵 My Vinyl

A private, personal music player with a tactile digital vinyl UI — spinning
record, moving tonearm, and all. Your music lives directly in this repo's
`public/music/` folder and is served as static files by Vercel.

## Features

- Browse by Album / Artist / Song, full-text search
- Vinyl turntable player with spinning record + animated tonearm
- Queue, shuffle, repeat (off / all / one)
- Favourites and Recently Played (stored locally in your browser)
- Installable as a PWA on iPhone/Android — feels like a native app
- Mobile-first responsive layout with bottom nav + full-screen player
- Site-wide password gate so both the app and your music stay private

## How it works

```
GitHub repo (public/music/*.mp3)
        │
        ▼
   Vercel build
        │
        ▼
  scripts/build-library.js scans public/music/
  and writes public/library.json
        │
        ▼
  App reads library.json, plays files
  directly from /music/... (static, no API/DB)
```

No OneDrive, no Microsoft login, no Redis, no server-side API for the
library — just files in the repo. This keeps setup to "add MP3s, push,
deploy" but means your whole library lives in git.

**Before you add real music, read the "Repo size" section below** — GitHub
and Vercel both have limits worth knowing about up front.

## 1. Add your music

```
public/music/<Artist>/<Album>/<NN - Track Title>.mp3
public/music/<Artist>/<Album>/cover.jpg   (optional)
```

Example:
```
public/music/Adele/21/01 - Rolling in the Deep.mp3
public/music/Adele/21/02 - Rumour Has It.mp3
public/music/Adele/21/cover.jpg
```

Track number and title are parsed from the filename — a leading number
followed by a space/dash/underscore/period (`01 - Song.mp3`, `01. Song.mp3`,
`01_Song.mp3`) becomes track 01, title "Song". No leading number just uses
the filename as the title. Metadata comes entirely from folder/file names —
there's no ID3 tag reading, to keep this dependency-free.

## 2. Generate the library manifest

```bash
npm install
npm run library     # scans public/music/ → writes public/library.json
```

This also runs automatically before `npm run dev` and `npm run build`, so
you normally don't need to run it by hand — just re-run `npm run dev` (or
redeploy) after adding/removing files.

## 3. Environment variables

Copy `.env.example` to `.env.local`:

| Variable | Notes |
|---|---|
| `SITE_PASSWORD` | Gates the whole app (and your music files) for visitors |
| `NEXT_PUBLIC_SITE_TITLE` | Optional, defaults to "My Vinyl" |

That's the entire configuration surface. No API keys, no OAuth app
registration, no database.

## 4. Local development

```bash
npm run dev
```

Visit `http://localhost:3000`.

## 5. Deploying to Vercel

1. **Make the GitHub repo private.** Your music files will be committed to
   it — don't make this public.
2. Push to GitHub, then in Vercel: **Add New → Project → Import** your repo.
3. Add `SITE_PASSWORD` (and optionally `NEXT_PUBLIC_SITE_TITLE`) under
   Environment Variables.
4. Deploy. Vercel runs `npm run build`, which regenerates `library.json`
   from whatever's in `public/music/` at that commit.
5. Visit your deployed URL → `/login` → enter your password → browse.

Any time you add/remove music, commit + push; Vercel rebuilds and
`library.json` updates automatically.

## 6. Installing on iPhone

Open the deployed URL in Safari → Share → **Add to Home Screen**.

## Repo size — read this before adding a lot of music

Committing actual audio files to git has real limits:

- **GitHub hard-blocks any single file over 100 MB.** Most MP3s are fine
  (a few MB each), but lossless FLAC albums can get close.
- GitHub recommends keeping whole repos **under ~1 GB**, and starts warning
  around 5 GB. A big personal library (thousands of tracks) can exceed this
  quickly.
- Every push re-uploads any changed files, and every clone downloads the
  full history — this gets slow as the repo grows.
- Vercel deployments also have size limits, and large repos slow down every
  build (since the whole repo is checked out each time).

**This approach is a great fit for a smaller, curated collection** — a few
hundred favourite tracks or albums. For a large full library, the earlier
OneDrive-backed version of this app (files stay in OneDrive, nothing is
committed to git) scales much better. If you outgrow this version, ask me
and I can bring that approach back.

If you want to push the git-based approach further anyway, look into
[Git LFS](https://git-lfs.com/) for large files — it keeps big binaries out
of your normal git history.

## Folder structure

```
src/
├── pages/            # routes (Next.js pages router)
│   └── api/auth/login.ts   # the only server route — site password check
├── components/        # UI, including VinylPlayer/Turntable
├── hooks/              # PlayerContext (queue/playback), library, favourites
├── lib/
│   ├── auth/session.ts   # site-password signed cookie
│   └── format.ts
└── types/music.ts
scripts/
└── build-library.js   # scans public/music/ → public/library.json
public/
└── music/              # your MP3s live here
config/site.config.js
```

## Notes / known limitations

- No embedded ID3 tag reading — metadata is folder/filename-based only. If
  your files are already tagged nicely but named inconsistently, rename
  them to match the convention above (or ask me to add ID3 parsing).
- Album art only comes from a `cover.jpg`/`folder.jpg` file placed in each
  album folder — no embedded-artwork extraction. If none is found, a
  generated cover is shown instead.
- The site password gate is one shared password, no per-user accounts —
  fine for solo/family use, not real multi-user auth.
