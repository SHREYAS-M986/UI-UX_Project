import React from 'react';
import { SeverityLevel } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface SeverityBadgeProps {
  severity: SeverityLevel;
  className?: string;
  showLabel?: boolean;
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({
  severity,
  className,
  showLabel = true,
}) => {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold select-none shadow-sm border',
        severity === 'critical' && 'bg-amber-tint border-amber-border/40 text-forest',
        severity === 'serious' && 'bg-taupe-tint border-taupe-border/40 text-forest',
        severity === 'minor' && 'bg-deep-green-100/70 border-deep-green-200/50 text-forest',
        className
      )}
      role="status"
      aria-label={`${severity} severity issue`}
    >
      {/* Shaped icon with distinct silhouette */}
      {severity === 'critical' && (
        <span
          className="w-4 h-4 rounded-full bg-amber text-mist flex items-center justify-center text-[10px] font-bold shadow-xs flex-shrink-0"
          aria-hidden="true"
        >
          !
        </span>
      )}

      {severity === 'serious' && (
        <span
          className="w-4 h-4 rounded-sm rotate-45 bg-taupe text-mist flex items-center justify-center text-[9px] font-bold shadow-xs flex-shrink-0"
          aria-hidden="true"
        >
          <span className="-rotate-45 leading-none">!</span>
        </span>
      )}

      {severity === 'minor' && (
        <span
          className="w-4 h-4 rounded-full bg-deep-green text-mist flex items-center justify-center text-[10px] font-bold font-serif shadow-xs flex-shrink-0"
          aria-hidden="true"
        >
          i
        </span>
      )}

      {showLabel && (
        <span className="capitalize text-forest font-semibold text-[11px] tracking-tight">
          {severity}
        </span>
      )}
    </span>
  );
};
