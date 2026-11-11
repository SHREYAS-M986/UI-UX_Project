import React, { useState } from 'react';
import { useAuditStore } from '@/lib/store';
import { GlassCard } from '../GlassCard';
import { SeverityBadge } from '../SeverityBadge';
import { Button } from '../Button';
import {
  Search,
  ArrowUpDown,
  FileText,
  Clock,
  Check,
  SlidersHorizontal,
} from 'lucide-react';
import { SeverityLevel, WcagLevel } from '@/lib/prioritise';

export const IssuesView: React.FC = () => {
  const issues = useAuditStore((state) => state.issues);
  const toggleIssueFixed = useAuditStore((state) => state.toggleIssueFixed);
  const openDrawer = useAuditStore((state) => state.openDrawer);

  const [severityFilter, setSeverityFilter] = useState<'all' | SeverityLevel>('all');
  const [levelFilter, setLevelFilter] = useState<'all' | WcagLevel>('all');
  const [sortBy, setSortBy] = useState<'priority' | 'impact' | 'effort' | 'elements'>('priority');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter issues
  const filteredIssues = issues
    .filter((issue) => {
      if (severityFilter !== 'all' && issue.severity !== severityFilter) return false;
      if (levelFilter !== 'all' && issue.wcagLevel !== levelFilter) return false;
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        return (
          issue.wcagCode.toLowerCase().includes(term) ||
          issue.description.toLowerCase().includes(term) ||
          issue.ruleId.toLowerCase().includes(term)
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'priority') return b.priorityRatio - a.priorityRatio;
      if (sortBy === 'impact') return b.impactScore - a.impactScore;
      if (sortBy === 'effort') return a.fixTimeMinutes - b.fixTimeMinutes; // quickest first
      if (sortBy === 'elements') return b.elementCount - a.elementCount;
      return 0;
    });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-forest tracking-tight">All Detected Issues</h1>
          <p className="text-xs text-forest-600 mt-1">
            Browse and filter through all {issues.length} WCAG violation groups.
          </p>
        </div>

        <div className="text-xs font-semibold text-forest-700 bg-mist-300/60 border border-white/60 px-4 py-2 rounded-full self-start sm:self-auto">
          {issues.filter((i) => i.isFixed).length} of {issues.length} Fixed
        </div>
      </div>

      {/* Filter and Search Controls */}
      <GlassCard className="p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-forest-500 absolute left-3.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by rule, criterion, or tag..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-full glass-input text-forest focus:outline-none focus:ring-2 focus:ring-deep-green"
            />
          </div>

          {/* Severity & WCAG Level Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
            <div className="flex items-center gap-1 bg-mist-100/50 p-1 rounded-full border border-white/50">
              {(['all', 'critical', 'serious', 'minor'] as const).map((sev) => (
                <button
                  key={sev}
                  type="button"
                  onClick={() => setSeverityFilter(sev)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition-all ${
                    severityFilter === sev
                      ? 'bg-forest text-mist shadow-sm'
                      : 'text-forest-700 hover:bg-mist-200/60'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 bg-mist-100/50 p-1 rounded-full border border-white/50">
              {(['all', 'A', 'AA'] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setLevelFilter(lvl as any)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    levelFilter === lvl
                      ? 'bg-forest text-mist shadow-sm'
                      : 'text-forest-700 hover:bg-mist-200/60'
                  }`}
                >
                  {lvl === 'all' ? 'All Levels' : `Level ${lvl}`}
                </button>
              ))}
            </div>
          </div>

          {/* Sort selection */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-forest-500" aria-hidden="true" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 rounded-xl text-xs font-semibold glass-input text-forest focus:outline-none focus:ring-2 focus:ring-deep-green"
              aria-label="Sort issues by"
            >
              <option value="priority">Sort: Priority (Impact ÷ Effort)</option>
              <option value="impact">Sort: Highest Impact</option>
              <option value="effort">Sort: Lowest Effort (Quickest)</option>
              <option value="elements">Sort: Most Elements</option>
            </select>
          </div>
        </div>
      </GlassCard>

      {/* Issues Table / List */}
      <GlassCard className="p-4 sm:p-6 divide-y divide-forest-100/30">
        {filteredIssues.length === 0 ? (
          <div className="py-12 text-center text-forest-600">
            <SlidersHorizontal className="w-8 h-8 text-forest-400 mx-auto mb-2" />
            <p className="font-semibold text-sm">No issues match the selected criteria.</p>
            <p className="text-xs mt-1">Try resetting the severity filter or search query.</p>
          </div>
        ) : (
          filteredIssues.map((issue) => (
            <div
              key={issue.id}
              className={`py-4 transition-all duration-200 rounded-xl px-2 -mx-2 hover:bg-mist-200/40 ${
                issue.isFixed ? 'opacity-60 bg-forest-50/20' : ''
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                {/* Left: Badge + Criterion */}
                <div
                  className="flex items-start sm:items-center gap-3 cursor-pointer group flex-1 min-w-0"
                  onClick={() => openDrawer(issue.id)}
                  tabIndex={0}
                  role="button"
                  aria-label={`Open details for ${issue.wcagCode}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      openDrawer(issue.id);
                    }
                  }}
                >
                  <SeverityBadge severity={issue.severity} />
                  <div className="min-w-0 pr-2">
                    <div className="text-sm font-bold text-forest group-hover:text-deep-green transition-colors flex items-center gap-2">
                      <span>{issue.wcagCode}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-mist-300 text-forest-700">
                        Level {issue.wcagLevel}
                      </span>
                    </div>
                    <p className="text-xs text-forest-600 truncate mt-0.5 max-w-md">
                      {issue.description}
                    </p>
                  </div>
                </div>

                {/* Metrics */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-mist-300/70 border border-white/70 text-forest">
                    <FileText className="w-3.5 h-3.5 text-forest-500" aria-hidden="true" />
                    <span>{issue.elementCount} elements</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-mist-300/70 border border-white/70 text-forest">
                    <Clock className="w-3.5 h-3.5 text-forest-500" aria-hidden="true" />
                    <span>{issue.fixTimeMinutes} min fix</span>
                  </span>
                </div>

                {/* Code Preview */}
                <div className="w-full lg:w-64 flex-shrink-0">
                  <div className="bg-forest rounded-xl px-3 py-1.5 text-xs font-mono text-mist overflow-x-auto shadow-inner border border-forest-700">
                    <code className="whitespace-pre text-mist-600 block leading-tight">
                      {issue.snippet}
                    </code>
                  </div>
                </div>

                {/* Action Button */}
                <div className="flex-shrink-0 flex items-center justify-end gap-2">
                  <Button
                    variant={issue.isFixed ? 'secondary' : 'primary'}
                    size="sm"
                    onClick={() => toggleIssueFixed(issue.id)}
                    className="min-h-[38px] px-4 font-semibold text-xs"
                  >
                    {issue.isFixed ? (
                      <>
                        <Check className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Fixed</span>
                      </>
                    ) : (
                      <span>Mark as fixed</span>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </GlassCard>
    </div>
  );
};
