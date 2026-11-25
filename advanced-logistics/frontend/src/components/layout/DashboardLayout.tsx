import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface DashboardLayoutProps {
  currentPath: string;
  currentTitle: string;
  onNavigate: (path: string, label: string) => void;
  onSearch?: (query: string) => void;
  onSignOut?: () => void;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  currentPath,
  currentTitle,
  onNavigate,
  onSearch,
  onSignOut,
  children,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col antialiased transition-colors duration-200">
      {/* Sidebar Navigation */}
      <Sidebar
        currentPath={currentPath}
        onNavigate={onNavigate}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          isCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        <Header
          currentTitle={currentTitle}
          onToggleMobileSidebar={() => setIsMobileOpen((prev) => !prev)}
          onSearch={onSearch}
          onSignOut={onSignOut}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
