import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search tracking ID, shipments, warehouses, or drivers...',
  onSearch,
}) => {
  const [query, setQuery] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (onSearch) onSearch(val);
  };

  const handleClear = () => {
    setQuery('');
    if (onSearch) onSearch('');
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
        <Search className="w-4 h-4" />
      </div>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full pl-9 pr-9 py-1.5 text-sm bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 border border-slate-200 dark:border-slate-700/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:focus:border-brand-500 transition-all"
      />
      {query ? (
        <button
          onClick={handleClear}
          type="button"
          className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X className="w-4 h-4" />
        </button>
      ) : (
        <div className="absolute inset-y-0 right-0 pr-2.5 hidden sm:flex items-center pointer-events-none">
          <kbd className="px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-200/60 dark:bg-slate-700/60 rounded border border-slate-300 dark:border-slate-600">
            ⌘K
          </kbd>
        </div>
      )}
    </div>
  );
};

export default SearchBar;

