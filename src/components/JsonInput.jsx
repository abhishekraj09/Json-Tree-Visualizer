import React from 'react';

export default function JsonInput({ jsonText, setJsonText, onVisualize, onClear, onDownload, samplePlaceholder }) {
  return (
    <div className="p-3 bg-white dark:bg-slate-800 h-full overflow-auto">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">JSON Input</h3>
        <div className="flex gap-2">
          <button onClick={onDownload} className="px-2 py-1 rounded bg-indigo-500 text-white">Download PNG</button>
          <button onClick={onClear} className="px-2 py-1 rounded bg-gray-200 dark:bg-slate-700">Clear</button>
        </div>
      </div>

      <textarea
        rows={14}
        value={jsonText}
        onChange={(e) => setJsonText(e.target.value)}
        placeholder={samplePlaceholder}
        className="w-full p-2 rounded border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-sm font-mono text-slate-900 dark:text-slate-100"
      />

      <div className="flex gap-2 mt-3">
        <button onClick={onVisualize} className="px-3 py-2 rounded bg-green-600 text-white">Generate Tree</button>
      </div>
    </div>
  );
}
