import React from 'react';

interface SparklineProps {
  data: number[];
  color: string;
  gradientId: string;
  height?: number;
  width?: number;
  className?: string;
}

export const Sparkline: React.FC<SparklineProps> = ({
  data,
  color,
  gradientId,
  height = 36,
  width = 160,
  className = '',
}) => {
  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const paddingY = 4;
  const usableHeight = height - paddingY * 2;

  // Build points
  const points = data.map((val, index) => {
    const x = (index / (data.length - 1)) * width;
    // higher val = closer to top
    const y = height - paddingY - ((val - min) / range) * usableHeight;
    return { x, y };
  });

  // Create smooth curved SVG path
  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const current = points[i];
    const next = points[i + 1];
    const controlX = (current.x + next.x) / 2;
    pathD += ` C ${controlX} ${current.y}, ${controlX} ${next.y}, ${next.x} ${next.y}`;
  }

  // Area path for gradient fill
  const areaD = `${pathD} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="w-full h-8 block"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.32" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Gradient fill underneath */}
        <path d={areaD} fill={`url(#${gradientId})`} />

        {/* Crisp line */}
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

