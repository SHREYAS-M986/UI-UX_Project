import React, { useState } from 'react';
import { GlassCard } from './GlassCard';
import { SeverityBadge } from './SeverityBadge';
import { Button } from './Button';
import { PRIORITIZED_ISSUES, AuditIssue } from '@/data/mockData';
import { Wrench, ArrowRight, FileText, Clock, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FixListProps {
  onIssueStatusChange?: (id: string, isFixed: boolean) => void;
}

export const FixList: React.FC<FixListProps> = ({ onIssueStatusChange }) => {
  const [issues, setIssues] = useState<AuditIssue[]>(PRIORITIZED_ISSUES);

  const toggleFixed = (id: string) => {
    setIssues((prev) =>
      prev.map((issue) => {
        if (issue.id === id) {
          const nextFixed = !issue.isFixed;
          if (onIssueStatusChange) {
            onIssueStatusChange(id, nextFixed);
          }
          return { ...issue, isFixed: nextFixed };
        }
        return issue;
      })
    );
  };

  return (
    <GlassCard className="p-4 sm:p-5 lg:p-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-forest-100/30 mb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-forest text-mist flex items-center justify-center shadow-sm">
            <Wrench className="w-4 h-4 text-mist" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-forest tracking-tight">
              Fix These First
            </h2>
          </div>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-forest-700 hover:text-forest transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-green rounded-lg px-2 py-1"
          aria-label="View all issues (22 total)"
        >
          <span>View all issues</span>
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      {/* Issues Rows */}
      <div className="divide-y divide-forest-100/30">
        {issues.map((issue) => (
          <div
            key={issue.id}
            className={cn(
              'py-3 sm:py-3.5 transition-all duration-200 rounded-xl px-1 sm:px-2 -mx-1 sm:-mx-2 hover:bg-mist-200/40',
              issue.isFixed && 'opacity-60 bg-forest-50/20'
            )}
          >
            {/* Desktop & Tablet Flex Row Layout */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 sm:gap-3">
              {/* Left group: Badge + Criterion */}
              <div className="flex items-center gap-2.5 min-w-0 flex-shrink-0">
                <div className="flex-shrink-0">
                  <SeverityBadge severity={issue.severity} />
                </div>
                <div className="w-32 lg:w-36 xl:w-44 flex-shrink-0">
                  <div className="text-xs sm:text-sm font-bold text-forest leading-tight truncate">
                    {issue.wcagCode}
                  </div>
                  <p className="text-[11px] text-forest-600 truncate mt-0.5">
                    {issue.description}
                  </p>
                </div>
              </div>

              {/* Middle group: Metrics tags */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-mist-300/70 border border-white/70 text-forest whitespace-nowrap shadow-xs">
                  <FileText className="w-3 h-3 text-forest-500" aria-hidden="true" />
                  <span>{issue.elementCount} elements</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-mist-300/70 border border-white/70 text-forest whitespace-nowrap shadow-xs">
                  <Clock className="w-3 h-3 text-forest-500" aria-hidden="true" />
                  <span>{issue.fixTimeMinutes} min fix</span>
                </span>
              </div>

              {/* Code Snippet Box */}
              <div className="flex-1 min-w-0 max-w-full md:max-w-[220px] lg:max-w-[240px] xl:max-w-[320px]">
                <div
                  className="bg-forest rounded-xl px-2.5 py-1.5 text-[11px] sm:text-xs font-mono text-mist overflow-x-auto shadow-inner border border-forest-700/60"
                  tabIndex={0}
                  role="region"
                  aria-label={`Code snippet for ${issue.wcagCode}`}
                >
                  <code className="whitespace-pre text-mist-600 block leading-tight">
                    {issue.snippet}
                  </code>
                </div>
              </div>

              {/* Mark as fixed Button */}
              <div className="flex-shrink-0 flex items-center justify-end">
                <Button
                  variant={issue.isFixed ? 'secondary' : 'primary'}
                  size="sm"
                  onClick={() => toggleFixed(issue.id)}
                  aria-pressed={issue.isFixed}
                  aria-label={`${issue.isFixed ? 'Mark as not fixed' : 'Mark as fixed'}: ${issue.wcagCode}`}
                  className={cn(
                    'min-h-[38px] px-3.5 font-semibold text-xs rounded-full whitespace-nowrap',
                    issue.isFixed
                      ? 'bg-deep-green-100 text-deep-green border-deep-green-300'
                      : 'bg-forest hover:bg-forest-900'
                  )}
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
        ))}
      </div>
    </GlassCard>
  );
};
