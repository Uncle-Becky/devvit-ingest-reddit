# Devvit Migration Notes

Reference notes for upgrading this app off the legacy Blocks/Mod Tools stack onto
**Devvit Web**. Captured so iteration can resume without re-researching.

_Last researched: 2026-06-30._

## Version status

| | Version |
|---|---|
| This repo (`package.json`) | `^0.11.17` |
| Latest published `latest` tag | **`0.13.6`** (published 2026-06-29) |
| Latest `0.11-latest` tag | `0.11.19` |
| Latest `next` tag | `0.13.7-next-*` |

Verify the current latest at any time with:

```bash
npm view devvit dist-tags
```

The `0.11.x` → `0.13.x` jump is **not a routine dependency bump** — it crosses the
move from the old Blocks runtime to the **Devvit Web** architecture. Treat it as a
migration, not an `npm update`.

## What this app actually uses (drives which guide applies)

This is a classic **Blocks + Mod Tools** app. It does **not** use `useWebView` or any
web view. Concretely, in `src/`:

- `Devvit.addCustomPostType()` rendering `<blocks>` JSX — `src/customPost/index.tsx`
- `Devvit.configure({...})` — `src/main.ts`
- Triggers (`src/triggers/*`), buttons/menu items (`src/buttons/*`), forms
  (`src/forms/*`), a scheduler job (`src/scheduler/*`), and app settings (`src/settings.ts`)
- `devvit.yaml` (legacy project config)

Because there is no web view, the relevant guide is **"Migrating Blocks/Mod Tools to
Devvit Web"** (a.k.a. the "singleton" guide) — the quickest path. The `useWebView`
guide does **not** apply here.

## Relevant migration guides (official docs)

Docs live in the `reddit/devvit-docs` repo. The unversioned (`docs/`) copy and the
`versioned_docs/version-0.13/` copy are kept in sync.

- **Migrating Blocks/Mod Tools to Devvit Web** ← primary path for this repo
  `docs/guides/migrate/devvit-singleton.md`
- Migrating from useWebView to Devvit Web (not needed here)
  `docs/guides/migrate/inline-web-view.md`
- Migrating from Devvit Web Experimental to Devvit Web (only if already on experimental)
  `docs/guides/migrate/devvit-web-experimental.md`
- Launch screen / entry points (replaces deprecated `submitCustomPost({ preview })` / `splash`)
  `docs/capabilities/server/launch_screen_and_entry_points/splash_migration.mdx`
- Migration FAQ
  `docs/guides/faq.mdx`

Browse on GitHub: <https://github.com/reddit/devvit-docs/tree/main/docs/guides/migrate>

## Migration path for this repo (summary)

The Blocks singleton path is intentionally low-effort — existing Blocks and Mod Tools
code is meant to keep working; the main change is project config.

1. **Replace `devvit.yaml` with `devvit.json`** at the repo root. Minimal shape for a
   Blocks app:

   ```json
   {
     "name": "your-app-name",
     "blocks": { "entry": "src/main.ts" },
     "media": { "dir": "assets/" }
   }
   ```

   - Set `name` to the real app slug.
   - Point `blocks.entry` at the Blocks entry (`src/main.ts` here).
   - Keep the `media.dir` block only because this repo has an `assets/` folder.
   - Delete `devvit.yaml` after the JSON is in place.

2. **Bump dependencies** to the `0.13.x` line — `devvit`, `@devvit/public-api`,
   `@devvit/protos`, `@devvit/server`, `@devvit/web-view-scripts` — then reinstall and
   regenerate `package-lock.json`.

3. **Run `devvit playtest`** to confirm the app still loads and behaves locally.

4. **Watch for deprecated APIs** (only act on these if/when you modernize beyond the
   singleton shim):
   - `Devvit.addCustomPostType()` → move post rendering to a `client` entry in
     `devvit.json` backed by a real HTML/React web app.
   - `submitCustomPost({ preview })` and the `splash` param → define inline/expanded
     views via `post.entrypoints` in `devvit.json` (see the launch-screen guide).

## Open questions before iterating

- Confirm the real published app `name`/slug to put in `devvit.json` (current
  `devvit.yaml` says `devvit-template`, which is a placeholder).
- Decide the target: minimal **singleton shim** (fastest, keep Blocks) vs. a fuller
  rewrite of the custom post to a Devvit Web `client` entry. The singleton path is the
  recommended starting point.
