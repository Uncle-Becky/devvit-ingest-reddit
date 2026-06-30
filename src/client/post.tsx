import './index.css';

import { navigateTo } from '@devvit/web/client';
import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { useCounter } from './hooks/useCounter';

type View = 'counter' | 'about';

const TabButton = ({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors cursor-pointer ${
      active
        ? 'bg-[#d93900] text-white'
        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
    }`}
  >
    {label}
  </button>
);

const CounterView = () => {
  const { count, username, loading, increment, decrement } = useCounter();
  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
        {username ? `Hey ${username} 👋` : 'Welcome 👋'}
      </h2>
      <p className="text-sm text-center text-gray-600 dark:text-gray-300 max-w-xs">
        A shared, per-post counter persisted in Redis. Everyone viewing this
        post sees the same value.
      </p>
      <div className="flex items-center justify-center">
        <button
          aria-label="Decrement"
          className="flex items-center justify-center bg-[#d93900] hover:bg-[#c23300] disabled:opacity-50 text-white w-14 h-14 text-3xl rounded-full cursor-pointer font-mono leading-none transition-colors"
          onClick={decrement}
          disabled={loading}
        >
          −
        </button>
        <span className="text-4xl font-medium mx-6 min-w-[64px] text-center leading-none text-gray-900 dark:text-white tabular-nums">
          {loading ? '…' : count}
        </span>
        <button
          aria-label="Increment"
          className="flex items-center justify-center bg-[#d93900] hover:bg-[#c23300] disabled:opacity-50 text-white w-14 h-14 text-3xl rounded-full cursor-pointer font-mono leading-none transition-colors"
          onClick={increment}
          disabled={loading}
        >
          +
        </button>
      </div>
    </div>
  );
};

const AboutView = () => (
  <div className="flex flex-col items-center gap-3 max-w-sm text-center">
    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
      About this app
    </h2>
    <p className="text-sm text-gray-600 dark:text-gray-300">
      Reddit Ingest is a Devvit Web app. The post you are viewing is a React
      client served by a Hono server running on Reddit&apos;s Developer
      Platform, with state stored in Redis.
    </p>
    <p className="text-sm text-gray-600 dark:text-gray-300">
      Moderators can create a new post from the subreddit menu (&ldquo;Create an
      ingest post&rdquo;).
    </p>
  </div>
);

export const App = () => {
  const [view, setView] = useState<View>('counter');
  return (
    <div className="flex relative flex-col min-h-screen bg-white dark:bg-gray-900">
      <header className="flex items-center justify-center gap-2 px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <TabButton
          active={view === 'counter'}
          label="Counter"
          onClick={() => setView('counter')}
        />
        <TabButton
          active={view === 'about'}
          label="About"
          onClick={() => setView('about')}
        />
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 py-8">
        {view === 'counter' ? <CounterView /> : <AboutView />}
      </main>

      <footer className="flex items-center justify-center gap-3 py-3 text-[0.8em] text-gray-500 dark:text-gray-400">
        <button
          className="cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors"
          onClick={() => navigateTo('https://developers.reddit.com/docs')}
        >
          Docs
        </button>
        <span className="text-gray-300 dark:text-gray-600">|</span>
        <button
          className="cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors"
          onClick={() => navigateTo('https://www.reddit.com/r/Devvit')}
        >
          r/Devvit
        </button>
      </footer>
    </div>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
