import { useCallback, useEffect, useState } from 'react';
import type {
  DecrementResponse,
  IncrementResponse,
  InitResponse,
} from '../../shared/api';

interface CounterState {
  count: number;
  username: string | null;
  loading: boolean;
}

/**
 * Loads the per-post counter and current user from the server, and exposes
 * optimistic increment/decrement actions backed by the `/api` routes.
 */
export const useCounter = () => {
  const [state, setState] = useState<CounterState>({
    count: 0,
    username: null,
    loading: true,
  });
  const [postId, setPostId] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const res = await fetch('/api/init');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: InitResponse = await res.json();
        if (data.type !== 'init') throw new Error('Unexpected response');
        setState({ count: data.count, username: data.username, loading: false });
        setPostId(data.postId);
      } catch (err) {
        console.error('Failed to init counter', err);
        setState((prev) => ({ ...prev, loading: false }));
      }
    };
    void init();
  }, []);

  const update = useCallback(
    async (action: 'increment' | 'decrement') => {
      if (!postId) {
        console.error('No postId – cannot update counter');
        return;
      }
      try {
        const res = await fetch(`/api/${action}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: IncrementResponse | DecrementResponse = await res.json();
        setState((prev) => ({ ...prev, count: data.count }));
      } catch (err) {
        console.error(`Failed to ${action}`, err);
      }
    },
    [postId]
  );

  const increment = useCallback(() => update('increment'), [update]);
  const decrement = useCallback(() => update('decrement'), [update]);

  return { ...state, increment, decrement } as const;
};
