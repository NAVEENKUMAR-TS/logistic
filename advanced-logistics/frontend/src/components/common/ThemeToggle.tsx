import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20"
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 text-slate-600 transition-transform hover:-rotate-12" />
      ) : (
        <Sun className="w-5 h-5 text-amber-400 transition-transform hover:rotate-45" />
      )}
    </button>
  );
};

export default ThemeToggle;

