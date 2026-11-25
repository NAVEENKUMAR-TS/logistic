import React from 'react';
import ThemeToggle from '../common/ThemeToggle';

interface AuthLayoutProps {
  children: React.ReactNode;
  imageUrl?: string;
  imageAlt?: string;
  imageCaption?: string;
  badgeText?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  imageUrl = '/assets/cargo-ship.jpg',
  imageAlt = 'Commercial container cargo vessel navigating ocean shipping route',
  imageCaption = 'Global Maritime Freight Operations • Autonomous Fleet Routing',
  badgeText = '4,820 Active Vessels',
}) => {
  return (
    <div className="min-h-screen bg-[#EAF2F4] dark:bg-slate-950 flex flex-col items-center justify-center p-3 sm:p-6 lg:p-8 transition-colors duration-200">
      {/* Top Utility Bar */}
      <div className="w-full max-w-5xl flex justify-end mb-3 px-2">
        <ThemeToggle />
      </div>

      {/* Main Split-Screen Card */}
      <div className="w-full max-w-5xl bg-white dark:bg-slate-900 rounded-[28px] sm:rounded-[34px] shadow-2xl shadow-slate-300/40 dark:shadow-none border border-slate-200/70 dark:border-slate-800 p-5 sm:p-7 lg:p-8 flex flex-col lg:flex-row items-stretch gap-6 lg:gap-8 transition-all">
        {/* Mobile Maritime Hero Banner */}
        <div className="w-full h-44 sm:h-52 rounded-2xl overflow-hidden lg:hidden relative shadow-inner">
          <img
            src={imageUrl}
            alt={imageAlt}
            className="w-full h-full object-cover object-center"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
          <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/40 shadow-xs flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-semibold text-slate-800 dark:text-slate-200">
              {badgeText}
            </span>
          </div>
          <div className="absolute bottom-3 left-3 right-3 text-white pointer-events-none">
            <p className="text-xs font-bold leading-tight drop-shadow-sm">
              {imageCaption}
            </p>
          </div>
        </div>

        {/* Left Authentication Form Section */}
        <div className="w-full lg:w-[48%] flex flex-col justify-center px-1 sm:px-3">
          {children}
        </div>

        {/* Right Desktop/Tablet Maritime Hero Section */}
        <div className="w-full lg:w-[52%] hidden lg:block relative min-h-[580px] rounded-[24px] sm:rounded-[28px] overflow-hidden shadow-inner group">
          <img
            src={imageUrl}
            alt={imageAlt}
            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
            loading="eager"
          />

          {/* Bottom Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent pointer-events-none" />

          {/* Floating Fleet Status Badge */}
          <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/40 dark:border-slate-700/60 shadow-lg flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-200">
              {badgeText}
            </span>
          </div>

          {/* Bottom Caption Overlay */}
          <div className="absolute bottom-5 left-5 right-5 text-white pointer-events-none">
            <p className="text-[11px] font-semibold tracking-wider uppercase text-emerald-300">
              Automated Route Intelligence
            </p>
            <p className="text-sm font-bold text-white/95 mt-0.5 leading-snug drop-shadow-sm">
              {imageCaption}
            </p>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-4 text-center text-xs text-slate-400 dark:text-slate-500">
        &copy; {new Date().getFullYear()} Intelligent Logistics Management Platform. Enterprise Edition.
      </div>
    </div>
  );
};

export default AuthLayout;
