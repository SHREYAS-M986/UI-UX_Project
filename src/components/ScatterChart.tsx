import React, { useState } from 'react';
import { useAuditStore } from '@/lib/store';
import { PrioritisedIssueGroup, SeverityLevel } from '@/lib/prioritise';
import { BarChart2 } from 'lucide-react';

export const ScatterChart: React.FC = () => {
  const issues = useAuditStore((state) => state.issues);
  const openDrawer = useAuditStore((state) => state.openDrawer);
  const [activePoint, setActivePoint] = useState<PrioritisedIssueGroup | null>(null);

  const getPointColor = (severity: SeverityLevel) => {
    switch (severity) {
      case 'critical':
        return '#8B6222';
      case 'serious':
        return '#A08569';
      case 'minor':
        return '#21402A';
      default:
        return '#21402A';
    }
  };

  // Display top issues on chart
  const chartIssues = issues.slice(0, 8);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-forest-600" aria-hidden="true" />
          <h3 className="text-sm font-bold text-forest">Impact vs Effort</h3>
        </div>
        <span className="text-[10px] text-forest-500 font-semibold uppercase tracking-wider">
          Click point to view fix
        </span>
      </div>

      {/* Chart container */}
      <div className="relative pl-7 pb-6 select-none">
        {/* Y Axis Label */}
        <div className="absolute left-0 top-0 bottom-6 w-6 flex items-center justify-center pointer-events-none">
          <span className="text-[11px] font-semibold text-forest-500 transform -rotate-90 tracking-wide whitespace-nowrap">
            Higher Impact &rarr;
          </span>
        </div>

        {/* Chart plot box */}
        <div className="relative w-full h-36 border border-forest-300/40 rounded-xl bg-mist-50/50 backdrop-blur-sm overflow-hidden p-2">
          {/* Subtle quadrant grid lines */}
          <div className="absolute inset-0 flex flex-col justify-center pointer-events-none px-2">
            <div className="w-full h-[1px] bg-forest-200/40" />
          </div>
          <div className="absolute inset-0 flex justify-center pointer-events-none py-2">
            <div className="h-full w-[1px] bg-forest-200/30" />
          </div>

          {/* SVG Points overlay */}
          <svg
            className="w-full h-full overflow-visible"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {chartIssues.map((pt) => {
              const cx = Math.max(10, Math.min(90, pt.effortScore));
              const cy = Math.max(10, Math.min(90, 100 - pt.impactScore));
              const color = getPointColor(pt.severity);

              return (
                <g
                  key={pt.id}
                  className="cursor-pointer group"
                  onClick={() => openDrawer(pt.id)}
                >
                  {/* Outer pulse / halo */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r="7.5"
                    fill={color}
                    fillOpacity={pt.isFixed ? '0.1' : '0.28'}
                    className="transition-transform duration-200 group-hover:scale-150"
                  />
                  {/* Core interactive dot */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r="4.5"
                    fill={color}
                    opacity={pt.isFixed ? 0.4 : 1}
                    stroke="#ECECE4"
                    strokeWidth="1.2"
                    tabIndex={0}
                    role="button"
                    aria-label={`${pt.wcagCode}: ${pt.severity} severity, impact ${pt.impactScore}%, effort ${pt.effortScore}%`}
                    onMouseEnter={() => setActivePoint(pt)}
                    onMouseLeave={() => setActivePoint(null)}
                    onFocus={() => setActivePoint(pt)}
                    onBlur={() => setActivePoint(null)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        openDrawer(pt.id);
                      }
                    }}
                    className="focus:outline-none focus:stroke-forest transition-transform group-hover:scale-125"
                  />
                </g>
              );
            })}
          </svg>

          {/* Tooltip on active point */}
          {activePoint && (
            <div className="absolute bottom-2 left-2 right-2 bg-forest text-mist text-[11px] px-2.5 py-1.5 rounded-lg shadow-lg flex items-center justify-between pointer-events-none z-10 border border-white/20">
              <span className="font-semibold truncate max-w-[200px]">{activePoint.wcagCode}</span>
              <span className="capitalize opacity-85 text-[10px]">
                {activePoint.severity} &bull; Click to fix
              </span>
            </div>
          )}
        </div>

        {/* X Axis Label */}
        <div className="w-full text-center mt-2 pointer-events-none">
          <span className="text-[11px] font-semibold text-forest-500 tracking-wide">
            Lower Effort &rarr;
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-5 pt-0.5 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber shadow-sm" aria-hidden="true" />
          <span className="text-forest-700 font-medium">Critical</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-taupe shadow-sm" aria-hidden="true" />
          <span className="text-forest-700 font-medium">Serious</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-deep-green shadow-sm" aria-hidden="true" />
          <span className="text-forest-700 font-medium">Minor</span>
        </div>
      </div>
    </div>
  );
};
