import React from 'react';
import { GlassCard } from './GlassCard';
import { Trophy, Flame, PartyPopper } from 'lucide-react';
import { PROGRESS_DATA } from '@/data/mockData';

interface ProgressCardProps {
  fixedCount?: number;
  totalCount?: number;
}

export const ProgressCard: React.FC<ProgressCardProps> = ({
  fixedCount = PROGRESS_DATA.fixedCount,
  totalCount = PROGRESS_DATA.totalCount,
}) => {
  const percentage = Math.round((fixedCount / totalCount) * 100);

  return (
    <GlassCard className="p-5 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <Trophy className="w-5 h-5 text-amber" aria-hidden="true" />
          <h3 className="text-sm font-bold text-forest">Your Progress</h3>
        </div>

        {/* Counts & Percentage */}
        <div className="flex items-center justify-between text-xs text-forest-700 font-medium mb-2.5">
          <span className="font-semibold text-forest text-sm">
            {fixedCount} of {totalCount} fixes done
          </span>
          <span className="font-bold text-forest text-sm">{percentage}%</span>
        </div>

        {/* Progress Bar */}
        <div
          className="w-full bg-forest-100/40 rounded-full h-3 overflow-hidden p-[2px] shadow-inner mb-4"
          role="progressbar"
          aria-valuenow={fixedCount}
          aria-valuemin={0}
          aria-valuemax={totalCount}
          aria-label={`Audit progress: ${fixedCount} of ${totalCount} fixes complete (${percentage}%)`}
        >
          <div
            className="bg-deep-green h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Streak Badge Card */}
      <div className="bg-mist-200/60 border border-white/60 rounded-xl p-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-amber-tint flex items-center justify-center flex-shrink-0">
            <Flame className="w-5 h-5 text-amber" aria-hidden="true" />
          </div>
          <div>
            <div className="text-xs font-bold text-forest">
              {PROGRESS_DATA.streakDays} Day Streak
            </div>
            <div className="text-[11px] text-forest-500 font-medium">
              {PROGRESS_DATA.streakMessage}
            </div>
          </div>
        </div>
        <div className="w-9 h-9 rounded-full bg-mist-300/40 flex items-center justify-center flex-shrink-0">
          <PartyPopper className="w-5 h-5 text-taupe" aria-hidden="true" />
        </div>
      </div>
    </GlassCard>
  );
};

