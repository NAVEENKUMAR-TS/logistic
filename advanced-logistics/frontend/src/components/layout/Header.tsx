import React, { useState, useRef, useEffect } from 'react';
import { Menu, ChevronDown, User, Shield, LogOut, ChevronRight } from 'lucide-react';
import SearchBar from '../common/SearchBar';
import NotificationPanel from '../common/NotificationPanel';
import ThemeToggle from '../common/ThemeToggle';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  currentTitle: string;
  onToggleMobileSidebar: () => void;
  onSearch?: (query: string) => void;
  onSignOut?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTitle,
  onToggleMobileSidebar,
  onSearch,
  onSignOut,
}) => {
  const { user, userRole } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const displayName =
    (user?.user_metadata?.name as string) ||
    user?.email?.split('@')[0] ||
    'Logistics Operator';
  const displayEmail = user?.email || 'user@company.com';
  const roleLabel =
    userRole === 'admin'
      ? 'Global Administrator'
      : userRole === 'dispatcher'
      ? 'Lead Dispatcher'
      : 'Fleet Operator';

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    if (profileOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [profileOpen]);

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between transition-colors">
      {/* Left side: Mobile Hamburger & Breadcrumb */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleMobileSidebar}
          type="button"
          aria-label="Toggle mobile menu"
          className="p-2 -ml-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <span className="hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer font-medium">Logistics</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-900 dark:text-slate-100">
            {currentTitle || 'Dashboard'}
          </span>
        </nav>
      </div>

      {/* Middle: Global Search */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <SearchBar onSearch={onSearch} />
      </div>

      {/* Right: Actions & User Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <NotificationPanel />

        <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block" />

        {/* User Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            type="button"
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              alt="Alex Morgan Avatar"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-brand-500/20"
            />
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                {displayName}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                {roleLabel}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden lg:block" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-700/80">
                <p className="text-xs font-semibold text-slate-900 dark:text-white">{displayName}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {displayEmail}
                </p>
              </div>

              <div className="py-1 text-xs">
                <button
                  type="button"
                  onClick={() => setProfileOpen(false)}
                  className="w-full text-left px-4 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-2.5"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  My Profile
                </button>
                <button
                  type="button"
                  onClick={() => setProfileOpen(false)}
                  className="w-full text-left px-4 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-2.5"
                >
                  <Shield className="w-4 h-4 text-slate-400" />
                  Security & Access
                </button>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-700/80 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    if (onSignOut) onSignOut();
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2.5"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
