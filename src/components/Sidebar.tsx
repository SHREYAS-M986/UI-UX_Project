import React from 'react';
import { Home, Bug, FileText, BarChart2, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

export type NavItemKey = 'overview' | 'issues' | 'pages' | 'reports' | 'settings';

interface SidebarProps {
  activeTab?: NavItemKey;
  onTabChange?: (tab: NavItemKey) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab = 'overview',
  onTabChange,
}) => {
  const navItems = [
    { key: 'overview' as NavItemKey, label: 'Overview', icon: Home },
    { key: 'issues' as NavItemKey, label: 'Issues', icon: Bug },
    { key: 'pages' as NavItemKey, label: 'Pages', icon: FileText },
    { key: 'reports' as NavItemKey, label: 'Reports', icon: BarChart2 },
    { key: 'settings' as NavItemKey, label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Desktop Vertical Glass Sidebar (>= 1024px) */}
      <aside
        aria-label="Main Navigation"
        className="hidden lg:flex flex-col justify-between w-20 xl:w-24 min-h-[660px] h-[calc(100vh-2.5rem)] sticky top-5 glass-sidebar rounded-[26px] p-2.5 text-mist z-20 select-none shadow-glass-sidebar overflow-hidden flex-shrink-0"
      >
        {/* Top: Accessibility Logo */}
        <div className="flex flex-col items-center pt-2">
          <div
            tabIndex={0}
            role="button"
            aria-label="AccessAudit Home"
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-mist hover:bg-mist-100/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mist cursor-pointer"
          >
            {/* Custom Accessibility Figure Icon matching WCAG symbol in Image 1 */}
            <svg
              className="w-7 h-7 text-mist"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="4.5" r="2.2" fill="currentColor" stroke="none" />
              <path d="M4 8.5h16" />
              <path d="M12 8.5v7" />
              <path d="M8 20.5l4-5 4 5" />
            </svg>
          </div>

          <div className="w-8 h-[1px] bg-white/10 my-3" aria-hidden="true" />

          {/* Navigation Links */}
          <nav className="w-full flex flex-col items-center gap-1.5" aria-label="Sidebar Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.key;

              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => onTabChange && onTabChange(item.key)}
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={item.label}
                  className={cn(
                    'w-full flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all duration-200 group relative',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mist',
                    isActive
                      ? 'bg-mist-200/20 text-white font-semibold shadow-inner'
                      : 'text-mist-500 hover:text-mist hover:bg-mist-100/10'
                  )}
                >
                  <Icon
                    className={cn(
                      'w-5 h-5 mb-1 transition-transform group-hover:scale-110',
                      isActive ? 'text-white' : 'text-mist-500 group-hover:text-mist'
                    )}
                    aria-hidden="true"
                  />
                  <span className="text-[10px] tracking-tight">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom: Stylized Organic Leaf Sprig (matching Image 1) */}
        <div className="relative w-full flex items-end justify-center pointer-events-none pb-1 opacity-80">
          <svg
            className="w-14 h-24 text-deep-green"
            viewBox="0 0 60 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            {/* Elegant curved stem */}
            <path
              d="M30 100 C28 75 32 45 35 15"
              stroke="#21402A"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Lower left leaf */}
            <path
              d="M30 85 C14 80 8 68 14 56 C22 56 28 70 30 85 Z"
              fill="#21402A"
              opacity="0.85"
            />
            {/* Lower right leaf */}
            <path
              d="M31 72 C46 66 52 54 46 44 C38 46 32 58 31 72 Z"
              fill="#21402A"
              opacity="0.75"
            />
            {/* Upper left leaf */}
            <path
              d="M33 55 C20 48 16 38 22 28 C28 30 33 42 33 55 Z"
              fill="#21402A"
              opacity="0.9"
            />
            {/* Terminal top leaf */}
            <path
              d="M35 18 C30 8 36 2 41 4 C44 10 41 18 35 18 Z"
              fill="#21402A"
              opacity="0.95"
            />
          </svg>
        </div>
      </aside>

      {/* Mobile/Tablet Bottom Navigation Bar (< 1024px) */}
      <nav
        aria-label="Mobile Navigation"
        className="lg:hidden fixed bottom-3 left-3 right-3 z-40 glass-sidebar rounded-full px-3 py-2 flex items-center justify-around shadow-2xl border border-white/20"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.key;

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onTabChange && onTabChange(item.key)}
              aria-current={isActive ? 'page' : undefined}
              aria-label={item.label}
              className={cn(
                'flex flex-col items-center justify-center min-w-[54px] min-h-[44px] rounded-full px-2 py-1 transition-all',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mist',
                isActive
                  ? 'bg-mist-200/20 text-white font-semibold'
                  : 'text-mist-500 hover:text-mist'
              )}
            >
              <Icon className="w-5 h-5 mb-0.5" aria-hidden="true" />
              <span className="text-[10px]">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
