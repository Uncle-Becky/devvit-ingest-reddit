import { Hono } from 'hono';
import { context, redis, reddit } from '@devvit/web/server';
import type {
  DecrementResponse,
  ErrorResponse,
  IncrementResponse,
  InitResponse,
} from '../../shared/api';

/** Redis key used to persist the per-post counter. */
const countKey = (postId: string) => `count:${postId}`;

export const api = new Hono();

api.get('/init', async (c) => {
  const { postId } = context;

  if (!postId) {
    console.error('API /init error: postId missing from devvit context');
    return c.json<ErrorResponse>(
      { status: 'error', message: 'postId is required but missing from context' },
      400
    );
  }

  try {
    const [count, username] = await Promise.all([
      redis.get(countKey(postId)),
      reddit.getCurrentUsername(),
    ]);

    return c.json<InitResponse>({
      type: 'init',
      postId,
      count: count ? parseInt(count, 10) : 0,
      username: username ?? 'anonymous',
    });
  } catch (error) {
    console.error(`API /init error for post ${postId}:`, error);
    const message =
      error instanceof Error
        ? `Initialization failed: ${error.message}`
        : 'Unknown error during initialization';
    return c.json<ErrorResponse>({ status: 'error', message }, 400);
  }
});

api.post('/increment', async (c) => {
  const { postId } = context;
  if (!postId) {
    return c.json<ErrorResponse>({ status: 'error', message: 'postId is required' }, 400);
  }

  const count = await redis.incrBy(countKey(postId), 1);
  return c.json<IncrementResponse>({ type: 'increment', postId, count });
});

api.post('/decrement', async (c) => {
  const { postId } = context;
  if (!postId) {
    return c.json<ErrorResponse>({ status: 'error', message: 'postId is required' }, 400);
  }

  const count = await redis.incrBy(countKey(postId), -1);
  return c.json<DecrementResponse>({ type: 'decrement', postId, count });
});
