import React from 'react';
import { useAuditStore } from '@/lib/store';
import { GlassCard } from '../GlassCard';
import { Button } from '../Button';
import { FileJson, FileSpreadsheet, Printer, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { projectName, score, issues, targetWcagLevel, lastAuditTime } = useAuditStore();

  const fixedCount = issues.filter((i) => i.isFixed).length;
  const criticalCount = issues.filter((i) => i.severity === 'critical' && !i.isFixed).length;
  const seriousCount = issues.filter((i) => i.severity === 'serious' && !i.isFixed).length;
  const minorCount = issues.filter((i) => i.severity === 'minor' && !i.isFixed).length;

  const handleExportJson = () => {
    const reportData = {
      project: projectName,
      generatedAt: new Date().toISOString(),
      score,
      conformanceTarget: `WCAG 2.1 Level ${targetWcagLevel}`,
      summary: {
        totalViolations: issues.length,
        fixedViolations: fixedCount,
        unfixedViolations: issues.length - fixedCount,
        critical: criticalCount,
        serious: seriousCount,
        minor: minorCount,
      },
      issues: issues.map((i) => ({
        id: i.id,
        ruleId: i.ruleId,
        wcagCriterion: i.wcagCode,
        wcagLevel: i.wcagLevel,
        severity: i.severity,
        elementCount: i.elementCount,
        fixTimeMinutes: i.fixTimeMinutes,
        impactScore: i.impactScore,
        isFixed: i.isFixed,
        whyItMatters: i.whyItMatters,
        snippet: i.snippet,
        selectors: i.nodes.map((n) => n.targetSelector),
      })),
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `access-audit-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCsv = () => {
    const headers = [
      'Rule ID',
      'WCAG Criterion',
      'WCAG Level',
      'Severity',
      'Element Count',
      'Fix Time (min)',
      'Impact Score',
      'Status',
      'Primary Selector',
    ];

    const rows = issues.map((i) => [
      `"${i.ruleId}"`,
      `"${i.wcagCode}"`,
      `"${i.wcagLevel}"`,
      `"${i.severity}"`,
      i.elementCount,
      i.fixTimeMinutes,
      i.impactScore,
      i.isFixed ? '"Fixed"' : '"Open"',
      `"${(i.nodes[0]?.targetSelector || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `access-audit-violations-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-forest tracking-tight">Audit Reports & Export</h1>
          <p className="text-xs text-forest-600 mt-1">
            Generate compliance exports and share actionable accessibility documentation with stakeholders.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="secondary"
            size="md"
            onClick={handleExportJson}
            className="text-xs font-semibold gap-1.5"
          >
            <FileJson className="w-4 h-4 text-forest-600" aria-hidden="true" />
            <span>Export JSON</span>
          </Button>

          <Button
            variant="secondary"
            size="md"
            onClick={handleExportCsv}
            className="text-xs font-semibold gap-1.5"
          >
            <FileSpreadsheet className="w-4 h-4 text-forest-600" aria-hidden="true" />
            <span>Export CSV</span>
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={handlePrint}
            className="text-xs font-semibold gap-1.5"
          >
            <Printer className="w-4 h-4" aria-hidden="true" />
            <span>Print Summary</span>
          </Button>
        </div>
      </div>

      {/* Summary Card */}
      <GlassCard className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-forest-100/30">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-deep-green" aria-hidden="true" />
            <h2 className="text-base font-bold text-forest">Executive WCAG Conformance Summary</h2>
          </div>
          <span className="text-xs text-forest-500 font-medium">Last audited: {lastAuditTime}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-mist-200/60 p-3.5 rounded-2xl border border-white/60">
            <span className="text-[11px] font-semibold text-forest-500 uppercase">Accessibility Score</span>
            <span className="text-3xl font-extrabold text-forest block mt-1">{score}/100</span>
          </div>

          <div className="bg-mist-200/60 p-3.5 rounded-2xl border border-white/60">
            <span className="text-[11px] font-semibold text-forest-500 uppercase">Target Level</span>
            <span className="text-3xl font-extrabold text-deep-green block mt-1">WCAG {targetWcagLevel}</span>
          </div>

          <div className="bg-mist-200/60 p-3.5 rounded-2xl border border-white/60">
            <span className="text-[11px] font-semibold text-forest-500 uppercase">Resolved Fixes</span>
            <span className="text-3xl font-extrabold text-forest block mt-1">
              {fixedCount} / {issues.length}
            </span>
          </div>

          <div className="bg-mist-200/60 p-3.5 rounded-2xl border border-white/60">
            <span className="text-[11px] font-semibold text-forest-500 uppercase">Critical Blockers</span>
            <span className="text-3xl font-extrabold text-amber block mt-1">{criticalCount}</span>
          </div>
        </div>

        {/* Detailed Breakdown Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-forest-100/40 text-forest-500 font-semibold uppercase text-[10px]">
                <th className="py-2.5 px-3">WCAG Criterion</th>
                <th className="py-2.5 px-3">Level</th>
                <th className="py-2.5 px-3">Severity</th>
                <th className="py-2.5 px-3">Elements</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest-100/30">
              {issues.map((i) => (
                <tr key={i.id} className="hover:bg-mist-200/40">
                  <td className="py-2.5 px-3 font-bold text-forest">{i.wcagCode}</td>
                  <td className="py-2.5 px-3 font-semibold text-forest-700">{i.wcagLevel}</td>
                  <td className="py-2.5 px-3 capitalize font-semibold text-forest">{i.severity}</td>
                  <td className="py-2.5 px-3 text-forest-700">{i.elementCount} affected</td>
                  <td className="py-2.5 px-3">
                    {i.isFixed ? (
                      <span className="inline-flex items-center gap-1 text-deep-green font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Fixed</span>
                      </span>
                    ) : (
                      <span className="text-amber font-semibold">Pending Fix</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};
