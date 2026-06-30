import { reddit } from '@devvit/web/server';

/**
 * Create a new interactive post for this app in the current subreddit.
 *
 * The post renders the `default` entrypoint from devvit.json (the splash
 * screen), which expands into the interactive counter view on tap.
 */
export const createPost = async () => {
  return await reddit.submitCustomPost({
    title: 'Reddit Ingest',
  });
};
