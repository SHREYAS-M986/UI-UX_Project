import React from 'react';
import { GlassCard } from './GlassCard';
import { ScoreRing } from './ScoreRing';
import { Sparkline } from './Sparkline';
import { SEVERITY_STATS, AUDIT_STATS } from '@/data/mockData';
import { CheckCircle2 } from 'lucide-react';

export const StatsRow: React.FC = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
      {/* 1. Accessibility Score Card (spans 2 columns on all breakpoints) */}
      <GlassCard className="p-4 sm:p-5 col-span-2 flex items-center justify-between gap-4">
        <ScoreRing score={AUDIT_STATS.score} size={108} strokeWidth={12} />

        <div className="flex-1 min-w-0 pr-1">
          <h2 className="text-base sm:text-lg font-bold text-forest leading-tight">
            Accessibility Score
          </h2>
          <p className="text-xs sm:text-sm text-forest-600 mt-1 leading-snug">
            {AUDIT_STATS.scoreStatus}
          </p>

          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-deep-green-100/70 text-forest border border-deep-green-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-deep-green" aria-hidden="true" />
            <span>+{AUDIT_STATS.scoreDelta} since last audit</span>
          </div>
        </div>
      </GlassCard>

      {/* 2, 3, 4: Critical, Serious, Minor Stat Cards */}
      {SEVERITY_STATS.map((stat) => {
        const isCritical = stat.severity === 'critical';
        const isSerious = stat.severity === 'serious';
        const isMinor = stat.severity === 'minor';

        return (
          <GlassCard
            key={stat.severity}
            className={`p-4 sm:p-5 flex flex-col justify-between ${
              isMinor ? 'col-span-2 sm:col-span-1 lg:col-span-1' : 'col-span-1'
            }`}
            role="region"
            aria-label={stat.ariaLabel}
          >
            {/* Top row: Icon */}
            <div>
              <div className="flex items-center">
                {isCritical && (
                  <div
                    className="w-7 h-7 rounded-full bg-amber text-mist flex items-center justify-center font-bold text-sm shadow-sm"
                    aria-hidden="true"
                  >
                    !
                  </div>
                )}
                {isSerious && (
                  <div
                    className="w-7 h-7 rounded-md rotate-45 bg-taupe text-mist flex items-center justify-center font-bold text-xs shadow-sm"
                    aria-hidden="true"
                  >
                    <span className="-rotate-45 leading-none">!</span>
                  </div>
                )}
                {isMinor && (
                  <div
                    className="w-7 h-7 rounded-full bg-deep-green text-mist flex items-center justify-center font-bold font-serif text-sm shadow-sm"
                    aria-hidden="true"
                  >
                    i
                  </div>
                )}
              </div>

              {/* Number and Label */}
              <div className="mt-3">
                <span className="text-2xl sm:text-3xl font-extrabold text-forest tracking-tight block">
                  {stat.count}
                </span>
                <span className="text-xs font-medium text-forest-600 mt-0.5 block">
                  {stat.label}
                </span>
              </div>
            </div>

            {/* Sparkline at bottom */}
            <div className="mt-2 pt-1">
              <Sparkline
                data={stat.trend}
                color={stat.color}
                gradientId={`grad-${stat.severity}`}
                height={32}
              />
            </div>
          </GlassCard>
        );
      })}
    </div>
  );
};
