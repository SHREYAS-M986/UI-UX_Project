import React from 'react';
import { useAuditStore } from '@/lib/store';
import { GlassCard } from '../GlassCard';
import { Button } from '../Button';
import { Globe, Plus, AlertOctagon, CheckCircle, RefreshCw } from 'lucide-react';

export const PagesView: React.FC = () => {
  const pages = useAuditStore((state) => state.pages);
  const setAuditModalOpen = useAuditStore((state) => state.setAuditModalOpen);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-forest tracking-tight">Audited Pages</h1>
          <p className="text-xs text-forest-600 mt-1">
            Track accessibility compliance across all key routes and sub-flows.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setAuditModalOpen(true)}
          className="text-xs font-semibold gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          <span>Audit New Page</span>
        </Button>
      </div>

      {/* Pages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pages.map((page) => (
          <GlassCard key={page.id} className="p-5 flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-forest text-mist flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Globe className="w-4 h-4 text-mist" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-forest leading-tight">{page.urlOrTitle}</h2>
                    <span className="text-[11px] text-forest-500">Audited {page.lastAudited}</span>
                  </div>
                </div>

                {/* Score badge */}
                <div className="flex flex-col items-end">
                  <span className="text-2xl font-extrabold text-forest">{page.score}</span>
                  <span className="text-[10px] font-semibold text-forest-500 uppercase">Score / 100</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-forest-100 rounded-full h-2 mt-4 overflow-hidden">
                <div
                  className="bg-deep-green h-full rounded-full transition-all duration-500"
                  style={{ width: `${page.score}%` }}
                />
              </div>
            </div>

            {/* Bottom info */}
            <div className="flex items-center justify-between pt-3 border-t border-forest-100/30 text-xs text-forest-700">
              <div className="flex items-center gap-3">
                <span className="font-semibold">{page.issuesCount} issues detected</span>
                {page.criticalCount > 0 ? (
                  <span className="inline-flex items-center gap-1 text-amber font-semibold">
                    <AlertOctagon className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{page.criticalCount} Critical</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-deep-green font-semibold">
                    <CheckCircle className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>0 Critical</span>
                  </span>
                )}
              </div>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => setAuditModalOpen(true)}
                className="text-xs font-semibold gap-1.5 h-8 px-3"
              >
                <RefreshCw className="w-3 h-3 text-forest-600" aria-hidden="true" />
                <span>Re-scan</span>
              </Button>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};
