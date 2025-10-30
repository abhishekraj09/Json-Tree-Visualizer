import React from 'react';

export default function Toolbar({ onZoomIn, onZoomOut, onFit }) {
  return (
    <div className="flex gap-2">
      <button onClick={onZoomIn} className="px-2 py-1 rounded bg-gray-200 dark:bg-slate-700">Zoom In</button>
      <button onClick={onZoomOut} className="px-2 py-1 rounded bg-gray-200 dark:bg-slate-700">Zoom Out</button>
      <button onClick={onFit} className="px-2 py-1 rounded bg-gray-200 dark:bg-slate-700">Fit View</button>
    </div>
  );
}
