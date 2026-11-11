import React, { useState, useEffect, useRef } from 'react';
import { useAuditStore } from '@/lib/store';
import { SeverityBadge } from './SeverityBadge';
import { Button } from './Button';
import {
  X,
  ExternalLink,
  Copy,
  Check,
  CheckCircle2,
  Code,
  Sparkles,
} from 'lucide-react';

export const IssueDetailDrawer: React.FC = () => {
  const activeIssueId = useAuditStore((state) => state.activeDrawerIssueId);
  const issues = useAuditStore((state) => state.issues);
  const closeDrawer = useAuditStore((state) => state.closeDrawer);
  const toggleIssueFixed = useAuditStore((state) => state.toggleIssueFixed);

  const [copied, setCopied] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  const issue = issues.find((i) => i.id === activeIssueId);

  // Esc key and focus trap support
  useEffect(() => {
    if (!activeIssueId) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeDrawer();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIssueId, closeDrawer]);

  if (!activeIssueId || !issue) return null;

  const handleCopyFix = () => {
    navigator.clipboard.writeText(issue.afterSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-forest-900/50 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-title"
    >
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div
          ref={drawerRef}
          className="w-screen max-w-xl bg-mist/95 backdrop-blur-2xl border-l border-white/80 shadow-2xl p-6 sm:p-8 flex flex-col justify-between overflow-y-auto text-forest animate-in slide-in-from-right duration-300"
        >
          {/* Top Section */}
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-forest-100/40">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <SeverityBadge severity={issue.severity} />
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-mist-300/80 border border-white/60 text-forest">
                    WCAG Level {issue.wcagLevel}
                  </span>
                </div>
                <h2 id="drawer-title" className="text-xl font-extrabold text-forest tracking-tight">
                  {issue.wcagCode}
                </h2>
                <p className="text-xs text-forest-600">{issue.description}</p>
              </div>

              <button
                type="button"
                onClick={closeDrawer}
                className="w-10 h-10 rounded-full flex items-center justify-center text-forest-600 hover:text-forest hover:bg-mist-300/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-green"
                aria-label="Close issue details drawer"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-mist-200/60 p-3 rounded-2xl border border-white/60 text-center">
                <span className="text-[11px] font-medium text-forest-500 block">Impact</span>
                <span className="text-lg font-bold text-forest">{issue.impactScore}/100</span>
              </div>
              <div className="bg-mist-200/60 p-3 rounded-2xl border border-white/60 text-center">
                <span className="text-[11px] font-medium text-forest-500 block">Est. Fix Time</span>
                <span className="text-lg font-bold text-forest">{issue.fixTimeMinutes} min</span>
              </div>
              <div className="bg-mist-200/60 p-3 rounded-2xl border border-white/60 text-center">
                <span className="text-[11px] font-medium text-forest-500 block">Occurrences</span>
                <span className="text-lg font-bold text-forest">{issue.elementCount}</span>
              </div>
            </div>

            {/* Plain language "Why It Matters" */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-forest uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber" aria-hidden="true" />
                <span>Why It Matters</span>
              </h3>
              <p className="text-xs text-forest-700 leading-relaxed bg-mist-100/60 p-3.5 rounded-2xl border border-white/60">
                {issue.whyItMatters}
              </p>
            </div>

            {/* Before vs After Fix Suggestion */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-forest uppercase tracking-wider flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5 text-deep-green" aria-hidden="true" />
                  <span>Recommended Fix</span>
                </h3>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleCopyFix}
                  className="text-xs font-semibold gap-1.5 h-8 px-3"
                  aria-label="Copy recommended fix snippet"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-deep-green" aria-hidden="true" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-forest-600" aria-hidden="true" />
                      <span>Copy fix</span>
                    </>
                  )}
                </Button>
              </div>

              {/* Before Code */}
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-amber-DEFAULT">Current Offending HTML:</span>
                <div className="bg-forest rounded-xl p-3 text-[11px] font-mono text-mist-500 overflow-x-auto shadow-inner border border-forest-700">
                  <code className="whitespace-pre block">{issue.beforeSnippet}</code>
                </div>
              </div>

              {/* After Code */}
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-deep-green">Accessible Replacement:</span>
                <div className="bg-forest rounded-xl p-3 text-[11px] font-mono text-mist overflow-x-auto shadow-inner border border-deep-green-300/40">
                  <code className="whitespace-pre block text-mist-600">{issue.afterSnippet}</code>
                </div>
              </div>
            </div>

            {/* Affected Element Selectors */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-forest uppercase tracking-wider">
                Affected Selectors ({issue.nodes.length})
              </h3>
              <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
                {issue.nodes.map((node, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-mist-100/50 border border-white/50 text-xs font-mono text-forest-800 break-all"
                  >
                    <div className="text-[11px] text-forest-500 mb-0.5">#{idx + 1} Selector:</div>
                    <code>{node.targetSelector}</code>
                  </div>
                ))}
              </div>
            </div>

            {/* Official Documentation Link */}
            <div>
              <a
                href={issue.wcagUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-deep-green hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-green rounded-md p-1"
              >
                <span>Read official W3C Understanding Document</span>
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="pt-6 border-t border-forest-100/30 flex items-center justify-between gap-3 mt-6">
            <Button
              variant="secondary"
              size="md"
              onClick={closeDrawer}
              className="text-xs font-semibold"
            >
              Close
            </Button>

            <Button
              variant="primary"
              size="md"
              onClick={() => {
                toggleIssueFixed(issue.id);
              }}
              className="text-xs font-semibold gap-2 px-5"
            >
              {issue.isFixed ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-deep-green" aria-hidden="true" />
                  <span>Marked as Fixed</span>
                </>
              ) : (
                <span>Mark as Fixed</span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
