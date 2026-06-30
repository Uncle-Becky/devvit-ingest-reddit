import './index.css';

import { context, navigateTo, requestExpandedMode } from '@devvit/web/client';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

export const Splash = () => {
  return (
    <div className="flex relative flex-col justify-center items-center min-h-screen gap-5 bg-white dark:bg-gray-900 px-6">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#d93900] text-4xl shadow-lg">
        📥
      </div>
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
          Reddit Ingest
        </h1>
        <p className="max-w-xs text-base text-center text-gray-600 dark:text-gray-300">
          Hey {context.username ?? 'there'} 👋 — tap to open the interactive
          post.
        </p>
      </div>
      <button
        className="flex items-center justify-center bg-[#d93900] hover:bg-[#c23300] text-white h-11 rounded-full cursor-pointer transition-colors px-6 font-medium"
        onClick={(e) => requestExpandedMode(e.nativeEvent, 'post')}
      >
        Open
      </button>
      <footer className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 text-[0.8em] text-gray-500 dark:text-gray-400">
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
    <Splash />
  </StrictMode>
);
