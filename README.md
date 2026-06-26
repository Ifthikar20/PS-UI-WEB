# PlayStudy Web

The web client for PlayStudy — turn notes, links, and documents into study
sets, quizzes, and games. Built with Next.js (App Router), TypeScript, Tailwind
CSS, and shadcn-style components. Airbnb-clean, two-color (white/black) light &
dark theme.

## Architecture

```
Browser ──(httpOnly cookies + CSRF header)──► Next.js BFF ──(Bearer JWT)──► Django API
```

- **No JWT in the browser.** The Django access/refresh tokens live in
  **httpOnly cookies** set by the Next.js route handlers, so client JS can
  never read them (XSS-resistant). See `src/lib/server/session.ts`.
- **CSRF protection.** A double-submit token is issued as a readable cookie by
  `src/middleware.ts`; the client echoes it in the `x-csrf-token` header on
  every write, and the BFF verifies it (`src/lib/server/csrf.ts`). All mutating
  requests pass through this check.
- **BFF proxy.** `src/app/api/proxy/[...path]/route.ts` forwards browser calls
  to `/<DJANGO_API_URL>/api/v1/...`, attaching the Bearer token server-side and
  transparently refreshing it on 401 (mirrors the mobile `ApiClient`).
- **Auth routes.** `src/app/api/auth/{login,signup,logout,session}` wrap the
  Django `auth/email/`, `auth/signout/`, and `me/` endpoints.

## Games

Web games reuse the **exact same HTML bundles and PlayStudy SDK** as the mobile
app. `src/components/games/game-host.tsx` embeds a bundle in a sandboxed iframe
and speaks the identical `postMessage` contract (`init` / `ready` / `score` /
`reward` / `gameover` / `error`) as the Flutter web host. Game sessions, scores,
and rewards are persisted through the BFF proxy. Native Flutter-only games
(Flappy, Shooter, Crossword) are not portable; the HTML/remote games are.

## Getting started

```bash
cp .env.example .env.local   # point DJANGO_API_URL at your backend
npm install
npm run dev                  # http://localhost:3000
```

## Scripts

- `npm run dev` — dev server
- `npm run build` — production build
- `npm run typecheck` — TypeScript check
- `npm run lint` — ESLint

## Feature parity with the mobile app

| Mobile feature        | Web status |
| --------------------- | ---------- |
| Landing / marketing   | ✅ `/`     |
| Email auth            | ✅ `/login`, `/signup` |
| Dashboard             | ✅ `/dashboard` |
| Study set create      | ✅ `/study/new` (link / text / file) |
| Study reader + quiz   | ✅ `/study/[id]` |
| Library               | ✅ `/library` |
| Games (HTML/iframe)   | ✅ `/games`, `/games/[slug]` |
| Rewards / ranks       | ✅ `/rewards` |
| Exam prep             | ✅ `/exam` (list) |
| Profile / settings    | ✅ `/profile`, `/settings` |
| Family / Subscription | ⏳ planned |
