import { Hono } from 'hono';
import { context } from '@devvit/web/server';

export const scheduler = new Hono();

/**
 * Recurring heartbeat task (declared in devvit.json under scheduler.tasks).
 * Runs on the configured cron schedule; currently a no-op beyond logging,
 * but a convenient hook for future periodic ingest work.
 */
scheduler.post('/heartbeat', async (c) => {
  console.log(`Heartbeat tick for r/${context.subredditName} at ${new Date().toISOString()}`);
  return c.json({ status: 'success' }, 200);
});
