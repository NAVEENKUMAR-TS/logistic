import React from 'react';
import {
  LayoutDashboard,
  ClipboardList,
  Navigation,
  Boxes,
  Warehouse,
  Truck,
  Users,
  Building2,
  Globe,
  CreditCard,
  BarChart3,
  Sparkles,
  TrendingUp,
  MapPin,
  ShieldAlert,
  Cpu,
  UserCog,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  PackageCheck,
  X,
} from 'lucide-react';

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string, label: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPath,
  onNavigate,
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const sections: NavSection[] = [
    {
      title: 'MAIN MENU',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'orders', label: 'Order Management', icon: ClipboardList, badge: '12', badgeColor: 'bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400' },
        { id: 'tracking', label: 'Shipment Tracking', icon: Navigation },
        { id: 'inventory', label: 'Inventory Management', icon: Boxes },
        { id: 'warehouse', label: 'Warehouse Management', icon: Warehouse },
        { id: 'transport', label: 'Transport Management', icon: Truck },
        { id: 'drivers', label: 'Driver Management', icon: Users },
        { id: 'suppliers', label: 'Supplier Management', icon: Building2 },
        { id: 'import-export', label: 'Import / Export', icon: Globe },
        { id: 'billing', label: 'Billing & Finance', icon: CreditCard },
        { id: 'analytics', label: 'Analytics & Reports', icon: BarChart3 },
      ],
    },
    {
      title: 'INTELLIGENCE',
      items: [
        { id: 'ai-assistant', label: 'AI Assistant', icon: Sparkles, badge: 'PRO', badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' },
        { id: 'forecasting', label: 'Demand Forecasting', icon: TrendingUp },
        { id: 'route-optimization', label: 'Route Optimization', icon: MapPin },
        { id: 'risk-analysis', label: 'Risk Analysis', icon: ShieldAlert },
        { id: 'decision-engine', label: 'Decision Engine', icon: Cpu },
      ],
    },
    {
      title: 'SYSTEM',
      items: [
        { id: 'users', label: 'User Management', icon: UserCog },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'settings', label: 'Settings', icon: Settings },
      ],
    },
  ];

  const handleItemClick = (id: string, label: string) => {
    onNavigate(id, label);
    if (isMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 ease-in-out bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'lg:w-20' : 'lg:w-64'} w-64`}
      >
        {/* Header / Brand Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-3 overflow-hidden cursor-pointer" onClick={() => onNavigate('dashboard', 'Dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 via-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 flex-shrink-0">
              <PackageCheck className="w-5 h-5" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col truncate">
                <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-white truncate">
                  LOGIX ENTERPRISE
                </span>
                <span className="text-[10px] uppercase font-semibold text-brand-600 dark:text-brand-400 tracking-wider">
                  Supply Chain AI
                </span>
              </div>
            )}
          </div>

          {/* Mobile close button */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {sections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              {!isCollapsed && (
                <h4 className="px-3 text-[11px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase mb-2">
                  {section.title}
                </h4>
              )}
              {isCollapsed && (
                <div className="w-full flex justify-center py-1">
                  <div className="w-4 h-0.5 bg-slate-200 dark:bg-slate-700 rounded-full" />
                </div>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPath === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleItemClick(item.id, item.label)}
                      title={isCollapsed ? item.label : undefined}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all group relative ${
                        isActive
                          ? 'bg-brand-500 text-white shadow-xs shadow-brand-500/30 dark:bg-brand-600'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
                      } ${isCollapsed ? 'justify-center px-2' : ''}`}
                    >
                      <Icon
                        className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-105 ${
                          isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400 group-hover:text-brand-600 dark:group-hover:text-brand-400'
                        }`}
                      />
                      {!isCollapsed && (
                        <>
                          <span className="flex-1 text-left truncate">{item.label}</span>
                          {item.badge && (
                            <span
                              className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                                isActive ? 'bg-white/20 text-white' : item.badgeColor || 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Collapse Toggle (Desktop) */}
        <div className="hidden lg:flex items-center justify-between p-3 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
          {!isCollapsed && (
            <div className="flex items-center gap-2 overflow-hidden px-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                Fleet Network: <strong className="text-slate-700 dark:text-slate-200">Online</strong>
              </span>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            type="button"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors ml-auto"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

