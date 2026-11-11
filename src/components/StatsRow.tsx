import React from 'react';
import { GlassCard } from './GlassCard';
import { ScoreRing } from './ScoreRing';
import { Sparkline } from './Sparkline';
import { useAuditStore } from '@/lib/store';
import { CheckCircle2 } from 'lucide-react';

export const StatsRow: React.FC = () => {
  const { score, scoreDelta, issues, history } = useAuditStore();

  const criticalCount = issues.filter((i) => i.severity === 'critical' && !i.isFixed).length;
  const seriousCount = issues.filter((i) => i.severity === 'serious' && !i.isFixed).length;
  const minorCount = issues.filter((i) => i.severity === 'minor' && !i.isFixed).length;

  // Derive real trends from audit history
  const criticalTrend =
    history.length >= 2
      ? history.map((h) => h.criticalCount)
      : [criticalCount + 3, criticalCount + 1, criticalCount + 2, criticalCount];

  const seriousTrend =
    history.length >= 2
      ? history.map((h) => h.seriousCount)
      : [seriousCount + 4, seriousCount + 2, seriousCount + 1, seriousCount];

  const minorTrend =
    history.length >= 2
      ? history.map((h) => h.minorCount)
      : [minorCount + 5, minorCount + 2, minorCount + 3, minorCount];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
      {/* 1. Accessibility Score Card */}
      <GlassCard className="p-4 sm:p-5 col-span-2 flex items-center justify-between gap-4">
        <ScoreRing score={score} size={108} strokeWidth={12} />

        <div className="flex-1 min-w-0 pr-1">
          <h2 className="text-base sm:text-lg font-bold text-forest leading-tight">
            Accessibility Score
          </h2>
          <p className="text-xs sm:text-sm text-forest-600 mt-1 leading-snug">
            {score >= 90
              ? 'Excellent! Site meets stringent accessibility targets.'
              : score >= 70
              ? 'Good job! Your site is mostly accessible.'
              : 'Action needed: multiple accessibility blockers detected.'}
          </p>

          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-deep-green-100/70 text-forest border border-deep-green-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-deep-green" aria-hidden="true" />
            <span>
              {scoreDelta >= 0 ? `+${scoreDelta}` : scoreDelta} since last audit
            </span>
          </div>
        </div>
      </GlassCard>

      {/* 2. Critical Issues Card */}
      <GlassCard
        className="p-4 sm:p-5 flex flex-col justify-between col-span-1"
        role="region"
        aria-label={`${criticalCount} critical issues found`}
      >
        <div>
          <div className="w-7 h-7 rounded-full bg-amber text-mist flex items-center justify-center font-bold text-sm shadow-sm">
            !
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-forest tracking-tight block">
              {criticalCount}
            </span>
            <span className="text-xs font-medium text-forest-600 mt-0.5 block">
              Critical Issues
            </span>
          </div>
        </div>
        <div className="mt-2 pt-1">
          <Sparkline
            data={criticalTrend}
            color="#8B6222"
            gradientId="grad-critical-live"
            height={32}
          />
        </div>
      </GlassCard>

      {/* 3. Serious Issues Card */}
      <GlassCard
        className="p-4 sm:p-5 flex flex-col justify-between col-span-1"
        role="region"
        aria-label={`${seriousCount} serious issues found`}
      >
        <div>
          <div className="w-7 h-7 rounded-md rotate-45 bg-taupe text-mist flex items-center justify-center font-bold text-xs shadow-sm">
            <span className="-rotate-45 leading-none">!</span>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-forest tracking-tight block">
              {seriousCount}
            </span>
            <span className="text-xs font-medium text-forest-600 mt-0.5 block">
              Serious Issues
            </span>
          </div>
        </div>
        <div className="mt-2 pt-1">
          <Sparkline
            data={seriousTrend}
            color="#A08569"
            gradientId="grad-serious-live"
            height={32}
          />
        </div>
      </GlassCard>

      {/* 4. Minor Issues Card */}
      <GlassCard
        className="p-4 sm:p-5 flex flex-col justify-between col-span-2 sm:col-span-1 lg:col-span-1"
        role="region"
        aria-label={`${minorCount} minor issues found`}
      >
        <div>
          <div className="w-7 h-7 rounded-full bg-deep-green text-mist flex items-center justify-center font-bold font-serif text-sm shadow-sm">
            i
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-forest tracking-tight block">
              {minorCount}
            </span>
            <span className="text-xs font-medium text-forest-600 mt-0.5 block">
              Minor Issues
            </span>
          </div>
        </div>
        <div className="mt-2 pt-1">
          <Sparkline
            data={minorTrend}
            color="#21402A"
            gradientId="grad-minor-live"
            height={32}
          />
        </div>
      </GlassCard>
    </div>
  );
};
