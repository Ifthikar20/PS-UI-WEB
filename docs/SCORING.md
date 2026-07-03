# PlayStudy Scoring — Architecture

This document explains **only scoring**: how each game scores a play, how that
score is captured, how it becomes points on the user's profile, and every
place the platform displays it. The companion product guide is
[PRODUCT.md](./PRODUCT.md).

Repos involved:

| Repo | Role in scoring |
| --- | --- |
| `ps-bk-dj` | Game bundles + SDK (`games_host/`), score capture API, validation, conversion, profile ledger |
| `PS-UI-WEB` | Web host that relays scores, anticipated-points panel, round summary, topbar/rewards display |
| `playstudy-mb-ui` | Mobile host (WebView) that relays the same SDK messages to the same API |

---

## 1. The two currencies

Scoring is deliberately split into two layers:

1. **In-game score** — each game's own system, tuned to its mechanics.
   Big flashy numbers are fine here; they only rank runs of *that* game.
2. **Profile points** — the single cross-platform currency on the user's
   profile (`RewardProfile.points`). Ranks, certificates, badges, and streaks
   all read this number. Only the **server** may mint it.

A play converts layer 1 into layer 2 exactly once, at session completion,
using a per-game exchange rate defined in the game catalog.

## 2. Per-game scoring systems

Every game row in the catalog (`apps/games/models.Game`) carries two scoring
fields, published to all clients through the manifest (`GET /api/v1/games/`):

- **`maxScore` (target score)** — what a *great run* scores in-game. Doubles
  as the server-side sanity cap on reported scores.
- **`rewardCap`** — the profile points a run at (or above) the target earns.

Current catalog:

| Game | In-game rules (from the bundle code) | Target `maxScore` | `rewardCap` |
| --- | --- | ---: | ---: |
| Quiz Rush | +10 per correct answer; 3-streak fires a +5 bonus reward | 100 | 30 |
| True/False Blitz | +10 per correct call | 100 | 20 |
| Word Pop | +10 per word popped from its clue | 100 | 25 |
| Flashcard Sprint | +10 per self-graded correct card | 100 | 20 |
| Flappy Quiz | +1 per pipe, +2 per bone, +2 on quiz revive | 50 | 30 |
| Space Shooter | +10–25 per invader, +150 boss, +5 asteroid | 1000 | 35 |

`rewardCap` scales roughly with difficulty (easy 20 → hard 35), so an easy
game can't out-earn a hard one minute-for-minute.

## 3. The conversion rule (one formula, every game)

```
profilePoints = round( rewardCap × min(score, maxScore) / maxScore )
```

- Score the target → the full `rewardCap`.
- Score **half** the target → **about half** the points.
- Overshoot the target → still `rewardCap` (the cap is the ceiling).
- `maxScore = 0` (unconfigured) → fallback: 1 point per score point, still
  capped by `rewardCap`; `rewardCap = 0` → the game awards nothing.

Implemented once, server-side, in
`ps-bk-dj/apps/rewards/services._points_for("Game completed", ...)` with an
absolute ceiling of 60 points per play regardless of catalog values.

## 4. Capture pipeline — how a score travels

```
┌──────────────────────────── game bundle (iframe / WebView) ────────────────┐
│  game logic  ──►  PlayStudyGame.score(n)        (live, every change)       │
│              ──►  PlayStudyGame.gameover(n)     (final)                    │
└──────────────┬─────────────────────────────────────────────────────────────┘
               │ postMessage JSON (web) / PlayStudy JS channel (mobile)
               ▼
┌──────────────────────────── host (GameHost / WebView host) ────────────────┐
│ 1. POST  games/sessions/               → session id     (round starts)     │
│ 2. PATCH games/sessions/{id}/          {score}          (heartbeat)        │
│ 3. POST  games/sessions/{id}/complete/ {score}          (gameover)         │
└──────────────┬─────────────────────────────────────────────────────────────┘
               │ authenticated API (JWT cookie via BFF proxy on web)
               ▼
┌──────────────────────────────── Django ────────────────────────────────────┐
│ complete/:                                                                  │
│   • clamp score to Game.maxScore            (anti-tamper)                   │
│   • close the GameSession (idempotent)                                      │
│   • award(user, "Game completed",                                           │
│           context={score, target_score, reward_cap},                        │
│           dedupe_key="gamesession:{id}")    (once per session, ever)        │
│   • respond {…session, pointsEarned}                                        │
│                                                                             │
│ award(): RewardProfile.points += N; PointEvent ledger row; streak update    │
└─────────────────────────────────────────────────────────────────────────────┘
```

