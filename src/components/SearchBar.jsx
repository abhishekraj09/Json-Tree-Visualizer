import React from 'react';

export default function SearchBar({ searchText, setSearchText, onSearch, status }) {
  return (
    <div className="flex gap-2 items-center">
      <input
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        placeholder='$.user.address.city or user.name'
        className="flex-1 p-2 rounded border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-100"
      />
      <button onClick={onSearch} className="px-3 py-2 rounded bg-blue-500 text-white">Search</button>
      <div className="text-sm text-slate-600 dark:text-slate-300 ml-2">{status}</div>
    </div>
  );
}
