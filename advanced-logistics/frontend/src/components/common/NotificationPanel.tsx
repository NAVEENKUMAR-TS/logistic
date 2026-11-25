import React, { useState, useRef, useEffect } from 'react';
import { Bell, CheckCheck, AlertCircle, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import { mockNotifications } from '../../data/mockLogisticsData';
import { NotificationItem } from '../../types/logistics';

export const NotificationPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);
  const panelRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'danger':
        return <AlertCircle className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />;
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />;
    }
  };

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        aria-label="View notifications"
        className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="p-3.5 border-b border-slate-100 dark:border-slate-700/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-medium bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                type="button"
                className="text-xs text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/60">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-sm text-slate-400">No notifications</div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-3.5 text-left flex gap-3 transition-colors ${
                    notif.read
                      ? 'bg-transparent opacity-75'
                      : 'bg-slate-50/70 dark:bg-slate-800/90'
                  } hover:bg-slate-100/60 dark:hover:bg-slate-700/40`}
                >
                  {getIcon(notif.type)}
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{notif.title}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                      {notif.message}
                    </p>
                    <span className="text-[10px] text-slate-400 mt-1 inline-block">{notif.time}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-2 border-t border-slate-100 dark:border-slate-700/80 text-center bg-slate-50/50 dark:bg-slate-800/50">
            <button
              onClick={() => setIsOpen(false)}
              type="button"
              className="text-xs font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            >
              Close notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;