Step-by-step:

1. **In the bundle.** Games are plain HTML5 bundles served from
   `games_host/games/<slug>/<version>/`. They speak one contract — the
   PlayStudy SDK (`games_host/playstudy-sdk.js`). During play they call
   `PlayStudyGame.score(n)` on every change and `PlayStudyGame.gameover(n)`
   at the end. The SDK serializes these to JSON and sends them over the
   transport for whichever host embeds it (web `postMessage`, mobile JS
   channel). **The bundle never talks to the API and can't mint points.**

2. **In the host.** The web host (`src/components/games/game-host.tsx`)
   accepts messages only from its own iframe's `contentWindow` (the iframe is
   sandboxed `allow-scripts`, no same-origin). Per round it opens a
   `GameSession` on the server, PATCHes heartbeat scores mid-play, and on
   `gameover` POSTs `complete/` with the final score. The mobile host does
   the same from its WebView.

3. **On the server.** `complete/` is the **only** place a game score becomes
   profile points:
   - the reported score is clamped to the game's `maxScore`;
   - the session is closed idempotently (a second `complete/` is a no-op);
   - the conversion formula runs and `award()` credits the profile inside a
     transaction, deduped by `gamesession:{id}` so retries/replays can never
     double-award;
   - every credit lands as a `PointEvent` ledger row (`reason="Game
     completed"`), so the profile total is always reconstructible.

## 5. Why it can't be gamed

- **The bundle is untrusted.** It runs sandboxed, and its only power is
  *reporting* a score. Points are computed server-side from catalog values.
- **Scores are clamped.** A tampered `gameover(999999)` clamps to `maxScore`,
  worth exactly `rewardCap` — the same as an honest perfect run.
- **The reason is not client-reportable.** `rewards/activity/` accepts only
  an allow-list of reasons ("Finished a quiz", …). `"Game completed"` is not
  on it — only the trusted `complete/` code path can use it.
- **Dedupe.** One award per session id, enforced by a ledger lookup inside
  the award transaction. Replaying `complete/` returns `pointsEarned: 0`.
- **Absolute ceiling.** Even a corrupted catalog row can't award more than
  60 points per play (`_MAX_POINTS["Game completed"]`).

## 6. Display — every surface a score appears on

| Surface | What it shows | Source |
| --- | --- | --- |
| **Session bar** (above the game) | Live score, round number, personal best, "N to beat your best" | SDK `score` events, in memory; best from `localStorage ps_best:{game}:{set}` |
| **Round summary** (game over) | Final score vs best, **"+N pts added to your profile"** | `complete/` response `pointsEarned` |
| **Scoring panel** (bottom of the game page) | The game's own rules, target score, the **anticipated-points ladder** (25/50/75/100% of target → points), what your best run is worth | Manifest `maxScore`/`rewardCap`; same formula as the server |
| **Topbar** | Total profile points + streak pills | `me/` (refreshed right after a scoring `complete/`) |
| **Rewards page** | Points/streak/rank chips, certificates + badges gated on points | `me/.rewards` |
| **Dashboard** | Count-up points stat, rank tile with progress-to-next | `me/.rewards` |
| **Activity page** | Daily points/accuracy charts | `rewards/history/`, `progress/activity/` |

The **anticipated-points ladder** is the up-front promise: before playing,
the user sees "score 50 → +15 pts, score 100 → +30 pts" for the exact game
they're looking at. Because the panel computes with the same formula and the
same manifest numbers the server uses, the promise always matches the payout.

## 7. Cross-platform note

Sessions, scores, and points all live server-side, so a run played on the
web counts on mobile and vice versa. Both hosts speak the identical SDK
contract and the identical sessions API; the only platform-specific part is
the transport (postMessage vs JS channel).

## 8. Extending the system

Adding or tuning a game's scoring is a catalog change, no client release:

1. Set the bundle's in-game rules however the game wants.
2. Publish with `maxScore` (a great run) and `rewardCap` (its profile worth):
   `python manage.py publish_game game.json` — both fields flow to every
   client through the manifest.
3. The web scoring panel needs one line of rule text per new slug
   (`GAME_RULES` in `src/components/games/scoring-panel.tsx`).

Tuning guidance: keep `rewardCap` in 15–40 (hard ceiling 60), scale with
difficulty and time-to-target, and pick `maxScore` so a skilled 2–3 minute
run reaches it.
