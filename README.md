# Reddit Ingest

A [Devvit Web](https://developers.reddit.com/docs) app for Reddit's Developer
Platform. The interactive post is a React client served by a [Hono](https://hono.dev)
server running on Devvit, with state stored in Redis.

## Stack

- **Client** (`src/client/`) — React 19 + Tailwind CSS, built by Vite. Two
  entrypoints: `splash` (the inline post preview) and `post` (the expanded
  interactive view).
- **Server** (`src/server/`) — Hono on `@devvit/web/server`, exposing the post
  API plus internal endpoints for menu actions, triggers, and the scheduler.
- **Shared** (`src/shared/`) — request/response types shared by client and server.
- **Config** (`devvit.json`) — entrypoints, server, menu items, triggers, and
  the recurring scheduler task.

## Project layout

```
src/
  client/            React web views (splash.tsx, post.tsx) + useCounter hook
  server/
    index.ts         Hono app wiring
    core/post.ts     createPost() helper
    routes/          api, menu, triggers, scheduler
  shared/api.ts      shared response types
tools/               tsconfig project references (client/server/shared/vite)
devvit.json          Devvit app configuration
vite.config.ts       Vite (React + Tailwind + @devvit/start) build
```

## Endpoints

| Route | Purpose |
| --- | --- |
| `GET /api/init` | Initial post state (counter + current user) |
| `POST /api/increment` / `POST /api/decrement` | Update the per-post Redis counter |
| `POST /internal/menu/post-create` | Moderator menu action: create a new post |
| `POST /internal/triggers/on-app-install` | Seed a post on install |
| `POST /internal/triggers/on-app-upgrade` | Log upgrades |
| `POST /internal/scheduler/heartbeat` | Recurring task (cron in `devvit.json`) |

## Develop

Requires Node `>=22.2.0` and a Reddit account with the Devvit CLI.

```bash
npm install
npm run build        # vite build → dist/client + dist/server
npm run type-check   # tsc --build (project references)
npm run lint
npm test             # vitest unit tests

npm run login        # devvit login (one-time)
npm run dev          # devvit playtest (live on a test subreddit)
npm run deploy       # type-check + lint + devvit upload
```

> `npm run dev`, `deploy`, and `launch` talk to Reddit and require
> `devvit login`. `build`, `type-check`, `lint`, and `test` run fully offline.

## Migration

This app was migrated from Devvit `0.11` Blocks to Devvit Web `0.13`. See
[`MIGRATION.md`](./MIGRATION.md) for the details and rationale.
