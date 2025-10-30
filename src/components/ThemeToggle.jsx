import React from 'react';

export default function ThemeToggle({ isDark, toggleDark }) {
  return (
    <button onClick={toggleDark} className="px-3 py-1 rounded bg-gray-200 dark:bg-slate-700">
      {isDark ? "Light" : "Dark"}
    </button>
  );
}
