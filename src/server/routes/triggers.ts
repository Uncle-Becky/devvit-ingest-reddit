import { Hono } from 'hono';
import type { OnAppInstallRequest, TriggerResponse } from '@devvit/web/shared';
import { context } from '@devvit/web/server';
import { createPost } from '../core/post';

export const triggers = new Hono();

/**
 * Fired once when the app is first installed on a subreddit. We seed the
 * subreddit with an initial interactive post so moderators see the app
 * immediately after install.
 */
triggers.post('/on-app-install', async (c) => {
  try {
    const input = await c.req.json<OnAppInstallRequest>();
    const post = await createPost();
    return c.json<TriggerResponse>(
      {
        status: 'success',
        message: `Created post ${post.id} in r/${context.subredditName} (trigger: ${input.type})`,
      },
      200
    );
  } catch (error) {
    console.error(`on-app-install error: ${error}`);
    return c.json<TriggerResponse>(
      { status: 'error', message: 'Failed to create install post' },
      400
    );
  }
});

/**
 * Fired after the app is upgraded to a new version. Nothing to migrate yet —
 * we just log the event so upgrades are observable in the app logs.
 */
triggers.post('/on-app-upgrade', async (c) => {
  console.log(`App upgraded on r/${context.subredditName}`);
  return c.json<TriggerResponse>({ status: 'success', message: 'Upgrade acknowledged' }, 200);
});
