import React, { useState } from 'react';
import { Button } from './Button';
import { ChevronDown, Search, Sun, RefreshCw, Check } from 'lucide-react';
import { useAuditStore } from '@/lib/store';

export const TopBar: React.FC = () => {
  const { projectName, userInitials, setProjectName, searchQuery, setSearchQuery, setAuditModalOpen } =
    useAuditStore();

  const [projectOpen, setProjectOpen] = useState(false);

  const handleSelectProject = (name: string) => {
    setProjectName(name);
    setProjectOpen(false);
  };

  return (
    <header
      role="banner"
      className="w-full flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8"
    >
      {/* Left: Project Selector */}
      <div className="relative flex items-center justify-between md:justify-start">
        <button
          type="button"
          onClick={() => setProjectOpen(!projectOpen)}
          aria-expanded={projectOpen}
          aria-haspopup="listbox"
          aria-label={`Switch project: Current is ${projectName}`}
          className="inline-flex items-center gap-2 text-base sm:text-lg font-bold text-forest hover:opacity-85 transition-opacity py-1 px-2 -ml-2 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-green"
        >
          <span>{projectName}</span>
          <ChevronDown
            className={`w-4 h-4 text-forest-500 transition-transform duration-200 ${
              projectOpen ? 'rotate-180' : ''
            }`}
            aria-hidden="true"
          />
        </button>

        {projectOpen && (
          <div
            role="listbox"
            className="absolute left-0 top-full mt-2 w-56 rounded-2xl glass-panel p-2 shadow-xl z-30 border border-white/60 animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="text-[11px] font-semibold text-forest-500 px-3 py-1.5 uppercase tracking-wider">
              Switch Project
            </div>
            {['My Web Project', 'Design System Docs', 'E-Commerce Portal'].map((pName) => {
              const isSelected = projectName === pName;
              return (
                <button
                  key={pName}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelectProject(pName)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-forest text-left mt-0.5 ${
                    isSelected ? 'bg-mist-300/80' : 'hover:bg-mist-200/60'
                  }`}
                >
                  <span>{pName}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-deep-green" aria-hidden="true" />}
                </button>
              );
            })}
          </div>
        )}

        {/* Mobile quick avatar & theme icon right side */}
        <div className="flex md:hidden items-center gap-2">
          <button
            type="button"
            className="w-10 h-10 rounded-full flex items-center justify-center text-forest-700 hover:text-forest bg-mist-300/50 border border-white/60 focus-visible:ring-2 focus-visible:ring-deep-green"
            aria-label="Toggle theme mode"
          >
            <Sun className="w-4 h-4" aria-hidden="true" />
          </button>
          <div
            className="w-10 h-10 rounded-full bg-forest text-mist flex items-center justify-center text-xs font-bold border border-white/20 select-none shadow-sm"
            aria-label={`User profile: ${userInitials}`}
          >
            {userInitials}
          </div>
        </div>
      </div>

      {/* Center: Search Field */}
      <div className="flex-1 max-w-full md:max-w-md lg:max-w-lg">
        <label htmlFor="search-input" className="sr-only">
          Search pages and accessibility issues
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-forest-500" aria-hidden="true" />
          </div>
          <input
            id="search-input"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search pages, issues..."
            className="w-full pl-10 pr-4 py-2.5 rounded-full text-xs sm:text-sm font-medium glass-input text-forest placeholder:text-forest-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-green transition-all"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="hidden md:flex items-center gap-3 flex-shrink-0">
        {/* Theme Icon */}
        <button
          type="button"
          className="w-10 h-10 rounded-full flex items-center justify-center text-forest-700 hover:text-forest hover:bg-mist-200/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-green"
          aria-label="Toggle theme appearance"
        >
          <Sun className="w-4 h-4" aria-hidden="true" />
        </button>

        {/* User Avatar */}
        <div
          tabIndex={0}
          role="button"
          aria-label={`User menu for ${userInitials}`}
          className="w-9 h-9 rounded-full bg-forest text-mist flex items-center justify-center text-xs font-bold border border-white/20 select-none shadow-sm cursor-pointer hover:ring-2 hover:ring-deep-green transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-green"
        >
          {userInitials}
        </div>

        {/* Re-run Audit Button */}
        <div>
          <Button
            variant="primary"
            size="md"
            onClick={() => setAuditModalOpen(true)}
            className="rounded-full shadow-glass-button gap-2 text-xs sm:text-sm font-semibold px-5"
          >
            <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Re-run audit</span>
          </Button>
        </div>
      </div>

      {/* Mobile Rerun Audit button row */}
      <div className="flex md:hidden">
        <Button
          variant="primary"
          size="md"
          onClick={() => setAuditModalOpen(true)}
          className="w-full rounded-full gap-2 text-sm font-semibold"
        >
          <RefreshCw className="w-4 h-4" aria-hidden="true" />
          <span>Re-run audit</span>
        </Button>
      </div>
    </header>
  );
};
