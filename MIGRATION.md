# Devvit 0.11 → 0.13 Migration Notes

This app was migrated from **Devvit 0.11 (Blocks + Mod Tools)** to **Devvit Web
0.13**. This document records what changed and, importantly, why the migration
was a rewrite rather than a config bump.

_Last updated: 2026-06-30._

## The key finding: 0.13 removed the Blocks custom-post API

The original app rendered its interactive post with the Blocks API
(`Devvit.addCustomPostType` + `<vstack>/<button>` JSX + `useState`/`useInterval`).
Verified directly against the installed `@devvit/public-api@0.13.6`:

| Legacy API | 0.13 status |
| --- | --- |
| `addMenuItem`, `addTrigger`, `addSchedulerJob`, `addSettings`, `createForm` | ✅ kept |
| `addCustomPostType`, `useState`, `useInterval`, `useChannel`, JSX intrinsics | ❌ **removed** |

So the "singleton / `blocks.entry`" path keeps *non-rendering* mod-tools APIs
working, but **any app with an interactive custom post must rewrite that post as
a Devvit Web client** (HTML/React served via `post.entrypoints`, backed by a
server). There is no in-place upgrade for Blocks UI.

## What changed

Mirrors the official [`reddit/devvit-template-react`](https://github.com/reddit/devvit-template-react)
structure (React + Hono + Vite + Tailwind):

- **Removed** the entire Blocks app: `addCustomPostType` post, the 20 trigger
  stubs, menu buttons, settings/validators, scheduler job, and the
  `devvit-helpers` dependency (along with template demo filler like the dice
  validator and the eight identical showcase buttons).
- **Added** a Devvit Web app:
  - `src/client/` — React views (`splash`, `post`) + Tailwind. The post keeps the
    original's in-post routing idea as Counter / About tabs.
  - `src/server/` — Hono server on `@devvit/web/server` with `/api` (Redis
    counter, current user) and `/internal` endpoints for menu, triggers, scheduler.
  - `src/shared/api.ts` — shared request/response types.
- **Config**: `devvit.yaml` → `devvit.json` (`post.entrypoints`, `server`, `menu`,
  `triggers`, `scheduler`). Build via `vite` + `@devvit/start`; types via
  `tsc --build` project references (`tools/tsconfig.*.json`).
- **Dependencies**: dropped `@devvit/public-api`, `@devvit/protos`,
  `@devvit/server`, `@devvit/web-view-scripts`, `devvit-helpers`. Added
  `@devvit/web`, `@devvit/start`, `hono`, `@hono/node-server`, `react`,
  `react-dom`, `vite`, `tailwindcss`, and the matching toolchain.

## Feature mapping (old → new)

| Old (Blocks) | New (Devvit Web) |
| --- | --- |
| `addCustomPostType` counter UI | `src/client/post.tsx` + `useCounter` + `/api/*` |
| Redis counter via `useInterval` | `redis.incrBy` in `src/server/routes/api.ts` |
| `customPostButton` menu → form → `submitPost` | `/internal/menu/post-create` → `reddit.submitCustomPost` |
| `appInstall`/`appUpgrade` triggers | `/internal/triggers/on-app-install`, `on-app-upgrade` |
| `someRecurringTask` scheduler job | `scheduler.tasks.heartbeat` → `/internal/scheduler/heartbeat` |
| 20 console-logging trigger stubs | dropped (add per-event endpoints as needed) |
| `addSettings` (dice/toggle/selects) | dropped (template demo filler) |

## Verification

Run fully offline (no Reddit auth required):

```bash
npm run type-check   # tsc --build — green
npm run build        # vite build → dist/client + dist/server — green
npm run lint         # eslint — green
npm test             # vitest — green
```

**Not yet verified on-platform.** Runtime behavior (the post rendering on
Reddit, menu/trigger/scheduler wiring, Redis) requires `devvit playtest`, which
needs `devvit login` and a test subreddit — out of scope for this environment.

## Follow-ups

- Confirm the published app slug for `devvit.json` `name` (currently
  `devvit-template`, inherited from the old `devvit.yaml`). Changing it creates a
  new app rather than updating the existing one.
- Run `devvit playtest` to validate on-platform, then re-add any of the dropped
  triggers/settings that are actually needed as server endpoints.
